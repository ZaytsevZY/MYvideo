from pathlib import Path
import json,hashlib,xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[5];HERE=Path(__file__).resolve().parent;PACK=HERE.parent
sha=lambda b:hashlib.sha256(b).hexdigest()
guards=json.loads((HERE/'protected-inputs.json').read_text())
for a in guards:assert sha((ROOT/a['path']).read_bytes())==a['sha256'],a['path']
layout=json.loads((PACK/'layout.json').read_text());assert len(layout['registry'])==25 and len(layout['states'])==24
for a in layout['registry']:
 b=(ROOT/a['path']).read_bytes();assert b[:8]==b'\x89PNG\r\n\x1a\n';assert sha(b)==a['sha256'];assert list((int.from_bytes(b[16:20],'big'),int.from_bytes(b[20:24],'big')))==[a['width'],a['height']]
files=list((PACK/'compositions').glob('*.svg'));assert len(files)==24
for p in files:
 root=ET.parse(p).getroot();assert root.attrib['viewBox']=='0 0 1920 1080'
 ids=[e.attrib['id'] for e in root.iter() if 'id' in e.attrib];assert len(ids)==len(set(ids)),p
 for e in root.iter():
  href=e.attrib.get('href','')
  if href.startswith('#'):assert href[1:] in ids,(p,href)
  elif href:assert href.startswith('data:image/png;base64,'),(p,href[:40])
gen=json.loads((HERE/'generation-register.json').read_text());assert len(gen)==18 and sum(x['status']=='adopted' for x in gen)==16
for a in gen:
 assert sha((ROOT/a['target']).read_bytes())==a['sha256'],a['target']
 for r in a['referenceHashes']:assert sha((ROOT/r['path']).read_bytes())==r['sha256'],r['path']
print('PASS:35 protected inputs,25PNG registry entries,24SVGs,18 model records and input hashes')
