import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {CAPTIONS,activeCaption,drawCaptions} from './captions.mjs';
test('caption text exactly covers the narration, including punctuation and Agent spelling',()=>{
 const source=fs.readFileSync(new URL('../../../../scripts/final/shot/01.md',import.meta.url),'utf8').split('<start>')[1].split('<end>')[0];
 assert.equal(CAPTIONS.map(c=>c.text).join('').replace(/\s/g,''),source.replace(/\s/g,''));
 assert.equal(CAPTIONS.length,14);
});
test('JSON cues cover 45 seconds without gaps, overlap, missing frames or invented confidence',()=>{
 assert.deepEqual(CAPTIONS,JSON.parse(fs.readFileSync(new URL('./01-narration-v01.json',import.meta.url))));
 assert.equal(CAPTIONS[0].startMs,0);assert.equal(CAPTIONS.at(-1).endMs,45000);
 CAPTIONS.forEach((c,i)=>{assert.ok(c.endMs>c.startMs);assert.equal(c.confidence,null);assert.equal(c.timestampMs,null);if(i)assert.equal(c.startMs,CAPTIONS[i-1].endMs);});
 for(let f=0;f<1350;f++){
  const ms=f/30*1000;
  assert.equal(CAPTIONS.filter(c=>c.startMs<=ms&&ms<c.endMs).length,1,`frame ${f}`);
  assert.ok(activeCaption(f/30));
 }
 assert.equal(activeCaption(2.2).startMs,2200);
 assert.equal(activeCaption(41).text,'为什么工作的终点反而越来越远？');
});
test('all subtitle lines fit the screen-safe region and use the same render as preview',()=>{
 for(const c of CAPTIONS){
  const svg=drawCaptions(c.startMs/1000),box=svg.match(/<rect x="([\d.]+)" y="994" width="([\d.]+)"/);
  assert.ok(box);assert.ok(Number(box[1])>=100);assert.ok(Number(box[1])+Number(box[2])<=1820);
  assert.match(svg,/data-layer="captions"/);assert.doesNotMatch(svg,/NaN|undefined/);
 }
});
