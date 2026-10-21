"""One-sentence English pronunciation correction; preserve source manuscripts."""
from pathlib import Path
import argparse,asyncio,json
R=Path(__file__).resolve().parents[3];O=R/'arts/audio/film/voice-v17';P=R/'arts/actions/film/provenance/pronunciation-v17'
async def main(rate):
 import edge_tts
 name='S17-01-05'+(''if rate=='-5%'else '-rate'+rate.replace('%',''));mp3=O/'raw'/f'{name}.mp3';request=mp3.with_suffix('.request.json');payload=dict(text='他发现任务逐项完成，to do list却不断延长，似乎永远也做不完。',voice='zh-CN-YunyangNeural',rate=rate,pitch='-2Hz',boundary='WordBoundary')
 if mp3.exists():assert json.loads(request.read_text())==payload;print('cached',name);return
 request.write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n');await edge_tts.Communicate(**payload,connect_timeout=25,receive_timeout=90).save(str(mp3),str(mp3.with_suffix('.jsonl')));print(json.dumps(dict(path=str(mp3.relative_to(R)),bytes=mp3.stat().st_size)))
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--rate',default='-5%');args=p.parse_args();asyncio.run(main(args.rate))
