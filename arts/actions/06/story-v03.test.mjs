import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';
import {ASSETS,BEATS,CONFIG,CUES,sample,svg} from './story-scene-v03.mjs';
import {createRenderer} from '../film/scenes.mjs';
const root=new URL('../../../',import.meta.url),refs=Object.fromEntries(Object.keys(ASSETS).map(k=>[k,'asset:'+k]));
test('15 authored shots cover1740frames; narration is the untouched110-character manuscript',()=>{
 assert.equal(CONFIG.frames,1740);assert.equal(BEATS.length,15);let end=0;for(const b of BEATS){assert.equal(b.start,end);end=b.end;}assert.equal(end,58);assert.equal(BEATS.filter(b=>b.type==='E').reduce((n,b)=>n+Math.round((b.end-b.start)*30),0),732);
 const raw=fs.readFileSync(new URL('scripts/final/shot/06.md',root),'utf8').split('<start>')[1].split('<end>')[0].replace(/\s/g,'');assert.equal(raw.length,110);assert.equal(CUES.length,9);assert.equal(CUES.map(c=>c.text).join('').replace(/\s/g,''),raw);assert.equal(CUES.at(-1).endMs,44000);
});
test('same saving and both windows precede mutually exclusive allocation emphases',()=>{
 for(const t of [.4,1.2,3.2,5,8,11]){const s=svg(t,refs);assert(s.includes('choice-left'));assert(s.includes('choice-right'));assert.equal(sample(t).savingResourceCount,1);assert.equal(sample(t).twoAlternativesAreCumulative,false);}
 assert(svg(2.5,refs).includes('data-raster-state="settled"'));assert(svg(3,refs).includes('data-raster-state="extra"'));assert(svg(5.6,refs).includes('data-raster-state="standing"'));assert(svg(6.8,refs).includes('data-raster-state="departed"'));assert.equal(sample(15.9).entryPlan.status,'pending-discussion');assert.equal(svg(15.3,refs),svg(15.9,refs));
});
test('development and testing precede pen contact, withdrawn pen and joint confirmation',()=>{
 assert.equal(sample(16).pose,'developer');assert.equal(sample(18.8).pose,'tester');assert.equal(sample(21.2).pose,'writing');assert.equal(sample(23).pose,'agreed');assert.equal(sample(23.39).jointConfirmed,false);assert.equal(sample(23.4).jointConfirmed,true);
 for(const t of [16,19,22,23.3])assert(!svg(t,refs).includes('共同确认'));assert(svg(23.4,refs).includes('共同确认'));assert.equal(sample(23.4).plan.workerCoDecision,true);
 assert(svg(24,refs).includes('工作日的缩短'));assert(svg(24,refs).includes('工会参与'));assert(svg(24,refs).includes('第154号公约第2条'));assert.equal(svg(24,refs,{caption:false}),svg(26.5,refs,{caption:false}));
});
test('new later deliverable requires human acceptance; historical task states stay intact',()=>{
 assert.equal(sample(27).tasks['T06-final'],'review');assert.equal(sample(28.29).humanAccepted,false);assert.equal(sample(28.3).tasks['T06-final'],'human-accepted');assert.equal(sample(29).pose,'standing');assert.equal(sample(30).pose,'departed');
 for(const t of [0,16,24,28,40,58]){assert.deepEqual(sample(t).previousTasks,{'S05-T01':'human-accepted','S05-T02':'running'});assert.equal(sample(t).agentIsEmployer,false);}
});
test('life stays uninterrupted through purchase, theatre and page turn; credits stay still and caption-free',()=>{
 for(const[t,pose]of [[31,'bookSelect'],[33.4,'bookBuy'],[35.7,'theatreSettle'],[38.4,'theatreEnjoy'],[40.3,'homeRead'],[43.2,'homeTurn']]){assert.equal(sample(t).pose,pose);const s=svg(t,refs);assert(s.includes(`data-raster-state="${pose}"`));assert(!s.includes('T06-final'));}
 assert.equal(svg(44,refs),svg(50.9,refs));assert.equal(svg(51,refs),svg(58,refs));for(const t of [44,51,57.97]){assert.equal(sample(t).caption,null);assert(!svg(t,refs).includes('data-chapter-caption'));}assert(svg(51,refs).includes('单一公司研究的机构报道'));
});
test('every chapter frame is deterministic, finite, free of duplicate story bodies and internal labels',()=>{
 for(let f=0;f<=1740;f++){const t=f/30,a=svg(t,refs,{caption:false});assert.equal(a,svg(t,refs,{caption:false}));assert(!/NaN|Infinity|undefined/.test(a));assert(a.endsWith('</svg>'));if(t>=16&&t<23.4||t>=31&&t<44)assert.equal((a.match(/data-raster-state=/g)||[]).length,1);assert(!/单一公司观察|标准接0|理论应用|机制示意|不代表实际时长/.test(a));}
 assert.throws(()=>sample(NaN));assert.equal(sample(-1).t,0);assert.equal(sample(99).t,58);
});
test('05 actual terminal holds exactly12frames within06 budget, then opens the two choices',()=>{
 const render=createRenderer(JSON.parse(fs.readFileSync(new URL('../film/bundle-v01.json',import.meta.url))),p=>'/'+p);const terminal=render(6659,{captions:false}).svg;
 for(let f=6660;f<6672;f++)assert.equal(render(f,{captions:false}).svg,terminal);assert.notEqual(render(6672,{captions:false}).svg,terminal);assert.equal(render(7980).cue,null);
});
test('six scripts, prior chapter implementations, adopted art and historical06 inputs retain their captured bytes',()=>{
 const guards=JSON.parse(fs.readFileSync(new URL('./provenance/story-v03/inputs-before.json',import.meta.url)));for(const p of guards)assert.equal(crypto.createHash('sha256').update(fs.readFileSync(new URL(p.path,root))).digest('hex'),p.sha256,p.path);
});
