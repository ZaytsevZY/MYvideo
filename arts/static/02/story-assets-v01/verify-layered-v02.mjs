import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {ART,LAYOUT,DURATION,sample,render,definitions,root,kpiSymbol} from './scene-layered-v02.mjs';
const require=createRequire(import.meta.url);let sharp;try{sharp=require('sharp');}catch{sharp=require('/Users/alan671/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');}
const HERE=path.dirname(fileURLToPath(import.meta.url)),ROOT=path.resolve(HERE,'../../../..'),QA=path.join(HERE,'provenance/layered-v02');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const old=JSON.parse(await fs.readFile(path.join(HERE,'provenance/inputs-v01.json'),'utf8'));
const unchanged=[];
for(const p of old.inputs){if(p.path==='scripts/final/shot/02.md')continue;assert.equal(sha(await fs.readFile(path.join(ROOT,p.path))),p.sha256,p.path);unchanged.push(p.path);}
let hrefs={};for(const[k,p]of Object.entries(ART)){assert(!p.includes('compositions'));hrefs[k]='data:image/png;base64,'+(await fs.readFile(path.resolve(HERE,p))).toString('base64');}
const def=definitions(hrefs);
const visible=render(3.8),indices=['background','left-option','right-option','programmer','thought'].map(k=>visible.indexOf('data-layer="'+k+'"'));
assert(indices.every(i=>i>=0));assert.deepEqual([...indices].sort((a,b)=>a-b),indices);
assert((LAYOUT.left[2]*LAYOUT.left[3]+LAYOUT.right[2]*LAYOUT.right[3])/(1920*1080)>.7);
assert(LAYOUT.foreground[0]+LAYOUT.foreground[2]>LAYOUT.left[0]);assert(LAYOUT.foreground[0]+LAYOUT.foreground[2]<LAYOUT.right[0]);
assert(LAYOUT.thought[0]>LAYOUT.foreground[0]);assert(LAYOUT.thought[1]<LAYOUT.foreground[1]);assert(LAYOUT.thought[1]>LAYOUT.right[1]+26+60);
assert(!kpiSymbol().includes('<text'));assert(!visible.includes('marker-end'));assert(!visible.includes('data-guide'));assert(!visible.includes('KPI'));
assert.deepEqual([...visible.matchAll(/font-size="([\d.]+)"/g)].map(m=>+m[1]),[38,38]);
assert(visible.includes('data-sub-layer="workstation"'));assert(visible.includes('data-sub-layer="complete-person"'));
for(let i=0;i<=306;i++){const t=Math.min(DURATION,i/30),s=render(t);assert(!/NaN|Infinity|undefined/.test(s));assert.equal(s,render(t));assert((s.match(/href="#s02-(?:think|choose)"/g)||[]).length<=1);}
assert(sample(5.75).pulse>.99);assert(sample(6.05).pulse<.001);assert(sample(6.35).pulse>.99);
assert(render(8.9).indexOf('data-layer="selected-right-front"')>render(8.9).indexOf('data-layer="programmer"'));
const full=await sharp(Buffer.from(root(visible,def))).raw().toBuffer({resolveWithObject:true});
const without=await sharp(Buffer.from(root(render(3.8,{hidden:['programmer']}),def))).raw().toBuffer({resolveWithObject:true});
function difference([x,y,w,h]){let changed=0;const c=full.info.channels;for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){const i=(yy*1920+xx)*c;if([...Array(c).keys()].some(k=>Math.abs(full.data[i+k]-without.data[i+k])>3))changed++;}return changed/(w*h);}
const occlusion={leftChangedFraction:difference([160,500,300,350]),rightChangedFraction:difference([1220,500,500,300])};
assert(occlusion.leftChangedFraction>.3);assert(occlusion.rightChangedFraction<.001);
const html=await fs.readFile(path.join(HERE,'preview.html'),'utf8');assert(html.includes('player-layered-v02.mjs'));assert(!html.includes('<img id="parallel"'));assert(!html.includes('compositions-v02/thought.png'));
for(const m of html.matchAll(/(?:src|href)="([^"#]+)"/g)){if(m[1].startsWith('http'))continue;await fs.access(path.resolve(HERE,m[1]));}
await sharp(full.data,{raw:full.info}).png().toFile(path.join(QA,'occlusion-visible.png'));
await sharp(without.data,{raw:without.info}).png().toFile(path.join(QA,'occlusion-hidden.png'));
let scriptCheck=null;
try{const before=(await fs.readFile(path.join(QA,'02-before.md'))).toString(),after=(await fs.readFile(path.join(ROOT,'scripts/final/shot/02.md'))).toString();const audio=t=>t.match(/<start>([\s\S]*?)<end>/)[1],refs=t=>t.split('## references')[1];assert.equal(audio(before),audio(after));assert.equal(refs(before),refs(after));scriptCheck='Only visual directions changed; audio and references identical';}catch(e){if(e.code!=='ENOENT')throw e;}
const report={version:'S02_LAYERED v0.2',date:'2026-10-18',passed:true,scope:'layered composition sample, not full chapter',sourceInputsUnchanged:unchanged.length,framesSampled:307,occlusion,panelAreaFraction:(888*862*2)/(1920*1080),guideArrows:false,kpiLabels:false,softBorderPulses:2,scriptCheck,artGenerationCalls:0,visualReview:['Full source PNGs reused at native aspect.','Foreground obscures left rest actor; right work action remains unobstructed.','Thought symbol moved below option title while remaining upper right of foreground actor.','Background blur and separate card shadows establish depth.'],sources:{scene:sha(await fs.readFile(path.join(HERE,'scene-layered-v02.mjs'))),player:sha(await fs.readFile(path.join(HERE,'player-layered-v02.mjs'))),layout:sha(await fs.readFile(path.join(HERE,'layout-v02.json')))}};
await fs.writeFile(path.join(QA,'verification.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({passed:report.passed,frames:307,...occlusion,unchanged:unchanged.length}));
