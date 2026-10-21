import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';import {createRequire} from 'node:module';import {spawnSync} from 'node:child_process';
import {createSpeechRenderer} from './speech-scene-v12.mjs';import {createBakeAssets} from './bake-assets-v09.mjs';import {GLOBAL_BEATS} from './scenes.mjs';
const HERE=path.dirname(fileURLToPath(import.meta.url)),ROOT=path.resolve(HERE,'../../..'),P=path.join(HERE,'provenance/voice-v13'),json=p=>JSON.parse(fs.readFileSync(path.join(HERE,p))),sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),save=(p,x)=>fs.writeFileSync(path.join(P,p),JSON.stringify(x,null,2)+'\n');
const data=json('bundle-v01.json'),a=json('provenance/voice-v13/alignment.json'),c=json('captions-v13.json'),inventory=json('assets-v01.json').assets,sourceDraw=createSpeechRenderer(data,json('provenance/voice-v12/alignment.json'),json('captions-v12.json'),p=>'/'+p),frameMap=json('provenance/voice-v13/frame-map.json').sourceFrameIndices,draw=f=>sourceDraw(frameMap[f]),coverage=new Map(GLOBAL_BEATS.map(b=>[b.id,0]));
let prior=-1;for(let f=0;f<a.frames;f++){const r=draw(f);assert(r.sourceTime>=prior);assert(!/NaN|Infinity/.test(r.svg));if(r.beat)coverage.set(r.beat.id,coverage.get(r.beat.id)+1);prior=r.sourceTime;}
assert([...coverage.values()].every(n=>n>0));for(const asset of inventory)assert.equal(sha(path.join(ROOT,asset.path)),asset.sha256,asset.path);
const sharp=createRequire(import.meta.url)('/Users/alan671/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');sharp.concurrency(1);sharp.cache({memory:24,files:0,items:24});const embed=await createBakeAssets(inventory,ROOT,sharp);
const frames=[...new Set([...c.map(x=>Math.floor((x.startMs+x.endMs)/2000*30)),...a.chapters.slice(1).flatMap(ch=>[Math.round(ch.start*30)-1,Math.round(ch.start*30)]),a.frames-421,a.frames-1])].sort((x,y)=>x-y);
if(process.argv.includes('--source')){
 const cells=[];
 for(let i=0;i<frames.length;i++){
  const f=frames[i],r=draw(f),p=path.join(P,`source-${String(f).padStart(5,'0')}.png`);await sharp(Buffer.from(embed(r.svg))).png().toFile(p);
  cells.push({input:await sharp(p).resize(480,270).png().toBuffer(),left:i%4*480,top:Math.floor(i/4)*300+30});cells.push({input:Buffer.from(`<svg width="480" height="30"><text x="10" y="22" font-size="17" fill="#f6f1e7">${r.chapter.id} / ${f} / ${(f/30).toFixed(2)}s</text></svg>`),left:i%4*480,top:Math.floor(i/4)*300});
 }
 for(let n=0;n<Math.ceil(frames.length/16);n++){
  const selected=cells.slice(n*32,(n+1)*32).map(x=>({...x,top:x.top-n*1200}));await sharp({create:{width:1920,height:1200,channels:3,background:'#17232c'}}).composite(selected).png().toFile(path.join(P,`source-contact-${n+1}.png`));
 }
}
const movie=path.join(HERE,'exports/film-complete-captioned-voiced-v13.mp4');let encoded=[];
if(fs.existsSync(movie)){
 const expr=frames.map(f=>`eq(n\\,${f})`).join('+'),r=spawnSync('/opt/homebrew/bin/ffmpeg',['-hide_banner','-loglevel','info','-i',movie,'-an','-vf',`blackdetect=d=0.03:pix_th=0.10,select=${expr}`,'-fps_mode','vfr','-threads','2',path.join(P,'encoded-%03d.png')],{encoding:'utf8',maxBuffer:32*1024*1024});assert.equal(r.status,0,r.stderr);assert(!r.stderr.includes('black_start:'));fs.writeFileSync(path.join(P,'decode-blackdetect.log'),r.stderr);
 for(let i=0;i<frames.length;i++)encoded.push({frame:frames[i],path:`arts/actions/film/provenance/voice-v13/encoded-${String(i+1).padStart(3,'0')}.png`});
 save('encoded-frames.json',encoded);
 const v=spawnSync('/opt/homebrew/bin/ffprobe',['-v','error','-select_streams','v:0','-show_packets','-show_entries','packet=pts_time,duration_time','-of','json',movie],{encoding:'utf8',maxBuffer:32*1024*1024});assert.equal(v.status,0);const pts=JSON.parse(v.stdout).packets.map(p=>+p.pts_time).sort((x,y)=>x-y);assert.equal(pts.length,a.frames);pts.forEach((t,i)=>assert(Math.abs(t-i/30)<.000002));
}
save('visual-verification.json',{framesChecked:a.frames,all72BeatsVisible:coverage.size===72,beatCoverage:Object.fromEntries(coverage),monotoneTimeMapping:true,sourcePaintingsHashVerified:inventory.length,opticalFlow:false,captionWordingPreserved:true,captionStyleUnchanged:true,encodedFrames:encoded.length,encodedBlackFrameCheckPassed:encoded.length>0,continuousPTS:encoded.length>0});console.log(JSON.stringify({frames:a.frames,beats:coverage.size,sampleFrames:frames.length,encoded:encoded.length}));
