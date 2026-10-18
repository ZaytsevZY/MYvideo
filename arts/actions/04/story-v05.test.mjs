import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';
import {CONFIG,BEATS,CUES,ASSETS,COPY,sample,svg} from './story-scene-v05.mjs';
import {createRenderer,stateAt} from '../film/scenes.mjs';
const refs=Object.fromEntries(Object.keys(ASSETS).map(k=>[k,'asset:'+k]));
test('55 seconds and14 E/L shots partition1650 frames; captions are exactly the current185-character narration',()=>{
 assert.equal(CONFIG.frames,1650);assert.equal(BEATS.length,14);let end=0;for(const b of BEATS){assert.equal(b.start,end);end=b.end;}assert.equal(end,55);
 assert.equal(BEATS.filter(b=>b.type==='E').reduce((n,b)=>n+Math.round((b.end-b.start)*30),0),963);
 const raw=fs.readFileSync(new URL('../../../scripts/final/shot/04.md',import.meta.url),'utf8').split('<start>')[1].split('<end>')[0].replace(/\s/g,'');assert.equal(CUES.map(c=>c.text).join('').replace(/\s/g,''),raw);assert.equal(raw.length,185);
});
test('three different people remain simultaneous; feedback follows manager evaluation, not automatic technical improvement',()=>{
 for(const t of [.4,2,5,8,11.9]){const a=svg(t,refs);assert.equal((a.match(/data-window=/g)||[]).length,3);assert(a.includes('research-footnote'));}
 assert.equal(sample(2).poses.lunch,'lunchBefore');assert.equal(sample(5).poses.meeting,'meetingLook');assert.equal(sample(8).poses.evening,'eveningReopen');
 assert.equal(sample(15.19).appraisal.left,null);assert.equal(sample(15.2).appraisal.left,'A');assert.equal(sample(15.54).poses.collaboration,'collab');assert.equal(sample(15.55).poses.collaboration,'collabRelief');
 assert.equal(sample(16.2).appraisal.right,'M');assert.equal(sample(16.55).poses.traditional,'traditionalLoss');assert.equal(sample(18.1).feedbackNodes,3);assert.equal(sample(18.6).feedbackNodes,4);
});
test('adoption precedes production cycle and market response; one market conserves total and freezes before planning',()=>{
 assert.deepEqual(sample(22.2).agents,[1,0,0]);assert.equal(sample(22.49).cycles[0],'1年');assert.equal(sample(22.5).cycles[0],'3个月');assert.deepEqual(sample(23.1).marketWeights,sample(20).marketWeights);
 assert.equal(sample(25).agents[1],1);assert.equal(sample(26.2).agents[2],1);assert.deepEqual(sample(27.1).marketWeights,sample(24).marketWeights);
 assert.equal(sample(30.1).agents[1],3);assert.equal(sample(30.49).cycles[1],'3个月');assert.equal(sample(30.5).cycles[1],'1个月');
 for(let f=600;f<1074;f++){const s=sample(f/30);assert(Math.abs(s.marketWeights.reduce((a,b)=>a+b,0)-1)<1e-12);assert(s.marketWeights.every(w=>w>0));assert.equal(s.marketIsMeasured,false);}
 assert.deepEqual(sample(32.6).marketWeights,sample(35.7).marketWeights);assert.equal(sample(33.4).planningOrder,'S04-PLAN-01');
});
test('same board order leads to human editing, publish, four applications and requirements in the original HR page',()=>{
 assert.equal(sample(36.69).board.strike,0);assert.equal(sample(37.5).board.strike,1);assert.equal(sample(39.69).board.writing,0);assert.equal(sample(40.9).board.writing,1);
 assert.equal(sample(43.29).job.independentResponsibility,false);assert.equal(sample(43.3).job.independentResponsibility,true);assert.equal(sample(44.2).job.multipleAgents,true);
 assert.equal(sample(46.29).job.published,false);assert.equal(sample(46.3).job.published,true);assert.equal(sample(46.6).job.cvCount,1);assert.equal(sample(49.2).job.cvCount,4);
 assert.equal(svg(54.2,refs,{caption:false}),svg(1649/30,refs,{caption:false}));assert.equal(sample(54.2).routine.required,1);
 const a=svg(54.9,refs);assert.equal((a.match(/data-job-id=/g)||[]).length,1);assert.equal((a.match(/data-application=/g)||[]).length,4);assert(a.includes(COPY.job.after[1]));
});
test('all frames deterministic and bounded; no body blends, production badges or old S04-X storyline',()=>{
 const forbidden=/单一公司观察|考核情境|组织情境|理论归纳|理论应用|假设情境|机制示意|标准接05|S04-X/;
 for(let f=0;f<=1650;f++){const t=f/30,s=sample(t),a=svg(t,refs,{caption:false});assert(a.startsWith('<svg'));assert(a.endsWith('</svg>'));assert(!/NaN|Infinity|undefined/.test(a));assert.equal(a,svg(t,refs,{caption:false}));assert(!a.includes('data-chapter-caption='));assert(!forbidden.test(a));assert.equal(s.inheritedTasks['S03-C'],undefined);if(t>=35.8&&t<42.2)assert((a.match(/data-whole-manager=/g)||[]).length<=1);}
 assert.throws(()=>sample(NaN));assert.equal(sample(-1).t,0);assert.equal(sample(70).t,55);
});
test('six scripts, historical chapters and all adopted art input bytes remain unchanged',()=>{
 const root=new URL('../../../',import.meta.url),guards=JSON.parse(fs.readFileSync(new URL('./provenance/story-v05/inputs-before.json',import.meta.url)));
 for(const g of guards)assert.equal(crypto.createHash('sha256').update(fs.readFileSync(new URL(g.path,root))).digest('hex'),g.sha256,g.path);
});
test('actual film holds exact outgoing scene on both sides; report, CV and tool tasks do not change identity',()=>{
 const render=createRenderer(JSON.parse(fs.readFileSync(new URL('../film/bundle-v01.json',import.meta.url))),p=>'/'+p);
 assert.equal(render(3659,{captions:false}).svg,render(3660,{captions:false}).svg);assert.equal(render(5309,{captions:false}).svg,render(5310,{captions:false}).svg);
 assert.equal(stateAt('04',0).previousScenarioTasks['S03-C'],'in-progress');assert.equal(stateAt('05',0).entryRequirement.jobId,'S04-JOB-01');assert.equal(stateAt('05',0).cvIsToolTask,false);assert.equal(stateAt('05',0).hrIsDirectSupervisor,false);
 assert(!render(5322).svg.includes('data-job-id='));assert.equal((render(5310).svg.match(/data-film-caption=/g)||[]).length,1);
});
