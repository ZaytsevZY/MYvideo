// Deterministic 1080p30 silent MP4. Streams frames in order; no realtime screen recording.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {spawn,spawnSync} from 'node:child_process';
import {once} from 'node:events';
import {rasterFrame,sharp,WIDTH,HEIGHT,FPS,FRAME_COUNT} from './render-frame.mjs';
const DIR=path.dirname(fileURLToPath(import.meta.url)),ROOT=path.resolve(DIR,'../../..');
const OUT=path.join(DIR,'exports'),BASE='01-captioned-silent-v01';
fs.mkdirSync(OUT,{recursive:true});
const final=path.join(OUT,BASE+'.mp4'),partial=path.join(OUT,BASE+'.part.mp4');
if(fs.existsSync(final))throw Error('Output already exists; select a new version before rendering');
const args=['-hide_banner','-loglevel','warning','-nostdin','-y','-f','rawvideo','-pixel_format','rgb24','-video_size',`${WIDTH}x${HEIGHT}`,'-framerate',String(FPS),'-i','pipe:0','-an','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-frames:v',String(FRAME_COUNT),'-movflags','+faststart','-metadata','title=01 · 口播字幕 · 无声音',partial];
const encoder=spawn('ffmpeg',args,{stdio:['pipe','ignore','pipe']});
const completed=once(encoder,'close');let log='';
encoder.stderr.on('data',d=>{log+=d.toString();});
encoder.stdin.on('error',error=>{process.stderr.write('Encoder input: '+error.message+'\n');});
const begin=Date.now(),pending=new Map(),concurrency=4;
const qaFrames=new Set([0,156,420,795,1349]);
try{
 for(let frame=0;frame<FRAME_COUNT;frame++){
  for(let next=frame;next<Math.min(FRAME_COUNT,frame+concurrency);next++)if(!pending.has(next))pending.set(next,rasterFrame(next));
  const data=await pending.get(frame);pending.delete(frame);
  if(data.length!==WIDTH*HEIGHT*3)throw Error('Unexpected raw frame size at '+frame);
  if(!encoder.stdin.write(data))await once(encoder.stdin,'drain');
  if(qaFrames.has(frame))await sharp(data,{raw:{width:WIDTH,height:HEIGHT,channels:3}}).png().toFile(path.join(OUT,`${BASE}-frame-${String(frame).padStart(4,'0')}.png`));
  if(frame%60===0||frame===FRAME_COUNT-1)console.log(JSON.stringify({renderedFrames:frame+1,totalFrames:FRAME_COUNT,videoSeconds:+((frame+1)/FPS).toFixed(2),elapsedSeconds:+((Date.now()-begin)/1000).toFixed(1)}));
 }
 encoder.stdin.end();const [exitCode]=await completed;
 fs.writeFileSync(path.join(OUT,BASE+'-ffmpeg.log'),log);
 if(exitCode!==0)throw Error('ffmpeg failed ('+exitCode+'): '+log.slice(-2000));
 const probe=spawnSync('ffprobe',['-v','error','-show_format','-show_streams','-of','json',partial],{encoding:'utf8'});
 if(probe.status!==0)throw Error(probe.stderr);
 const info=JSON.parse(probe.stdout),video=info.streams.find(s=>s.codec_type==='video');
 if(info.streams.some(s=>s.codec_type==='audio'))throw Error('Unexpected audio stream');
 if(video.width!==WIDTH||video.height!==HEIGHT||Number(video.nb_frames)!==FRAME_COUNT||Math.abs(Number(info.format.duration)-45)>.001)throw Error('Unexpected encoded media metadata');
 fs.renameSync(partial,final);
 fs.writeFileSync(path.join(OUT,BASE+'-ffprobe.json'),JSON.stringify(info,null,2)+'\n');
 for(const ext of ['json','srt','vtt'])fs.copyFileSync(path.join(DIR,'captions','01-narration-v01.'+ext),path.join(OUT,BASE+'.'+ext));
 const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
 const code=['bake-video.mjs','render-frame.mjs','camera-motion.mjs','performance.mjs','captions/captions.mjs','captions/01-narration-v01.json'];
 fs.writeFileSync(path.join(OUT,BASE+'-manifest.json'),JSON.stringify({version:'S01_SILENT_VIDEO v0.1',date:'2026-10-16',method:'native frame-driven SVG via sharp/librsvg, streamed to FFmpeg; not realtime capture or Remotion',fps:FPS,frames:FRAME_COUNT,width:WIDTH,height:HEIGHT,durationSeconds:45,audio:false,burnedCaptions:true,captionTiming:'provisional semantic timing; no voice alignment',font:'Hiragino Sans GB',captionCues:14,rendererVersions:sharp.versions,ffmpeg:spawnSync('ffmpeg',['-version'],{encoding:'utf8'}).stdout.split('\n')[0],command:['ffmpeg',...args],elapsedSeconds:(Date.now()-begin)/1000,output:{path:path.relative(ROOT,final),bytes:fs.statSync(final).size,sha256:sha(final)},code:code.map(p=>({path:'arts/actions/01/'+p,sha256:sha(path.join(DIR,p))})),assetManifest:{path:'arts/static/01/raster-assets-manifest-v01.json',sha256:sha(path.join(ROOT,'arts/static/01/raster-assets-manifest-v01.json'))}},null,2)+'\n');
 console.log(JSON.stringify({complete:true,path:final,bytes:fs.statSync(final).size,durationSeconds:45,frames:FRAME_COUNT,audio:false}));
}catch(error){encoder.stdin.destroy();encoder.kill('SIGTERM');fs.writeFileSync(path.join(OUT,BASE+'-ffmpeg.log'),log);throw error;}
