import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';
import {MOTION,motionAt} from './motion-v10.mjs';import {createRenderer} from './scenes.mjs';import {createRenderer as originalRenderer} from './provenance/painted-v10/reference-renderer-v08.mjs';
const data=JSON.parse(fs.readFileSync(new URL('./bundle-v01.json',import.meta.url))),assets=JSON.parse(fs.readFileSync(new URL('./assets-v01.json',import.meta.url))).assets,render=createRenderer(data,p=>'/'+p),reference=originalRenderer(data,p=>'/'+p),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
test('only four independently painted supplements are registered, zero synthetic cels',()=>{
 assert.equal(MOTION.groups.length,4);const paths=new Set(assets.map(a=>a.path));for(const g of MOTION.groups){assert.equal(g.frames.length,5);for(const f of g.frames){assert.equal(f.mode,'painted-original');assert(f.path.endsWith('.png'));assert.equal(sha(fs.readFileSync(new URL('../../../'+f.path,import.meta.url))),f.sha256);assert(paths.has(f.path));}}
 assert.equal(assets.length,153);assert(!assets.some(a=>a.path.endsWith('.webp')));assert(!assets.some(a=>/motion-v09\/[^/]+\//.test(a.path)));
});
test('entire06 and non-supplemented frames exactly match pre-flow renderer across all8400 frames',()=>{
 let restored06=0,unchanged=0;const observed={};
 for(let f=0;f<8400;f++){const a=render(f),old=reference(f),clips=motionAt(a.chapter.id,a.sourceTime??0);assert(!/rife|\/motion-v09\/[^/"<>]+\//i.test(a.svg));
  if(a.chapter.id==='06'){assert.equal(a.svg,old.svg,'06 frame '+f);restored06++;}
  if(!a.svg.includes('data-motion-family=')){assert.equal(a.svg,old.svg,'unchanged frame '+f);unchanged++;}
  for(const[,id,phase]of a.svg.matchAll(/data-motion-family="([^"]+)" data-motion-phase="([^"]+)"/g))(observed[id]??=new Set()).add(phase);
 }
 assert.equal(restored06,1740);assert(unchanged>7000);for(const g of MOTION.groups)assert.equal(observed[g.id].size,5,g.id);fs.writeFileSync(new URL('./provenance/painted-v10/observed.json',import.meta.url),JSON.stringify({restored06,unchanged,observed:Object.fromEntries(Object.entries(observed).map(([id,s])=>[id,s.size]))},null,2)+'\n');
});
test('current manuscripts, subtitles and previous full videos stay intact',()=>{
 const guards=JSON.parse(fs.readFileSync(new URL('./provenance/painted-v10/before-inputs.json',import.meta.url)));for(const g of guards)assert.equal(sha(fs.readFileSync(new URL('../../../'+g.path,import.meta.url))),g.sha256,g.path);
 for(const t of [0,5.9,7.4,19,22,29,32,34,38,43,57])assert.deepEqual(motionAt('06',t),[]);
});
