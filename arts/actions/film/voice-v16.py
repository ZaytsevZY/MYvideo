"""Whole-sentence narration of the1247-character repaired draft, fixed280s film."""
from pathlib import Path
import argparse,asyncio,hashlib,html,json,re,subprocess
import numpy as np
ROOT=Path(__file__).resolve().parents[3];F=ROOT/'arts/actions/film';O=ROOT/'arts/audio/film/voice-v16';P=F/'provenance/voice-v16';FF='/opt/homebrew/bin/ffmpeg';SR=48000
def save(p,x):p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def lex(t):return re.sub(r'[^a-z0-9\u4e00-\u9fff]','',html.unescape(t).lower())
def run(args,data=None):return subprocess.run([FF,'-v','error','-y',*args],input=data,capture_output=True,check=True).stdout
def groups():
 cues=json.loads((F/'captions-v15.json').read_text());snapshot=json.loads((F/'narration-v15.json').read_text())
 for s in snapshot['sources']:assert sha(ROOT/s['path'])==s['sha256'],s['path']
 result=[];pending=[]
 for c in cues:
  pending.append(c)
  if re.search(r'[。？！；][”’]?$',c['text']):
   result.append(dict(id=f'S16-{c["chapterId"]}-{1+sum(r["chapterId"]==c["chapterId"]for r in result):02}',chapterId=c['chapterId'],text=''.join(x['text']for x in pending),cues=pending));pending=[]
 assert not pending;assert ''.join(g['text']for g in result)==''.join(c['text']for c in cues)
 assert sum(len(re.sub(r'\s','',g['text']))for g in result)==1247
 return result
def source_path(g,rate='-5%'):
 return O/'raw'/f'{g["id"]}{""if rate=="-5%"else "-rate"+rate.replace("%","")}.mp3'
async def synth(args):
 import edge_tts
 rows=groups();save(P/'sentence-groups.json',rows)
 for g in rows:
  if args.chapter and g['chapterId']!=args.chapter:continue
  path=source_path(g,args.rate);request=path.with_suffix('.request.json');payload=dict(text=g['text'].replace('Agent','agent'),voice='zh-CN-YunyangNeural',rate=args.rate,pitch='-2Hz',boundary='WordBoundary');assert lex(payload['text'])==lex(g['text'])
  if path.exists():assert json.loads(request.read_text())==payload and path.stat().st_size>1000;print(g['id']+' cached '+args.rate,flush=True);continue
  save(request,payload);await edge_tts.Communicate(**payload,connect_timeout=25,receive_timeout=90).save(str(path),str(path.with_suffix('.jsonl')))
  print(json.dumps(dict(id=g['id'],rate=args.rate,bytes=path.stat().st_size)),flush=True);await asyncio.sleep(.5)
 save(P/'provider.json',dict(provider='Microsoft Edge online neural TTS',voice='zh-CN-YunyangNeural',defaultRate='-5%',pitch='-2Hz',clientVersion=edge_tts.__version__,wholeSentenceRequests=len(rows),documentation='https://github.com/rany2/edge-tts',consent='consent.json',note='Current user requested regeneration and calibration using the already approved Microsoft destination; no new destination.'))
def load_clip(g,rate):
 path=source_path(g,rate);req=json.loads(path.with_suffix('.request.json').read_text());words=[json.loads(x)for x in path.with_suffix('.jsonl').read_text().splitlines()if x];assert lex(''.join(w['text']for w in words))==lex(g['text'])
 pcm=np.frombuffer(run(['-i',str(path),'-ar',str(SR),'-ac','1','-f','f32le','pipe:1']),dtype='<f4').copy();n=len(pcm)//480;active=np.flatnonzero(np.max(np.abs(pcm[:n*480].reshape(n,480)),axis=1)>.001);assert len(active)
 a=max(0,int(active[0]*480-.045*SR));b=min(len(pcm),int((active[-1]+1)*480+.065*SR));pcm=pcm[a:b];pcm[:96]*=np.linspace(0,1,96);pcm[-96:]*=np.linspace(1,0,96)
 return dict(**g,rawPath=str(path.relative_to(ROOT)),rawSha256=sha(path),rate=rate,words=words,trimStart=a/SR,pcm=pcm,speechSeconds=len(pcm)/SR)
def selection():
 config=P/'rate-selection.json'
 return json.loads(config.read_text())if config.exists()else{}
def budgets(rows):
 result=[]
 for ch,budget in zip(['01','02','03','04','05','06'],[45,38,39,55,45,58]):
  subset=[g for g in rows if g['chapterId']==ch];entry=.4 if ch in ['04','05','06']else 0
  if ch=='06':sections=[('argument',.4,31,[g for g in subset if g['cues'][0]['startMs']<253000]),('closing',31,44,[g for g in subset if g['cues'][0]['startMs']>=253000])]
  else:sections=[('chapter',entry,budget,subset)]
  for name,start,end,ss in sections:
   speech=sum(g['speechSeconds']for g in ss);gap=.32;minimum=speech+max(0,len(ss)-1)*gap+.10;result.append(dict(chapter=ch,section=name,start=start,end=end,groups=[g['id']for g in ss],speechSeconds=speech,minimumFlowSeconds=minimum,availableSeconds=end-start,overSeconds=minimum-(end-start)))
 return result
def plan():
 rates=selection();rows=[load_clip(g,rates.get(g['chapterId'],'-5%'))for g in groups()];result=budgets(rows);save(P/'fit-plan.json',dict(rateSelection=rates,sections=result,over=[r for r in result if r['overSeconds']>0]));print(json.dumps(result,ensure_ascii=False,indent=2));return rows,result
def assemble():
 rows,sections=plan();assert not any(s['overSeconds']>0 for s in sections),'Select a natural TTS rate for the over-budget chapter before assembly.'
 old=json.loads((F/'captions-v15.json').read_text());snapshot=json.loads((F/'narration-v15.json').read_text());offsets={c['chapter']:c['start']for c in snapshot['chapters']};byid={g['id']:g for g in rows};mix=np.zeros(SR*280,dtype='<f4');placed=[];raw_cues=[];joins=[]
 for section in sections:
  ss=[byid[g]for g in section['groups']];speech=sum(g['speechSeconds']for g in ss);available=section['end']-section['start'];lead=.04;tail=.14
  # Same-sentence clauses stay inside one model request. Added pauses are only after full sentences.
  if section['section']=='closing':gap=.44
  else:gap=min(.90,max(.32,(available-speech-lead-tail)/max(1,len(ss)-1)))
  cursor=section['start']+lead;offset=offsets[section['chapter']]
  for j,g in enumerate(ss):
   pcm=g['pcm'];at=round((offset+cursor)*SR);end=at+len(pcm);assert end<=round((offset+section['end'])*SR);assert not np.any(mix[at:end]);mix[at:end]=pcm
   dest=O/'sentences'/f'{g["id"]}.wav';run(['-f','f32le','-ar',str(SR),'-ac','1','-i','pipe:0','-c:a','pcm_s24le',str(dest)],pcm.tobytes())
   pos=0;words=[]
   for w in g['words']:
    n=len(lex(w['text']));words.append(dict(text=w['text'],first=pos,last=pos+n,start=offset+cursor+max(0,w['offset']/1e7-g['trimStart']),end=offset+cursor+max(0,(w['offset']+w['duration'])/1e7-g['trimStart'])));pos+=n
   def edge(index,is_end=False):
    if index==pos:return words[-1]['end']
    for w in words:
     if w['first']<=index<w['last']:
      return w['start']+(w['end']-w['start'])*(index-w['first'])/(w['last']-w['first'])
    raise AssertionError(index)
   cumulative=0;local=[]
   for c in g['cues']:
    length=len(lex(c['text']));first=edge(cumulative);last=edge(cumulative+length,True);cumulative+=length
    local.append(dict(id=c['id'].replace('N15','N16'),chapterId=c['chapterId'],text=c['text'],startMs=int(np.floor(first*30+1e-7)/30*1000+.5),endMs=int(np.ceil((last+.12)*30-1e-7)/30*1000+.5),timestampMs=round(first*1000),confidence=None,voiceStartMs=first*1000,voiceEndMs=last*1000,sentenceId=g['id'],sourceIds=[c['id']],sourceStartMs=c['startMs'],sourceEndMs=c['endMs'],timing='Microsoft WordBoundary character offsets; display rounded to30fps'))
   for i,c in enumerate(local):
    if i+1<len(local):c['endMs']=local[i+1]['startMs']
    assert c['endMs']>c['startMs'];assert c['endMs']<=round((offset+section['end'])*1000)
   raw_cues+=local;placed.append(dict(id=g['id'],chapterId=g['chapterId'],text=g['text'],start=offset+cursor,speechEnd=offset+cursor+g['speechSeconds'],section=section['section'],rate=g['rate'],rawPath=g['rawPath'],rawSha256=g['rawSha256'],fittedPath=str(dest.relative_to(ROOT)),fittedSha256=sha(dest),trimStartSeconds=g['trimStart'],words=words))
   if j+1<len(ss):joins.append(dict(afterSentence=g['id'],beforeSentence=ss[j+1]['id'],pauseSeconds=gap))
   cursor+=g['speechSeconds']+gap
  section['lastSpeechEnd']=cursor-gap;section['tailSeconds']=section['end']-(cursor-gap);section['normalSentencePauseSeconds']=gap
 # Merge any fast fragment with a neighbor while retaining the existing one-line44px style.
 captions=[dict(c)for c in raw_cues]
 def width(t):return sum(.56 if ord(x)<128 else 1 for x in t)*44+68
 i=0
 while i<len(captions):
  c=captions[i]
  if c['endMs']-c['startMs']>=2000:i+=1;continue
  candidates=[]
  if i+1<len(captions)and captions[i+1]['chapterId']==c['chapterId']and width(c['text']+captions[i+1]['text'])<=1800:candidates.append(i)
  if i>0 and captions[i-1]['chapterId']==c['chapterId']and width(captions[i-1]['text']+c['text'])<=1800:candidates.append(i-1)
  assert candidates,('Cannot safely merge short caption',c)
  k=min(candidates,key=lambda k:captions[k+1]['endMs']-captions[k]['startMs']);a,b=captions[k:k+2];captions[k:k+2]=[dict(a,text=a['text']+b['text'],endMs=b['endMs'],voiceEndMs=b['voiceEndMs'],sourceEndMs=b['sourceEndMs'],sourceIds=a['sourceIds']+b['sourceIds'])];i=max(0,k-1)
 for i,c in enumerate(captions):c['id']=f'N16-{c["chapterId"]}-{1+sum(x["chapterId"]==c["chapterId"]for x in captions[:i]):02}';assert len(re.sub(r'\s','',c['text']))>=10 and width(c['text'])<=1800
 assert ''.join(c['text']for c in captions)==''.join(c['text']for c in old)
 clocks={};local_cues={}
 for ch,budget in zip(['01','02','03','04','05','06'],[45,38,39,55,45,58]):
  offset=offsets[ch];fixed=[(0.,0.),(float(budget),float(budget))]+([(.4,.4)]if ch in ['04','05','06']else[])+([(31.,31.),(44.,44.)]if ch=='06'else[])
  points=list(fixed)
  for c in raw_cues:
   if c['chapterId']!=ch:continue
   t=c['startMs']/1000-offset;s=c['sourceStartMs']/1000-offset
   if any(abs(s-y)<.002 for x,y in fixed):continue
   points.append((t,s))
  points=sorted(points);assert all(t<u and s<v for (t,s),(u,v)in zip(points,points[1:])),(ch,points);clocks[ch]=points
  local_cues[ch]=[dict(c,startMs=c['startMs']-offset*1000,endMs=c['endMs']-offset*1000)for c in captions if c['chapterId']==ch]
 draft=O/'narration-unnormalized-v16.wav';run(['-f','f32le','-ar',str(SR),'-ac','1','-i','pipe:0','-c:a','pcm_s24le',str(draft)],mix.tobytes())
 first=subprocess.run([FF,'-hide_banner','-i',str(draft),'-af','loudnorm=I=-16:TP=-1.5:LRA=9:print_format=json','-f','null','-'],capture_output=True,text=True,check=True);m=json.JSONDecoder().raw_decode(first.stderr[first.stderr.rfind('{'):].strip())[0];save(P/'loudness-pass1.json',m)
 chain='loudnorm=I=-16:TP=-1.5:LRA=9:measured_I={input_i}:measured_TP={input_tp}:measured_LRA={input_lra}:measured_thresh={input_thresh}:offset={target_offset}:linear=true:print_format=json'.format(**m)+f',aresample=48000,apad=whole_len={SR*280},atrim=end_sample={SR*280},asetpts=N/SR/TB'
 second=subprocess.run([FF,'-hide_banner','-y','-i',str(draft),'-af',chain,'-ar','48000','-ac','1','-c:a','pcm_s24le',str(O/'narration-v16.wav')],capture_output=True,text=True,check=True);save(P/'loudness-pass2.json',json.JSONDecoder().raw_decode(second.stderr[second.stderr.rfind('{'):].strip())[0])
 chapters=[dict(c,cues=len([x for x in captions if x['chapterId']==c['chapter']]),minDisplayMs=min(x['endMs']-x['startMs']for x in captions if x['chapterId']==c['chapter']))for c in snapshot['chapters']]
 save(P/'alignment.json',dict(version='FILM_VOICE v0.16',duration=280,frames=8400,fps=30,chapters=chapters,sentences=placed,sections=sections,rawCaptionAlignment=raw_cues,clocks=clocks,captions=captions,normalSentenceJoins=joins,voice='zh-CN-YunyangNeural',rateSelection=selection(),defaultRate='-5%',pitch='-2Hz',audioTempoApplied=False))
 save(F/'narration-v16.json',dict(version='FILM_NARRATION v0.16',date='2026-10-21',duration=280,frames=8400,fps=30,audio=True,timing='WordBoundary aligned to newly generated1247-character narration; chapter budgets unchanged',sources=snapshot['sources'],cues=local_cues,clocks=clocks,chapters=chapters))
 save(F/'captions-v16.json',captions)
 def stamp(ms,vtt=False):ms=round(ms);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02}{"."if vtt else","}{ms%1000:03}'
 def body(cc,vtt=False):return ('WEBVTT\n\n'if vtt else'')+'\n'.join(f'{i+1}\n{stamp(c["startMs"],vtt)} --> {stamp(c["endMs"],vtt)}\n{c["text"]}\n'for i,c in enumerate(cc))
 for ext in ['srt','vtt']:
  text=body(captions,ext=='vtt');(F/f'captions-v16.{ext}').write_text(text);(F/f'exports/film-subtitles-v16.{ext}').write_text(text)
  for ch,cc in local_cues.items():(F/f'captions/{ch}/{ch}-captions-v16.{ext}').write_text(body(cc,ext=='vtt'))
 save(P/'generation-record.json',dict(voice='zh-CN-YunyangNeural',defaultRate='-5%',rateSelection=selection(),newRequests=len(list((O/'raw').glob('*.mp3'))),adoptedRequests=len(placed),recordings=[dict(path=str(p.relative_to(ROOT)),sha256=sha(p),request=json.loads(p.with_suffix('.request.json').read_text()))for p in sorted((O/'raw').glob('*.mp3'))],audioTempoApplied=False))
 print(json.dumps(dict(stage='master-ready',duration=280,sentences=len(placed),captions=len(captions),minCaptionMs=min(c['endMs']-c['startMs']for c in captions),sections=sections),ensure_ascii=False),flush=True)
def main():
 p=argparse.ArgumentParser();p.add_argument('stage',choices=['plan','synthesize','fit','assemble']);p.add_argument('--chapter');p.add_argument('--rate',default='-5%');args=p.parse_args()
 for d in [O/'raw',O/'sentences',P]:d.mkdir(parents=True,exist_ok=True)
 if args.stage=='plan':save(P/'sentence-groups.json',groups());print(json.dumps(dict(sentences=len(groups()),characters=1247)))
 if args.stage=='synthesize':asyncio.run(synth(args))
 if args.stage=='fit':plan()
 if args.stage=='assemble':assemble()
if __name__=='__main__':main()
