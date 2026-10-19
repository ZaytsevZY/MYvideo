import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';
import {ASSETS,BEATS,CONFIG,CUES,sample,svg} from './story-scene-v03.mjs';
import {createRenderer,stateAt} from '../film/scenes.mjs';
const root=new URL('../../../',import.meta.url),refs=Object.fromEntries(Object.keys(ASSETS).map(k=>[k,'asset:'+k]));
test('13 authored shots cover1350 frames; 12s story and33s logic;155-character narration promoted verbatim',()=>{
 assert.equal(CONFIG.frames,1350);assert.equal(BEATS.length,13);let end=0;for(const b of BEATS){assert.equal(b.start,end);assert(Number.isInteger(Math.round(b.start*30)));end=b.end;}assert.equal(end,45);assert.equal(BEATS.filter(b=>b.type==='E').reduce((n,b)=>n+Math.round((b.end-b.start)*30),0),360);
 const raw=fs.readFileSync(new URL('scripts/final/shot/05.md',root),'utf8').split('<start>')[1].split('<end>')[0].replace(/\s/g,'');assert.equal(raw.length,155);assert.equal(CUES.length,13);assert.equal(CUES.map(c=>c.text).join('').replace(/\s/g,''),raw);assert.equal(CUES[0].startMs,400);
});
test('two relations are simultaneous; employees propose adjustments through organization rather than through Agent',()=>{
 for(const t of [.4,1,4,12]){const s=svg(t,refs,{caption:false});for(const k of ['工具调用','组织管理','rel-employee-0','rel-employee-1','rel-employee-2'])assert(s.includes(k));}
 assert.deepEqual(sample(6.5).goals,[false,false,false]);assert.deepEqual(sample(11.7).goals,[true,true,true]);assert.equal(sample(13.29).proposal.status,'not-introduced');assert.equal(sample(13.3).proposal.origin,'employee');
 for(const t of [15,20,32,44.9]){const s=sample(t);assert.equal(s.proposal.status,'pending-discussion');assert.equal(s.plan.workerCoDecision,false);assert.equal(s.decisionOwner,'organization');assert.equal(s.agentIsEmployer,false);}
});
test('result generation, human acceptance, request, reaction and renewed input remain separate causes',()=>{
 assert.equal(sample(21.09).tasks['S05-T01'],'executing');assert.equal(sample(21.1).tasks['S05-T01'],'generated');assert.equal(sample(24.79).humanAccepted,false);assert.equal(sample(24.8).tasks['S05-T01'],'human-accepted');
 assert(!svg(24.7,refs).includes('human-reviewed'));assert(svg(24.8,refs).includes('human-reviewed'));
 assert.equal(sample(25.6).requestVisible,true);assert.equal(sample(25.6).reactionVisible,false);assert.equal(sample(25.9).reactionVisible,true);assert(svg(25.6,refs).includes('请给我下一项指令。'));assert(!svg(26.4,refs).includes('等待新指令'));assert(svg(26.8,refs).includes('等待新指令'));
 assert.equal(sample(32.59).tasks['S05-T02'],'awaiting-human-input');assert.equal(sample(32.6).tasks['S05-T02'],'prompted-by-human');assert.equal(sample(33.2).tasks['S05-T02'],'running');assert.equal(sample(45).tasks['S05-T01'],'human-accepted');
});
test('physical slogans have a stable2.2-second insert; final pending page holds without a premature06 diagram',()=>{
 const a=svg(29.4,refs,{caption:false});assert.equal(a,svg(31.5,refs,{caption:false}));for(const s of ['深度和Agent合作','把重复劳动','交给AI干'])assert(a.includes(s));
 assert(svg(32.6,refs).includes('data-shot-pose="resume"'));const b=svg(43.8,refs,{caption:false});assert.equal(b,svg(45,refs,{caption:false}));assert(b.includes('排期与收益配置'));assert(b.includes('待讨论'));assert(!b.includes('同一份节约，如何配置'));
});
test('every chapter frame resolves references deterministically and preserves one coherent raster body state',()=>{
 for(let f=0;f<=1350;f++){const t=f/30,a=svg(t,refs,{caption:false});assert(a.startsWith('<svg'));assert(a.endsWith('</svg>'));assert(!/NaN|Infinity|undefined/.test(a));assert.equal(a,svg(t,refs,{caption:false}));assert(!/示意，不代表|单一公司观察|标准接06|理论应用|机制示意/.test(a));if(t>=21.8&&t<33.8)assert.equal((a.match(/data-raster-state=/g)||[]).length,1);}
 assert.throws(()=>sample(NaN));assert.equal(sample(-1).t,0);assert.equal(sample(99).t,45);
});
test('current integration holds exact actual terminal images and independent object identities',()=>{
 const render=createRenderer(JSON.parse(fs.readFileSync(new URL('../film/bundle-v01.json',import.meta.url))),p=>'/'+p);
 for(const cut of [5310,6660]){assert.equal(render(cut-1,{captions:false}).svg,render(cut,{captions:false}).svg);assert.equal(render(cut,{captions:false}).svg,render(cut+11,{captions:false}).svg);assert.notEqual(render(cut+11,{captions:false}).svg,render(cut+12,{captions:false}).svg);}
 assert.equal(stateAt('05',0).cvIsToolTask,false);assert.deepEqual(stateAt('05',0).inheritedTasks,{});assert.equal(stateAt('06',0).entryPlan.status,'pending-discussion');assert.equal(stateAt('06',0).previousTasks['S05-T02'],'running');assert.equal(stateAt('06',0).newStoryImplementation,false);
});
test('six manuscript bytes, old runtimes and adopted drawing sources stay unchanged',()=>{
 const guards=JSON.parse(fs.readFileSync(new URL('./provenance/story-v03/inputs-before.json',import.meta.url)));for(const g of guards)assert.equal(crypto.createHash('sha256').update(fs.readFileSync(new URL(g.path,root))).digest('hex'),g.sha256,g.path);
 // Guard every directly adopted05 bitmap against the already-reviewed art inventory.
 const inventory=JSON.parse(fs.readFileSync(new URL('../../static/05/story-assets-v02/layout.json',import.meta.url))).registry;
 for(const [key,p] of Object.entries(ASSETS).filter(([k])=>!k.startsWith('entry04_'))){const g=inventory.find(a=>a.path===p);assert(g,key);assert.equal(crypto.createHash('sha256').update(fs.readFileSync(new URL(p,root))).digest('hex'),g.sha256,p);}
});
