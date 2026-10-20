// Native1080p bake of the current six-chapter renderer. No historical chapter MP4 is used.
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';import {createRequire} from 'node:module';import {spawn,spawnSync} from 'node:child_process';import {once} from 'node:events';
import {createBakeAssets} from './bake-assets-v09.mjs';
import {createRenderer,GLOBAL_CUES,GLOBAL_BEATS} from './scenes.mjs';import {CHAPTERS,TOTAL_FRAMES,FPS,DURATION} from './timeline.mjs';import {CAPTION_STYLE} from './captions.mjs';
const HERE=path.dirname(fileURLToPath(import.meta.url)),ROOT=path.resolve(HERE,'../../..'),PROV=path.join(HERE,'provenance/bake-v09'),OUT=path.join(HERE,'exports');
const sharp=createRequire(import.meta.url)('/Users/alan671/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');sharp.concurrency(1);sharp.cache({memory:32,files:0,items:32});
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),read=p=>fs.readFileSync(path.resolve(ROOT,p)),save=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n');
for(const d of [OUT,PROV])fs.mkdirSync(d,{recursive:true});
const guardFile=path.join(PROV,'protected-inputs.json');
if(!fs.existsSync(guardFile)){
 const src=JSON.parse(read('arts/actions/film/provenance/motion-v09/inputs.json'));
 const files=[...src.source,...src.framework].map(x=>x.path).concat(JSON.parse(read('arts/actions/film/assets-v01.json')).assets.map(x=>x.path),['arts/actions/film/captions-v01.json','arts/actions/film/captions-v01.srt','arts/actions/film/bundle-v01.json','arts/actions/film/assets-v01.json','arts/actions/film/bake-v09.mjs','arts/actions/film/bake-assets-v09.mjs','arts/actions/film/exports/film-complete-captioned-silent-v07.mp4']);
 save(guardFile,[...new Set(files)].map(p=>({path:p,sha256:sha(read(p))})));
}
const guards=JSON.parse(fs.readFileSync(guardFile));
function checkGuards(){for(const g of guards)assert.equal(sha(read(g.path)),g.sha256,g.path);}
checkGuards();
const data=JSON.parse(read('arts/actions/film/bundle-v01.json')),inventory=JSON.parse(read('arts/actions/film/assets-v01.json')).assets;
assert.equal(data.version,'FILM_PREVIEW v0.9');assert.equal(GLOBAL_CUES.length,54);
const embed=await createBakeAssets(inventory,ROOT,sharp),keys=createRenderer(data,p=>'/'+p),cache=new Map();let rendered=0,hits=0;
function raster(f){
 // data-time is inspection metadata on02, not paint. No visual attribute is removed from actual render.
 const svg=keys(f).svg,key=sha(svg.replace(/ data-time="[^"]*"/g,''));
 if(cache.has(key)){hits++;const result=cache.get(key);cache.delete(key);cache.set(key,result);return result;}
 const result=sharp(Buffer.from(embed(svg))).flatten({background:'#F6F1E7'}).removeAlpha().raw().toBuffer();rendered++;cache.set(key,result);if(cache.size>8)cache.delete(cache.keys().next().value);return result;
}
const raw={width:1920,height:1080,channels:3},samples=[30,320,1500,2120,2680,3200,3800,4820,5600,6280,7200,7710],stills=[];
for(const f of samples){const p=path.join(PROV,`source-${String(f).padStart(4,'0')}.png`);await sharp(await raster(f),{raw}).png().toFile(p);stills.push({frame:f,path:path.relative(ROOT,p),sha256:sha(fs.readFileSync(p))});}
const cells=[];for(let i=0;i<stills.length;i++){const x=i%4*480,y=Math.floor(i/4)*300;cells.push({input:await sharp(path.join(ROOT,stills[i].path)).resize(480,270).png().toBuffer(),left:x,top:y+30});cells.push({input:Buffer.from(`<svg width="480" height="30"><text x="12" y="22" font-family="sans-serif" font-size="17" fill="#f6f1e7">chapter${CHAPTERS.find(c=>stills[i].frame<c.endFrame).id} / frame${stills[i].frame}</text></svg>`),left:x,top:y});}
await sharp({create:{width:1920,height:900,channels:3,background:'#13212c'}}).composite(cells).png().toFile(path.join(PROV,'source-contact.png'));save(path.join(PROV,'source-stills.json'),stills);
console.log(JSON.stringify({stage:'samples-ready',samples:stills.length}));
if(process.argv.includes('--samples-only'))process.exit(0);
const final=path.join(OUT,'film-complete-captioned-silent-v09.mp4'),partial=final.replace('.mp4','.part.mp4');assert(!fs.existsSync(final)&&!fs.existsSync(partial),'Output exists; preserve the existing bake and choose a new version.');
const sourceMeta=JSON.parse(read('arts/actions/film/provenance/motion-v09/inputs.json'));
const dependencies=[...sourceMeta.source,...sourceMeta.framework].map(s=>s.path).concat(['arts/actions/film/bake-v09.mjs','arts/actions/film/bake-assets-v09.mjs','arts/actions/film/render-assets.mjs','arts/actions/film/render-assets.test.mjs','arts/actions/film/motion-v09.test.mjs','arts/actions/film/captions.test.mjs','arts/actions/film/captions-v01.json']);
save(path.join(PROV,'bake-inputs.json'),{version:data.version,date:'2026-10-20',config:{width:1920,height:1080,fps:FPS,frames:TOTAL_FRAMES,duration:DURATION,audio:false},captionStyle:CAPTION_STYLE,captions:GLOBAL_CUES.length,assets:inventory.length,source:[...new Set(dependencies)].map(p=>({path:p,sha256:sha(read(p))})),assetPolicy:'Full-resolution originals; adopted WebP decoded losslessly to PNG for SVG. No camera or caption changes; motion applied before raster expansion.',font:{path:'/System/Library/Fonts/Hiragino Sans GB.ttc',sha256:sha(fs.readFileSync('/System/Library/Fonts/Hiragino Sans GB.ttc'))},tools:{node:process.version,sharp:sharp.versions},externalModelCalls:0});
const args=['-hide_banner','-loglevel','warning','-nostdin','-f','rawvideo','-pixel_format','rgb24','-video_size','1920x1080','-framerate',String(FPS),'-i','pipe:0','-an','-c:v','libx264','-preset','medium','-crf','18','-threads','2','-pix_fmt','yuv420p','-frames:v',String(TOTAL_FRAMES),'-video_track_timescale','15360','-map_metadata','-1','-movflags','+faststart',partial];
const enc=spawn('/opt/homebrew/bin/ffmpeg',args,{stdio:['pipe','ignore','pipe']}),done=once(enc,'close');let log='',encoderError=null;enc.stderr.on('data',d=>log+=d);enc.stdin.on('error',e=>encoderError=e);const pending=new Map(),started=Date.now(),progress=[];
try{
 for(let f=0;f<TOTAL_FRAMES;f++){
  for(let n=f;n<Math.min(TOTAL_FRAMES,f+3);n++)if(!pending.has(n))pending.set(n,raster(n));
  const buf=await pending.get(f);pending.delete(f);assert.equal(buf.length,1920*1080*3);if(encoderError)throw encoderError;if(!enc.stdin.write(buf))await once(enc.stdin,'drain');
  if(f%150===0||f===TOTAL_FRAMES-1){const p={frame:f+1,total:TOTAL_FRAMES,chapter:CHAPTERS.find(c=>f<c.endFrame).id,elapsedSeconds:+((Date.now()-started)/1000).toFixed(1),uniqueRasters:rendered,cacheHits:hits};progress.push(p);save(path.join(PROV,'progress.json'),p);console.log(JSON.stringify(p));}
 }
 enc.stdin.end();const[code]=await done;assert.equal(code,0,log);
}catch(e){enc.stdin.destroy();enc.kill('SIGTERM');throw e;}finally{fs.writeFileSync(path.join(PROV,'ffmpeg-encode.log'),log);save(path.join(PROV,'render-progress.json'),progress);}
checkGuards();
const run=(cmd,a)=>{const r=spawnSync(cmd,a,{encoding:'utf8',maxBuffer:32*1024*1024});assert.equal(r.status,0,r.stderr);return r;};
const probe=JSON.parse(run('/opt/homebrew/bin/ffprobe',['-v','error','-show_streams','-show_format','-of','json',partial]).stdout),v=probe.streams[0];assert.equal(probe.streams.length,1);assert.equal(v.codec_type,'video');assert.equal(v.codec_name,'h264');assert.equal(+v.width,1920);assert.equal(+v.height,1080);assert.equal(+v.nb_frames,8400);assert.equal(v.avg_frame_rate,'30/1');assert.equal(v.pix_fmt,'yuv420p');assert.equal(+probe.format.duration,280);
const selected=[...new Set([...GLOBAL_CUES.map(c=>Math.floor((c.startMs+c.endMs)/2000*30)),...JSON.parse(read('arts/actions/film/provenance/motion-v09/clips.json')).map(c=>Math.floor((c.firstFrame+c.lastFrame)/2)),...CHAPTERS.slice(1).flatMap(c=>[c.startFrame-1,c.startFrame]),0,7979,7980,8189,8190,8399])].sort((a,b)=>a-b);
const expr=selected.map(f=>`eq(n\\,${f})`).join('+'),decoded=run('/opt/homebrew/bin/ffmpeg',['-hide_banner','-loglevel','info','-i',partial,'-vf',`blackdetect=d=0.03:pix_th=0.10,select=${expr}`,'-fps_mode','vfr','-threads','2',path.join(PROV,'encoded-%03d.png')]);assert(!decoded.stderr.includes('black_start:'),'Unexpected black frame detected');fs.writeFileSync(path.join(PROV,'decode-blackdetect.log'),decoded.stderr);
const timestamps=JSON.parse(run('/opt/homebrew/bin/ffprobe',['-v','error','-select_streams','v:0','-show_packets','-show_entries','packet=pts_time,duration_time','-of','json',partial]).stdout).packets;assert.equal(timestamps.length,8400);const sorted=timestamps.map(p=>+p.pts_time).sort((a,b)=>a-b);for(let i=0;i<sorted.length;i++)assert(Math.abs(sorted[i]-i/30)<.000002);for(const p of timestamps)assert(Math.abs(+p.duration_time-1/30)<.000002);
const encoded=selected.map((f,i)=>{const p=path.join(PROV,`encoded-${String(i+1).padStart(3,'0')}.png`);assert(fs.existsSync(p));return {frame:f,time:f/30,path:path.relative(ROOT,p),sha256:sha(fs.readFileSync(p))};});
save(path.join(PROV,'encoded-frames.json'),encoded);save(path.join(PROV,'ffprobe.json'),probe);fs.renameSync(partial,final);
const output={path:path.relative(ROOT,final),bytes:fs.statSync(final).size,sha256:sha(fs.readFileSync(final))};save(path.join(OUT,'film-complete-captioned-silent-v09-manifest.json'),{version:'FILM_BAKE v0.9',sourceVersion:data.version,output,chapters:CHAPTERS,captions:GLOBAL_CUES.length,beats:GLOBAL_BEATS.length,probe,frames:8400,dimensions:[1920,1080],fps:30,duration:280,audio:false,decodePassed:true,blackFrames:false,continuousPresentationTimestamps:true,encodedFrameEvidence:encoded,command:['ffmpeg',...args],renderSeconds:(Date.now()-started)/1000,uniqueRasters:rendered,cacheHits:hits,protectedInputs:guards.length,externalModelCalls:0,captionCharacters:994,motionFamilies:41,visualReview:'pending encoded and browser inspection'});
console.log(JSON.stringify({stage:'bake-complete',...output,encodedQAFrames:encoded.length,seconds:(Date.now()-started)/1000}));
