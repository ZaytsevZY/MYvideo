import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {ART,LAYOUT,DURATION,sample,render,definitions,root,kpiSymbol} from './scene-layered-v03.mjs';
const require=createRequire(import.meta.url);let sharp;try{sharp=require('sharp');}catch{sharp=require('/Users/alan671/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');}
const HERE=path.dirname(fileURLToPath(import.meta.url)),ROOT=path.resolve(HERE,'../../../..'),QA=path.join(HERE,'provenance/layered-v03');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const old=JSON.parse(await fs.readFile(path.join(HERE,'provenance/inputs-v01.json'),'utf8'));
const unchanged=[];
for(const p of old.inputs){if(p.path==='scripts/final/shot/02.md')continue;assert.equal(sha(await fs.readFile(path.join(ROOT,p.path))),p.sha256,p.path);unchanged.push(p.path);}
let hrefs={};for(const[k,p]of Object.entries(ART)){assert(!p.includes('compositions'));hrefs[k]='data:image/png;base64,'+(await fs.readFile(path.resolve(HERE,p))).toString('base64');}
const def=definitions(hrefs);
const visible=render(5.9),indices=['background','left-option','right-option','programmer','thought'].map(k=>visible.indexOf('data-layer="'+k+'"'));
assert(indices.every(i=>i>=0));assert.deepEqual([...indices].sort((a,b)=>a-b),indices);
assert((LAYOUT.left[2]*LAYOUT.left[3]+LAYOUT.right[2]*LAYOUT.right[3])/(1920*1080)>.7);
assert(LAYOUT.foreground[0]+LAYOUT.foreground[2]>LAYOUT.left[0]);assert(LAYOUT.foreground[0]+LAYOUT.foreground[2]<LAYOUT.right[0]);
assert(LAYOUT.thought[0]>LAYOUT.foreground[0]);assert(LAYOUT.thought[1]<LAYOUT.foreground[1]);assert(LAYOUT.thought[1]>LAYOUT.right[1]+26+60);
assert(kpiSymbol().includes('>KPI</text>'));assert(!visible.includes('marker-end'));assert(!visible.includes('data-guide'));assert(visible.includes('KPI'));
assert.deepEqual([...visible.matchAll(/font-size="([\d.]+)"/g)].map(m=>+m[1]),[38,38,52]);
assert(visible.includes('data-sub-layer="workstation"'));assert(visible.includes('data-sub-layer="complete-person"'));
for(let i=0;i<=360;i++){const t=Math.min(DURATION,i/30),s=render(t);assert(!/NaN|Infinity|undefined/.test(s));assert.equal(s,render(t));assert((s.match(/href="#s02-(?:think|choose)"/g)||[]).length<=1);}
assert(sample(7.65).pulse>.99);assert(sample(7.95).pulse<.001);assert(sample(8.25).pulse>.99);
assert(render(10.8).indexOf('data-layer="selected-right-front"')>render(10.8).indexOf('data-layer="programmer"'));
const full=await sharp(Buffer.from(root(visible,def))).raw().toBuffer({resolveWithObject:true});
const without=await sharp(Buffer.from(root(render(5.9,{hidden:['programmer']}),def))).raw().toBuffer({resolveWithObject:true});
function difference([x,y,w,h]){let changed=0;const c=full.info.channels;for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){const i=(yy*1920+xx)*c;if([...Array(c).keys()].some(k=>Math.abs(full.data[i+k]-without.data[i+k])>3))changed++;}return changed/(w*h);}
const occlusion={leftChangedFraction:difference([160,500,300,350]),rightChangedFraction:difference([1220,500,500,300])};
assert(occlusion.leftChangedFraction>.3);assert(occlusion.rightChangedFraction<.001);
assert.equal(sample(.2).eatPose,'eatDown');assert.equal(sample(.9).eatPose,'eatScoop');assert.equal(sample(1.7).eatPose,'eatBite');assert.equal(sample(3.6).eatPose,'eatDown');
assert.equal(new Set([.2,.9,1.7].map(t=>sample(t).eatPose)).size,3);
assert.equal(new Set([.2,.9,1.7,3].map(t=>sample(t).agentPose)).size,4);
assert(!render(.9).includes('data-status="accepted"'));
assert(render(.9).includes('paper-in-flight'));assert(!render(1.5).includes('paper-in-flight'));
const a=await sharp(Buffer.from(root(render(.2,{hidden:['programmer','thought']}),def))).raw().toBuffer({resolveWithObject:true});
const b=await sharp(Buffer.from(root(render(1.7,{hidden:['programmer','thought']}),def))).raw().toBuffer();
function motion([x,y,w,h]){let sum=0;for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){const i=(yy*1920+xx)*a.info.channels;if(Math.abs(a.data[i]-b[i])+Math.abs(a.data[i+1]-b[i+1])+Math.abs(a.data[i+2]-b[i+2])>20)sum++;}return sum/(w*h);}
const motionFractions={meal:motion([260,100,480,550]),work:motion([1200,350,600,440])};assert(motionFractions.meal>.01);assert(motionFractions.work>.005);
const gif=await sharp(path.join(HERE,'compositions-v03/comparison.gif'),{animated:true}).metadata();assert.equal(gif.pages,48);assert.equal(gif.width,960);
const html=await fs.readFile(path.join(HERE,'preview.html'),'utf8');assert(html.includes('player-layered-v03.mjs'));assert(!html.includes('<img id="parallel"'));assert(!html.includes('compositions-v03/thought.png'));
for(const m of html.matchAll(/(?:src|href)="([^"#]+)"/g)){if(m[1].startsWith('http'))continue;await fs.access(path.resolve(HERE,m[1]));}
await sharp(full.data,{raw:full.info}).png().toFile(path.join(QA,'occlusion-visible.png'));
await sharp(without.data,{raw:without.info}).png().toFile(path.join(QA,'occlusion-hidden.png'));
let scriptCheck=null;
try{const before=(await fs.readFile(path.join(QA,'02-before.md'))).toString(),after=(await fs.readFile(path.join(ROOT,'scripts/final/shot/02.md'))).toString();const audio=t=>t.match(/<start>([\s\S]*?)<end>/)[1],refs=t=>t.split('## references')[1];assert.equal(audio(before),audio(after));assert.equal(refs(before),refs(after));scriptCheck='Only visual directions changed; audio and references identical';}catch(e){if(e.code!=='ENOENT')throw e;}
const report={version:'S02_LAYERED v0.3',date:'2026-10-18',passed:true,scope:'layered composition sample, not full chapter',sourceInputsUnchanged:unchanged.length,framesSampled:361,occlusion,motionFractions,gifFrames:gif.pages,panelAreaFraction:(888*862*2)/(1920*1080),guideArrows:false,kpiLabels:true,softBorderPulses:2,scriptCheck,artGenerationCalls:4,visualReview:['Full source PNGs reused at native aspect.','Foreground obscures left dining action; right work action remains unobstructed.','Thought symbol moved below option title while remaining upper right of foreground actor.','Background blur and separate card shadows establish depth.'],sources:{scene:sha(await fs.readFile(path.join(HERE,'scene-layered-v03.mjs'))),player:sha(await fs.readFile(path.join(HERE,'player-layered-v03.mjs'))),layout:sha(await fs.readFile(path.join(HERE,'layout-v03.json')))}};
await fs.writeFile(path.join(QA,'verification.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({passed:report.passed,frames:361,...occlusion,unchanged:unchanged.length}));
