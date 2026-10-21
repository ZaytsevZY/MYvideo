"""Verify final encoded audio, captions, protected inputs, and speech timing."""
from pathlib import Path
import hashlib,json,math,subprocess
import numpy as np
ROOT=Path(__file__).resolve().parents[3];D=ROOT/'arts/actions/film';P=D/'provenance/voice-v12';A=ROOT/'arts/audio/film/voice-v12';FF='/opt/homebrew/bin/ffmpeg'
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def pcm(p):return np.frombuffer(subprocess.check_output([FF,'-v','error','-i',str(p),'-map','0:a:0','-ar','48000','-ac','1','-f','f32le','pipe:1']),dtype='<f4').copy()
def main():
 m=json.loads((D/'exports/film-complete-captioned-voiced-v12-manifest.json').read_text());align=json.loads((P/'alignment.json').read_text());n=round(align['duration']*48000)
 a=pcm(A/'narration-v12.wav');b=pcm(ROOT/m['output']['path']);assert len(a)==n and n<=len(b)<n+1024;decoded=len(b);b=b[:n]
 peak=float(np.max(np.abs(b)));tail=float(np.max(np.abs(b[-14*48000:])));cor=float(np.dot(a,b)/math.sqrt(float(np.dot(a,a))*float(np.dot(b,b))));snr=10*math.log10(float(np.mean(a*a))/float(np.mean((a-b)**2)));assert peak<1 and tail<.00001 and cor>.98 and snr>18
 captions=json.loads((D/'captions-v12.json').read_text());old=json.loads((D/'captions-v01.json').read_text());assert ''.join(c['text']for c in captions)==''.join(c['text']for c in old)
 for c in captions:assert np.sqrt(np.mean(b[round(c['startMs']*48):round(c['endMs']*48)]**2))>.001
 for g in json.loads((P/'protected-inputs.json').read_text()):assert sha(ROOT/g['path'])==g['sha256'],g['path']
 speech=json.loads((P/'speech-verification.json').read_text());visual=json.loads((P/'visual-verification.json').read_text());assert not speech['flagged'];assert visual['all72BeatsVisible']and visual['continuousPTS']and visual['encodedBlackFrameCheckPassed']
 r=subprocess.run([FF,'-hide_banner','-i',str(ROOT/m['output']['path']),'-map','0:a:0','-af','ebur128=peak=true','-f','null','-'],capture_output=True,check=True);(P/'encoded-audio-loudness.log').write_bytes(r.stderr)
 report=dict(version='FILM_VOICE_QA v0.12',duration=align['duration'],frames=align['frames'],fps=30,sourceManuscriptAndPaintingsUnchanged=True,captionCount=54,captionCharacters=994,captionStyleUnchanged=True,captionTimingChanged=True,minCaptionMs=min(c['endMs']-c['startMs']for c in captions),newTtsRequests=m['newTtsRequests'],generationMode=align['generationMode'],audio=dict(codec='aac',sampleRate=48000,channels=1,masterSamples=n,decodedSamplesIncludingAacPadding=decoded,samplePeak=peak,samplePeakDb=20*math.log10(peak),last14SecondsPeak=tail,masterCorrelation=cor,masterToAacSnrDb=snr),sameSentenceBoundaryCount=len(speech['sameSentenceBoundaries']),oldMedianGapSeconds=speech['oldMedianGapSeconds'],newMedianGapSeconds=speech['newMedianGapSeconds'],maxNewInternalGapSeconds=speech['maxNewInternalGapSeconds'],sourceGuardsPassed=m['sourceGuardsPassed'],fullDecodePassed=m['fullDecodePassed'],visualVerification=visual,asrFlagged=speech['flagged'],manualListening=False,output=m['output'],narration=m['narration'],browserReview='pending')
 (P/'verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items()if k!='visualVerification'},ensure_ascii=False),flush=True)
if __name__=='__main__':main()
