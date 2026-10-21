"""Align the current painted v12 master to whole-sentence v13 speech.

Decode once, choose existing complete frames in order, and encode at CRF16.
No optical-flow, morphing, cropped subtitle replacement, or new artwork.
"""
from pathlib import Path
import bisect,hashlib,json,math,subprocess,time
import numpy as np
ROOT=Path(__file__).resolve().parents[3];F=ROOT/'arts/actions/film';P=F/'provenance/voice-v13';FF='/opt/homebrew/bin/ffmpeg'
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def save(p,x):p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def mapping():
 old=json.loads((F/'captions-v12.json').read_text());new=json.loads((F/'captions-v13.json').read_text());a=json.loads((P/'alignment.json').read_text());prior=json.loads((F/'provenance/voice-v12/alignment.json').read_text());assert len(old)==len(new)==54
 anchors={0.:0.,a['duration']:prior['duration'],a['duration']-14:prior['duration']-14}
 for x,y in zip(old,new):
  assert x['id']==y['id']and x['text']==y['text']
  for k in ['startMs','endMs']:
   t,s=y[k]/1000,x[k]/1000
   if t in anchors:assert abs(anchors[t]-s)<.001
   anchors[t]=s
 nodes=sorted(anchors.items());assert all(t<u and s<v for (t,s),(u,v)in zip(nodes,nodes[1:]))
 ts=np.arange(a['frames'])/30;positions=np.interp(ts,[t for t,s in nodes],[s for t,s in nodes]);frames=np.floor(positions*30+1e-7).astype(int);frames=np.clip(frames,0,prior['frames']-1)
 starts=[c['startMs']for c in new];old_starts=[c['startMs']for c in old]
 def active(cues,begins,ms):
  i=bisect.bisect_right(begins,ms)-1
  return i if i>=0 and ms<cues[i]['endMs']else None
 for f,t in enumerate(ts):
  i=active(new,starts,t*1000)
  if i is not None:lo=math.ceil(old[i]['startMs']*.03-1e-9);hi=math.ceil(old[i]['endMs']*.03-1e-9)-1
  else:
   j=bisect.bisect_right(starts,t*1000);lo=math.ceil(old[j-1]['endMs']*.03-1e-9)if j else 0;hi=math.ceil(old[j]['startMs']*.03-1e-9)-1 if j<len(old)else prior['frames']-1
  assert lo<=hi,(f,i,lo,hi);frames[f]=np.clip(frames[f],lo,hi)
  # JSON millisecond rounding and IEEE frame arithmetic can differ at an exact boundary.
  if active(old,old_starts,frames[f]/30*1000)!=i:
   candidates=[k for k in range(max(0,int(frames[f])-3),min(prior['frames'],int(frames[f])+4))if active(old,old_starts,k/30*1000)==i]
   assert candidates,(f,i,frames[f]);frames[f]=min(candidates,key=lambda k:abs(k-frames[f]))
  assert active(old,old_starts,frames[f]/30*1000)==i,(f,i,frames[f])
 assert np.all(np.diff(frames)>=0);assert frames[0]==0 and frames[-1]==prior['frames']-1
 save(P/'frame-map.json',dict(sourceVersion='FILM_VOICE v0.12',sourceDuration=prior['duration'],outputDuration=a['duration'],outputFrames=a['frames'],anchors=[dict(time=t,sourceTime=s)for t,s in nodes],sourceFrameIndices=frames.tolist(),allOutputFramesCaptionMatched=True,interpolation='nearest existing whole frame; no optical flow',note='Reuse only the freshly rendered v12 candidate with the same reviewed text, caption style and adopted paintings; retain source and export at CRF16 to limit second-generation encoding loss.'))
 return a,frames
def main():
 a,indices=mapping();source=F/'exports/film-complete-captioned-voiced-v12.mp4';prior_manifest=json.loads((F/'exports/film-complete-captioned-voiced-v12-manifest.json').read_text());assert sha(source)==prior_manifest['output']['sha256']
 guards=json.loads((P/'protected-inputs.json').read_text())
 for g in guards:assert sha(ROOT/g['path'])==g['sha256']
 final=F/'exports/film-complete-captioned-voiced-v13.mp4';part=final.with_suffix('.part.mp4');assert not final.exists()and not part.exists()
 master=ROOT/'arts/audio/film/voice-v13/narration-v13.wav'
 args=['-hide_banner','-loglevel','warning','-nostdin','-f','rawvideo','-pixel_format','rgb24','-video_size','1920x1080','-framerate','30','-i','pipe:0','-i',str(master),'-map','0:v:0','-map','1:a:0','-c:v','libx264','-preset','medium','-crf','16','-threads','2','-pix_fmt','yuv420p','-frames:v',str(a['frames']),'-c:a','aac','-b:a','192k','-ar','48000','-ac','1','-t',str(a['duration']),'-metadata:s:a:0','language=zho','-video_track_timescale','15360','-map_metadata','-1','-movflags','+faststart',str(part)]
 start=time.monotonic();size=1920*1080*3;current=-1;buf=None
 with (P/'decode-source.log').open('wb')as dec_log,(P/'encode.log').open('wb')as enc_log:
  dec=subprocess.Popen([FF,'-v','error','-i',str(source),'-map','0:v:0','-an','-pix_fmt','rgb24','-f','rawvideo','pipe:1'],stdout=subprocess.PIPE,stderr=dec_log)
  enc=subprocess.Popen([FF,*args],stdin=subprocess.PIPE,stderr=enc_log)
  try:
   for f,target in enumerate(indices):
    while current<target:
     buf=dec.stdout.read(size);assert len(buf)==size,(current,len(buf));current+=1
    enc.stdin.write(buf)
    if f%300==0 or f==len(indices)-1:
     progress=dict(frame=f+1,total=len(indices),sourceFrame=current,elapsedSeconds=round(time.monotonic()-start,1));save(P/'render-progress.json',progress);print(json.dumps(progress),flush=True)
   enc.stdin.close();assert enc.wait()==0;assert dec.stdout.read()==b'';assert dec.wait()==0
  except BaseException:
   dec.terminate();enc.terminate();raise
 probe=json.loads(subprocess.check_output(['/opt/homebrew/bin/ffprobe','-v','error','-show_streams','-show_format','-of','json',str(part)]));v=next(s for s in probe['streams']if s['codec_type']=='video');audio=next(s for s in probe['streams']if s['codec_type']=='audio');assert int(v['nb_frames'])==a['frames']and v['width']==1920 and v['height']==1080 and v['avg_frame_rate']=='30/1';assert audio['sample_rate']=='48000'and audio['channels']==1;assert abs(float(probe['format']['duration'])-a['duration'])<.04
 check=subprocess.run([FF,'-v','error','-i',str(part),'-f','null','-'],capture_output=True,check=True);(P/'decode.log').write_bytes(check.stderr)
 for g in guards:assert sha(ROOT/g['path'])==g['sha256']
 part.rename(final);save(P/'ffprobe.json',probe)
 manifest=dict(version='FILM_VOICE v0.13',date='2026-10-21',duration=a['duration'],frames=a['frames'],fps=30,dimensions=[1920,1080],chapters=a['chapters'],voice=a['voice'],rate=a['rate'],pitch=a['pitch'],generationMode=a['generationMode'],newTtsRequests=28,sentenceGroups=28,audioTempoApplied=False,captionCount=54,captionTextUnchanged=True,captionStyleUnchanged=True,captionTiming='Word-boundary aligned. Every encoded source-frame selection checked for identical caption text/blank state on every output frame.',opticalFlow=False,sourceVideo=prior_manifest['output'],sourcePaintings='153 adopted v10 original paintings; no visual generation',videoReencoded=True,frameSelection='Nearest existing complete frame; monotone mapping, no synthesized frames',crf=16,fullDecodePassed=True,sourceGuardsPassed=len(guards),output=dict(path=str(final.relative_to(ROOT)),bytes=final.stat().st_size,sha256=sha(final)),narration=dict(path=str(master.relative_to(ROOT)),sha256=sha(master)),command=[FF,*args],exportSeconds=time.monotonic()-start)
 save(F/'exports/film-complete-captioned-voiced-v13-manifest.json',manifest);print(json.dumps(dict(stage='complete',output=manifest['output'],duration=a['duration'])),flush=True)
if __name__=='__main__':main()
