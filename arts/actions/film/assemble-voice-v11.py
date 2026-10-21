"""Fit original spoken clauses to fixed captions, preserve video and text bytes."""
from pathlib import Path
import json,subprocess,hashlib,re,argparse,html
import numpy as np
ROOT=Path(__file__).resolve().parents[3];FILM=ROOT/'arts/actions/film';OUT=ROOT/'arts/audio/film/voice-v11';PROV=FILM/'provenance/voice-v11';FF='/opt/homebrew/bin/ffmpeg';SR=48000
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
def run(args,data=None):return subprocess.run([FF,'-v','error','-y',*args],input=data,capture_output=True,check=True).stdout
def norm(s):return re.sub(r'[^a-z0-9\u4e00-\u9fff]','',html.unescape(s).lower())
def raw_read(p):return np.frombuffer(run(['-i',str(p),'-ac','1','-ar',str(SR),'-f','f32le','pipe:1']),dtype='<f4').copy()
def trim(samples):
 block=480;n=len(samples)//block;levels=np.max(np.abs(samples[:n*block].reshape(n,block)),axis=1);active=np.flatnonzero(levels>.001);assert len(active)>0
 a=max(0,int(active[0]*block-.05*SR));b=min(len(samples),int((active[-1]+1)*block+.07*SR));return samples[a:b],a/SR,b/SR

def main():
 p=argparse.ArgumentParser();p.add_argument('--plan-only',action='store_true');p.add_argument('--normalize-only',action='store_true');args=p.parse_args();
 if args.normalize_only:return normalize(json.loads((PROV/'fit-plan.json').read_text())['rows'])
 cues=json.loads((FILM/'captions-v01.json').read_text());rows=[];mix=np.zeros(SR*280,dtype='<f4');over=[]
 for c in cues:
  stem=c['id'];variant=OUT/'raw'/f'{stem}-rate25.mp3';opening=OUT/'raw'/f'{stem}-agent-pronunciation.mp3';raw=opening if opening.exists()else variant if variant.exists()else OUT/'raw'/f'{stem}.mp3';request=json.loads(raw.with_suffix('.request.json').read_text());assert norm(request['text'])==norm(c['text']);words=[json.loads(l)for l in raw.with_suffix('.jsonl').read_text().splitlines()if l];assert norm(''.join(w['text']for w in words))==norm(c['text']),stem
  samples=raw_read(raw);samples,cut_start,cut_end=trim(samples);available=(c['endMs']-c['startMs'])/1000-.12;tempo=max(1.,len(samples)/SR/available*1.002);row=dict(id=stem,text=c['text'],captionStartMs=c['startMs'],captionEndMs=c['endMs'],rawPath=str(raw.relative_to(ROOT)),rawSha256=sha(raw),ttsRate=request['rate'],speechInput=request['text'],trimStartSeconds=cut_start,trimEndSeconds=cut_end,trimmedSeconds=len(samples)/SR,tempo=tempo)
  if tempo>1.18:over.append(row)
  rows.append(row)
  if args.plan_only or tempo>1.18:continue
  if tempo>1.003:
   for _ in range(3):
    fitted=np.frombuffer(run(['-f','f32le','-ar',str(SR),'-ac','1','-i','pipe:0','-af',f'atempo={tempo:.7f}','-f','f32le','pipe:1'],samples.astype('<f4').tobytes()),dtype='<f4').copy()
    if len(fitted)<=round(available*SR):break
    tempo*=1.006
   samples=fitted
  assert len(samples)<=round(available*SR),stem
  #2ms outer fade affects silent safety pads, not phonemes.
  ramp=96;samples[:ramp]*=np.linspace(0,1,ramp);samples[-ramp:]*=np.linspace(1,0,ramp)
  dest=OUT/'fitted'/f'{stem}.wav';run(['-f','f32le','-ar',str(SR),'-ac','1','-i','pipe:0','-c:a','pcm_s24le',str(dest)],samples.astype('<f4').tobytes());at=round((c['startMs']/1000+.04)*SR);end=at+len(samples);assert end<=round(c['endMs']/1000*SR);assert np.max(np.abs(mix[at:end]))==0;mix[at:end]=samples
  row.update(tempo=tempo,placedStartMs=at/SR*1000,placedEndMs=end/SR*1000,fittedPath=str(dest.relative_to(ROOT)),fittedSha256=sha(dest),voiceWords=[dict(text=w['text'],startMs=c['startMs']+40+max(0,w['offset']/1e7-cut_start)/tempo*1000,endMs=c['startMs']+40+max(0,(w['offset']+w['duration'])/1e7-cut_start)/tempo*1000)for w in words])
 (PROV/'fit-plan.json').write_text(json.dumps(dict(cues=len(rows),overBudget=over,rows=rows),ensure_ascii=False,indent=2)+'\n');print(json.dumps(dict(cues=len(rows),overBudget=[dict(id=r['id'],ratio=r['tempo'],seconds=r['trimmedSeconds'])for r in over],maxTempo=max(r['tempo']for r in rows)),ensure_ascii=False),flush=True)
 if args.plan_only:return
 assert not over,'Regenerate over-budget sentence rather than extreme time compression'
 assert np.max(np.abs(mix[266*SR:]))==0
 normalize(rows,mix)

def normalize(rows,mix=None):
 draft=OUT/'narration-unnormalized-v11.wav'
 if mix is not None:run(['-f','f32le','-ar',str(SR),'-ac','1','-i','pipe:0','-c:a','pcm_s24le',str(draft)],mix.tobytes())
 first=subprocess.run([FF,'-hide_banner','-i',str(draft),'-af','loudnorm=I=-16:TP=-1.5:LRA=9:print_format=json','-f','null','-'],capture_output=True,text=True,check=True);measurement=json.JSONDecoder().raw_decode(first.stderr[first.stderr.rfind('{'):].strip())[0];(PROV/'loudness-pass1.json').write_text(json.dumps(measurement,indent=2)+'\n')
 chain='loudnorm=I=-16:TP=-1.5:LRA=9:measured_I={input_i}:measured_TP={input_tp}:measured_LRA={input_lra}:measured_thresh={input_thresh}:offset={target_offset}:linear=true:print_format=json'.format(**measurement)+',aresample=48000,apad=whole_dur=280,atrim=duration=280'
 final=OUT/'narration-v11.wav';second=subprocess.run([FF,'-hide_banner','-y','-i',str(draft),'-af',chain,'-ar','48000','-ac','1','-c:a','pcm_s24le',str(final)],capture_output=True,text=True,check=True);(PROV/'loudness-pass2.json').write_text(json.dumps(json.JSONDecoder().raw_decode(second.stderr[second.stderr.rfind('{'):].strip())[0],indent=2)+'\n')
 (PROV/'cue-alignment.json').write_text(json.dumps(dict(voice='zh-CN-YunyangNeural',duration=280,sampleRate=48000,channels=1,captionsUnchanged=True,textUnchanged=True,last14SecondsSilent=True,rows=rows),ensure_ascii=False,indent=2)+'\n');print(json.dumps(dict(stage='narration-master-ready',path=str(final.relative_to(ROOT)),sha256=sha(final))),flush=True)
if __name__=='__main__':main()
