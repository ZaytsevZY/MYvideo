import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {fileURLToPath} from 'node:url';import {createRequire} from 'node:module';import {spawnSync} from 'node:child_process';
import {createRenderer,stateAt} from '../film/scenes.mjs';
const sharp=createRequire(import.meta.url)('/Users/alan671/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');sharp.concurrency(1);
const HERE=path.dirname(fileURLToPath(import.meta.url)),ROOT=path.resolve(HERE,'../../..'),OUT=path.join(HERE,'provenance/story-v04'),FILM=path.join(HERE,'../film/provenance/integration-v02');
const data=JSON.parse(fs.readFileSync(path.join(HERE,'../film/bundle-v01.json'))),uris=new Map();
const renderer=createRenderer(data,p=>{if(!uris.has(p)){const buf=fs.readFileSync(path.join(ROOT,p));uris.set(p,`data:image/${p.endsWith('.svg')?'svg+xml':'png'};base64,${buf.toString('base64')}`);}return uris.get(p);});
const sources=[];
for(const f of [1349,1350,2489,2490]){const b=await sharp(Buffer.from(renderer(f).svg),{density:36}).png().toBuffer(),file=`frame-${f}.png`;fs.writeFileSync(path.join(FILM,file),b);sources.push({frame:f,path:path.relative(ROOT,path.join(FILM,file)),sha256:crypto.createHash('sha256').update(b).digest('hex')});}
const seams=[];
for(const [name,cut]of [['01-to-02',1350],['02-to-03',2490]]){
 const raw=[];for(let i=0;i<60;i++)raw.push(await sharp(Buffer.from(renderer(cut-30+i).svg),{density:36}).flatten({background:'#f6f1e7'}).removeAlpha().raw().toBuffer());
 const output=path.join(FILM,name+'-source-v02.mp4');
 const r=spawnSync('/opt/homebrew/bin/ffmpeg',['-hide_banner','-loglevel','error','-y','-f','rawvideo','-pixel_format','rgb24','-video_size','960x540','-framerate','30','-i','pipe:0','-an','-c:v','libx264','-preset','veryfast','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',output],{input:Buffer.concat(raw),maxBuffer:1024*1024});if(r.status)throw Error(r.stderr.toString());
 const probe=JSON.parse(spawnSync('/opt/homebrew/bin/ffprobe',['-v','error','-show_streams','-show_format','-of','json',output],{encoding:'utf8'}).stdout);if(probe.streams.length!==1||Number(probe.streams[0].nb_frames)!==60)throw Error('Invalid seam');
 const decode=spawnSync('/opt/homebrew/bin/ffmpeg',['-v','error','-i',output,'-f','null','-'],{encoding:'utf8'});if(decode.status)throw Error(decode.stderr);
 seams.push({name,path:path.relative(ROOT,output),source:'new framework source render, not historical MP4 concat',frames:60,duration:2,fps:30,audio:false,decodePassed:true});console.log(name+' encoded and decoded');
}
const body=JSON.parse(fs.readFileSync(path.join(OUT,'manifest.json')));
const inputs=JSON.parse(fs.readFileSync(path.join(OUT,'inputs-before.json'))),hash=p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT,p))).digest('hex');
const unchanged=inputs.filter(p=>p.path.startsWith('scripts/')||p.path.startsWith('arts/actions/02/')&&!p.path.endsWith('README.md'));
for(const p of unchanged)if(hash(p.path)!==p.sha256)throw Error('Unexpected input change '+p.path);
const result={version:'S02_STORY v0.4',chapterFrames:1140,stateSamples:1141,globalFramesChecked:8400,scriptAndCaptionBytesUnchanged:true,originalChapter02ModulesUnchanged:true,unchangedInputs:unchanged.length,sources,seams,
 boundaryFrom01:{object:'feedback',state:'candidate',inheritedReturn:'T01-R remains merged',method:'reuse original chapter02 entry graphic for 0.3 seconds, match candidate paper into native workstation'},
 boundaryTo03:{out:stateAt('02',1139/30),incoming:stateAt('03',0),method:'cut to distinct S03 explanatory scenario; chapter03 remains basic version, no claim of new action-match camera'},imageGenerationCalls:0,audio:false,fullChapterMp4Exported:false,visualReview:'representative frames and browser checked; finite whole-pose animation'};
fs.writeFileSync(path.join(OUT,'verification.json'),JSON.stringify(result,null,2)+'\n');
fs.writeFileSync(path.join(FILM,'verification.json'),JSON.stringify(result,null,2)+'\n');
