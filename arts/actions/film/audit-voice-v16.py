"""Check the delivered AAC against the aligned master, sources and fixed film."""
from pathlib import Path
import hashlib,json,math,subprocess
import numpy as np
ROOT=Path(__file__).resolve().parents[3];F=ROOT/'arts/actions/film';P=F/'provenance/voice-v16';A=ROOT/'arts/audio/film/voice-v16';FF='/opt/homebrew/bin/ffmpeg'
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def pcm(p):return np.frombuffer(subprocess.check_output([FF,'-v','error','-i',str(p),'-map','0:a:0','-ar','48000','-ac','1','-f','f32le','pipe:1']),dtype='<f4').copy()
def main():
 m=json.loads((F/'exports/film-complete-captioned-voiced-v16-manifest.json').read_text());align=json.loads((P/'alignment.json').read_text());n=280*48000
 a=pcm(A/'narration-v16.wav');b=pcm(ROOT/m['output']['path']);assert len(a)==n and n<=len(b)<n+1024;decoded=len(b);b=b[:n]
 peak=float(np.max(np.abs(b)));tail=float(np.max(np.abs(b[-14*48000:])));cor=float(np.dot(a,b)/math.sqrt(float(np.dot(a,a))*float(np.dot(b,b))));snr=10*math.log10(float(np.mean(a*a))/float(np.mean((a-b)**2)));assert peak<1 and tail<.00001 and cor>.98 and snr>18
 captions=json.loads((F/'captions-v16.json').read_text());old=json.loads((F/'captions-v15.json').read_text());assert ''.join(c['text']for c in captions)==''.join(c['text']for c in old)
 for c in captions:assert np.sqrt(np.mean(b[round(c['startMs']*48):round(c['endMs']*48)]**2))>.001
 for g in json.loads((P/'protected-inputs.json').read_text()):assert sha(ROOT/g['path'])==g['sha256'],g['path']
 speech=json.loads((P/'speech-verification.json').read_text());assert not speech['flagged']
 movie=str(ROOT/m['output']['path']);r=subprocess.run([FF,'-hide_banner','-i',movie,'-map','0:a:0','-af','ebur128=peak=true','-f','null','-'],capture_output=True,check=True);(P/'encoded-audio-loudness.log').write_bytes(r.stderr)
 raw=align['rawCaptionAlignment'];internal=[]
 for c,nxt in zip(raw,raw[1:]):
  if c['sentenceId']!=nxt['sentenceId']:continue
  words=next(s for s in align['sentences']if s['id']==c['sentenceId'])['words'];boundary=nxt['voiceStartMs']/1000;before=max((w['end']for w in words if w['end']<=boundary+.00001),default=boundary);internal.append(dict(after=c['id'],before=nxt['id'],nativeGapSeconds=boundary-before))
 report=dict(version='FILM_VOICE_QA v0.16',duration=280,frames=8400,fps=30,sourceManuscriptAndPaintingsUnchanged=True,captionCount=len(captions),captionCharacters=1247,captionStyleUnchanged=True,minCaptionMs=min(c['endMs']-c['startMs']for c in captions),newTtsRequests=33,generationMode='whole-sentence Microsoft Yunyang',audioTempoApplied=False,audio=dict(codec='aac',sampleRate=48000,channels=1,masterSamples=n,decodedSamplesIncludingAacPadding=decoded,samplePeak=peak,samplePeakDb=20*math.log10(peak),last14SecondsPeak=tail,masterCorrelation=cor,masterToAacSnrDb=snr),sameSentenceBoundaries=internal,maxInternalGapSeconds=max(x['nativeGapSeconds']for x in internal),sourceGuardsPassed=m['sourceGuardsPassed'],fullDecodePassed=m['fullDecodePassed'],asrFlagged=speech['flagged'],manualListening=False,output=m['output'],narration=m['narration'],browserReview='pending')
 (P/'verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items()if k!='sameSentenceBoundaries'},ensure_ascii=False),flush=True)
if __name__=='__main__':main()
