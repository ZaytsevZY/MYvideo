import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';
import {MOTION,motionAt} from './motion-v09.mjs';import {createRenderer,GLOBAL_CUES} from './scenes.mjs';
const data=JSON.parse(fs.readFileSync(new URL('./bundle-v01.json',import.meta.url))),assets=JSON.parse(fs.readFileSync(new URL('./assets-v01.json',import.meta.url))).assets;
const render=createRenderer(data,p=>'/'+p),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
test('all43 motion families contain at least five distinct adopted complete cels, all registered and intact',()=>{
 assert.equal(MOTION.groups.length,43);const paths=new Set(assets.map(a=>a.path));
 for(const g of MOTION.groups){assert(g.frames.length>=5,g.id);assert(new Set(g.frames.map(f=>f.sha256)).size>=5,g.id);assert.equal(g.frames[0].at,0);assert.equal(g.frames.at(-1).at,1);
  for(const f of g.frames){assert(paths.has(f.path),f.path);assert.equal(hash(fs.readFileSync(new URL('../../../'+f.path,import.meta.url))),f.sha256);assert(f.width>0&&f.height>0);}
 }
});
test('actual movie consumes at least five distinct frames of each active motion family',()=>{
 const observed={};
 for(let f=0;f<8400;f++){const s=render(f).svg;for(const [,id,phase]of s.matchAll(/data-motion-family="([^"]+)" data-motion-phase="([^"]+)"/g))(observed[id]??=new Set()).add(phase);}
 const sizes=Object.fromEntries(Object.entries(observed).map(([id,set])=>[id,set.size]));fs.writeFileSync(new URL('./provenance/motion-v09/observed-frames.json',import.meta.url),JSON.stringify(sizes,null,2)+'\n');
 assert(Object.keys(sizes).length>=35);for(const[id,n]of Object.entries(sizes))assert(n>=5,`${id}: only ${n} used`);
});
test('human scripts and full subtitle bytes remain exactly as reviewed before motion work',()=>{
 const protectedInputs=JSON.parse(fs.readFileSync(new URL('./provenance/motion-v09/before-inputs.json',import.meta.url)));
 for(const g of protectedInputs.filter(g=>g.path.startsWith('scripts/')||/captions-v01\.(json|srt)$|narration-v08.json$/.test(g.path)))assert.equal(hash(fs.readFileSync(new URL('../../../'+g.path,import.meta.url))),g.sha256,g.path);
 assert.equal(GLOBAL_CUES.length,54);
});
test('separate camera cuts never interpolate bookshop aisle into checkout, and choice windows remain distinct',()=>{
 assert(motionAt('06',32).some(c=>c.id==='book-reach'));assert(!motionAt('06',32).some(c=>c.id==='book-bag'));
 assert(motionAt('06',34).some(c=>c.id==='book-bag'));assert(!motionAt('06',34).some(c=>c.id==='book-reach'));
 const extra=motionAt('06',3.2).find(c=>c.id==='extra-work');assert(extra);assert(!extra.aliases.some(p=>p.includes('choice-settled')));
 const middle=render(6660+Math.round(19*30)).svg;assert(middle.includes('translate(-19.2 -10.8) scale(1.02)'));
});
