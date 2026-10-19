import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {CHAPTERS,FPS,TOTAL_FRAMES,DURATION} from './timeline.mjs';
import {DIRECT_ASSETS_BY_CHAPTER,GLOBAL_CUES,GLOBAL_BEATS} from './scenes.mjs';
import {REGISTRY as STORY02} from '../02/story-scene-v04.mjs';
const DIR=path.dirname(fileURLToPath(import.meta.url)),ROOT=path.resolve(DIR,'../../..');
const read=p=>fs.readFileSync(path.join(ROOT,p)),json=p=>JSON.parse(read(p)),sha=p=>crypto.createHash('sha256').update(read(p)).digest('hex');
const registries={'02':json('arts/actions/02/provenance/full-v03/input-manifest.json').registry,'05':json('arts/actions/05/provenance/v01/input-manifest.json').registry,'06':json('arts/actions/06/provenance/v01/input-manifest.json').registry};
Object.assign(registries['02'],STORY02);
const bundle01=json('arts/actions/01/bundle-camera-v01.json');
const data={version:'FILM_PREVIEW v0.6',date:'2026-10-19',fps:FPS,duration:DURATION,frames:TOTAL_FRAMES,width:1920,height:1080,audio:false,bundle01,registries,chapters:CHAPTERS,beats:GLOBAL_BEATS};
const sources=['arts/actions/01/camera-motion.mjs','arts/actions/01/performance.mjs','arts/actions/01/keyframes.mjs','arts/actions/01/bundle-camera-v01.json','arts/actions/01/captions/caption-data.mjs','arts/actions/02/full-scene.mjs','arts/actions/02/opening-revised.mjs','arts/actions/02/entry-v03.mjs','arts/actions/02/scene.mjs','arts/actions/03/scene.mjs','arts/actions/04/scene.mjs','arts/actions/05/scene.mjs','arts/actions/06/scene.mjs'];
const inventory=new Map();
function add(id,a,chapter){
 if(!inventory.has(a.path))inventory.set(a.path,{path:a.path,ids:[],chapters:[]});
 const item=inventory.get(a.path);if(!item.ids.includes(id))item.ids.push(id);if(!item.chapters.includes(chapter))item.chapters.push(chapter);
}
for(const [id,a]of Object.entries({...bundle01.assets,...bundle01.poses}))add(id,a,'01');
for(const [chapter,r]of Object.entries(registries))for(const [id,a]of Object.entries(r))add(id,a,chapter);
for(const [chapter,items]of Object.entries(DIRECT_ASSETS_BY_CHAPTER))for(const [id,p]of Object.entries(items))add(id,{path:p},chapter);
//04 holds03's terminal image before opening the simultaneous study scenes.
for(const id of ['manager','portrait','coworkerA','coworkerB','office'])add(id,{path:DIRECT_ASSETS_BY_CHAPTER['03'][id]},'04');
const sharp=createRequire(import.meta.url)('/Users/alan671/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
for(const item of inventory.values()){
 const buf=read(item.path),m=await sharp(buf).metadata();
 Object.assign(item,{bytes:buf.length,sha256:sha(item.path),width:m.width,height:m.height,alpha:!!m.hasAlpha,format:m.format,kind:item.path.includes('/poses/')?'完整姿态':item.path.includes('/portraits/')?'头像':item.path.includes('/backgrounds/')?'背景':item.path.includes('/items/')?'道具':item.path.includes('/provenance/')?'合成底图':'图解与状态'});
}
for(const c of CHAPTERS){
 const script=read(`scripts/final/shot/${c.id}.md`).toString().split('<start>')[1].split('<end>')[0].replace(/\s/g,'');
 const actual=GLOBAL_CUES.filter(x=>x.chapterId===c.id).map(x=>x.text).join('').replace(/\s/g,'');
 if(script!==actual)throw Error('Narration differs in '+c.id);
}
const save=(p,d)=>fs.writeFileSync(path.join(DIR,p),JSON.stringify(d,null,2)+'\n');
save('bundle-v01.json',data);
save('assets-v01.json',{version:data.version,assets:[...inventory.values()],note:'Original paths retained; shared references deduplicated by path. Composite stages are not new drawings.'});
save('captions-v01.json',GLOBAL_CUES);
const stamp=ms=>{const x=Math.round(ms);return `${String(Math.floor(x/3600000)).padStart(2,'0')}:${String(Math.floor(x/60000)%60).padStart(2,'0')}:${String(Math.floor(x/1000)%60).padStart(2,'0')},${String(x%1000).padStart(3,'0')}`;};
fs.writeFileSync(path.join(DIR,'captions-v01.srt'),GLOBAL_CUES.map((c,i)=>`${i+1}\n${stamp(c.startMs)} --> ${stamp(c.endMs)}\n${c.text}\n`).join('\n'));
sources.push('arts/actions/02/story-scene-v04.mjs','arts/static/02/story-assets-v01/scene-layered-v03.mjs');
sources.push('arts/actions/03/story-scene-v05.mjs','arts/actions/04/entry-from-03-v05.mjs','arts/static/03/story-assets-v04/assets.mjs','arts/static/03/story-assets-v04/screen-copy.json');
sources.push('arts/actions/04/story-scene-v05.mjs','arts/actions/04/captions/04-narration-v05.json','arts/static/04/story-assets-v03/assets.mjs','arts/static/04/story-assets-v03/screen-copy.json','arts/actions/05/entry-from-04-v05.mjs');
sources.push('arts/actions/05/story-scene-v03.mjs','arts/actions/05/captions/05-narration-v03.json','arts/static/05/story-assets-v02/assets.mjs','arts/static/05/story-assets-v02/screen-copy.json','arts/actions/06/entry-from-05-v03.mjs');
sources.push('arts/actions/06/story-scene-v03.mjs','arts/actions/06/captions/06-narration-v03.json','arts/static/06/story-assets-v02/assets.mjs','arts/static/06/story-assets-v02/screen-copy.json');
fs.mkdirSync(path.join(DIR,'provenance/integration-v06'),{recursive:true});
save('provenance/integration-v06/inputs.json',{date:data.date,chapters:CHAPTERS,source:sources.map(p=>({path:p,sha256:sha(p)})),framework:['timeline.mjs','scenes.mjs','player.mjs','player.css','preview.html','build.mjs','qa.mjs','framework.test.mjs'].map(p=>({path:'arts/actions/film/'+p,sha256:sha('arts/actions/film/'+p)})),audio:false,externalModelCalls:0,updatedChapter:'06',entryAdapter:'new05 pending plan held for0.4s in06; new15-shot06 including joint confirmation, later acceptance, life and references'});
console.log(JSON.stringify({chapters:CHAPTERS.length,duration:DURATION,frames:TOTAL_FRAMES,captions:GLOBAL_CUES.length,uniqueAssetPaths:inventory.size}));
