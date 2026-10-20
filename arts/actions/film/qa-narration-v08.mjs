import fs from 'node:fs';import path from 'node:path';import {createRequire} from 'node:module';import {fileURLToPath} from 'node:url';import {spawnSync} from 'node:child_process';
import {createRenderer,GLOBAL_CUES} from './scenes.mjs';import {CHAPTERS} from './timeline.mjs';
const DIR=path.dirname(fileURLToPath(import.meta.url)),ROOT=path.resolve(DIR,'../../..'),OUT=path.join(DIR,'provenance/narration-v08');
const sharp=createRequire(import.meta.url)('/Users/alan671/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');sharp.concurrency(1);sharp.cache({memory:40,files:0,items:20});
const assets=JSON.parse(fs.readFileSync(path.join(DIR,'assets-v01.json'))).assets,uris=new Map();
for(const a of assets){let b=fs.readFileSync(path.join(ROOT,a.path));if(a.format!=='svg')b=await sharp(b).resize({width:Math.min(a.width,a.kind==='头像'?320:1600),withoutEnlargement:true}).png().toBuffer();uris.set(a.path,`data:image/${a.format==='svg'?'svg+xml':'png'};base64,${b.toString('base64')}`);}
const render=createRenderer(JSON.parse(fs.readFileSync(path.join(DIR,'bundle-v01.json'))),p=>uris.get(p));
const chapterFilter=process.argv.find(x=>x.startsWith('--chapter='))?.split('=')[1];
const selected=[...new Set([...GLOBAL_CUES.map(c=>Math.floor((c.startMs+c.endMs)*.015)),...CHAPTERS.slice(1).flatMap(c=>[c.startFrame-1,c.startFrame]),5310+Math.round(19.8*30),7980,8399])].sort((a,b)=>a-b),stills=[];
for(const f of selected){const p=`frame-${String(f).padStart(4,'0')}.png`,r=render(f);if(!chapterFilter||r.chapter.id===chapterFilter)await sharp(Buffer.from(r.svg)).png().toFile(path.join(OUT,p));stills.push({frame:f,chapter:r.chapter.id,time:r.localTime,caption:r.cue?.text??null,file:p});}
for(const [name,filter] of [['captions',s=>s.caption],['seams',s=>CHAPTERS.slice(1).some(c=>s.frame===c.startFrame||s.frame===c.startFrame-1)]]){
 const rows=stills.filter(filter),columns=name==='seams'?2:3,cells=[];
 for(let i=0;i<rows.length;i++){const r=rows[i],left=i%columns*640,top=Math.floor(i/columns)*390;cells.push({input:await sharp(path.join(OUT,r.file)).resize(640,360).toBuffer(),left,top:top+30});cells.push({input:Buffer.from(`<svg width="640" height="30"><text x="12" y="22" fill="#fff" font-family="sans-serif" font-size="17">${r.chapter} / ${r.time.toFixed(2)}s / ${r.frame}</text></svg>`),left,top});}
 await sharp({create:{width:640*columns,height:390*Math.ceil(rows.length/columns),channels:3,background:'#13212c'}}).composite(cells).png().toFile(path.join(OUT,name+'-contact.png'));
}
fs.writeFileSync(path.join(OUT,'frames.json'),JSON.stringify(stills,null,2)+'\n');console.log(JSON.stringify({stills:stills.length}));
const ffmpeg='/opt/homebrew/bin/ffmpeg',clips=chapterFilter?JSON.parse(fs.readFileSync(path.join(OUT,'media-qa.json'))).clips:[];
for(const c of CHAPTERS.slice(1).filter(c=>!chapterFilter||String(Number(c.id)-1).padStart(2,'0')===chapterFilter||c.id===chapterFilter)){
 const start=c.startFrame-15,raw=[];
 for(let f=start;f<start+45;f++)raw.push(await sharp(Buffer.from(render(f).svg)).resize(960,540).flatten({background:'#f6f1e7'}).removeAlpha().raw().toBuffer());
 const p=path.join(OUT,`seam-${Number(c.id)-1}-to-${c.id}.mp4`),r=spawnSync(ffmpeg,['-hide_banner','-loglevel','error','-f','rawvideo','-pixel_format','rgb24','-video_size','960x540','-framerate','30','-i','pipe:0','-an','-c:v','libx264','-preset','veryfast','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart','-y',p],{input:Buffer.concat(raw),maxBuffer:1024*1024});if(r.status!==0)throw Error(r.stderr.toString());
 const decoded=spawnSync(ffmpeg,['-v','error','-i',p,'-f','null','-'],{encoding:'utf8'});if(decoded.status!==0)throw Error(decoded.stderr);const prior=clips.findIndex(x=>x.file===path.basename(p));if(prior>=0)clips.splice(prior,1);clips.push({file:path.basename(p),frames:45,duration:1.5,decodePassed:true});console.log(JSON.stringify({seam:c.id}));
}
fs.writeFileSync(path.join(OUT,'media-qa.json'),JSON.stringify({stills:stills.length,clips,fullVideoBaked:false,audio:false},null,2)+'\n');
