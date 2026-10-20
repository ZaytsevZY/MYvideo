import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';
import {NARRATION,CLOCKS,sourceTime,filmTime} from './narration-v08.mjs';
import {CUES,BEATS,createRenderer,stateAt} from './scenes.mjs';
import {CAPTION_STYLE,characterCount} from './captions.mjs';import {CHAPTERS} from './timeline.mjs';
const render=createRenderer(JSON.parse(fs.readFileSync(new URL('./bundle-v01.json',import.meta.url))),p=>'/'+p);
test('current audio blocks exactly match the human-reviewed snapshot including the authorized typo correction',()=>{
 for(const s of NARRATION.sources){const raw=fs.readFileSync(new URL('../../../'+s.path,import.meta.url),'utf8').split('<start>')[1].split('<end>')[0];assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),s.audioSha256);assert.equal(CUES[s.chapter].map(c=>c.text).join(''),raw.trim().split(/\r?\n/).map(x=>x.trim()).join(''));}
 assert(CUES['05'][0].text.startsWith('调度多个 Agent 可能会'));assert.equal(CUES['06'].at(-1).endMs,44000);
});
test('all semantic cuts preserve chapter durations, minimum exposure and readable single-line widths',()=>{
 for(const c of CHAPTERS){const clock=CLOCKS[c.id];assert.deepEqual(clock[0],[0,0]);assert.deepEqual(clock.at(-1),[c.duration,c.duration]);for(let i=1;i<clock.length;i++){assert(clock[i][0]>clock[i-1][0]);assert(clock[i][1]>clock[i-1][1]);}
  for(let t=0;t<c.duration;t+=.07)assert(Math.abs(filmTime(c.id,sourceTime(c.id,t))-t)<1e-8);
  for(const cue of CUES[c.id]){assert(characterCount(cue.text)>=10);assert(cue.endMs-cue.startMs>=2400);assert(cue.endMs<=c.duration*1000);assert([...cue.text].reduce((n,ch)=>n+(ch.charCodeAt(0)<128?.56:1),0)*44+68<=CAPTION_STYLE.maxWidth);}
  for(const b of BEATS[c.id])assert(b.end>b.start);
 }
});
test('key claims display their matching physical action or constraint diagram',()=>{
 assert.equal(stateAt('01',28).taskStates.test,'scheduled');
 assert.equal(stateAt('02',25).choice,'expand-output');
 assert.equal(stateAt('03',19).assignmentArrived,true);assert.equal(stateAt('03',27).phase,'organization-tree');
 assert.equal(stateAt('04',9).phase,'parallel');
 for(const local of [19,20.5]){const f=5310+Math.round(local*30),s=render(f).svg;assert(s.includes('data-narration-cost="time-and-money"'));assert(s.includes('金钱'));}
 assert(!render(5310+Math.round(27*30)).svg.includes('data-narration-cost='));
 for(const [id,time] of [['04',0],['05',0],['06',0]])assert.equal(sourceTime(id,time),0);
});
test('editable screen-copy replacements and cost feedback remain valid rasterizable SVG',async()=>{
 const {createRequire}=await import('node:module');const sharp=createRequire(import.meta.url)('/Users/alan671/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
 const tiny=await sharp({create:{width:2,height:2,channels:4,background:'#eee'}}).png().toBuffer(),r=createRenderer(JSON.parse(fs.readFileSync(new URL('./bundle-v01.json',import.meta.url))),()=>`data:image/png;base64,${tiny.toString('base64')}`);
 for(const f of [390,570,1350,5880])await sharp(Buffer.from(r(f).svg)).resize(192,108).png().toBuffer();
});
