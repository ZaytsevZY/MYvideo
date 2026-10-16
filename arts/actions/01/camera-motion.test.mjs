import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {CAMERA_BEATS,sampleCameraScene,cameraDefinitions,drawCameraScene} from './camera-motion.mjs';
const bundle=JSON.parse(fs.readFileSync(new URL('./bundle-camera-v01.json',import.meta.url)));
const ends=[0,3,5,8,10,12,16,20,23,30,37,41,45];
test('12 shots cover the authorized 45-second timeline with exact cuts',()=>{
 assert.equal(CAMERA_BEATS.length,12);
 for(let i=0;i<12;i++){
  const beat=CAMERA_BEATS[i];assert.equal(beat.id,`S01-${String(i+1).padStart(2,'0')}`);assert.equal(beat.start,ends[i]);assert.equal(beat.end,ends[i+1]);
  assert.equal(sampleCameraScene(beat.start).beat.id,beat.id);
  assert.equal(sampleCameraScene(beat.end-1/300).beat.id,beat.id);
 }
 assert.equal(sampleCameraScene(45).beat.id,'S01-12');
});
test('sampling is deterministic and independent of scrub order',()=>{
 const first=JSON.stringify(sampleCameraScene(14.8));
 for(const t of [44.9,0,26,6,32,14.8])sampleCameraScene(t);
 assert.equal(JSON.stringify(sampleCameraScene(14.8)),first);
});
test('mixed native PNG dimensions are retained by the bundle',()=>{
 assert.deepEqual([bundle.poses['programmer-front-neutral'].width,bundle.poses['programmer-front-neutral'].height],[1153,1364]);
 assert.deepEqual([bundle.poses['programmer-front-dispatch'].width,bundle.poses['programmer-front-dispatch'].height],[1153,1364]);
 assert.deepEqual([bundle.poses['programmer-logic-stand-right'].width,bundle.poses['programmer-logic-stand-right'].height],[1024,1536]);
 const defs=cameraDefinitions(bundle);assert.match(defs,/1153/);assert.match(defs,/1364/);
});
test('all 1,351 sampled states render finite transforms and resolve every referenced image',()=>{
 for(let frame=0;frame<=1350;frame++){
  const state=sampleCameraScene(frame/30),svg=drawCameraScene(state,bundle);
  assert.doesNotMatch(svg,/NaN|Infinity|undefined/,`frame ${frame}`);
  const poses=[...svg.matchAll(/href="#pose-([^"#]+)"/g)].map(m=>m[1]);
  for(const id of poses)assert.ok(bundle.poses[id],`frame ${frame}: missing pose ${id}`);
  for(const m of svg.matchAll(/href="#asset-([^"#]+)"/g))assert.ok(bundle.assets[m[1]],`frame ${frame}: missing asset ${m[1]}`);
  assert.ok(poses.filter(p=>p.startsWith('programmer-')).length<=1,`frame ${frame}: duplicated programmer`);
  assert.ok(poses.filter(p=>p.startsWith('agent-')).length<=1,`frame ${frame}: duplicated Agent`);
  const papers=[...svg.matchAll(/data-document="T01(?:-R)?"/g)];assert.ok(papers.length<=1,`frame ${frame}: duplicated moving paper`);
 }
});
test('new planning tasks move only after human selection and remain unaccepted',()=>{
 for(const [id,at] of [['test',24.2],['interface',25.8],['feature',27.4]]){
  assert.equal(sampleCameraScene(at-.01).taskStates[id],'candidate');
  assert.equal(sampleCameraScene(at).cursor.actor,'human');
  assert.equal(sampleCameraScene(at).cursor.click,at);
  assert.equal(sampleCameraScene(at).taskStates[id],'selected');
  assert.equal(sampleCameraScene(at+1.2).taskStates[id],'scheduled');
  assert.equal(sampleCameraScene(45).taskStates[id],'scheduled');
 }
 assert.equal(sampleCameraScene(45).taskStates.feedback,'candidate');
});
test('T01-R passes only after the human review action and then merges into T01',()=>{
 assert.equal(sampleCameraScene(13.7).taskStates['T01-R'],null);
 assert.equal(sampleCameraScene(13.9).taskStates.T01,'partial');
 assert.equal(sampleCameraScene(31.59).taskStates['T01-R'],'awaiting-review');
 assert.equal(sampleCameraScene(31.6).cursor.actor,'human');
 assert.equal(sampleCameraScene(31.6).cursor.click,31.6);
 assert.equal(sampleCameraScene(31.6).taskStates['T01-R'],'approved');
 assert.equal(sampleCameraScene(33.59).taskStates.T01,'partial');
 assert.equal(sampleCameraScene(33.6).taskStates.T01,'accepted');
 assert.equal(sampleCameraScene(33.6).taskStates['T01-R'],'merged');
});
test('endpoint and at least the first old completed item stay visible through the final camera moves',()=>{
 for(let frame=37*30;frame<=45*30;frame++){
  const state=sampleCameraScene(frame/30),c=state.camera;
  const endpointX=(state.endpoint-c.x)*c.scale;
  const oldX=(640-c.x)*c.scale;
  assert.ok(endpointX>20&&endpointX<1880,`frame ${frame}: endpoint offscreen`);
  assert.ok(oldX>=0&&oldX+176*c.scale<=1920,`frame ${frame}: old accepted item offscreen`);
 }
});
test('the opening push uses many distinct rendered scale values rather than coarse steps',()=>{
 const scales=new Set();
 for(let f=0;f<90;f++){
  const svg=drawCameraScene(sampleCameraScene(f/30),bundle);
  scales.add(svg.match(/data-layer="camera" transform="scale\(([^)]+)\)/)?.[1]);
 }
 assert.ok(scales.size>50,'opening push is visibly quantized');
});
