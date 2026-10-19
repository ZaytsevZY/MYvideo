import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';
import{CONFIG,BEATS,CUES,ASSETS,COPY,sample,svg}from'./story-scene-v05.mjs';
import{createRenderer,stateAt}from'../film/scenes.mjs';
const refs=Object.fromEntries(Object.keys(ASSETS).map(k=>[k,'asset:'+k]));
test('39 seconds and eleven shots partition the authored E/L budget',()=>{assert.equal(CONFIG.frames,1170);assert.equal(BEATS.length,11);let end=0;for(const b of BEATS){assert.equal(b.start,end);assert(b.end>b.start);end=b.end;}assert.equal(end,39);assert.equal(BEATS.filter(b=>b.type==='E').reduce((n,b)=>n+Math.round((b.end-b.start)*30),0),642);});
test('check, completion send, employer assignment, reaction and unfinished report have causal order',()=>{
 assert.equal(sample(9.6).taskStates['S03-A'],'submitted');assert.equal(sample(9.65).taskStates['S03-A'],'completed');assert.equal(sample(10).taskStates['S03-B'],'submitted');assert.equal(sample(10.1).taskStates['S03-B'],'completed');
 assert.equal(sample(11.59).completionSent,false);assert.equal(sample(11.6).chatCount,5);
 assert.equal(sample(13.49).taskStates['S03-C'],'not-introduced');assert.equal(sample(13.5).taskStates['S03-C'],'assigned');
 assert.equal(sample(13.6).assignmentRead,false);assert.equal(sample(13.7).pose,'read');
 assert.equal(sample(19.3).pose,'gaze');assert.equal(sample(19.8).pose,'look');
 assert.equal(sample(20.5).phase,'working-colleagues');assert.equal(sample(23.2).pose,'gaze');
 assert.equal(sample(24.6).taskStates['S03-C'],'in-progress');assert.equal(sample(39).taskStates['S03-C'],'in-progress');
 assert(!svg(11.5,refs).includes('data-message="4"'));assert(svg(11.9,refs).includes('data-message="4"'));assert(!svg(13.4,refs).includes('data-message="5"'));assert(svg(13.8,refs).includes('data-message="5"'));
});
test('all chapter frames are deterministic, bounded and use whole frame poses without clock or body blending',()=>{
 for(let f=0;f<1170;f++){const t=f/30,s=sample(t),a=svg(t,refs,{caption:false});assert(!/NaN|Infinity|undefined/.test(a));assert.equal(s.workdayEnded,false);assert(!a.includes('data-chapter-caption='));assert(!a.includes('stroke-dasharray'));assert(a.startsWith('<svg'));assert.equal(a,svg(t,refs,{caption:false}));if(t>=9.1&&t<20||t>=23&&t<30.5)assert.equal((a.match(/data-pose=/g)||[]).length,1);}
 assert.throws(()=>sample(NaN));assert.equal(sample(-1).t,0);assert.equal(sample(50).t,39);
});
test('03 narration, captions, original chapter sources and raster inputs are byte preserved;04 follows its authorized revision',()=>{
 const root=new URL('../../../',import.meta.url),guards=JSON.parse(fs.readFileSync(new URL('./provenance/story-v05/inputs-before.json',import.meta.url)));
 //04 was manually rewritten after this03 snapshot. Preserve the historical manifest and check04 against its current stage input guard.
 const current04=JSON.parse(fs.readFileSync(new URL('../04/provenance/story-v05/inputs-before.json',import.meta.url))).find(g=>g.path==='scripts/final/shot/04.md');
 const current05=JSON.parse(fs.readFileSync(new URL('../05/provenance/story-v03/inputs-before.json',import.meta.url))).find(g=>g.path==='scripts/final/shot/05.md');
 for(const g of guards){const hash=crypto.createHash('sha256').update(fs.readFileSync(new URL(g.path,root))).digest('hex');assert.equal(hash,g.path==='scripts/final/shot/04.md'?current04.sha256:g.path==='scripts/final/shot/05.md'?current05.sha256:g.sha256,g.path);}
 const caption=JSON.parse(fs.readFileSync(new URL('./captions/03-narration-v01.json',import.meta.url)));assert.deepEqual(CUES,caption);
 const inventory=JSON.parse(fs.readFileSync(new URL('../../static/03/story-assets-v04/layout.json',import.meta.url))).registry;
 for(const p of Object.values(ASSETS)){const expected=inventory.find(a=>a.path===p);assert(expected,p);assert.equal(crypto.createHash('sha256').update(fs.readFileSync(new URL(p,root))).digest('hex'),expected.sha256,p);}
 const raw=fs.readFileSync(new URL('scripts/final/shot/03.md',root),'utf8').split('<start>')[1].split('<end>')[0].replace(/\s/g,'');assert.equal(CUES.map(c=>c.text).join(''),raw);
 assert.equal(COPY.messages[4].time,'14:00');assert.equal(COPY.messages[5].time,'14:01');assert(COPY.messages[5].lines.join('').includes('17:00前'));
});
test('film entry04 holds exact new03 end before introducing distinct research; no old S03-D task inheritance',()=>{
 const data=JSON.parse(fs.readFileSync(new URL('../film/bundle-v01.json',import.meta.url))),render=createRenderer(data,p=>'/'+p);
 assert.equal(render(3659,{captions:false}).svg,render(3660,{captions:false}).svg);
 assert.equal(stateAt('04',0).previousScenarioTasks['S03-C'],'in-progress');assert.deepEqual(stateAt('04',0).inheritedTasks,{});
 assert(render(3678).svg.includes('data-entry="new-study"'));assert.equal((render(3678).svg.match(/data-film-caption=/g)||[]).length,1);
 assert(render(3710).svg.includes('data-entry="new-study"'));assert.equal(render(3710).chapter.id,'04');
});
