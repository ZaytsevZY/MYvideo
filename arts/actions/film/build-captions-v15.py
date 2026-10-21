"""Build versioned captions from the repaired human manuscript, without TTS."""
from pathlib import Path
import hashlib,json,re
ROOT=Path(__file__).resolve().parents[3];F=ROOT/'arts/actions/film';P=F/'provenance/captions-v15'
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def save(p,x):p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def count(t):return len(re.sub(r'\s','',t))
def stamp(ms,vtt=False):
 ms=round(ms);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02}{"."if vtt else","}{ms%1000:03}'
def subtitle(cues,vtt=False):return ('WEBVTT\n\n'if vtt else'')+'\n'.join(f'{i+1}\n{stamp(c["startMs"],vtt)} --> {stamp(c["endMs"],vtt)}\n{c["text"]}\n'for i,c in enumerate(cues))
def main():
 P.mkdir(parents=True,exist_ok=True);plan=json.loads((F/'caption-plan-v15.json').read_text());rows=[];global_cues=[];sources=[];local={};offset=0;clocks={}
 for ch,duration in zip(['01','02','03','04','05','06'],[45,38,39,55,45,58]):
  path=ROOT/f'scripts/final/shot/{ch}.md';text=re.findall(r'<start>(.*?)<end>',path.read_text(),re.S);assert len(text)==1
  canonical=''.join(l.strip()for l in text[0].strip().splitlines());actual=''.join(line for b in plan[ch]for line in b['lines']);assert canonical==actual,(ch,canonical,actual)
  cues=[];points=[];previous=0;source_previous=0
  for block in plan[ch]:
   start,end=block['time'];a,b=block['source'];assert start==previous and a==source_previous;assert end>start and b>a;previous=end;source_previous=b
   if not points:points.append([start,a])
   points.append([end,b]);lines=block['lines'];frames=round((end-start)*30);weights=[count(x)for x in lines]
   if not lines:continue
   assert all(n>=10 for n in weights),(ch,weights,lines)
   # Minimum2sec; remaining exposure follows character count inside each semantic block.
   assert frames>=60*len(lines);left=frames-60*len(lines);dur=[60+left*n/sum(weights)for n in weights];edges=[round(start*30)]
   for d in dur:edges.append(edges[-1]+d)
   edges=[round(x)for x in edges];assert edges[-1]==round(end*30)
   for i,line in enumerate(lines):
    units=sum(.56 if ord(c)<128 else 1 for c in line);assert units*44+68<=1800,(ch,line)
    cue=dict(id=f'N15-{ch}-{len(cues)+1:02}',chapterId=ch,text=line,startMs=round(edges[i]/30*1000),endMs=round(edges[i+1]/30*1000),timestampMs=None,confidence=None,timing='estimated semantic timing; new narration not recorded',mergedFrom=[])
    assert cue['endMs']-cue['startMs']>=2000;cue['mergedFrom']=[dict(id=cue['id'],text=line,startMs=cue['startMs'],endMs=cue['endMs'])];cues.append(cue)
  assert previous==source_previous==duration;clocks[ch]=points;local[ch]=cues
  assert ''.join(c['text']for c in cues)==canonical
  global_cues.extend([dict(c,startMs=c['startMs']+offset*1000,endMs=c['endMs']+offset*1000,mergedFrom=[dict(x)for x in c['mergedFrom']])for c in cues])
  rows.append(dict(chapter=ch,duration=duration,start=offset,cues=len(cues),characters=count(canonical),chineseCharacters=len(re.findall('[\u4e00-\u9fff]',canonical)),minDisplayMs=min(c['endMs']-c['startMs']for c in cues)))
  sources.append(dict(chapter=ch,path=str(path.relative_to(ROOT)),sha256=sha(path),audioSha256=hashlib.sha256(text[0].encode()).hexdigest(),audioText=text[0],canonicalText=canonical));offset+=duration
  folder=F/'captions'/ch;folder.mkdir(parents=True,exist_ok=True)
  for ext in ['srt','vtt']:(folder/f'{ch}-captions-v15.{ext}').write_text(subtitle(cues,ext=='vtt'))
  save(folder/f'{ch}-captions-v15.json',cues)
 assert offset==280 and sum(r['characters']for r in rows)==1247
 for ext in ['srt','vtt']:
  body=subtitle(global_cues,ext=='vtt');(F/f'captions-v15.{ext}').write_text(body);(F/f'exports/film-subtitles-v15.{ext}').write_text(body)
 save(F/'captions-v15.json',global_cues)
 save(F/'narration-v15.json',dict(version='FILM_NARRATION v0.15',date='2026-10-21',duration=280,frames=8400,fps=30,timing='estimated; 300characters/min calibration and fixed semantic shot budgets, not aligned to old audio',newAudio=False,sources=sources,cues=local,clocks=clocks,chapters=rows))
 save(P/'manifest.json',dict(version='FILM_CAPTIONS v0.15',date='2026-10-21',characters=1247,cues=len(global_cues),minCharacters=min(count(c['text'])for c in global_cues),minDisplayMs=min(c['endMs']-c['startMs']for c in global_cues),duration=280,frames=8400,referencesStartMs=266000,lastCaptionEndMs=global_cues[-1]['endMs'],newAudio=False,oldAudioCompatible=False,chapters=rows,sources=sources,outputs=[dict(path=str(p.relative_to(ROOT)),sha256=sha(p))for p in [F/'captions-v15.json',F/'captions-v15.srt',F/'captions-v15.vtt',F/'narration-v15.json']]))
 for source in sources:assert sha(ROOT/source['path'])==source['sha256']
 print(json.dumps(dict(characters=1247,cues=len(global_cues),chapters=rows,minDisplayMs=min(c['endMs']-c['startMs']for c in global_cues)),ensure_ascii=False),flush=True)
if __name__=='__main__':main()
