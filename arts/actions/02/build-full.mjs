import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {spawn,spawnSync} from 'node:child_process';
import {once} from 'node:events';
import {CONFIG,CUES,BEATS,sample,draw,svg} from './full-scene.mjs';
import {INHERITED} from './scene.mjs';
import {sampleCameraScene,drawCameraScene,cameraDefinitions} from '../01/camera-motion.mjs';
import {rootSvg} from '../../characters/rigs/runtime/rig.mjs';
const sharp=createRequire(import.meta.url)('sharp');sharp.concurrency(1);sharp.cache({memory:128,files:64,items:64});
const DIR=path.dirname(fileURLToPath(import.meta.url)),ROOT=path.resolve(DIR,'../../..'),PROV=path.join(DIR,'provenance/full-v02'),OUT=path.join(DIR,'exports');
const read=p=>fs.readFileSync(path.resolve(ROOT,p)),rel=p=>path.relative(ROOT,p),sha=p=>crypto.createHash('sha256').update(read(p)).digest('hex'),json=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const ids=c=>[...new Set([...c.matchAll(/href="#asset-([^"#]+)"/g)].map(m=>m[1]))];
const final=path.join(OUT,'02-complete-silent-v02.mp4'),tail=path.join(OUT,'02-continuation-silent-v02.mp4'),partial=path.join(OUT,'02-continuation-silent-v02.part.mp4'),opening=path.join(OUT,'02-opening-silent-v02.mp4');
if(process.argv.includes('--video')){assert(!fs.existsSync(final),'Full output exists; choose a new version');assert(!fs.existsSync(tail),'Tail exists; choose a new version');}
fs.mkdirSync(PROV,{recursive:true});
const previous=JSON.parse(read('arts/actions/02/provenance/opening-v02/input-manifest.json'));
const registry={...previous.registry};
const old=JSON.parse(read('arts/actions/01/bundle-camera-v01.json'));
let rest=drawCameraScene(sampleCameraScene(44.966667),old,{captions:false});
const ca=rest.indexOf('<g data-layer="camera"'),cb=rest.indexOf('<g data-layer="vignette"');assert(ca>=0&&cb>ca);
rest=(rest.slice(0,ca)+rest.slice(cb)).replaceAll('#pose-programmer-input','#pose-programmer-rest');
const refs=prefix=>[...new Set([...rest.matchAll(new RegExp('href="#'+prefix+'-([^"#]+)"','g'))].map(m=>m[1]))];
const inline=a=>({...a,dataUri:'data:'+(a.path.endsWith('.svg')?'image/svg+xml':'image/png')+';base64,'+read(a.path).toString('base64')});
const restBundle={...old,assets:Object.fromEntries(refs('asset').map(id=>[id,inline(old.assets[id])])),poses:Object.fromEntries(refs('pose').map(id=>[id,inline(old.poses[id])]))};
await sharp(Buffer.from(rootSvg(rest,cameraDefinitions(restBundle),1920,1080))).flatten({background:'#F6F1E7'}).png().toFile(path.join(PROV,'stage-rest.png'));
registry['stage-rest']={path:rel(path.join(PROV,'stage-rest.png')),width:1920,height:1080};
const stageBuffers={};for(const id of ['stage','stage-lean','stage-rest'])stageBuffers[id]=await sharp(read(registry[id].path)).flatten({background:'#F6F1E7'}).removeAlpha().raw().toBuffer();
const embedded={};
for(const [id,a]of Object.entries(registry)){
 if(id.startsWith('stage'))continue;
 // Rasterizer texture preparation only; original asset files and hashes remain unchanged.
 const buf=a.path.endsWith('.svg')?read(a.path):await sharp(read(a.path)).resize({width:Math.min(240,a.width),withoutEnlargement:true}).png().toBuffer();
 const data='data:'+(a.path.endsWith('.svg')?'image/svg+xml':'image/png')+';base64,'+buf.toString('base64');
 embedded[id]=`<symbol id="asset-${id}" viewBox="0 0 ${a.width} ${a.height}" preserveAspectRatio="xMidYMid meet"><image href="${data}" width="${a.width}" height="${a.height}"/></symbol>`;
}
const cache=new Map();
async function raster(t){
 let c=draw(sample(t));const found=c.match(/<use href="#asset-(stage(?:-lean|-rest)?)"[^>]*\/>/);assert(found,'Missing stage');c=c.replace(found[0],'');
 const key=crypto.createHash('sha256').update(found[1]+c).digest('hex');if(cache.has(key))return cache.get(key);
 const defs=ids(c).map(id=>{assert(embedded[id],'Missing '+id);return embedded[id];}).join('');
 const task=sharp(stageBuffers[found[1]],{raw:{width:1920,height:1080,channels:3}}).composite([{input:Buffer.from(svg(c,defs))}]).removeAlpha().raw().toBuffer();cache.set(key,task);if(cache.size>8)cache.delete(cache.keys().next().value);return task;
}
// Semantic assertions before any MP4 encoding: token conservation, scene isolation and real narration.
const script=read('scripts/final/shot/02.md').toString().split('<start>')[1].split('<end>')[0].replace(/\s/g,'');assert.equal(CUES.map(c=>c.text).join(''),script);
let lastEnd=0;for(const c of CUES){assert.equal(c.startMs,lastEnd);assert(c.endMs>c.startMs);lastEnd=c.endMs;}assert.equal(lastEnd,38000);
for(let f=0;f<=1140;f++){
 const s=sample(f/30);assert.deepEqual(sample(f/30),s);for(const[id,status]of Object.entries(INHERITED))assert.equal(s.tasks[id],status);
 assert.equal(s.token.id,'saving-02');assert(s.token.fraction>=0&&s.token.fraction<=1);assert(s.hypothetical.distinctFromInheritedTasks);assert(Number.isFinite(s.comparison.totalHuman));
 for(const task of s.hypothetical.extraTasks)assert.notEqual(task.status,'accepted');
 const c=draw(s);assert(!/NaN|Infinity|undefined/.test(c));if(s.t>=14.3&&s.t<27)assert.equal((c.match(/data-saving-token=/g)||[]).length,1);
}
assert.equal(sample(17.4).token.owner,'common');assert.equal(sample(17.4).token.fraction,0);assert(sample(30.9).comparison.totalHuman<360);assert(sample(35).comparison.totalHuman>=360);assert.equal(sample(38).caption,null);
const snapshots=[0,12.966667,13,13.7,15.4,17.4,19.1,24.5,27,28.5,30.9,33.7,35.5,37.966667],stills=[];
for(let i=0;i<snapshots.length;i++){const t=snapshots[i],p=path.join(PROV,'frame-'+String(i).padStart(2,'0')+'.png');await sharp(await raster(t),{raw:{width:1920,height:1080,channels:3}}).png().toFile(p);stills.push({time:t,path:rel(p),sha256:sha(rel(p))});}
const tiles=[];for(let i=0;i<stills.length;i++)tiles.push({input:await sharp(read(stills[i].path)).resize(640,360).png().toBuffer(),left:(i%3)*640,top:Math.floor(i/3)*360});
await sharp({create:{width:1920,height:1800,channels:3,background:'#263342'}}).composite(tiles).png().toFile(path.join(OUT,'02-complete-v02-contact.png'));
const stamp=(ms,sep=',')=>`${String(Math.floor(ms/3600000)).padStart(2,'0')}:${String(Math.floor(ms/60000)%60).padStart(2,'0')}:${String(Math.floor(ms/1000)%60).padStart(2,'0')}${sep}${String(ms%1000).padStart(3,'0')}`;
json(path.join(DIR,'captions/02-complete-v02.json'),CUES);
fs.writeFileSync(path.join(DIR,'captions/02-complete-v02.srt'),CUES.map((c,i)=>`${i+1}\n${stamp(c.startMs)} --> ${stamp(c.endMs)}\n${c.text}\n`).join('\n'));
fs.writeFileSync(path.join(DIR,'captions/02-complete-v02.vtt'),'WEBVTT\n\n'+CUES.map(c=>`${stamp(c.startMs,'.')} --> ${stamp(c.endMs,'.')}\n${c.text}\n`).join('\n'));
json(path.join(PROV,'scene-states.json'),{config:CONFIG,frames:Array.from({length:1141},(_,frame)=>({frame,...sample(frame/30)}))});
const browserDefs=Object.entries(registry).map(([id,a])=>`<symbol id="asset-${id}" viewBox="0 0 ${a.width} ${a.height}" preserveAspectRatio="xMidYMid meet"><image href="${path.relative(DIR,path.resolve(ROOT,a.path)).split(path.sep).join('/')}" width="${a.width}" height="${a.height}"/></symbol>`).join('');
fs.writeFileSync(path.join(DIR,'full-preview.html'),`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>02 · 完整38秒</title><style>body{margin:24px;background:#263342;color:#fff;font:16px system-ui}#stage{max-width:1280px}svg{width:100%;height:auto}input{width:60%}button{padding:8px 18px}</style><h2>02 · 完整38秒无声字幕候选</h2><p>两种配置先后演示；条带仅作定性示意，字幕未配音校时。</p><div id="stage"></div><button id="play">播放 / 暂停</button><input aria-label="章节时间" id="seek" type="range" min="0" max="37.966667" step="0.033333" value="0"><span id="time"></span><script type="module">import{sample,draw,svg}from'./full-scene.mjs';const defs=${JSON.stringify(browserDefs)};let t=0,on=false,last=null;const st=document.querySelector('#stage'),seek=document.querySelector('#seek');function show(){st.innerHTML=svg(draw(sample(t)),defs);seek.value=t;document.querySelector('#time').textContent=t.toFixed(2)+' / 38.00s'}document.querySelector('#play').onclick=()=>{if(t>=37.96)t=0;on=!on;last=null};seek.oninput=()=>{on=false;t=+seek.value;show()};function tick(now){if(on&&last!==null){t=Math.min(37.966667,t+(now-last)/1000);if(t>=37.966667)on=false;show()}last=now;requestAnimationFrame(tick)}show();requestAnimationFrame(tick);</script>`);
const sources=['arts/actions/02/full-scene.mjs','arts/actions/02/build-full.mjs','arts/actions/02/scene.mjs','arts/actions/01/camera-motion.mjs','arts/actions/01/performance.mjs','arts/actions/01/keyframes.mjs','arts/characters/rigs/runtime/rig.mjs','arts/actions/01/bundle-camera-v01.json','scripts/final/shot/02.md','scripts/final/shot/03.md','scripts/style/STYLE_BIBLE.md',...Object.values(registry).map(a=>a.path),...refs('asset').map(id=>old.assets[id].path),...refs('pose').map(id=>old.poses[id].path),rel(opening)];
const inputs=[...new Set(sources)].map(p=>({path:p,sha256:sha(p)}));
fs.mkdirSync(path.join(PROV,'source-snapshot'),{recursive:true});for(const a of inputs.filter(a=>/\.(mjs|md)$/.test(a.path))){const dest=path.join(PROV,'source-snapshot',a.path.replaceAll('/','__'));fs.writeFileSync(dest,read(a.path));a.snapshot=rel(dest);}
json(path.join(PROV,'input-manifest.json'),{config:CONFIG,date:'2026-10-16',codeAuthor:'Codex',externalModelCalls:0,imageGenerationCalls:0,audioGenerationCalls:0,inputs,registry,texturePreparation:'in-memory PNG downsample to max240px wide for <=140px graphics; original files unchanged; stageRGB composed outside SVG'});
json(path.join(PROV,'verification.json'),{status:'stills_ready_video_not_rendered',checks:{samples:1141,narrationVerbatim:true,cues:11,captionCoverageMs:38000,singleSavingToken:true,resetBeforeB:true,hypotheticalTasksIsolated:true,inheritedStatesPreserved:true,comparisonContracts:true},stills});
console.log(JSON.stringify({stills:stills.length,semanticChecks:'passed',video:process.argv.includes('--video')}));
if(!process.argv.includes('--video'))process.exit(0);
const args=['-hide_banner','-loglevel','warning','-nostdin','-y','-f','rawvideo','-pixel_format','rgb24','-video_size','1920x1080','-framerate','30','-i','pipe:0','-an','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-frames:v','750','-movflags','+faststart',partial];
const enc=spawn('ffmpeg',args,{stdio:['pipe','ignore','pipe']}),completed=once(enc,'close');let log='';enc.stderr.on('data',d=>log+=d);enc.stdin.on('error',()=>{});
const pending=new Map(),start=Date.now();
try{
 for(let f=0;f<750;f++){
  for(let n=f;n<Math.min(750,f+4);n++)if(!pending.has(n))pending.set(n,raster(13+n/30));
  const data=await pending.get(f);pending.delete(f);assert.equal(data.length,1920*1080*3);if(!enc.stdin.write(data))await once(enc.stdin,'drain');
  if(f%90===0||f===749)console.log(JSON.stringify({frame:f+1,total:750,elapsedSeconds:+((Date.now()-start)/1000).toFixed(1)}));
 }
 enc.stdin.end();const[code]=await completed;assert.equal(code,0,log);fs.renameSync(partial,tail);
}catch(e){enc.stdin.destroy();enc.kill('SIGTERM');throw e;}finally{fs.writeFileSync(path.join(PROV,'ffmpeg-tail.log'),log);}
const probe=file=>{const r=spawnSync('ffprobe',['-v','error','-show_format','-show_streams','-of','json',file],{encoding:'utf8'});assert.equal(r.status,0,r.stderr);return JSON.parse(r.stdout);};
const a=probe(opening),b=probe(tail);
for(const k of ['codec_name','width','height','r_frame_rate','pix_fmt','time_base'])assert.equal(a.streams[0][k],b.streams[0][k],'concat incompatible '+k);
const listing=path.join(PROV,'concat.txt');fs.writeFileSync(listing,`file '${opening}'\nfile '${tail}'\n`);
const joined=final.replace('.mp4','.part.mp4');const concatArgs=['-v','warning','-y','-f','concat','-safe','0','-i',listing,'-map','0:v:0','-c','copy','-an','-movflags','+faststart',joined];
const joinedResult=spawnSync('ffmpeg',concatArgs,{encoding:'utf8'});assert.equal(joinedResult.status,0,joinedResult.stderr);fs.writeFileSync(path.join(PROV,'ffmpeg-concat.log'),joinedResult.stderr);
const info=probe(joined),v=info.streams[0];assert.equal(info.streams.length,1);assert.equal(v.width,1920);assert.equal(v.height,1080);assert.equal(+v.nb_frames,1140);assert.equal(+info.format.duration,38);
const decoded=spawnSync('ffmpeg',['-v','error','-i',joined,'-f','null','-'],{encoding:'utf8'});assert.equal(decoded.status,0,decoded.stderr);
// Exact decoded-frame reuse check, not just matching media duration.
const md5=(file,n)=>{const r=spawnSync('ffmpeg',['-v','error','-i',file,'-frames:v',String(n),'-f','framemd5','-'],{encoding:'utf8',maxBuffer:4*1024*1024});assert.equal(r.status,0,r.stderr);return r.stdout.split('\n').filter(x=>x&&!x.startsWith('#')).map(x=>x.split(',').at(-1).trim());};
assert.deepEqual(md5(opening,390),md5(joined,390));fs.renameSync(joined,final);json(path.join(OUT,'02-complete-silent-v02-ffprobe.json'),info);
const qa=[0,12.966667,13,15.4,17.4,20.1,26.966667,27,30.9,33.7,37.966667];
for(let i=0;i<qa.length;i++){const r=spawnSync('ffmpeg',['-v','error','-y','-ss',String(qa[i]),'-i',final,'-frames:v','1',path.join(PROV,'encoded-'+String(i).padStart(2,'0')+'.png')],{encoding:'utf8'});assert.equal(r.status,0,r.stderr);}
const pts=spawnSync('ffprobe',['-v','error','-select_streams','v:0','-show_entries','frame=best_effort_timestamp_time','-of','csv=p=0',final],{encoding:'utf8'});assert.equal(pts.status,0);const ts=pts.stdout.split('\n').map(x=>parseFloat(x)).filter(Number.isFinite);assert.equal(ts.length,1140);for(let i=1;i<ts.length;i++)assert(Math.abs(ts[i]-ts[i-1]-1/30)<.00001,'timestamp gap');
const black=spawnSync('ffmpeg',['-hide_banner','-i',final,'-vf','blackdetect=d=0.03:pix_th=0.10','-an','-f','null','-'],{encoding:'utf8'});assert.equal(black.status,0);assert(!black.stderr.includes('black_start:'));fs.writeFileSync(path.join(PROV,'decode-and-blackdetect.log'),black.stderr);
const manifest={config:CONFIG,date:'2026-10-16',inputs,registry,externalModelCalls:0,imageGenerationCalls:0,audioGenerationCalls:0,sourceOpening:{path:rel(opening),sha256:sha(rel(opening)),frames:390,decodedFramesEqual:true},tail:{path:rel(tail),sha256:sha(rel(tail)),frames:750},output:{path:rel(final),sha256:sha(rel(final)),bytes:fs.statSync(final).size},commands:[['ffmpeg',...args],['ffmpeg',...concatArgs]],versions:{sharp:sharp.versions,ffmpeg:spawnSync('ffmpeg',['-version'],{encoding:'utf8'}).stdout.split('\n')[0]},elapsedSeconds:(Date.now()-start)/1000,checks:{fullDecode:true,monotonic30fpsTimestamps:true,blackFrames:false,openingDecodedFramesEqual:true},qaTimes:qa,captionTiming:'provisional semantic timing; no recorded narration; full121 characters preserved'};
json(path.join(OUT,'02-complete-silent-v02-manifest.json'),manifest);
console.log(JSON.stringify({complete:true,output:final,duration:38,frames:1140,openingReusedExactly:true}));
