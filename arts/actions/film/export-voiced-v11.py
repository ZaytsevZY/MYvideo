"""Attach verified narration without re-encoding painted video or baked captions."""
from pathlib import Path
import json,subprocess,hashlib,shutil
import numpy as np
ROOT=Path(__file__).resolve().parents[3];FILM=ROOT/'arts/actions/film';PROV=FILM/'provenance/voice-v11';VOICE=ROOT/'arts/audio/film/voice-v11';FF='/opt/homebrew/bin/ffmpeg';FP='/opt/homebrew/bin/ffprobe'
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
def run(cmd):return subprocess.run(cmd,capture_output=True,check=True)
def probe(p):return json.loads(run([FP,'-v','error','-show_streams','-show_format','-of','json',str(p)]).stdout)
def stream_hash(p):return run([FF,'-v','error','-i',str(p),'-map','0:v:0','-c','copy','-f','hash','-hash','sha256','-']).stdout.decode().strip()
def main():
 for g in json.loads((PROV/'protected-inputs.json').read_text()):assert sha(ROOT/g['path'])==g['sha256'],g['path']
 original=FILM/'exports/film-complete-captioned-silent-v10.mp4';master=VOICE/'narration-v11.wav';target=FILM/'exports/film-complete-captioned-voiced-v11.mp4';partial=target.with_suffix('.part.mp4');assert not target.exists() and not partial.exists()
 align=json.loads((PROV/'cue-alignment.json').read_text());assert len(align['rows'])==54
 for r in align['rows']:assert r['placedStartMs']>=r['captionStartMs'] and r['placedEndMs']<=r['captionEndMs'] and r['tempo']<=1.18
 wav=probe(master);a=wav['streams'][0];assert a['sample_rate']=='48000' and a['channels']==1 and int(a['duration_ts'])==48000*280
 pcm=np.frombuffer(run([FF,'-v','error','-i',str(master),'-f','f32le','-ac','1','-ar','48000','pipe:1']).stdout,dtype='<f4');peak=float(np.max(np.abs(pcm)));assert len(pcm)==48000*280 and peak<1;tail=float(np.max(np.abs(pcm[266*48000:])));assert tail<.00001
 args=[FF,'-hide_banner','-loglevel','warning','-i',str(original),'-i',str(master),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-ar','48000','-ac','1','-metadata:s:a:0','language=zho','-metadata:s:a:0','title=普通话男声旁白','-map_metadata','-1','-t','280','-movflags','+faststart',str(partial)];result=run(args);(PROV/'mux.log').write_bytes(result.stderr)
 meta=probe(partial);assert len(meta['streams'])==2;v=next(s for s in meta['streams']if s['codec_type']=='video');a=next(s for s in meta['streams']if s['codec_type']=='audio');assert v['width']==1920 and v['height']==1080 and v['avg_frame_rate']=='30/1' and int(v['nb_frames'])==8400;assert a['codec_name']=='aac' and a['sample_rate']=='48000' and a['channels']==1;assert abs(float(meta['format']['duration'])-280)<.001
 original_hash=stream_hash(original);output_hash=stream_hash(partial);assert original_hash==output_hash
 full=run([FF,'-v','error','-i',str(partial),'-f','null','-']);(PROV/'full-decode.log').write_bytes(full.stderr);partial.rename(target)
 srt=FILM/'exports/film-subtitles-v11.srt';
 if not srt.exists():shutil.copyfile(FILM/'captions-v01.srt',srt)
 assert sha(srt)==sha(FILM/'captions-v01.srt')
 manifest=dict(version='FILM_VOICE v0.11',date='2026-10-21',videoSource='FILM_BAKE v0.10; original painted frames; no optical flow',voiceProvider='Microsoft Edge online neural TTS',voice='zh-CN-YunyangNeural',userPreference='沉稳男声',output=dict(path=str(target.relative_to(ROOT)),bytes=target.stat().st_size,sha256=sha(target)),narration=dict(path=str(master.relative_to(ROOT)),sha256=sha(master),sampleRate=48000,channels=1,pcmBits=24,peakAmplitude=peak,tail14SecondsPeak=tail),subtitles=dict(path=str(srt.relative_to(ROOT)),sha256=sha(srt),count=54,characters=994,wordingStyleTimingUnchanged=True),duration=280,frames=8400,fps=30,dimensions=[1920,1080],audioCodec='aac',videoReencoded=False,originalVideoStreamHash=original_hash,outputVideoStreamHash=output_hash,fullDecodePassed=True,probe=meta,ttsCalls=len(list((VOICE/'raw').glob('*.mp3'))),visualReview='pending browser playback',speechVerification='pending independent ASR review',command=args)
 (FILM/'exports/film-complete-captioned-voiced-v11-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n');(PROV/'ffprobe.json').write_text(json.dumps(meta,indent=2)+'\n');print(json.dumps(dict(stage='voiced-film-ready',output=manifest['output'],videoBitstreamUnchanged=True,voiceClips=54,tail14SecondsSilent=True)),flush=True)
if __name__=='__main__':main()
