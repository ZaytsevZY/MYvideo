"""Independent on-device ASR for narrated cue files; no media uploaded."""
from pathlib import Path
import json, argparse, re, difflib, subprocess
import numpy as np
from faster_whisper import WhisperModel
ROOT=Path(__file__).resolve().parents[3];FILM=ROOT/'arts/actions/film';OUT=ROOT/'arts/audio/film/voice-v11';PROV=FILM/'provenance/voice-v11'
def normalized(t):return re.sub(r'[^a-z0-9\u4e00-\u9fff]','',t.lower())
def distance(a,b):
 prev=list(range(len(b)+1))
 for i,x in enumerate(a):
  curr=[i+1]
  for j,y in enumerate(b):curr.append(min(curr[-1]+1,prev[j+1]+1,prev[j]+(x!=y)))
  prev=curr
 return prev[-1]
def main():
 p=argparse.ArgumentParser();p.add_argument('--download-only',action='store_true');args=p.parse_args()
 model=WhisperModel('small',device='cpu',compute_type='int8',cpu_threads=4,download_root='/private/tmp/myvideo-whisper-cache',use_auth_token=False,local_files_only=not args.download_only)
 if args.download_only:print('Whisper-small ready for local checks',flush=True);return
 rows=[]
 master=OUT/'narration-v11.wav';whole=np.frombuffer(subprocess.check_output(['/opt/homebrew/bin/ffmpeg','-v','error','-i',str(master),'-ar','16000','-ac','1','-f','f32le','pipe:1']),dtype='<f4').copy();positions={r['id']:r for r in json.loads((PROV/'cue-alignment.json').read_text())['rows']}
 for c in json.loads((FILM/'captions-v01.json').read_text()):
  audio=OUT/'fitted'/f'{c["id"]}.wav';assert audio.exists(),audio
  r=positions[c['id']];pcm=whole[round(r['placedStartMs']*16):round(r['placedEndMs']*16)].copy()
  segments,info=model.transcribe(pcm,language='zh',beam_size=3,temperature=0,condition_on_previous_text=False,initial_prompt='简体中文科普旁白。术语：Agent、Todo list、劳动者、劳动力、价值增殖、虚拟雇主。',vad_filter=False)
  segs=[dict(start=s.start,end=s.end,text=s.text,avgLogProbability=s.avg_logprob)for s in segments];text=''.join(s['text']for s in segs);a,b=normalized(c['text']),normalized(text);error=distance(a,b)/len(a);row=dict(id=c['id'],expected=c['text'],transcript=text,characterErrorRate=error,needsReview=error>.2,segments=segs);rows.append(row);print(json.dumps({k:row[k]for k in ['id','transcript','characterErrorRate','needsReview']},ensure_ascii=False),flush=True)
 (PROV/'asr-verification.json').write_text(json.dumps(dict(model='Systran/faster-whisper-small',backend='CTranslate2 int8 CPU; local inference',scope='54 placed narration clauses extracted from normalized final WAV',rows=rows,flagged=[r['id']for r in rows if r['needsReview']]),ensure_ascii=False,indent=2)+'\n')
if __name__=='__main__':main()
