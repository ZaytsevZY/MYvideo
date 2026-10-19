import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {CHAPTERS,TOTAL_FRAMES,DURATION,locateFrame,frameAtTime} from './timeline.mjs';
import {createRenderer,GLOBAL_CUES,GLOBAL_BEATS,CUES,BEATS,stateAt} from './scenes.mjs';
const data=JSON.parse(fs.readFileSync(new URL('./bundle-v01.json',import.meta.url)));
const render=createRenderer(data,p=>'/'+p);
test('one global frame clock covers six chapters without duplicate endpoint frames',()=>{
 assert.equal(DURATION,280);assert.equal(TOTAL_FRAMES,8400);
 for(let i=0;i<CHAPTERS.length;i++){
  const c=CHAPTERS[i];assert.equal(locateFrame(c.startFrame).chapter.id,c.id);assert.equal(locateFrame(c.endFrame-1).localFrame,c.frames-1);
  if(i<5)assert.equal(locateFrame(c.endFrame).chapter.id,CHAPTERS[i+1].id);
 }
 assert.equal(frameAtTime(280).frame,8399);assert.equal(locateFrame(-1).frame,0);assert.throws(()=>locateFrame(NaN));
});
test('all original narration appears once with a single global subtitle offset',()=>{
 assert.equal(GLOBAL_CUES.length,69);
 let last=0;
 for(const c of CHAPTERS){
  const raw=fs.readFileSync(new URL(`../../../scripts/final/shot/${c.id}.md`,import.meta.url),'utf8').split('<start>')[1].split('<end>')[0].replace(/\s/g,'');
  assert.equal(CUES[c.id].map(x=>x.text).join('').replace(/\s/g,''),raw);
  for(const cue of GLOBAL_CUES.filter(x=>x.chapterId===c.id)){assert(cue.startMs>=last);assert(cue.endMs>cue.startMs);assert(cue.endMs<=c.end*1000);last=cue.endMs;}
 }
 assert.equal(last,266000); // Final fourteen seconds are visual references, not narration.
});
test('six adapters render every frame with resolvable assets and stable state',()=>{
 for(let f=0;f<TOTAL_FRAMES;f++){
  const r=render(f);assert(!/NaN|Infinity|undefined/.test(r.svg),`bad frame ${f}`);
  assert(r.svg.startsWith('<svg'));assert(r.svg.endsWith('</svg>'));
  assert.equal((r.svg.match(/data-film-caption=/g)||[]).length,r.cue?1:0);
  assert(!r.svg.includes('data-layer="captions"'));
  const defs=new Set([...r.svg.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]));
  for(const [,id]of r.svg.matchAll(/href="#([^"]+)"/g))assert(defs.has(id),`missing ${id} frame ${f}`);
 }
 for(const f of [0,1349,1350,2489,2490,3659,3660,5309,5310,6659,6660,8399])assert.equal(render(f).svg,render(f).svg);
});
test('scene jumps select authored shots and subtitle toggle only removes subtitles',()=>{
 assert.equal(GLOBAL_BEATS.length,72);
 for(const b of GLOBAL_BEATS){assert.equal(locateFrame(b.globalFrame).chapter.id,b.chapterId);assert.equal(render(b.globalFrame).beat.id,b.id);}
 for(const c of CHAPTERS){const on=render(c.startFrame+30),off=render(c.startFrame+30,{captions:false});assert(!off.svg.includes('data-film-caption='));assert(on.svg.includes(off.svg.slice(0,-6)));}
});
test('cross chapter identity and evidence semantics stay in their original scenarios',()=>{
 assert.equal(stateAt('01',1349/30).taskStates['T01-R'],'merged');
 assert.equal(stateAt('02',0).tasks['T01-R'],'merged');assert.equal(stateAt('02',37).tasks.feedback,'candidate');
 assert.equal(stateAt('03',0).taskStates['S03-A'],'submitted');
 assert.equal(stateAt('03',38.9).taskStates['S03-C'],'in-progress');
 assert.deepEqual(stateAt('04',0).inheritedTasks,{});
 assert.equal(stateAt('04',0).previousScenarioTasks['S03-C'],'in-progress');
 assert.equal(stateAt('04',54.9).job.published,true);assert.equal(stateAt('04',54.9).job.cvCount,4);
 assert.equal(stateAt('04',54.9).routine.required,1);
 assert.equal(stateAt('05',0).entryRequirement.jobId,'S04-JOB-01');
 assert.equal(stateAt('05',0).decisionOwner,'organization');
 const body=s=>s.replace(/<defs>[\s\S]*?<\/defs>/,'');
 assert.ok(body(render(6659,{captions:false}).svg)===body(render(6660,{captions:false}).svg),'05→06 graphic content matches; stage assets use chapter-specific paths');
 for(const t of [266,270,279.966667])assert.equal(render(frameAtTime(t).frame).cue,null);
});
