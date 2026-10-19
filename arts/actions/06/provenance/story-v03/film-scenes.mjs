// Adapters only: the adopted chapter sources and PNGs remain unchanged.
import * as c01 from '../01/camera-motion.mjs';
import {CAPTIONS} from '../01/captions/caption-data.mjs';
import {rootSvg} from '../../characters/rigs/runtime/rig.mjs';
import * as c02 from '../02/story-scene-v04.mjs';
import * as c03 from '../03/story-scene-v05.mjs';
import * as c04 from '../04/story-scene-v05.mjs';
import * as entry06 from '../06/entry-from-05-v03.mjs';
import * as legacy05 from '../05/scene.mjs';
import * as c05 from '../05/story-scene-v03.mjs';
import * as c06 from '../06/scene.mjs';
import {CHAPTERS,FPS,locateFrame} from './timeline.mjs';
export const CUES={'01':CAPTIONS,'02':c02.CUES,'03':c03.CUES,'04':c04.CUES,'05':c05.CUES,'06':c06.CUES};
export const BEATS={'01':c01.CAMERA_BEATS,'02':c02.BEATS,
 '03':c03.BEATS,
 '04':c04.BEATS,
 '05':c05.BEATS,'06':c06.BEATS};
export const DIRECT_ASSETS_BY_CHAPTER={'03':c03.ASSETS,'04':c04.ASSETS,'05':c05.ASSETS,'06':entry06.ASSETS};
export function stateAt(id,t){return id==='01'?c01.sampleCameraScene(t):id==='02'?c02.sample(t):id==='03'?c03.sample(t):id==='04'?c04.sample(t):id==='05'?c05.sample(t):entry06.sample(t);}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
export function captionSvg(cue){
 if(!cue)return '';
 const units=[...cue.text].reduce((n,ch)=>n+(/[\x00-\x7f]/.test(ch)?.56:1),0),w=Math.ceil(units*44+68);
 return `<g data-film-caption="${cue.startMs}" aria-label="${esc(cue.text)}"><rect x="${960-w/2}" y="994" width="${w}" height="68" rx="12" fill="#101923" fill-opacity=".78"/><text x="960" y="1028" text-anchor="middle" dominant-baseline="central" font-family="Hiragino Sans GB, PingFang SC, sans-serif" font-size="44" font-weight="500" fill="#FFFDF8">${esc(cue.text)}</text></g>`;
}
export function activeCue(id,t){return CUES[id].find(c=>c.startMs<=t*1000&&t*1000<c.endMs)||null;}
function symbol(id,a,resolve){
 const vb=a.viewBox||[0,0,a.width,a.height];
 return `<symbol id="asset-${id}" viewBox="${vb.join(' ')}" preserveAspectRatio="${a.preserveAspectRatio||'xMidYMid meet'}"><image href="${esc(resolve(a.path))}" width="${a.width}" height="${a.height}"/></symbol>`;
}
export function createRenderer(data,resolve){
 const bundle={...data.bundle01,assets:Object.fromEntries(Object.entries(data.bundle01.assets).map(([id,a])=>[id,{...a,dataUri:resolve(a.path)}])),poses:Object.fromEntries(Object.entries(data.bundle01.poses).map(([id,a])=>[id,{...a,dataUri:resolve(a.path)}]))};
 const definitions=Object.fromEntries(['02','05','06'].map(id=>[id,Object.fromEntries(Object.entries(data.registries[id]).map(([key,a])=>[key,symbol(key,a,resolve)]))]));
 const cache01=new Map();
 const used=(content,prefix)=>[...new Set([...content.matchAll(new RegExp('href="#'+prefix+'-([^"#]+)"','g'))].map(m=>m[1]))].sort();
 const defsFor=(id,content)=>used(content,'asset').map(key=>definitions[id][key]||(()=>{throw Error(`Unregistered ${id}/${key}`)})()).join('');
 const refs=Object.fromEntries(Object.entries(DIRECT_ASSETS_BY_CHAPTER).map(([chapter,items])=>[chapter,Object.fromEntries(Object.entries(items).map(([id,path])=>[id,resolve(path)]))]));
 return function render(frame,{captions=true}={}){
  const point=locateFrame(frame),id=point.chapter.id,t=point.localTime,cue=activeCue(id,t);
  let image;
  if(id==='01'){
   const content=c01.drawCameraScene(c01.sampleCameraScene(t),bundle,{captions:false}),assets=used(content,'asset'),poses=used(content,'pose'),key=assets.join(',')+'|'+poses.join(',');
   if(!cache01.has(key)){cache01.set(key,c01.cameraDefinitions({...bundle,assets:Object.fromEntries(assets.map(key=>[key,bundle.assets[key]])),poses:Object.fromEntries(poses.map(key=>[key,bundle.poses[key]]))}));if(cache01.size>12)cache01.delete(cache01.keys().next().value);}
   image=rootSvg(content,cache01.get(key),1920,1080,'当效率成为义务 · 01');
  }
  else if(id==='02'){const content=legacy05.withoutCaptions(c02.draw(c02.sample(t)));image=c02.svg(content,defsFor(id,content));}
  else if(id==='03')image=c03.svg(t,refs['03'],{caption:false});
  else if(id==='04')image=c04.svg(t,refs['04'],{caption:false});
  else if(id==='05')image=c05.svg(t,refs['05'],{caption:false});
  else if(id==='06'&&t<.4)image=entry06.entrySvg(t,refs['06']);
  else {const content=legacy05.withoutCaptions(c06.draw(c06.sample(t)));image=c06.svg(content,defsFor(id,content));}
  // Insert after the complete root content, never into chapter04's nested prior SVG.
  const at=image.lastIndexOf('</svg>');
  image=image.slice(0,at)+(captions?captionSvg(cue):'')+image.slice(at);
  return {...point,cue,svg:image,beat:BEATS[id].find(b=>t>=b.start&&t<b.end)||BEATS[id].at(-1)};
 };
}
export const GLOBAL_CUES=CHAPTERS.flatMap(c=>CUES[c.id].map(cue=>({...cue,chapterId:c.id,startMs:cue.startMs+c.start*1000,endMs:cue.endMs+c.start*1000})));
export const GLOBAL_BEATS=CHAPTERS.flatMap(c=>BEATS[c.id].map(beat=>({...beat,chapterId:c.id,globalFrame:c.startFrame+Math.round(beat.start*FPS)})));
