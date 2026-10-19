import json,pathlib,hashlib,sys,shutil
root=pathlib.Path(__file__).resolve().parents[5]
base=root/'arts/static/06/story-assets-v02/provenance'
record=json.loads(pathlib.Path(sys.argv[1]).read_text())
dst=root/record['target'];dst.parent.mkdir(parents=True,exist_ok=True)
if dst.exists():raise RuntimeError('Refusing to overwrite '+str(dst))
shutil.copyfile(record['source'],dst)
record['sha256']=hashlib.sha256(dst.read_bytes()).hexdigest()
record['tool']='built-in image_gen';record['model']='not exposed'
record['referenceHashes']=[{'path':p,'sha256':hashlib.sha256((root/p).read_bytes()).hexdigest()} for p in record['refs']]
registry=base/'generation-register.json';entries=json.loads(registry.read_text());entries.append(record)
registry.write_text(json.dumps(entries,ensure_ascii=False,indent=2)+'\n')
(base/(record['id']+'-prompt-en.txt')).write_text(record['prompt']+'\n')
print(json.dumps({'id':record['id'],'target':record['target'],'sha256':record['sha256']}))
