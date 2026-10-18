// Representative frames and source-rendered seam previews, using the same adapter as the UI.
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {fileURLToPath} from 'node:url';import {createRequire} from 'node:module';import {spawnSync} from 'node:child_process';
import {createRenderer,stateAt} from './scenes.mjs';import {CHAPTERS,FPS,TOTAL_FRAMES} from './timeline.mjs';
const DIR=path.dirname(fileURLToPath(import.meta.url)),ROOT=path.resolve(DIR,'../../..'),OUT=path.join(DIR,'provenance/integration-v01');
const sharp=createRequire(import.meta.url)('sharp');sharp.concurrency(1);sharp.cache({memory:100,files:32,items:64});
const assets=JSON.parse(fs.readFileSync(path.join(DIR,'assets-v01.json'))).assets,uris=new Map();
for(const a of assets){let buf=fs.readFileSync(path.join(ROOT,a.path));if(a.format!=='svg'){const max=a.kind==='头像'?350:a.kind==='完整姿态'?1100:1920;buf=await sharp(buf).resize({width:Math.min(max,a.width),withoutEnlargement:true}).png().toBuffer();}uris.set(a.path,`data:image/${a.format==='svg'?'svg+xml':'png'};base64,${buf.toString('base64')}`);}
const render=createRenderer(JSON.parse(fs.readFileSync(path.join(DIR,'bundle-v01.json'))),p=>uris.get(p));
const sha=buf=>crypto.createHash('sha256').update(buf).digest('hex'),frames=[];
const selected=new Set(CHAPTERS.flatMap(c=>[c.startFrame,c.startFrame+Math.round(c.frames*.5),c.endFrame-1]));
for(const c of CHAPTERS.slice(1))for(const delta of [-30,-1,0,30])selected.add(c.startFrame+delta);
for(const f of [...selected].sort((a,b)=>a-b)){
 const r=render(f),p=`frame-${String(f).padStart(4,'0')}.png`,buf=await sharp(Buffer.from(r.svg)).png().toBuffer();fs.writeFileSync(path.join(OUT,p),buf);frames.push({frame:f,chapter:r.chapter.id,localTime:r.localTime,path:'arts/actions/film/provenance/integration-v01/'+p,sha256:sha(buf)});
}
const montage=async(list,name,columns)=>{
 const cells=[];for(let i=0;i<list.length;i++){const r=list[i],x=(i%columns)*480,y=Math.floor(i/columns)*300;const thumb=await sharp(path.join(ROOT,r.path)).resize(480,270).png().toBuffer();cells.push({input:thumb,left:x,top:y+30});const label=Buffer.from(`<svg width="480" height="30"><text x="12" y="22" font-family="sans-serif" font-size="17" fill="#F6F1E7">${r.chapter} · ${r.localTime.toFixed(2)}s / frame ${r.frame}</text></svg>`);cells.push({input:label,left:x,top:y});}
 await sharp({create:{width:480*columns,height:300*Math.ceil(list.length/columns),channels:3,background:'#13212c'}}).composite(cells).png().toFile(path.join(DIR,name));
};
await montage(CHAPTERS.flatMap(c=>[c.startFrame,c.startFrame+Math.round(c.frames*.5),c.endFrame-1]).map(f=>frames.find(x=>x.frame===f)),'contact-v01.png',3);
await montage(CHAPTERS.slice(1).flatMap(c=>[c.startFrame-1,c.startFrame]).map(f=>frames.find(x=>x.frame===f)),'seams-v01.png',2);
const boundaries=[];
for(const c of CHAPTERS.slice(1)){
 const before=CHAPTERS[Number(c.id)-2],from=c.startFrame-30,count=60,out=path.join(OUT,`${before.id}-to-${c.id}-source-seam-v01.mp4`),raw=[];
 for(let n=0;n<count;n++)raw.push(await sharp(Buffer.from(render(from+n).svg)).resize(960,540).flatten({background:'#F6F1E7'}).removeAlpha().raw().toBuffer());
 const r=spawnSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','rawvideo','-pixel_format','rgb24','-video_size','960x540','-framerate','30','-i','pipe:0','-an','-c:v','libx264','-preset','veryfast','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',out],{input:Buffer.concat(raw),maxBuffer:1024*1024});if(r.status!==0)throw Error(r.stderr.toString());
 const probe=JSON.parse(spawnSync('ffprobe',['-v','error','-show_streams','-show_format','-of','json',out],{encoding:'utf8'}).stdout);if(probe.streams.length!==1||+probe.streams[0].nb_frames!==60)throw Error('Bad seam output');
 boundaries.push({from:before.id,to:c.id,startFrame:c.startFrame,mode:'authored incoming scene; no frame overlap or added time',preview:path.relative(ROOT,out),previewFrames:60,previewSize:[960,540],source:'unified adapter render, not a concat of historical MP4s',stateBefore:stateAt(before.id,(before.frames-1)/FPS),stateAfter:stateAt(c.id,0),semanticNote:c.id==='03'?'S03 tasks are a distinct explanatory scenario; inherited01/02 tasks are not reset':c.id==='05'?'Organization standards continue as a concept; S04-X is not reclassified into05 tasks':null,visualReview:'pending'});
 console.log(JSON.stringify({seam:`${before.id}→${c.id}`,frames:60}));
}
fs.writeFileSync(path.join(OUT,'verification.json'),JSON.stringify({date:'2026-10-18',version:'FILM_PREVIEW v0.1',framesTested:TOTAL_FRAMES,sourceFrames:frames,boundaries,allChapterSourcesPreserved:true,audio:false,externalModelCalls:0,note:'Representative raster QA and five encoded source-rendered seam previews; not a full-film MP4.'},null,2)+'\n');
console.log(JSON.stringify({sourceFrames:frames.length,seams:boundaries.length}));
