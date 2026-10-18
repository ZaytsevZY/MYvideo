import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {createRequire} from 'node:module';import {fileURLToPath} from 'node:url';
import {createRenderer} from '../film/scenes.mjs';import {BEATS,CUES,REGISTRY,CONFIG,sample} from './story-scene-v04.mjs';
const require=createRequire(import.meta.url),sharp=require('/Users/alan671/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const HERE=path.dirname(fileURLToPath(import.meta.url)),ROOT=path.resolve(HERE,'../../..'),OUT=path.join(HERE,'provenance/story-v04');
const data=JSON.parse(fs.readFileSync(path.join(HERE,'../film/bundle-v01.json'))),uris=new Map(),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
// Resolve lazily, so unreferenced chapter images never enter a frame's SVG.
const render=createRenderer(data,p=>{if(!uris.has(p)){const b=fs.readFileSync(path.join(ROOT,p));uris.set(p,'data:image/'+(p.endsWith('.svg')?'svg+xml':'png')+';base64,'+b.toString('base64'));}return uris.get(p);});
const times=[0,.7,2.8,4.7,6,10.7,12.7,13.1,16,18.3,21.6,24.5,25.7,26.6,27.5,30.7,32.1,34.6,37.5];let frames=[];
for(const t of times){const f=Math.round(t*30),r=render(1350+f),file='frame-'+String(f).padStart(4,'0')+'.png';const buf=await sharp(Buffer.from(r.svg)).png().toBuffer();fs.writeFileSync(path.join(OUT,file),buf);frames.push({time:t,frame:f,path:path.relative(ROOT,path.join(OUT,file)),sha256:sha(buf)});console.log('frame '+t);}
const cells=[];for(let i=0;i<frames.length;i++){const x=(i%3)*480,y=Math.floor(i/3)*300;cells.push({input:await sharp(path.join(ROOT,frames[i].path)).resize(480,270).png().toBuffer(),left:x,top:y+30});cells.push({input:Buffer.from(`<svg width="480" height="30"><text x="12" y="22" font-family="sans-serif" font-size="18" fill="#f6f1e7">02 · ${frames[i].time}s</text></svg>`),left:x,top:y});}
await sharp({create:{width:1440,height:300*Math.ceil(frames.length/3),channels:3,background:'#253542'}}).composite(cells).png().toFile(path.join(OUT,'contact.png'));
const sources=['scripts/final/shot/02.md','arts/actions/02/story-scene-v04.mjs','arts/actions/02/story-player-v04.mjs','arts/static/02/story-assets-v01/scene-layered-v03.mjs'];
fs.writeFileSync(path.join(OUT,'manifest.json'),JSON.stringify({config:CONFIG,beats:BEATS,captions:CUES,frames,assets:Object.entries(data.registries['02']).map(([id,a])=>({id,...a,sha256:sha(fs.readFileSync(path.join(ROOT,a.path)))})),sources:sources.map(p=>({path:p,sha256:sha(fs.readFileSync(path.join(ROOT,p)))})),imageGenerationCalls:0,audio:false,scope:'38-second live framework; no chapter MP4 export'},null,2)+'\n');
fs.writeFileSync(path.join(OUT,'scene-states.json'),JSON.stringify(Array.from({length:1141},(_,i)=>sample(i/30)),null,2)+'\n');
console.log('chapter02 story-v04 build complete');
