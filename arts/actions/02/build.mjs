import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {spawn,spawnSync} from 'node:child_process';
import {once} from 'node:events';
import assert from 'node:assert/strict';
import {sampleCameraScene,drawCameraScene,cameraDefinitions} from '../01/camera-motion.mjs';
import {rootSvg} from '../../characters/rigs/runtime/rig.mjs';
import {CONFIG,CUES,BEATS,INHERITED,sample,draw,svg} from './scene.mjs';
const require=createRequire(import.meta.url),sharp=require('sharp');
sharp.concurrency(1);sharp.cache({memory:128,files:64,items:100});
const DIR=path.dirname(fileURLToPath(import.meta.url)),ROOT=path.resolve(DIR,'../../..');
const out=path.join(DIR,'exports'),prov=path.join(DIR,'provenance/opening-v02');
const read=p=>fs.readFileSync(path.resolve(ROOT,p));
const sha=p=>crypto.createHash('sha256').update(read(p)).digest('hex');
const rel=p=>path.relative(ROOT,p),json=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const old=JSON.parse(read('arts/actions/01/bundle-camera-v01.json'));
const inline=a=>({...a,dataUri:'data:'+(a.path.endsWith('.svg')?'image/svg+xml':'image/png')+';base64,'+read(a.path).toString('base64')});
const ids=(content,prefix)=>[...new Set([...content.matchAll(new RegExp('href="#'+prefix+'-([^"#]+)"','g'))].map(m=>m[1]))];
function oldSVG(t,stage=false,lean=false){
 let c=drawCameraScene(sampleCameraScene(t),old,{captions:!stage});
 if(stage){const a=c.indexOf('<g data-layer="camera"'),b=c.indexOf('<g data-layer="vignette"');assert(a>=0&&b>a);c=c.slice(0,a)+c.slice(b);if(lean)c=c.replaceAll('#pose-programmer-input','#pose-programmer-lean');}
 const b={...old,assets:Object.fromEntries(ids(c,'asset').map(id=>[id,inline(old.assets[id])])),poses:Object.fromEntries(ids(c,'pose').map(id=>[id,inline(old.poses[id])]))};
 return rootSvg(c,cameraDefinitions(b),1920,1080);
}
for(const lean of [false,true])await sharp(Buffer.from(oldSVG(44.966667,true,lean))).png().toFile(path.join(prov,lean?'stage-lean.png':'stage-idle.png'));
const assetIds=['document-portrait','avatar-programmer-neutral','avatar-programmer-focus','avatar-agent-neutral','avatar-agent-focus','cursor'];
const registry=Object.fromEntries(assetIds.map(id=>[id,old.assets[id]]));
registry.stage={path:rel(path.join(prov,'stage-idle.png')),width:1920,height:1080};
registry['stage-lean']={path:rel(path.join(prov,'stage-lean.png')),width:1920,height:1080};
const defsFor=(embedded=false)=>Object.entries(registry).map(([id,a])=>{
 const href=embedded?inline(a).dataUri:path.relative(DIR,path.resolve(ROOT,a.path)).split(path.sep).join('/');
 return `<symbol id="asset-${id}" viewBox="0 0 ${a.width} ${a.height}" preserveAspectRatio="xMidYMid meet"><image href="${href}" width="${a.width}" height="${a.height}"/></symbol>`;
}).join('');
const embeddedDefs=Object.fromEntries(Object.entries(registry).map(([id,a])=>[id,`<symbol id="asset-${id}" viewBox="0 0 ${a.width} ${a.height}" preserveAspectRatio="xMidYMid meet"><image href="${inline(a).dataUri}" width="${a.width}" height="${a.height}"/></symbol>`]));
function content(t){let c=draw(sample(t));if(t>=4.6&&t<5.8)c=c.replace('href="#asset-stage"','href="#asset-stage-lean"');return c;}
async function raster(t){const c=content(t),defs=ids(c,'asset').map(id=>embeddedDefs[id]).join('');return sharp(Buffer.from(svg(c,defs))).flatten({background:'#F6F1E7'}).removeAlpha().raw().toBuffer();}
const stamp=ms=>{const h=Math.floor(ms/3600000),m=Math.floor(ms/60000)%60,s=Math.floor(ms/1000)%60;return [h,m,s].map(x=>String(x).padStart(2,'0')).join(':')+','+String(ms%1000).padStart(3,'0');};
json(path.join(DIR,'captions/02-opening-v02.json'),CUES);
const srt=CUES.map((c,i)=>`${i+1}\n${stamp(c.startMs)} --> ${stamp(c.endMs)}\n${c.text}\n`).join('\n');
fs.writeFileSync(path.join(DIR,'captions/02-opening-v02.srt'),srt);
fs.writeFileSync(path.join(DIR,'captions/02-opening-v02.vtt'),'WEBVTT\n\n'+srt.replace(/(\d\d:\d\d:\d\d),(\d{3})/g,'$1.$2'));
const source=read('scripts/final/shot/02.md').toString().split('<start>')[1].split('<end>')[0].trim().split('\n')[0];
assert.equal(CUES.map(c=>c.text).join(''),source);
for(let f=0;f<=CONFIG.frames;f++){
 const state=sample(f/CONFIG.fps);assert.deepEqual(sample(f/CONFIG.fps),state);
 for(const [id,status] of Object.entries(INHERITED))assert.equal(state.tasks[id],status);
 for(const c of state.candidates){assert.equal(c.status,'candidate');assert(Number.isFinite(c.x)&&c.p>=0&&c.p<=1);}
 assert(!/NaN|Infinity|undefined/.test(content(f/CONFIG.fps)));
}
assert.deepEqual(sample(0).candidates.map(c=>c.feasible),[false,false,false]);
assert.deepEqual(sample(13).candidates.map(c=>c.feasible),[true,true,false]);
assert.equal(sample(13).caption,null);
const times=[0,2.4,4.9,6.5,8.3,10.4,12.966667],stills=[];
for(let i=0;i<times.length;i++){
 const t=times[i],p=path.join(prov,`frame-${String(i).padStart(2,'0')}.png`);
 await sharp(await raster(t),{raw:{width:1920,height:1080,channels:3}}).png().toFile(p);stills.push({t,path:rel(p),sha256:sha(rel(p))});
}
const thumbs=await Promise.all(stills.map(async (s,i)=>({input:await sharp(read(s.path)).resize(640,360).png().toBuffer(),left:(i%2)*640,top:Math.floor(i/2)*360})));
await sharp({create:{width:1280,height:1440,channels:3,background:'#263342'}}).composite(thumbs).png().toFile(path.join(out,'02-opening-v02-contact.png'));
const browserDefs=defsFor(false);
fs.writeFileSync(path.join(DIR,'preview.html'),`<!doctype html><meta charset="utf-8"><title>02 · 13秒无声候选</title><style>body{margin:24px;background:#263342;color:#fff;font:16px system-ui}#stage{max-width:1280px}svg{width:100%;height:auto}input{width:60%}button{padding:8px 18px;margin-right:16px}</style><h2>02开头 · 13秒无声候选</h2><p>字幕暂定排时，未配音；成本收益示意，非实测。</p><div id="stage"></div><button id="play">播放 / 暂停</button><input id="seek" type="range" min="0" max="12.966667" step="0.033333" value="0"><span id="time"></span><script type="module">import{sample,draw,svg}from'./scene.mjs';const defs=${JSON.stringify(browserDefs)};let t=0,playing=false,last=null;const stage=document.querySelector('#stage'),seek=document.querySelector('#seek');function show(){let c=draw(sample(t));if(t>=4.6&&t<5.8)c=c.replace('href="#asset-stage"','href="#asset-stage-lean"');stage.innerHTML=svg(c,defs);seek.value=t;document.querySelector('#time').textContent=t.toFixed(2)+' / 13.00s'}document.querySelector('#play').onclick=()=>{if(t>=12.96)t=0;playing=!playing;last=null};seek.oninput=()=>{t=+seek.value;show()};function tick(now){if(playing&&last!==null){t=Math.min(12.966667,t+(now-last)/1000);if(t>=12.966667)playing=false;show()}last=now;requestAnimationFrame(tick)}show();requestAnimationFrame(tick);</script>`);
json(path.join(prov,'scene-states.json'),{config:CONFIG,frames:Array.from({length:391},(_,f)=>({frame:f,...sample(f/30)}))});
const inputs=[...Object.values(registry).map(a=>a.path),'scripts/final/shot/01.md','scripts/final/shot/02.md','scripts/style/STYLE_BIBLE.md','arts/actions/01/camera-motion.mjs','arts/actions/01/performance.mjs','arts/actions/01/bundle-camera-v01.json','arts/actions/02/scene.mjs','arts/actions/02/build.mjs'];
const unique=[...new Set(inputs)];
json(path.join(prov,'input-manifest.json'),{date:'2026-10-16',codeAuthor:'Codex',externalModelCalls:0,imageGenerationCalls:0,prompt:null,method:'reuse adopted PNG assets unchanged; native SVG/JavaScript; derived stage excludes old diagram and captions',inputs:unique.map(p=>({path:p,sha256:sha(p)})),registry});
json(path.join(prov,'verification.json'),{status:'stills generated; video not yet rendered',checks:{sampledFrames:391,deterministicSeeking:true,inheritedStatesPreserved:true,candidateNotAutoScheduled:true,firstParagraphVerbatim:true,expectedFeasibilityAtEnd:[true,true,false],captionEndsAt13000:true},stills});
console.log(JSON.stringify({stills:stills.length,semanticChecks:'passed',mode:process.argv.includes('--video')?'video':'stills'}));
if(!process.argv.includes('--video'))process.exit(0);
const final=path.join(out,'02-opening-silent-v02.mp4'),partial=path.join(out,'02-opening-silent-v02.part.mp4');
assert(!fs.existsSync(final),'Select a new output version; existing MP4 will not be overwritten');
async function encode(file,count,frameFn){
 const args=['-hide_banner','-loglevel','warning','-nostdin','-y','-f','rawvideo','-pixel_format','rgb24','-video_size','1920x1080','-framerate','30','-i','pipe:0','-an','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-frames:v',String(count),'-movflags','+faststart',file];
 const p=spawn('ffmpeg',args,{stdio:['pipe','ignore','pipe']}),done=once(p,'close');let log='';p.stderr.on('data',d=>log+=d);p.stdin.on('error',()=>{});
 try{for(let f=0;f<count;f++){const data=await frameFn(f);if(!p.stdin.write(data))await once(p.stdin,'drain');if(f%60===0)console.log(JSON.stringify({file:path.basename(file),frame:f,total:count}));}p.stdin.end();const[code]=await done;assert.equal(code,0,log);}catch(e){p.stdin.destroy();p.kill('SIGTERM');throw e;}
 fs.writeFileSync(file+'.log',log);return args;
}
const start=Date.now(),args=await encode(partial,390,f=>raster(f/30));
const probe=spawnSync('ffprobe',['-v','error','-show_streams','-show_format','-of','json',partial],{encoding:'utf8'});assert.equal(probe.status,0,probe.stderr);const info=JSON.parse(probe.stdout),v=info.streams[0];
assert.equal(info.streams.length,1);assert.equal(v.codec_type,'video');assert.equal(v.width,1920);assert.equal(v.height,1080);assert.equal(v.r_frame_rate,'30/1');assert.equal(+v.nb_frames,390);assert.equal(+info.format.duration,13);
const decode=spawnSync('ffmpeg',['-v','error','-i',partial,'-f','null','-'],{encoding:'utf8'});assert.equal(decode.status,0,decode.stderr);fs.renameSync(partial,final);
json(path.join(out,'02-opening-silent-v02-ffprobe.json'),info);
for(const [label,at]of [['start',0],['crossing',7.3],['end',12.966667]]){const r=spawnSync('ffmpeg',['-v','error','-y','-ss',String(at),'-i',final,'-frames:v','1',path.join(prov,`encoded-${label}.png`)],{encoding:'utf8'});assert.equal(r.status,0,r.stderr);}
// Reconstruct only the preceding two seconds from unchanged 01 code, not the full 45s video.
const seam=path.join(out,'01-to-02-seam-v02.mp4');assert(!fs.existsSync(seam));
await encode(seam,120,async f=>f<60?sharp(Buffer.from(oldSVG(43+f/30))).flatten({background:'#F6F1E7'}).removeAlpha().raw().toBuffer():raster((f-60)/30));
const seamDecode=spawnSync('ffmpeg',['-v','error','-i',seam,'-f','null','-'],{encoding:'utf8'});assert.equal(seamDecode.status,0,seamDecode.stderr);
json(path.join(out,'02-opening-silent-v02-manifest.json'),{config:CONFIG,scope:'V02.1 only; chapter02 remains incomplete',captionTiming:'provisional semantic timing; no voice alignment',codeAuthor:'Codex',externalModelCalls:0,imageGenerationCalls:0,command:['ffmpeg',...args],elapsedSeconds:(Date.now()-start)/1000,versions:sharp.versions,ffmpeg:spawnSync('ffmpeg',['-version'],{encoding:'utf8'}).stdout.split('\n')[0],inputs:unique.map(p=>({path:p,sha256:sha(p)})),output:{path:rel(final),sha256:sha(rel(final)),bytes:fs.statSync(final).size},seam:{path:rel(seam),sha256:sha(rel(seam)),source:'01 last2s re-rendered from original code; not original MP4'},qa:'metadata, full decode and encoded QA frames generated; visual review recorded separately'});
console.log(JSON.stringify({complete:true,output:final,seam}));
