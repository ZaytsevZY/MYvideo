"""Formal delivery of the baked picture and corrected narration, without generational loss."""
from pathlib import Path
import hashlib,json,subprocess
R=Path(__file__).resolve().parents[3];F=R/'arts/actions/film';P=F/'provenance/final-v18';E=F/'exports';FF='/opt/homebrew/bin/ffmpeg';FP='/opt/homebrew/bin/ffprobe'
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def save(p,x):p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def run(cmd):return subprocess.run(cmd,capture_output=True,check=True)
def stream_hash(p,kind):return run([FF,'-v','error','-i',str(p),'-map',f'0:{kind}:0','-c','copy','-f','hash','-hash','sha256','pipe:1']).stdout.decode().strip()
def main():
 P.mkdir(parents=True,exist_ok=True);src=E/'film-complete-captioned-voiced-v17.mp4';dst=E/'film-complete-final-v18.mp4';part=dst.with_name(dst.stem+'.part.mp4');assert not dst.exists()and not part.exists(),'Preserve existing exports.'
 q=json.loads((F/'provenance/pronunciation-v17/verification.json').read_text());assert q['fullDecodePassed']and q['videoStreamBitExact']and 'to do list'in q['finalAacEnglishRecognition'].lower();assert sha(src)==q['output']['sha256']
 inputs=[src,R/q['narration']['path'],F/'captions-v16.json',F/'captions-v16.srt',F/'scenes-v16.mjs',F/'bundle-v17.json',F/'player-v17.mjs',F/'narration-v16.json',F/'provenance/pronunciation-v17/verification.json',F/'provenance/voice-v16/visual-verification.json']
 for s in json.loads((F/'narration-v16.json').read_text())['sources']:p=R/s['path'];assert sha(p)==s['sha256'],s['path'];inputs.append(p)
 guards=[dict(path=str(p.relative_to(R)),sha256=sha(p))for p in inputs];save(P/'protected-inputs.json',guards)
 args=[FF,'-hide_banner','-nostdin','-y','-i',str(src),'-map','0:v:0','-map','0:a:0','-c','copy','-map_metadata','-1','-metadata','title=当效率成为义务','-metadata:s:a:0','language=zho','-movflags','+faststart',str(part)];r=run(args);(P/'export.log').write_bytes(r.stderr)
 probe=json.loads(run([FP,'-v','error','-show_streams','-show_format','-of','json',str(part)]).stdout);v=next(s for s in probe['streams']if s['codec_type']=='video');a=next(s for s in probe['streams']if s['codec_type']=='audio');assert len(probe['streams'])==2;assert int(v['nb_frames'])==8400 and v['avg_frame_rate']=='30/1'and v['width']==1920 and v['height']==1080;assert a['codec_name']=='aac'and a['sample_rate']=='48000'and a['channels']==1;assert abs(float(probe['format']['duration'])-280)<.001
 hashes={k:stream_hash(src,k)for k in ['v','a']};assert all(stream_hash(part,k)==hashes[k]for k in hashes)
 packets=json.loads(run([FP,'-v','error','-select_streams','v:0','-show_packets','-show_entries','packet=pts_time,duration_time','-of','json',str(part)]).stdout)['packets'];pts=sorted(float(p['pts_time'])for p in packets);assert len(pts)==8400 and all(abs(t-i/30)<.000002 for i,t in enumerate(pts))
 decode=run([FF,'-v','error','-i',str(part),'-f','null','-']);(P/'decode.log').write_bytes(decode.stderr);assert not decode.stderr
 # Representative final-file frames include the revised phrase, chapter joins and painted chapter06.
 frames=[60,1030,1349,1350,2489,2490,3659,3660,5309,5310,6659,6660,6807,7193,7658,7980,8399];expr='+'.join(f'eq(n\\,{n})'for n in frames);r=run([FF,'-y','-hide_banner','-loglevel','info','-i',str(part),'-an','-vf',f'blackdetect=d=0.03:pix_th=0.10,select={expr}','-fps_mode','vfr','-threads','2',str(P/'frame-%02d.png')]);assert b'black_start:'not in r.stderr;(P/'blackdetect.log').write_bytes(r.stderr);save(P/'frames.json',[dict(frame=n,path=str((P/f'frame-{i+1:02}.png').relative_to(R)))for i,n in enumerate(frames)])
 for g in guards:assert sha(R/g['path'])==g['sha256'],g['path']
 part.rename(dst)
 for ext in ['srt','vtt']:(E/f'film-subtitles-final-v18.{ext}').write_bytes((E/f'film-subtitles-v17.{ext}').read_bytes())
 save(P/'ffprobe.json',probe);report=dict(version='FILM_FINAL v0.18',date='2026-10-21',duration=280,frames=8400,fps=30,dimensions=[1920,1080],bakedCaptions=65,narration='Microsoft Yunyang; to do list pronunciation corrected',pictureSource='Native baked v16 / adopted complete paintings only',voiceSource='Corrected v17',rasterRenderRepeated=False,generationMode='Final lossless container assembly of already baked picture and corrected AAC',newTtsRequests=0,newImages=0,opticalFlow=False,videoPayloadBitExact=True,audioPayloadBitExact=True,streamHashes=hashes,fullDecodePassed=True,continuousPTS=True,blackFrameCheckPassed=True,representativeFinalFrames=len(frames),inheritedPictureQA='provenance/voice-v16/visual-verification.json',inheritedNarrationQA='provenance/pronunciation-v17/verification.json',sourceGuardsPassed=len(guards),captionTextAndTimingUnchanged=True,last14SecondsSilent=True,browserReview='pending',output=dict(path=str(dst.relative_to(R)),bytes=dst.stat().st_size,sha256=sha(dst)),command=args)
 save(P/'verification.json',report);save(E/'film-complete-final-v18-manifest.json',report);print(json.dumps(report,ensure_ascii=False),flush=True)
if __name__=='__main__':main()
