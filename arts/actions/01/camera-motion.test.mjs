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
test('thinking feedback stops at result generation, including when scrubbing backwards',()=>{
 const draw=t=>drawCameraScene(sampleCameraScene(t),bundle);
 assert.match(draw(10.8),/data-agent-thinking="loading"/);
 assert.doesNotMatch(draw(11.3),/data-agent-thinking="loading"/);
 assert.match(draw(11.3),/data-agent-thinking="feedback"/);
 assert.match(draw(7),/data-agent-thinking="loading"/);
 assert.notEqual(draw(10.4),draw(10.5));
});
test('opening includes a drawn blink and a brief pose buffer, not two overlaid bodies',()=>{
 assert.equal(sampleCameraScene(1.75).programmer.id,'programmer-front-fatigue');
 assert.equal(sampleCameraScene(1.5).programmer.id,'programmer-front-neutral');
 assert.match(drawCameraScene(sampleCameraScene(3.03),bundle),/data-motion="pose-buffer"/);
 assert.doesNotMatch(drawCameraScene(sampleCameraScene(3.2),bundle),/data-motion="pose-buffer"/);
 assert.deepEqual([bundle.poses['programmer-front-fatigue'].width,bundle.poses['programmer-front-fatigue'].height],[1153,1364]);
});
test('logic scenes use acting avatars and a changing workstation vignette without slide disclaimers',()=>{
 for(const t of [18,21.5,26.5,32,39,43]){
  const svg=drawCameraScene(sampleCameraScene(t),bundle);
  assert.match(svg,/data-avatar="agent"/);
  assert.match(svg,/data-layer="vignette"/);
  assert.doesNotMatch(svg,/示意|实测时长|人工操作与机器执行|人的项目清单/);
  assert.doesNotMatch(svg,/href="#pose-programmer-logic-stand-right"/);
 }
 const pose=t=>drawCameraScene(sampleCameraScene(t),bundle).match(/data-pose="(programmer-[^"]+)"/)[1];
 assert.notEqual(pose(34.4),pose(36));
});

test('final hold stops camera, carrier and vignette after 44.2 seconds',()=>{
 assert.equal(drawCameraScene(sampleCameraScene(44.25),bundle),drawCameraScene(sampleCameraScene(45),bundle));
});
test('painted assets are genuine native-aspect PNGs and replace the old visible geometric subjects',()=>{
 const manifest=JSON.parse(fs.readFileSync(new URL('../../static/01/raster-assets-manifest-v01.json',import.meta.url)));
 assert.equal(manifest.assets.length,10);
 const defs=cameraDefinitions(bundle);
 for(const a of manifest.assets){
  const bytes=fs.readFileSync(new URL('../../../'+a.path,import.meta.url));
  assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  assert.deepEqual([bytes.readUInt32BE(16),bytes.readUInt32BE(20)],a.size);
  assert.equal(a.alpha,true);
  assert.equal(bundle.assets[a.id].preserveAspectRatio,'xMidYMid meet');
  assert.match(defs,new RegExp('id="asset-'+a.id+'"[^>]*preserveAspectRatio="xMidYMid meet"'));
 }
 const rear=drawCameraScene(sampleCameraScene(6.5),bundle),logic=drawCameraScene(sampleCameraScene(26.5),bundle);
 assert.match(rear,/#asset-workstation-painted/);
 assert.doesNotMatch(rear,/#asset-(?:desk-lamp|keyboard|mouse|monitor-frame|desk-surface|desk-legs|chair-back-rear)"/);
 assert.match(logic,/#asset-avatar-programmer-neutral/);
 assert.match(logic,/#asset-avatar-agent-focus/);
 assert.match(logic,/#asset-document-landscape/);
 assert.match(logic,/#asset-plan-tray/);
});
