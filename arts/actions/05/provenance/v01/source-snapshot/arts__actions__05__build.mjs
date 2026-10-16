import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {spawn,spawnSync} from 'node:child_process';
import {once} from 'node:events';
import {CONFIG,CUES,BEATS,sample,draw,svg,MATCH06_GRAPHIC,withoutCaptions} from './scene.mjs';
const sharp=createRequire(import.meta.url)('sharp');sharp.concurrency(1);sharp.cache({memory:128,files:64,items:64});
const DIR=path.dirname(fileURLToPath(import.meta.url)),ROOT=path.resolve(DIR,'../../..');
// Optional alternate output root permits a repeat render without changing or overwriting the adopted output.
const oi=process.argv.indexOf('--output-dir'),DEST=oi<0?DIR:path.resolve(process.argv[oi+1]);
const PROV=path.join(DEST,'provenance/v01'),OUT=path.join(DEST,'exports'),CAP=path.join(DEST,'captions'),video=process.argv.includes('--video');
const final=path.join(OUT,'05-complete-silent-v01.mp4'),partial=path.join(OUT,'05-complete-silent-v01.part.mp4');
if(video)assert(!fs.existsSync(final)&&!fs.existsSync(partial),'Output exists; use --output-dir <new-directory>');
for(const d of [PROV,OUT,CAP,path.join(PROV,'source-snapshot')])fs.mkdirSync(d,{recursive:true});
const read=p=>fs.readFileSync(path.resolve(ROOT,p)),sha=p=>crypto.createHash('sha256').update(fs.readFileSync(path.resolve(ROOT,p))).digest('hex');
const rel=p=>path.relative(ROOT,p),json=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const b=JSON.parse(read('arts/actions/01/bundle-camera-v01.json'));
const registry={};
for(const id of ['document-portrait','avatar-programmer-neutral','avatar-programmer-focus','avatar-agent-neutral','avatar-agent-focus','cursor','workstation-painted','chair-back-painted'])registry[id]=b.assets[id];
for(const id of ['agent-idle','programmer-input','programmer-lean','programmer-release-half','programmer-rest','programmer-rise','programmer-rise-high','programmer-stand','programmer-turn-left','programmer-walk-a','programmer-walk-pass','programmer-walk-recover'])registry[id]=b.poses[id];
const room=await sharp(read(b.assets['room-day'].path)).resize(2040,1148,{fit:'fill'}).extract({left:60,top:34,width:1920,height:1080}).blur(1.2).png().toBuffer();
fs.writeFileSync(path.join(PROV,'stage-room.png'),room);registry['stage-room']={path:rel(path.join(PROV,'stage-room.png')),width:1920,height:1080};
const background=await sharp(room).flatten({background:'#F6F1E7'}).removeAlpha().raw().toBuffer();
const embedded={},assets=[];
for(const [id,a]of Object.entries(registry)){
 const meta=await sharp(read(a.path)).metadata();assert.equal(meta.width,a.width,id);assert.equal(meta.height,a.height,id);
 assets.push({id,path:a.path,sha256:sha(a.path),width:meta.width,height:meta.height,hasAlpha:meta.hasAlpha});
 if(id==='stage-room')continue;
 const max=id==='workstation-painted'?720:id==='chair-back-painted'?320:id.startsWith('programmer-')||id==='agent-idle'?400:240;
 const data=a.path.endsWith('.svg')?read(a.path):await sharp(read(a.path)).resize({width:Math.min(max,a.width),withoutEnlargement:true}).png().toBuffer();
 embedded[id]=`<symbol id="asset-${id}" viewBox="0 0 ${a.width} ${a.height}" preserveAspectRatio="xMidYMid meet"><image href="data:${a.path.endsWith('.svg')?'image/svg+xml':'image/png'};base64,${data.toString('base64')}" width="${a.width}" height="${a.height}"/></symbol>`;
}
for(const x of assets)if(!x.id.startsWith('stage')&&x.path.endsWith('.png'))assert(x.hasAlpha,'Missing transparency '+x.id);
json(path.join(PROV,'asset-validation.json'),assets);
const ids=c=>[...new Set([...c.matchAll(/href="#asset-([^"#]+)"/g)].map(m=>m[1]))];
const cache=new Map();
async function raster(t){
 const c=draw(sample(t)).replace(/<use href="#asset-stage-room"[^>]*\/>/,'');
 const key=crypto.createHash('sha256').update(c).digest('hex');if(cache.has(key))return cache.get(key);
 const defs=ids(c).map(id=>{assert(embedded[id],'Missing '+id);return embedded[id]}).join('');
 const p=sharp(background,{raw:{width:1920,height:1080,channels:3}}).composite([{input:Buffer.from(svg(c,defs))}]).removeAlpha().raw().toBuffer();
 cache.set(key,p);if(cache.size>8)cache.delete(cache.keys().next().value);return p;
}
const narration=read('scripts/final/shot/05.md').toString().split('<start>')[1].split('<end>')[0].replace(/\s/g,'');
assert.equal(CUES.map(c=>c.text).join('').replace(/\s/g,''),narration);assert.equal([...narration].length,156);
let last=0;for(const c of CUES){assert.equal(c.startMs,last);assert(c.endMs>last);last=c.endMs;}assert.equal(last,45000);
for(let f=0;f<=CONFIG.frames;f++){
 const t=f/30,s=sample(t),c=draw(s);assert.deepEqual(s,sample(t));assert(!/NaN|Infinity|undefined/.test(c));
 assert.equal(s.decisionOwner,'organization');assert.equal(s.workerDecisionRights,'not_automatically_granted');assert.equal(s.workerParticipatesInDecision,false);assert.equal(s.agentIsEmployer,false);assert.equal(s.acceptedTaskCount,0);
 assert.equal((c.match(/data-pose="programmer-/g)||[]).length,1);
 if(t<40)assert.equal((c.match(/data-decision-node=/g)||[]).length,3);
 if(t>=40&&t<42)assert.equal((c.match(/data-agent-instance=/g)||[]).length,1);
 if(t>=14&&t<31)assert(c.includes('data-feedback-origin="organization-delivery-standard"'));
 if(t>=42){assert.equal(withoutCaptions(c),MATCH06_GRAPHIC);}
}
const QA=[0,1.6,3,4.3,5.3,6.8,8,10,13.966667,14,15.3,17.5,18.5,19.2,21.966667,22,25.966667,26,28.5,30.966667,31,31.8,34,35.7,37.9,39.2,40,40.5,41,41.4,41.966667,42,43,44.966667];
const stills=[];
for(let i=0;i<QA.length;i++){
 const p=path.join(PROV,'frame-'+String(i).padStart(2,'0')+'.png');await sharp(await raster(QA[i]),{raw:{width:1920,height:1080,channels:3}}).png().toFile(p);stills.push({time:QA[i],path:rel(p),sha256:sha(rel(p))});
}
const tiles=[];for(let i=0;i<stills.length;i++)tiles.push({input:await sharp(read(stills[i].path)).resize(480,270).png().toBuffer(),left:i%4*480,top:Math.floor(i/4)*270});
await sharp({create:{width:1920,height:Math.ceil(stills.length/4)*270,channels:3,background:'#263342'}}).composite(tiles).png().toFile(path.join(OUT,'05-contact-v01.png'));
const stamp=(ms,sep=',')=>`${String(Math.floor(ms/3600000)).padStart(2,'0')}:${String(Math.floor(ms/60000)%60).padStart(2,'0')}:${String(Math.floor(ms/1000)%60).padStart(2,'0')}${sep}${String(ms%1000).padStart(3,'0')}`;
json(path.join(CAP,'05-v01.json'),CUES);fs.writeFileSync(path.join(CAP,'05-v01.srt'),CUES.map((c,i)=>`${i+1}\n${stamp(c.startMs)} --> ${stamp(c.endMs)}\n${c.text}\n`).join('\n'));
fs.writeFileSync(path.join(CAP,'05-v01.vtt'),'WEBVTT\n\n'+CUES.map(c=>`${stamp(c.startMs,'.')} --> ${stamp(c.endMs,'.')}\n${c.text}\n`).join('\n'));
json(path.join(PROV,'scene-states.json'),{config:CONFIG,beats:BEATS,frames:Array.from({length:CONFIG.frames+1},(_,f)=>({frame:f,...sample(f/30)}))});
const defs=Object.entries(registry).map(([id,a])=>`<symbol id="asset-${id}" viewBox="0 0 ${a.width} ${a.height}" preserveAspectRatio="xMidYMid meet"><image href="${path.relative(DEST,path.resolve(ROOT,a.path)).split(path.sep).join('/')}" width="${a.width}" height="${a.height}"/></symbol>`).join('');
const sceneUrl=path.relative(DEST,path.join(DIR,'scene.mjs')).split(path.sep).join('/');
fs.writeFileSync(path.join(DEST,'preview.html'),`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>第05章 · 45秒预览</title><style>body{background:#263342;color:#fff;font:16px system-ui;margin:24px}#stage{max-width:1440px}svg{width:100%;height:auto}input{width:60%}button{padding:8px 18px}</style><h2>第05章 · 执行能力与劳动自主性</h2><p>45秒无声字幕候选；工具调用与劳动决策权分层，片尾匹配06首帧。</p><div id="stage"></div><button id="play">播放 / 暂停</button><input aria-label="章节时间" id="seek" type="range" min="0" max="44.966667" step=".033333" value="0"><span id="time"></span><script type="module">import{sample,draw,svg}from'./${sceneUrl}';const defs=${JSON.stringify(defs)};let t=0,on=false,last=null;const st=document.querySelector('#stage'),seek=document.querySelector('#seek');function show(){st.innerHTML=svg(draw(sample(t)),defs);seek.value=t;document.querySelector('#time').textContent=t.toFixed(2)+' / 45.00s'}document.querySelector('#play').onclick=()=>{if(t>=44.96)t=0;on=!on;last=null};seek.oninput=()=>{on=false;t=+seek.value;show()};function tick(now){if(on&&last!==null){t=Math.min(44.966667,t+(now-last)/1000);if(t>=44.966667)on=false;show()}last=now;requestAnimationFrame(tick)}show();requestAnimationFrame(tick);</script>`);
fs.writeFileSync(path.join(OUT,'index.html'),'<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>第05章 · 完整45秒</title><style>body{margin:24px;background:#263342;color:#FFFDF8;font:18px system-ui}video{width:100%;max-width:1440px}a{color:#A9D9E1}</style><h2>第05章 · 完整45秒无声字幕版</h2><p>多Agent执行 → 组织规则反馈 → 工具调用与决定权分层。45秒无声字幕候选。</p><video controls preload="metadata" poster="../provenance/v01/frame-05.png" src="05-complete-silent-v01.mp4"></video><p><a href="../preview.html">交互时间轴</a> · <a href="../captions/05-v01.srt">SRT字幕</a> · <a href="05-contact-v01.png">分镜联系表</a> · <a href="05-to-06-seam-v01.mp4">05→06接缝</a> · <a href="../../../../scripts/doc/SOURCES.md">完整来源</a></p>');
const sourcePaths=['arts/actions/05/scene.mjs','arts/actions/05/build.mjs','arts/actions/05/package.json','arts/actions/05/provenance/v01/chapter-plan.md','arts/actions/06/scene.mjs','arts/actions/01/keyframes.mjs','arts/actions/01/bundle-camera-v01.json','scripts/final/shot/05.md','scripts/final/shot/04.md','scripts/final/shot/06.md','scripts/style/STYLE_BIBLE.md','scripts/doc/SOURCES.md'];
const inputs=sourcePaths.map(p=>{const dst=path.join(PROV,'source-snapshot',p.replaceAll('/','__'));fs.copyFileSync(path.resolve(ROOT,p),dst);return {path:p,sha256:sha(p),snapshot:rel(dst)}});
inputs.push(...[...new Set([...Object.values(registry).map(a=>a.path),b.assets['room-day'].path])].map(p=>({path:p,sha256:sha(p)})));
json(path.join(PROV,'input-manifest.json'),{config:CONFIG,inputs,registry,toolVersions:{node:process.version,sharp:sharp.versions},externalModelCalls:0,imageGenerationCalls:0,audioGenerationCalls:0});
const verification={status:'stills_ready_pending_visual_review',semanticChecks:{samples:1351,narrationVerbatim:true,characters:156,captionCount:12,captionsEnd:45,decisionOwnerPreserved:true,noAutomaticDecisionRights:true,feedbackOriginOrganization:true,agentNotEmployer:true,noAutomaticAcceptance:true,wholePoseSingleLayer:true,deterministicSamples:true,exitGraphicExactMatch06:true},stills,limitations:['Silent; provisional subtitle timing.','04 animation absent; incoming seam not tested.']};
json(path.join(PROV,'verification.json'),verification);console.log(JSON.stringify({stills:stills.length,stateChecks:1351,video}));
if(!video)process.exit(0);
const args=['-hide_banner','-loglevel','warning','-nostdin','-y','-f','rawvideo','-pixel_format','rgb24','-video_size','1920x1080','-framerate','30','-i','pipe:0','-an','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-frames:v','1350','-movflags','+faststart',partial];
const enc=spawn('ffmpeg',args,{stdio:['pipe','ignore','pipe']}),done=once(enc,'close');let log='';enc.stderr.on('data',d=>log+=d);enc.stdin.on('error',()=>{});const pending=new Map(),start=Date.now();
try{for(let f=0;f<1350;f++){for(let n=f;n<Math.min(1350,f+4);n++)if(!pending.has(n))pending.set(n,raster(n/30));const buf=await pending.get(f);pending.delete(f);if(!enc.stdin.write(buf))await once(enc.stdin,'drain');if(f%150===0||f===1739)console.log(JSON.stringify({frame:f+1,total:1350,elapsedSeconds:+((Date.now()-start)/1000).toFixed(1)}));}enc.stdin.end();const[code]=await done;assert.equal(code,0,log);}catch(e){enc.stdin.destroy();enc.kill('SIGTERM');throw e;}finally{fs.writeFileSync(path.join(PROV,'ffmpeg.log'),log);}
const run=(cmd,args)=>{const r=spawnSync(cmd,args,{encoding:'utf8',maxBuffer:16*1024*1024});assert.equal(r.status,0,r.stderr);return r};
const info=JSON.parse(run('ffprobe',['-v','error','-show_format','-show_streams','-of','json',partial]).stdout),v=info.streams[0];
assert.equal(info.streams.length,1);assert.equal(v.width,1920);assert.equal(v.height,1080);assert.equal(v.r_frame_rate,'30/1');assert.equal(+v.nb_frames,1350);assert.equal(+info.format.duration,45);
run('ffmpeg',['-v','error','-i',partial,'-f','null','-']);fs.renameSync(partial,final);json(path.join(OUT,'05-v01-ffprobe.json'),info);
const pts=run('ffprobe',['-v','error','-select_streams','v:0','-show_entries','frame=best_effort_timestamp_time','-of','csv=p=0',final]).stdout.split('\n').map(parseFloat).filter(Number.isFinite);assert.equal(pts.length,1350);for(let i=1;i<pts.length;i++)assert(Math.abs(pts[i]-pts[i-1]-1/30)<.00001);
const black=run('ffmpeg',['-hide_banner','-i',final,'-vf','blackdetect=d=0.03:pix_th=0.10','-an','-f','null','-']);assert(!black.stderr.includes('black_start:'));fs.writeFileSync(path.join(PROV,'decode-and-blackdetect.log'),black.stderr);
for(let i=0;i<QA.length;i++)run('ffmpeg',['-v','error','-y','-ss',String(QA[i]),'-i',final,'-frames:v','1',path.join(PROV,'encoded-'+String(i).padStart(2,'0')+'.png')]);
const output={path:rel(final),sha256:sha(rel(final)),bytes:fs.statSync(final).size};
let seam=null;const next=path.resolve(ROOT,'arts/actions/06/exports/06-complete-silent-v01.mp4');
if(fs.existsSync(next)){
 const seamPath=path.join(OUT,'05-to-06-seam-v01.mp4');assert(!fs.existsSync(seamPath),'Seam output exists');
 const seamArgs=['-v','error','-y','-i',final,'-i',next,'-filter_complex','[0:v]trim=start_frame=1290:end_frame=1350,setpts=PTS-STARTPTS[a];[1:v]trim=start_frame=0:end_frame=60,setpts=PTS-STARTPTS[b];[a][b]concat=n=2:v=1:a=0[v]','-map','[v]','-an','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-r','30','-frames:v','120','-movflags','+faststart',seamPath];
 run('ffmpeg',seamArgs);run('ffmpeg',['-v','error','-i',seamPath,'-f','null','-']);
 const si=JSON.parse(run('ffprobe',['-v','error','-show_format','-show_streams','-of','json',seamPath]).stdout);assert.equal(+si.streams[0].nb_frames,120);assert.equal(+si.format.duration,4);
 seam={path:rel(seamPath),sha256:sha(rel(seamPath)),bytes:fs.statSync(seamPath).size,fromVideoSha256:output.sha256,toVideoPath:rel(next),toVideoSha256:sha(rel(next)),commands:['ffmpeg',...seamArgs],fullDecode:true};
 for(const [name,time]of [['before',1.966667],['after',2]])run('ffmpeg',['-v','error','-y','-ss',String(time),'-i',seamPath,'-frames:v','1',path.join(PROV,'seam-'+name+'.png')]);
}
json(path.join(OUT,'05-v01-manifest.json'),{config:CONFIG,inputs,output,seam,registry,commands:[['ffmpeg',...args]],tools:{node:process.version,sharp:sharp.versions,ffmpeg:run('ffmpeg',['-version']).stdout.split('\n')[0]},externalModelCalls:0,imageGenerationCalls:0,audioGenerationCalls:0});
verification.status='rendered_pending_visual_review';verification.mediaChecks={fullDecode:true,monotonic30fpsTimestamps:true,blackFrames:false,...CONFIG};verification.output=output;verification.seam=seam;json(path.join(PROV,'verification.json'),verification);
console.log(JSON.stringify({complete:true,output,duration:45,frames:1350,seam:seam?.path||null}));
