// Native SVG rasterization shared by the complete-video baker and frame QA.
import fs from 'node:fs';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {sampleCameraScene,drawCameraScene,cameraDefinitions} from './camera-motion.mjs';
import {rootSvg} from '../../characters/rigs/runtime/rig.mjs';
const require=createRequire(import.meta.url);
export const sharp=require('sharp');
sharp.cache({memory:128,files:64,items:128});
sharp.concurrency(1);
export const WIDTH=1920,HEIGHT=1080,FPS=30,FRAME_COUNT=1350;
const bundle=JSON.parse(fs.readFileSync(new URL('./bundle-camera-v01.json',import.meta.url)));
const inline=a=>({...a,dataUri:'data:'+(a.path.endsWith('.svg')?'image/svg+xml':'image/png')+';base64,'+fs.readFileSync(new URL('../../../'+a.path,import.meta.url)).toString('base64')});
const art={assets:Object.fromEntries(Object.entries(bundle.assets).map(([id,a])=>[id,inline(a)])),poses:Object.fromEntries(Object.entries(bundle.poses).map(([id,a])=>[id,inline(a)]))};
const defsCache=new Map(),frameCache=new Map();
export async function rasterFrame(frame){
 if(!Number.isInteger(frame)||frame<0||frame>=FRAME_COUNT)throw Error('Frame outside 0..1349');
 const content=drawCameraScene(sampleCameraScene(frame/FPS),bundle);
 const ids=prefix=>[...new Set([...content.matchAll(new RegExp('href="#'+prefix+'-([^"#]+)"','g'))].map(m=>m[1]))].sort();
 const assets=ids('asset'),poses=ids('pose'),key=assets.join(',')+'|'+poses.join(',');
 let defs=defsCache.get(key);
 if(!defs){defs=cameraDefinitions({...bundle,assets:Object.fromEntries(assets.map(id=>[id,art.assets[id]])),poses:Object.fromEntries(poses.map(id=>[id,art.poses[id]]))});defsCache.set(key,defs);if(defsCache.size>12)defsCache.delete(defsCache.keys().next().value);}
 const hash=crypto.createHash('sha256').update(content).digest('hex');
 if(frameCache.has(hash))return frameCache.get(hash);
 const task=sharp(Buffer.from(rootSvg(content,defs,WIDTH,HEIGHT)),{density:72,limitInputPixels:100000000}).flatten({background:'#F6F1E7'}).removeAlpha().raw().toBuffer();
 frameCache.set(hash,task);if(frameCache.size>8)frameCache.delete(frameCache.keys().next().value);
 return task;
}
export async function writeFramePNG(frame,path){
 const data=await rasterFrame(frame);
 await sharp(data,{raw:{width:WIDTH,height:HEIGHT,channels:3}}).png().toFile(path);
}
