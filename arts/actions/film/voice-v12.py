"""Whole-sentence TTS and speech-led timeline, preserving reviewed manuscript."""
from pathlib import Path
import argparse, asyncio, hashlib, html, json, re, subprocess
import numpy as np
ROOT=Path(__file__).resolve().parents[3]; FILM=ROOT/'arts/actions/film'
OUT=ROOT/'arts/audio/film/voice-v12'; PROV=FILM/'provenance/voice-v12'
FF='/opt/homebrew/bin/ffmpeg'; SR=48000
def save(p,x): p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def lexical(t): return re.sub(r'[^a-z0-9\u4e00-\u9fff]','',html.unescape(t).lower())
def run(a,data=None): return subprocess.run([FF,'-v','error','-y',*a],input=data,capture_output=True,check=True).stdout
def groups():
    cues=json.loads((FILM/'captions-v01.json').read_text()); result=[]; pending=[]
    for c in cues:
        pending.append(c)
        if re.search(r'[。？！；][”’]?$',c['text']):
            result.append(dict(id=f'S12-{c["chapterId"]}-{sum(g["chapterId"]==c["chapterId"] for g in result)+1:02}',chapterId=c['chapterId'],text=''.join(x['text']for x in pending),cues=pending));pending=[]
    assert not pending
    assert ''.join(g['text']for g in result)==''.join(c['text']for c in cues)
    return result
async def synth():
    import edge_tts
    rows=groups(); save(PROV/'sentence-groups.json',rows)
    for g in rows:
        target=OUT/'raw'/f'{g["id"]}.mp3';request=target.with_suffix('.request.json')
        payload=dict(text=g['text'].replace('Agent','agent'),voice='zh-CN-YunyangNeural',rate='-5%',pitch='-2Hz',boundary='WordBoundary')
        assert lexical(payload['text'])==lexical(g['text'])
        if target.exists():
            assert json.loads(request.read_text())==payload
            assert target.stat().st_size>1000 and target.with_suffix('.jsonl').exists()
            print(g['id']+' cached',flush=True);continue
        save(request,payload)
        await edge_tts.Communicate(**payload,connect_timeout=25,receive_timeout=90).save(str(target),str(target.with_suffix('.jsonl')))
        print(json.dumps(dict(id=g['id'],characters=len(g['text']),bytes=target.stat().st_size)),flush=True)
        await asyncio.sleep(.5)
    save(PROV/'provider.json',dict(provider='Microsoft Edge online neural TTS',clientVersion=edge_tts.__version__,voice=payload['voice'],rate=payload['rate'],pitch=payload['pitch'],sentenceRequests=len(rows),note='Whole sentences rather than subtitle-sized requests; no atempo, no stretching to visual budgets.',documentation='https://github.com/rany2/edge-tts'))
def cached_sentences():
    """Offline option: trim cached clip padding and join clauses; never sends text."""
    prior=json.loads((FILM/'provenance/voice-v11/cue-alignment.json').read_text())['rows'];byid={r['id']:r for r in prior}
    folder=OUT/'local-candidate';folder.mkdir(exist_ok=True)
    for g in groups():
        parts=[];words=[];cursor=0;chars=0
        for j,c in enumerate(g['cues']):
            r=byid[c['id']];pcm=np.frombuffer(run(['-i',str(ROOT/r['fittedPath']),'-ar',str(SR),'-ac','1','-f','f32le','pipe:1']),dtype='<f4').copy()
            # Existing fitted clips already contain 50/70ms safe outer padding.
            parts.append(pcm)
            for w in r['voiceWords']:
                words.append(dict(text=w['text'],offset=round((cursor+(w['startMs']-r['placedStartMs'])/1000)*1e7),duration=round((w['endMs']-w['startMs'])/1000*1e7)))
            cursor+=len(pcm)/SR
            if j+1<len(g['cues']):
                gap=.12 if c['text'].endswith('，')else .2
                silence=np.zeros(round(gap*SR),dtype='<f4');parts.append(silence);cursor+=len(silence)/SR
        dest=folder/f'{g["id"]}.wav';run(['-f','f32le','-ar',str(SR),'-ac','1','-i','pipe:0','-c:a','pcm_s24le',str(dest)],np.concatenate(parts).tobytes())
        dest.with_suffix('.jsonl').write_text('\n'.join(json.dumps(w,ensure_ascii=False)for w in words)+'\n')
    print('Offline candidate: 28 full sentence clips from existing local recordings',flush=True)
def assemble(local_audio=False):
    rows=groups();cursor=0;clips=[];captions=[];segments=[];word_rows=[];boundaries=[]
    for i,g in enumerate(rows):
        raw=OUT/('local-candidate'if local_audio else'raw')/f'{g["id"]}{".wav"if local_audio else".mp3"}'; words=[json.loads(l)for l in raw.with_suffix('.jsonl').read_text().splitlines()if l];assert lexical(''.join(w['text']for w in words))==lexical(g['text']),g['id']
        pcm=np.frombuffer(run(['-i',str(raw),'-ar',str(SR),'-ac','1','-f','f32le','pipe:1']),dtype='<f4').copy()
        n=len(pcm)//480;act=np.flatnonzero(np.max(np.abs(pcm[:n*480].reshape(n,480)),axis=1)>.001)
        a=max(0,int(act[0]*480-.035*SR));b=min(len(pcm),int((act[-1]+1)*480+.055*SR));pcm=pcm[a:b]
        # Keep every phoneme and all native internal pauses. Fade only the outer silent pads.
        pcm[:96]*=np.linspace(0,1,96);pcm[-96:]*=np.linspace(1,0,96)
        speech=len(pcm)/SR;chapter_end=i==len(rows)-1 or rows[i+1]['chapterId']!=g['chapterId']
        gap=.62 if chapter_end else .43 if g['text'].endswith('；') else .52
        duration=np.ceil((speech+gap)*30)/30
        old_start=g['cues'][0]['startMs']/1000;old_end=g['cues'][-1]['endMs']/1000
        # Preserve the unvoiced entry adapters, closing life montage, and source-page duration.
        if g['id']=='S12-05-01' or g['id']=='S12-06-01':
            segments.append(dict(start=cursor,end=cursor+.4,sourceStart=old_start-.4,sourceEnd=old_start,kind='entry'));cursor+=.4
        if g['id']=='S12-06-04':duration=max(duration,13.)
        dest=OUT/'sentences'/f'{g["id"]}.wav';run(['-f','f32le','-ar',str(SR),'-ac','1','-i','pipe:0','-c:a','pcm_s24le',str(dest)],pcm.tobytes());clips.append((round(cursor*SR),pcm))
        offsets=[];pos=0
        for w in words:
            size=len(lexical(w['text']));offsets.append((pos,pos+size,w));pos+=size
        cumulative=0;local=[]
        for c in g['cues']:
            length=len(lexical(c['text']));matching=[w for x,y,w in offsets if x<cumulative+length and y>cumulative];assert matching
            first=max(0,matching[0]['offset']/1e7-a/SR);last=max(first,(matching[-1]['offset']+matching[-1]['duration'])/1e7-a/SR)
            local.append(dict(c,startMs=round((cursor+first)*30)/30*1000,endMs=min(round((cursor+last+.12)*30)/30*1000,(cursor+speech+.1)*1000),sentenceId=g['id'],sourceStartMs=c['startMs'],sourceEndMs=c['endMs']))
            cumulative+=length
        for j,c in enumerate(local):
            if j+1<len(local):c['endMs']=local[j+1]['startMs']
            c['startMs']=round(c['startMs']);c['endMs']=round(c['endMs']);assert c['endMs']>c['startMs'];assert len(c['text'].replace(' ',''))>=10
        captions+=local
        # Align scene progression to the same spoken-clause boundaries as subtitles.
        anchors=[(cursor,old_start)]+[(c['startMs']/1000,c['sourceStartMs']/1000)for c in local[1:]]+[(cursor+duration,old_end)]
        for (t,s),(u,v)in zip(anchors,anchors[1:]):
            assert u>t and v>s
            segments.append(dict(start=t,end=u,sourceStart=s,sourceEnd=v,kind='speech',sentenceId=g['id']))
        for j in range(len(local)-1):
            boundary=g['cues'][j]['text'];lastchar=sum(len(lexical(c['text']))for c in g['cues'][:j+1]);left=[w for x,y,w in offsets if x<lastchar];right=[w for x,y,w in offsets if y>lastchar];native_gap=(right[0]['offset']-left[-1]['offset']-left[-1]['duration'])/1e7
            boundaries.append(dict(sentenceId=g['id'],afterCue=g['cues'][j]['id'],nativeGapSeconds=max(0,native_gap)))
        word_rows.append(dict(id=g['id'],chapterId=g['chapterId'],text=g['text'],start=cursor,speechEnd=cursor+speech,end=cursor+duration,trimStart=a/SR,rawPath=str(raw.relative_to(ROOT)),rawSha256=sha(raw),words=[dict(text=w['text'],start=cursor+max(0,w['offset']/1e7-a/SR),end=cursor+max(0,(w['offset']+w['duration'])/1e7-a/SR))for w in words]))
        cursor+=duration
    assert segments[-1]['sourceEnd']==266
    segments.append(dict(start=cursor,end=cursor+14,sourceStart=266,sourceEnd=280,kind='references'));duration=round((cursor+14)*30)/30
    mix=np.zeros(round(duration*SR),dtype='<f4')
    for at,pcm in clips: assert not np.any(mix[at:at+len(pcm)]);mix[at:at+len(pcm)]=pcm
    draft=OUT/'narration-unnormalized-v12.wav';run(['-f','f32le','-ar',str(SR),'-ac','1','-i','pipe:0','-c:a','pcm_s24le',str(draft)],mix.tobytes())
    first=subprocess.run([FF,'-hide_banner','-i',str(draft),'-af','loudnorm=I=-16:TP=-1.5:LRA=9:print_format=json','-f','null','-'],capture_output=True,text=True,check=True);m=json.JSONDecoder().raw_decode(first.stderr[first.stderr.rfind('{'):].strip())[0];save(PROV/'loudness-pass1.json',m)
    chain='loudnorm=I=-16:TP=-1.5:LRA=9:measured_I={input_i}:measured_TP={input_tp}:measured_LRA={input_lra}:measured_thresh={input_thresh}:offset={target_offset}:linear=true:print_format=json'.format(**m)+f',aresample=48000,apad=whole_dur={duration},atrim=duration={duration}'
    second=subprocess.run([FF,'-hide_banner','-y','-i',str(draft),'-af',chain,'-ar','48000','-ac','1','-c:a','pcm_s24le',str(OUT/'narration-v12.wav')],capture_output=True,text=True,check=True);save(PROV/'loudness-pass2.json',json.JSONDecoder().raw_decode(second.stderr[second.stderr.rfind('{'):].strip())[0])
    chapter_rows=[]
    for ch in ['01','02','03','04','05','06']:
        sub=[r for r in word_rows if r['chapterId']==ch];start=sub[0]['start']-(.4 if ch in ['05','06']else 0);end=sub[-1]['end']+(14 if ch=='06'else 0);chapter_rows.append(dict(id=ch,start=round(start,6),end=round(end,6),duration=round(end-start,6)))
    save(PROV/'alignment.json',dict(version='FILM_VOICE v0.12',duration=duration,frames=round(duration*30),fps=30,chapters=chapter_rows,sentences=word_rows,segments=segments,internalClauseBoundaries=boundaries,voice='zh-CN-YunyangNeural',rate='cached-v11'if local_audio else'-5%',pitch='-2Hz',audioTempoApplied=False,generationMode='local clip assembly'if local_audio else'whole-sentence TTS'))
    save(FILM/'captions-v12.json',captions)
    def stamp(ms):
        ms=round(ms);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
    (FILM/'exports/film-subtitles-v12.srt').write_text('\n'.join(f'{i+1}\n{stamp(c["startMs"])} --> {stamp(c["endMs"])}\n{c["text"]}\n'for i,c in enumerate(captions)))
    print(json.dumps(dict(duration=duration,sentences=len(rows),captions=len(captions),maxInternalBoundaryGap=max(b['nativeGapSeconds']for b in boundaries),chapters=chapter_rows),ensure_ascii=False),flush=True)
def main():
    p=argparse.ArgumentParser();p.add_argument('stage',choices=['plan','synthesize','assemble','local-candidate']);p.add_argument('--local',action='store_true');a=p.parse_args()
    for d in [OUT/'raw',OUT/'sentences',PROV]:d.mkdir(parents=True,exist_ok=True)
    if a.stage=='plan':save(PROV/'sentence-groups.json',groups());print('\n'.join(g['id']+' '+g['text']for g in groups()));return
    if a.stage=='synthesize':asyncio.run(synth())
    if a.stage=='assemble':assemble(local_audio=a.local)
    if a.stage=='local-candidate':cached_sentences()
if __name__=='__main__':main()
