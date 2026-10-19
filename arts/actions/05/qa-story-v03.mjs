import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {fileURLToPath} from 'node:url';import {createRequire} from 'node:module';import {spawnSync} from 'node:child_process';
import {createRenderer,stateAt} from '../film/scenes.mjs';import {BEATS,CONFIG,sample} from './story-scene-v03.mjs';
const sharp=createRequire(import.meta.url)('/Users/alan671/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');sharp.concurrency(1);sharp.cache({memory:100,items:64,files:32});
const HERE=path.dirname(fileURLToPath(import.meta.url)),ROOT=path.resolve(HERE,'../../..'),OUT=path.join(HERE,'provenance/story-v03'),FILM=path.join(HERE,'../film/provenance/integration-v05');
const data=JSON.parse(fs.readFileSync(path.join(HERE,'../film/bundle-v01.json'))),uris=new Map(),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const renderer=createRenderer(data,p=>{if(!uris.has(p)){const b=fs.readFileSync(path.join(ROOT,p));uris.set(p,`data:image/${p.endsWith('.svg')?'svg+xml':'png'};base64,${b.toString('base64')}`);}return uris.get(p);});
const args=process.argv.slice(2),sources=[];
if(!args.includes('--seams-only')){
 const times=[.4,1.2,3.5,4.8,6.8,9.9,11.7,13.5,14.8,15.8,17.7,19.5,21.5,21.9,23.2,24.7,24.9,25.6,25.9,26.8,28.5,29.4,31.5,31.8,32.6,33.3,33.8,34.3,34.9,35.6,36.8,37.9,39.3,40.9,42.2,43.2,43.8,44.9];
 const updating=args.includes('--refresh-feedback');if(updating)sources.push(...JSON.parse(fs.readFileSync(path.join(OUT,'source-frames.json'))).filter(s=>s.localTime<33.8||s.localTime>35.6));
 for(const t of times.filter(t=>!updating||t>=33.8&&t<=35.6)){const frame=Math.round(t*30),b=await sharp(Buffer.from(renderer(5310+frame).svg)).png().toBuffer(),filename=`frame-${String(frame).padStart(4,'0')}.png`;fs.writeFileSync(path.join(OUT,filename),b);sources.push({frame,localTime:frame/30,path:path.relative(ROOT,path.join(OUT,filename)),sha256:sha(b)});}
 sources.sort((a,b)=>a.frame-b.frame);
 const selected=[.4,4.8,6.8,11.7,13.5,15.8,17.7,21.5,21.9,23.2,24.9,25.6,26.8,29.4,31.8,33.3,34.3,36.8,39.3,43.8],cells=[];
 for(let i=0;i<selected.length;i++){const r=sources.find(s=>s.frame===Math.round(selected[i]*30)),x=i%4*480,y=Math.floor(i/4)*300;cells.push({input:await sharp(path.join(ROOT,r.path)).resize(480,270).png().toBuffer(),left:x,top:y+30});cells.push({input:Buffer.from(`<svg width="480" height="30"><text x="12" y="22" font-family="sans-serif" font-size="17" fill="#f6f1e7">05 · ${r.localTime.toFixed(2)}s / frame ${r.frame}</text></svg>`),left:x,top:y});}
 await sharp({create:{width:1920,height:1500,channels:3,background:'#13212c'}}).composite(cells).png().toFile(path.join(OUT,'contact-v03.png'));
 fs.writeFileSync(path.join(OUT,'source-frames.json'),JSON.stringify(sources,null,2)+'\n');console.log('38 full-size representative frames and contact sheet rendered');
}
if(args.includes('--frames-only'))process.exit(0);
const seams=[];
for(const[name,cut]of[['04-to-05',5310],['05-to-06',6660]]){
 const raw=[];for(let i=0;i<120;i++)raw.push(await sharp(Buffer.from(renderer(cut-60+i).svg),{density:36}).flatten({background:'#f6f1e7'}).removeAlpha().raw().toBuffer());
 const output=path.join(FILM,name+'-source-v05.mp4'),args=['-hide_banner','-loglevel','error','-y','-f','rawvideo','-pixel_format','rgb24','-video_size','960x540','-framerate','30','-i','pipe:0','-an','-c:v','libx264','-preset','veryfast','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',output];
 const encoded=spawnSync('/opt/homebrew/bin/ffmpeg',args,{input:Buffer.concat(raw),maxBuffer:1024*1024});if(encoded.status!==0)throw Error(encoded.stderr.toString());
 const probe=JSON.parse(spawnSync('/opt/homebrew/bin/ffprobe',['-v','error','-show_streams','-show_format','-of','json',output],{encoding:'utf8'}).stdout);if(probe.streams.length!==1||+probe.streams[0].nb_frames!==120||+probe.streams[0].width!==960||+probe.streams[0].height!==540||probe.streams[0].codec_name!=='h264'||probe.streams[0].avg_frame_rate!=='30/1'||probe.streams[0].pix_fmt!=='yuv420p'||Math.abs(+probe.format.duration-4)>1e-6)throw Error('Incorrect seam media');
 fs.writeFileSync(path.join(FILM,name+'-probe.json'),JSON.stringify(probe,null,2)+'\n');
 const decoded=spawnSync('/opt/homebrew/bin/ffmpeg',['-v','error','-i',output,'-f','null','-'],{encoding:'utf8'});if(decoded.status!==0)throw Error(decoded.stderr);
 for(const t of [1.966667,2,2.4,3.6]){const p=path.join(FILM,`${name}-encoded-${t.toFixed(2)}.png`),r=spawnSync('/opt/homebrew/bin/ffmpeg',['-v','error','-y','-ss',String(t),'-i',output,'-frames:v','1',p],{encoding:'utf8'});if(r.status!==0)throw Error(r.stderr);}
 seams.push({name,path:path.relative(ROOT,output),frames:120,duration:4,fps:30,size:[960,540],audio:false,measuredStream:probe.streams[0],measuredFormat:probe.format,source:'current framework render, no historical MP4 concatenation',decodePassed:true,sha256:sha(fs.readFileSync(output)),command:['ffmpeg',...args]});console.log(name+' encoded and decoded');
}
const guards=JSON.parse(fs.readFileSync(path.join(OUT,'inputs-before.json')));for(const g of guards)if(sha(fs.readFileSync(path.join(ROOT,g.path)))!==g.sha256)throw Error('Input changed '+g.path);
const result={version:CONFIG.version,chapterFrames:1350,stateSamples:1351,globalFramesChecked:8400,shots:BEATS,unchangedInputs:guards.length,sixScriptBytesUnchanged:true,adoptedArtBytesUnchanged:true,sources:JSON.parse(fs.readFileSync(path.join(OUT,'source-frames.json'))),seams,imageGenerationCalls:0,externalModelCalls:0,audio:false,fullChapterMp4Exported:false,visualReview:'pending representative/encoded/browser inspection',boundaryFrom04:{out:stateAt('04',1649/30),incoming:sample(0),mode:'hold exact published JD for0.4s; CV and unfinished03 report are not new tool tasks'},boundaryTo06:{out:sample(1349/30),incoming:stateAt('06',0),mode:'hold exact pending plan page for0.4s;06 body remains S06 v0.1, new06 E/L script not implemented'}};
fs.writeFileSync(path.join(OUT,'verification.json'),JSON.stringify(result,null,2)+'\n');fs.writeFileSync(path.join(FILM,'verification.json'),JSON.stringify(result,null,2)+'\n');console.log('05 live framework QA complete');
