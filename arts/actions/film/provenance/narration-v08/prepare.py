from pathlib import Path
import re,json,hashlib
root=Path(__file__).resolve().parents[5]
out=root/'arts/actions/film/provenance/narration-v08'
# Hand-authored semantic cuts, within the unchanged chapter budgets. End anchors retain all punctuation.
plans={
'01':[(0,4.6,'交给 Agent：'),(4.6,8.4,'整理文档。'),(8.4,16,'再进行验收。'),(16,20.4,'“接受”，'),(20.4,24,'下班回家。'),(24,27.8,'多做一件事，'),(27.8,31.6,'搁置的需求。'),(31.6,37.4,'不断延长。'),(37.4,45,'越来越远？')],
'02':[(0,5.1,'固定的存量。'),(5.1,10.1,'边界移动，'),(10.1,14.2,'逐渐提升。'),(14.2,21.3,'扩大产出。'),(21.3,27.2,'重新投入生产。'),(27.2,32.5,'更多的任务，'),(32.5,38,'投入的平衡。')],
'03':[(0,4.7,'雇佣劳动中，'),(4.7,9.6,'换取报酬。'),(9.6,13.3,'清单提前清空，'),(13.3,17,'工时结束之前，'),(17,22,'分配其他任务。'),(22,26.2,'缩短了执行过程，'),(26.2,30.5,'决定权。'),(30.5,35.1,'界限的约束下，'),(35.1,39,'劳动是否结束。')],
'04':[(0,4.3,'公司的调查称，'),(4.3,8.4,'扩大任务范围，'),(8.4,14,'交付任务。'),(14,18,'更多产出，'),(18,21.5,'随之提高。'),(21.5,26.8,'新技术的压力：'),(26.8,31.8,'逐渐消退，'),(31.8,36,'增加交付的动力。'),(36,40.4,'进入排期和考核，'),(40.4,44.6,'新的基准。'),(44.6,50.6,'工作标准的提升，'),(50.6,55,'“必须做”。')],
'05':[(.4,7,'“虚拟员工”的错觉，'),(7,12.8,'额外收益的权力；'),(12.8,18.5,'更多的成本，'),(18.5,21.7,'时间和金钱，'),(21.7,26.8,'生产力优势。'),(26.8,32.5,'占有和组织关系中，'),(32.5,37,'外在力量。'),(37,39.5,'一个侧面：'),(39.5,42,'由劳动者发出，'),(42,45,'由他人设定。')],
'06':[(.4,4.6,'更多交付，'),(4.6,8.8,'更短工时。'),(8.8,16,'节约的时间。'),(16,21.5,'任务边界，'),(21.5,27,'可支配的时间，'),(27,31,'人的自由。'),(31,44,'工作画上句号。')]
}
allc={};sources=[]
for id,segments in plans.items():
 p=root/f'scripts/final/shot/{id}.md';raw=p.read_bytes();(out/f'{id}.md.before').write_bytes(raw)
 block=raw.decode().split('<start>',1)[1].split('<end>',1)[0]
 audio=''.join(v.strip() for v in block.strip().splitlines())
 cues=[];pos=0
 for i,(start,end,anchor) in enumerate(segments):
  stop=audio.index(anchor,pos)+len(anchor);text=audio[pos:stop];pos=stop
  assert len(re.sub(r'\s','',text))>=10,(id,text)
  units=sum(.56 if ord(ch)<128 else 1 for ch in text)
  assert units*44+68<=1800,(id,text)
  cues.append(dict(id=f'N08-{id}-{i+1:02}',startMs=round(start*1000),endMs=round(end*1000),text=text))
 assert pos==len(audio),id
 allc[id]=cues
 sources.append(dict(chapter=id,path=str(p.relative_to(root)),sha256=hashlib.sha256(raw).hexdigest(),audioSha256=hashlib.sha256(block.encode()).hexdigest(),characters=len(re.sub(r'\s','',audio))))
(out/'narration.json').write_text(json.dumps(dict(version='FILM_NARRATION v0.8',date='2026-10-20',sources=sources,cues=allc),ensure_ascii=False,indent=2)+'\n')
print([(id,len(cs),sum(len(re.sub(r'\s','',c['text'])) for c in cs)) for id,cs in allc.items()])
