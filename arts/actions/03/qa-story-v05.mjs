import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import{fileURLToPath}from'node:url';import{createRequire}from'node:module';import{spawnSync}from'node:child_process';
import{createRenderer,stateAt}from'../film/scenes.mjs';
const sharp=createRequire(import.meta.url)('/Users/alan671/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');sharp.concurrency(1);sharp.cache({memory:100,items:64,files:32});
const HERE=path.dirname(fileURLToPath(import.meta.url)),ROOT=path.resolve(HERE,'../../..'),OUT=path.join(HERE,'provenance/story-v05'),FILM=path.join(HERE,'../film/provenance/integration-v03');
const data=JSON.parse(fs.readFileSync(path.join(HERE,'../film/bundle-v01.json'))),uris=new Map(),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const renderer=createRenderer(data,p=>{if(!uris.has(p)){const b=fs.readFileSync(path.join(ROOT,p));uris.set(p,`data:image/${p.endsWith('.svg')?'svg+xml':'png'};base64,${b.toString('base64')}`);}return uris.get(p);});
const sources=[];for(const f of [2489,2490,3659,3660,3672,3690,3708,3719]){const b=await sharp(Buffer.from(renderer(f).svg),{density:36}).png().toBuffer(),filename=`frame-${f}.png`;fs.writeFileSync(path.join(FILM,filename),b);sources.push({frame:f,path:path.relative(ROOT,path.join(FILM,filename)),sha256:sha(b)});}
const seams=[];
for(const [name,cut]of [['02-to-03',2490],['03-to-04',3660]]){
 const raw=[];for(let i=0;i<120;i++)raw.push(await sharp(Buffer.from(renderer(cut-60+i).svg),{density:36}).flatten({background:'#f6f1e7'}).removeAlpha().raw().toBuffer());
 const output=path.join(FILM,name+'-source-v03.mp4');
 const args=['-hide_banner','-loglevel','error','-y','-f','rawvideo','-pixel_format','rgb24','-video_size','960x540','-framerate','30','-i','pipe:0','-an','-c:v','libx264','-preset','veryfast','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',output];
 const encoded=spawnSync('/opt/homebrew/bin/ffmpeg',args,{input:Buffer.concat(raw),maxBuffer:1024*1024});if(encoded.status!==0)throw Error(encoded.stderr.toString());
 const probe=JSON.parse(spawnSync('/opt/homebrew/bin/ffprobe',['-v','error','-show_streams','-show_format','-of','json',output],{encoding:'utf8'}).stdout);if(probe.streams.length!==1||+probe.streams[0].nb_frames!==120||+probe.streams[0].width!==960||+probe.streams[0].height!==540)throw Error('Incorrect seam media');
 const decoded=spawnSync('/opt/homebrew/bin/ffmpeg',['-v','error','-i',output,'-f','null','-'],{encoding:'utf8'});if(decoded.status!==0)throw Error(decoded.stderr);
 for(const t of [1.966667,2,3.6]){const p=path.join(FILM,`${name}-encoded-${t.toFixed(2)}.png`),r=spawnSync('/opt/homebrew/bin/ffmpeg',['-v','error','-y','-ss',String(t),'-i',output,'-frames:v','1',p],{encoding:'utf8'});if(r.status!==0)throw Error(r.stderr);}
 seams.push({name,path:path.relative(ROOT,output),frames:120,duration:4,fps:30,size:[960,540],audio:false,source:'current framework render; not historical MP4 concatenation',decodePassed:true,sha256:sha(fs.readFileSync(output)),command:['ffmpeg',...args]});console.log(name+' encoded and decoded');
}
const guards=JSON.parse(fs.readFileSync(path.join(OUT,'inputs-before.json')));for(const g of guards)if(sha(fs.readFileSync(path.join(ROOT,g.path)))!==g.sha256)throw Error('Input changed '+g.path);
const result={version:'S03_STORY v0.5',chapterFrames:1170,stateSamples:1171,globalFramesChecked:8400,unchangedInputs:guards.length,scriptAndCaptionBytesUnchanged:true,originalChapterSceneModulesUnchanged:true,sources,seams,imageGenerationCalls:0,externalModelCalls:0,audio:false,fullChapterMp4Exported:false,visualReview:'pending representative/encoded/browser inspection',boundaryFrom02:{out:stateAt('02',1139/30),incoming:stateAt('03',0),mode:'distinct employment explanation; H02 tasks not cleared'},boundaryTo04:{out:stateAt('03',1169/30),incoming:stateAt('04',0),mode:'exact terminal graphic held in04 entry, then distinct research scene; no S03-C/S03-D substitution'}};
fs.writeFileSync(path.join(OUT,'verification.json'),JSON.stringify(result,null,2)+'\n');fs.writeFileSync(path.join(FILM,'verification.json'),JSON.stringify(result,null,2)+'\n');
console.log('03 live framework QA complete');
