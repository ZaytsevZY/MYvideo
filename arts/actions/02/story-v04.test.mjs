import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';
import {sample,draw,BEATS,CUES,CONFIG} from './story-scene-v04.mjs';
import {ART,definitions,render,root} from '../../static/02/story-assets-v01/scene-layered-v03.mjs';
import {createRequire} from 'node:module';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
test('chapter script and original caption data remain byte-identical',()=>{
 const inputs=JSON.parse(fs.readFileSync(new URL('./provenance/story-v04/inputs-before.json',import.meta.url)));
 for(const item of inputs.filter(p=>p.path.startsWith('scripts/final/shot/')||p.path.endsWith('02-complete-v03.json')))assert.equal(sha(fs.readFileSync(new URL('../../../'+item.path,import.meta.url))),item.sha256,item.path);
 const old=JSON.parse(fs.readFileSync(new URL('./captions/02-complete-v03.json',import.meta.url)));assert.deepEqual(CUES,old.cues||old.captions||old);
});
test('seven authored E/L intervals cover 1140 frames with deterministic actions',()=>{
 assert.equal(CONFIG.frames,1140);assert.equal(BEATS[0].start,0);assert.equal(BEATS.at(-1).end,38);
 for(let i=1;i<BEATS.length;i++)assert.equal(BEATS[i-1].end,BEATS[i].start);
 for(let i=0;i<=1140;i++){const s=sample(i/30),body=draw(s);assert.equal(body,draw(sample(i/30)));assert(!/NaN|Infinity|undefined/.test(body));assert.equal(s.tasks.feedback,'candidate');assert.equal(s.tasks['T01-R'],'merged');assert.equal(s.humanAccepted.length,0);assert((body.match(/data-saving-token=/g)||[]).length<=1);}
});
test('parallel windows, foreground and KPI follow script timing without changing labels',()=>{
 assert.equal(sample(22.9).layer.enter,0);assert.equal(sample(22.9).choice,null);assert(sample(24.5).layer.bubble>.99);
 assert.equal(sample(25.3).layer.bubble,0);assert(sample(25.5).layer.pulse>.99);assert(sample(25.9).layer.pulse>.99);
 assert.equal(sample(27).layer.expand,1);for(const word of ['休息','继续工作','KPI'])assert(draw(sample(24.5)).includes('>'+word+'</text>'));
 for(const t of [13.2,18.3,21.6,24.5]){const b=draw(sample(t));assert(b.includes('data-layer="left-option"'));assert(b.includes('data-layer="right-option"'));}
});
test('review alternates complete drawings while pending jobs remain distinct',()=>{
 assert.equal(sample(32.1).reviewPose,'review');assert.equal(sample(34.5).reviewPose,'reviewNext');
 assert.equal(sample(37.9).hypothetical.extraTasks[0].status,'reviewing');assert.equal(sample(37.9).hypothetical.extraTasks[1].status,'queued');
 const body=draw(sample(37.9));assert(body.includes('#asset-s02-reviewNext'));assert(body.includes('#asset-s02-agentIdle'));assert(!body.includes('#asset-s02-agentOffer'));assert(!body.includes('paper-in-flight'));
});
test('optional shared interfaces preserve approved standalone composition pixels',async()=>{
 const sharp=createRequire(import.meta.url)('/Users/alan671/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
 const hrefs=Object.fromEntries(Object.entries(ART).map(([id,p])=>[id,'data:image/png;base64,'+fs.readFileSync(new URL('../../static/02/story-assets-v01/'+p,import.meta.url)).toString('base64')]));
 for(const [name,t]of [['options',1.65],['thought',5.9]]){
  const actual=await sharp(Buffer.from(root(render(t),definitions(hrefs)))).removeAlpha().raw().toBuffer();
  const before=await sharp(new URL('../../static/02/story-assets-v01/compositions-v03/'+name+'.png',import.meta.url).pathname).removeAlpha().raw().toBuffer();
  assert(actual.equals(before),name+' pixels unchanged');
 }
});
