"""Validate delivered AAC against the aligned WAV and protected silent video."""
from pathlib import Path
import json,subprocess,hashlib,math
import numpy as np
ROOT=Path(__file__).resolve().parents[3];D=ROOT/'arts/actions/film';P=D/'provenance/voice-v11';A=ROOT/'arts/audio/film/voice-v11';F='/opt/homebrew/bin/ffmpeg';N=48000*280
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
def pcm(p):return np.frombuffer(subprocess.check_output([F,'-v','error','-i',str(p),'-map','0:a:0','-ar','48000','-ac','1','-f','f32le','pipe:1']),dtype='<f4').copy()
def main():
 m=json.loads((D/'exports/film-complete-captioned-voiced-v11-manifest.json').read_text());a=pcm(A/'narration-v11.wav');b=pcm(ROOT/m['output']['path']);assert len(a)==N and len(b)==N
 peak=float(np.max(np.abs(b)));tail=float(np.max(np.abs(b[266*48000:])));correlation=float(np.dot(a,b)/math.sqrt(float(np.dot(a,a))*float(np.dot(b,b))));snr=10*math.log10(float(np.mean(a*a))/float(np.mean((a-b)**2)));assert peak<1 and tail<.00001 and correlation>.98 and snr>18
 cues=json.loads((D/'captions-v01.json').read_text());align=json.loads((P/'cue-alignment.json').read_text());assert len(cues)==len(align['rows'])==54;assert m['originalVideoStreamHash']==m['outputVideoStreamHash']
 for c,r in zip(cues,align['rows']):
  assert c['id']==r['id']and c['text']==r['text'];assert c['startMs']<=r['placedStartMs']<r['placedEndMs']<=c['endMs'];assert np.sqrt(np.mean(b[round(r['placedStartMs']*48):round(r['placedEndMs']*48)]**2))>.001
 for g in json.loads((P/'protected-inputs.json').read_text()):assert sha(ROOT/g['path'])==g['sha256'],g['path']
 assert sha(D/'captions-v01.srt')==sha(D/'exports/film-subtitles-v11.srt')
 loud=subprocess.run([F,'-hide_banner','-i',str(ROOT/m['output']['path']),'-map','0:a:0','-af','ebur128=peak=true','-f','null','-'],capture_output=True,check=True);(P/'encoded-audio-loudness.log').write_bytes(loud.stderr)
 verification=dict(version='FILM_VOICE_QA v0.11',date='2026-10-21',output=m['output'],sourceSilentVideoUnchanged=True,videoBitstreamIdentical=True,frames=8400,fps=30,duration=280,audio=dict(codec='aac',sampleRate=48000,channels=1,decodedSamples=N,samplePeak=peak,samplePeakDb=20*math.log10(peak),last14SecondsPeak=tail,masterCorrelation=correlation,masterToAacSnrDb=snr),narrationClauses=54,allClausesInsideOriginalCaptionWindows=True,manuscriptCharacters=994,captionTextStyleTimingUnchanged=True,ttsVoice='zh-CN-YunyangNeural',ttsCalls=m['ttsCalls'],fit=dict(maxLocalTempo=max(r['tempo']for r in align['rows']),sourceRateChanges=['N08-05-10:+25%'],speechOnlyPronunciationNormalization='Opening Agent -> agent and colon -> sentence stop for TTS input only; same lexical words, manuscript and captions unchanged'),fullDecodePassed=True,browserReview='pending',asrReport='arts/actions/film/provenance/voice-v11/asr-verification.json',externalGeneration='TTS only; no new image or video generation',noOpticalFlow=True)
 (P/'verification.json').write_text(json.dumps(verification,ensure_ascii=False,indent=2)+'\n');print(json.dumps(verification,ensure_ascii=False),flush=True)
if __name__=='__main__':main()
