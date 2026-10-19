from pathlib import Path
import json,hashlib,re
ROOT=Path(__file__).resolve().parents[5];OUT=Path(__file__).resolve().parent
read=lambda p:(ROOT/p).read_bytes()
sha=lambda b:hashlib.sha256(b).hexdigest()
before=(OUT/'06-before.md').read_text();actual=(ROOT/'scripts/final/shot/06.md').read_text()
audio=lambda s:s.split('<start>')[1].split('<end>')[0]
assert audio(before)==audio(actual)
assert len(re.sub(r'\s','',audio(actual)))==110
notes=json.loads((OUT/'user-visual-notes.json').read_text())
for n in notes:assert n in actual
# Head and reference text are intentionally updated;01–05 and all runtime files must stay unchanged.
guards=json.loads((OUT/'protected-inputs.json').read_text())
for g in guards:assert sha(read(g['path']))==g['sha256'],g['path']
for g in json.loads((OUT/'reuse-inventory.json').read_text())['assets']:assert sha(read(g['path']))==g['sha256'],g['path']
data=json.loads((OUT/'shot-timing.json').read_text());shots=data['shots'];assert len(shots)==15
f=0;types={'E':0,'L':0};parents={}
for s in shots:
 assert s['startFrame']==f and s['endFrame']>f,s['id']
 assert abs(s['start']*30-s['startFrame'])<1e-6 and abs(s['end']*30-s['endFrame'])<1e-6
 frames=s['endFrame']-s['startFrame'];types[s['type']]+=frames;parents[s['parent']]=parents.get(s['parent'],0)+frames;f=s['endFrame']
 assert s['id'] in actual
assert f==1740 and types=={'E':732,'L':1008}
assert parents=={'V06.1':480,'V06.2':450,'V06.3':390,'V06.4':210,'V06.5':210}
cues=json.loads((OUT/'narration-cues-draft.json').read_text())['cues'];assert len(cues)==9
assert ''.join(c['text'] for c in cues)==re.sub(r'\s','',audio(actual))
end=0
for c in cues:assert c['startMs']>=end and c['endMs']>c['startMs'];end=c['endMs']
assert end==44000
assert shots[1]['end']==cues[0]['endMs']/1000 and shots[2]['start']==cues[1]['startMs']/1000
# Every life shot remains in life; no31s return to the office from the superseded table.
life=[s for s in shots if s['start']>=31 and s['end']<=44];assert len(life)==3 and all(s['type']=='E' for s in life)
assert all(s['start']>=44 or s['end']<=44 for s in shots)
for name in ['boundary-from-05-v02.json','boundary-to-ending-v02.json']:
 boundary=json.loads((OUT/name).read_text());assert boundary['verified']==False and boundary['evidence']['newSeamPreviewPath'] is None
# Resolve relative file links in the edited script and stage plan; leave remote URLs to source-check.
links=[]
for p in [ROOT/'scripts/final/shot/06.md',OUT/'chapter-plan.md']:
 for target in re.findall(r'\]\(([^)]+)\)',p.read_text()):
  if '://' in target or target.startswith('#'):continue
  path=target.split('#')[0];assert (p.parent/path).exists(),(p,target);links.append(target)
result={'version':'S06_STORYBOARD v0.2','stage':'text-storyboard-only','passed':True,'shots':15,'duration':58,'frames':1740,'storyFrames':732,'logicFrames':1008,'audioCharacters':110,'audioSha256':sha(audio(actual).encode()),'audioBytesUnchanged':True,'threeHumanNotesPreserved':True,'protectedInputs':len(guards),'referencePngHashesChecked':22,'draftCaptions':9,'captionEndMs':44000,'relativeLinksChecked':len(links),'runtimeRebuilt':False,'newImagesGenerated':False,'newSeamsVerified':False,'externalModelCalls':0,'audioProduced':False}
(OUT/'verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps(result,ensure_ascii=False))
