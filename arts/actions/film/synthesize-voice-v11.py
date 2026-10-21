"""Generate original-manuscript Mandarin narration; cached calls, no text rewrite."""
from pathlib import Path
import argparse,asyncio,json,hashlib,subprocess,time
import edge_tts
ROOT=Path(__file__).resolve().parents[3];FILM=ROOT/'arts/actions/film';OUT=ROOT/'arts/audio/film/voice-v11';PROV=FILM/'provenance/voice-v11';VOICE='zh-CN-YunyangNeural'
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
async def main():
 parser=argparse.ArgumentParser();parser.add_argument('--pilot',action='store_true');parser.add_argument('--fit-cue',action='store_true');parser.add_argument('--opening-variant',action='store_true');args=parser.parse_args()
 cues=json.loads((FILM/'captions-v01.json').read_text());selected=[cues[i]for i in [0,17,37,53]]if args.pilot else cues
 if args.fit_cue:selected=[c for c in cues if c['id']=='N08-05-10']
 if args.opening_variant:selected=[cues[0]]
 voice=next(v for v in await edge_tts.list_voices()if v['ShortName']==VOICE);(PROV/'voice-provider.json').write_text(json.dumps(dict(provider='Microsoft Edge online neural TTS',clientVersion=edge_tts.__version__,voice=voice,baseRate='+0%',pitch='-2Hz',userPreference='calm male Mandarin narration',sourceDocumentation='https://github.com/rany2/edge-tts',elevenLabs='No configured API connector or credential; user allowed alternatives.'),ensure_ascii=False,indent=2)+'\n')
 for c in selected:
  stem=c['id']+('-rate25'if args.fit_cue else'-agent-pronunciation'if args.opening_variant else'');mp3=OUT/'raw'/f'{stem}.mp3';meta=mp3.with_suffix('.jsonl');request=mp3.with_suffix('.request.json');payload=dict(text=c['text'].replace('Agent：','agent。')if args.opening_variant else c['text'],voice=VOICE,rate='+25%'if args.fit_cue else'+0%',pitch='-2Hz',boundary='WordBoundary')
  if mp3.exists() and request.exists():
   assert json.loads(request.read_text())==payload;print(json.dumps(dict(id=stem,cached=True)),flush=True);continue
  assert not mp3.exists() and not meta.exists(),'Partial output exists; inspect before resuming'
  request.write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n')
  comm=edge_tts.Communicate(**payload,connect_timeout=20,receive_timeout=60);await comm.save(str(mp3),str(meta));assert mp3.stat().st_size>1000
  probe=json.loads(subprocess.check_output(['/opt/homebrew/bin/ffprobe','-v','error','-show_format','-of','json',str(mp3)]));print(json.dumps(dict(id=stem,seconds=float(probe['format']['duration']),window=(c['endMs']-c['startMs'])/1000,bytes=mp3.stat().st_size)),flush=True)
  await asyncio.sleep(.3)
 print(json.dumps(dict(stage='pilot-ready'if args.pilot else'voice-source-ready',cues=len(selected))),flush=True)
if __name__=='__main__':asyncio.run(main())
