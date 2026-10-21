"""Local ASR and continuity measurements, not a substitute for listening."""
from pathlib import Path
import json,re,subprocess
import numpy as np
from faster_whisper import WhisperModel
from importlib.util import spec_from_file_location,module_from_spec
ROOT=Path(__file__).resolve().parents[3];F=ROOT/'arts/actions/film';P=F/'provenance/voice-v16';O=ROOT/'arts/audio/film/voice-v16'
def norm(t):return re.sub(r'[^a-z0-9\u4e00-\u9fff]','',t.lower())
def dist(a,b):
 prev=list(range(len(b)+1))
 for i,x in enumerate(a):
  cur=[i+1]
  for j,y in enumerate(b):cur.append(min(cur[-1]+1,prev[j+1]+1,prev[j]+(x!=y)))
  prev=cur
 return prev[-1]
def main():
 data=json.loads((P/'alignment.json').read_text());old=json.loads((F/'captions-v15.json').read_text());new=json.loads((F/'captions-v16.json').read_text());assert ''.join(c['text']for c in old)==''.join(c['text']for c in new)
 assert len(new)==65 and all(len(c['text'].replace(' ',''))>=10 for c in new)
 assert all(c['endMs']<=n['startMs']for c,n in zip(new,new[1:]));assert all(c['endMs']-c['startMs']>=2000 for c in new)
 pcm=np.frombuffer(subprocess.check_output(['/opt/homebrew/bin/ffmpeg','-v','error','-i',str(O/'narration-v16.wav'),'-ar','16000','-ac','1','-f','f32le','pipe:1']),dtype='<f4').copy();assert len(pcm)==280*16000;assert np.max(np.abs(pcm[-14*16000:]))==0
 model=WhisperModel('small',device='cpu',compute_type='int8',cpu_threads=2,download_root='/private/tmp/myvideo-whisper-cache',local_files_only=True)
 rows=[]
 for s in data['sentences']:
  audio=pcm[round(s['start']*16000):round(s['speechEnd']*16000)].copy()
  segs,info=model.transcribe(audio,language='zh',beam_size=3,temperature=0,condition_on_previous_text=False,initial_prompt='简体中文科普旁白。术语：Agent、Todo list、劳动者、劳动力、价值增殖、虚拟雇主。',vad_filter=False)
  transcript=''.join(x.text for x in segs);cer=dist(norm(s['text']),norm(transcript))/len(norm(s['text']));r=dict(id=s['id'],expected=s['text'],transcript=transcript,characterErrorRate=cer,flagged=cer>.2);rows.append(r);print(json.dumps(r,ensure_ascii=False),flush=True)
  (P/'asr-progress.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
 report=dict(asrModel='Systran/faster-whisper-small / local CTranslate2 int8',manualListening=False,rows=rows,flagged=[r['id']for r in rows if r['flagged']],duration=280,captions=len(new),originalWordingPreserved=True,last14SecondsSilent=True,peak=float(np.max(np.abs(pcm))))
 (P/'speech-verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items()if k!='rows'},ensure_ascii=False),flush=True)
if __name__=='__main__':main()
