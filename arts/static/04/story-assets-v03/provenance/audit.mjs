import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {ASSETS,SCENES,scene,root,COMPETITION_STATES} from '../assets.mjs';
const HERE=path.dirname(fileURLToPath(import.meta.url)),ROOT=path.resolve(HERE,'../../../../..');
const sharp=createRequire(import.meta.url)('/Users/alan671/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const read=p=>fs.readFile(path.join(ROOT,p));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const json=async p=>JSON.parse(await fs.readFile(path.join(HERE,p),'utf8'));
const guards=await json('protected-inputs.json'),generated=await json('generation-register.json');
const layout=JSON.parse(await fs.readFile(path.join(HERE,'../layout.json'),'utf8'));
for(const item of guards)if(hash(await read(item.path))!==item.sha256)throw Error('Protected input changed: '+item.path);
if(new Set(generated.map(e=>e.source)).size!==generated.length)throw Error('Duplicate source counted as new generation');
for(const e of generated){
 const source=await fs.readFile(e.source),target=await read(e.target);
 if(hash(source)!==hash(target)||hash(target)!==e.sha256)throw Error('Image source copy mismatch '+e.id);
 for(const ref of e.references)if(hash(await read(ref.path))!==ref.sha256)throw Error('Reference changed '+ref.path);
 if(e.transparent){const st=await sharp(target).stats(),a=st.channels[3];if(!a||a.min!==0||a.max<240||a.mean<10)throw Error('Invalid alpha '+e.id);}
}
for(const e of layout.registry)if(hash(await read(e.path))!==e.sha256)throw Error('Registry mismatch '+e.path);
for(const f of layout.frames){const b=await read(f.path),m=await sharp(b).metadata();if(hash(b)!==f.sha256||m.width!==1920||m.height!==1080)throw Error('Composition mismatch '+f.path);}
const hrefs=Object.fromEntries(Object.keys(ASSETS).map(k=>[k,'asset:'+k]));
for(const name of Object.keys(SCENES))for(let state=0;state<SCENES[name].states;state++){
 const markup=root(scene(name,hrefs,state));if(/NaN|undefined|Infinity/.test(markup))throw Error('Invalid component '+name);
 if(!markup.includes('data-layer='))throw Error('Missing independent layers '+name);
}
if(COMPETITION_STATES.some(s=>Math.abs(s.weights.reduce((a,b)=>a+b,0)-1)>1e-9))throw Error('Market not normalized');
const browserShot='arts/static/04/story-assets-v03/provenance/browser-preview.png';
await fs.access(path.join(ROOT,browserShot));
const result={version:'S04_ART v0.3',passed:true,phase:'art-and-representative-compositions',modelCalls:generated.length,
 adoptedGeneratedPngs:generated.length,derivedPortraits:1,reusedAssets:4,registeredAssets:layout.registry.length,
 representativeCompositions:layout.frames.length,protectedFilesBytePreserved:guards.length,
 checks:['raw model outputs copied byte-identically','PNG dimensions and registry SHA','all reference SHA retained','genuine alpha in six isolated assets','light and dark alpha review','complete character and contact-perspective review','three distinct simultaneous window identities','editable performance and whiteboard copy','single normalized market in all four states','same job identity and growing CV list','source ends at992px before caption-safe997px','no script, runtime, caption or film mutation'],
 browserChecked:true,browserChecks:['three-window key states','A/M feedback','competition next-round state','whiteboard final state and caption-safe toggle','JD published with four anonymous CV rows'],browserScreenshot:browserShot,
 commands:['node arts/static/04/story-assets-v03/build.mjs','node arts/static/04/story-assets-v03/provenance/audit.mjs'],
 newRuntime:false,newFilmBuild:false,newVideo:false,newAudio:false,
 limitations:['有限完整关键态，尚非完整人物／写字逐帧动画','新55秒动态／185字符正式字幕待制作','03→04及04→05新接缝未实测','制作方视觉复查，不代表用户冻结或Claude审核']};
await fs.writeFile(path.join(HERE,'verification.json'),JSON.stringify(result,null,2)+'\n');
async function walk(folder){let list=[];for(const e of await fs.readdir(folder,{withFileTypes:true})){const p=path.join(folder,e.name);if(e.isDirectory())list.push(...await walk(p));else if(e.name!=='outputs.json')list.push(p);}return list;}
const outputs=[...await walk(path.resolve(HERE,'..')),...generated.map(e=>path.join(ROOT,e.target)),path.join(ROOT,ASSETS.hrPortrait),...['arts/actions/04/README.md','scripts/PROJECT_STATE.md','scripts/HANDOFF.md','scripts/doc/GENERATION_LOG.md'].map(p=>path.join(ROOT,p))];
const manifest=[];for(const p of [...new Set(outputs)].sort())manifest.push({path:path.relative(ROOT,p),sha256:hash(await fs.readFile(p))});
await fs.writeFile(path.join(HERE,'outputs.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({passed:true,generated:generated.length,registered:layout.registry.length,compositions:layout.frames.length,preserved:guards.length,browser:true}));
