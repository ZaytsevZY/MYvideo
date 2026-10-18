// Adapters only: the adopted chapter sources and PNGs remain unchanged.
import * as c01 from '../01/camera-motion.mjs';
import {CAPTIONS} from '../01/captions/caption-data.mjs';
import {rootSvg} from '../../characters/rigs/runtime/rig.mjs';
import * as c02 from '../02/story-scene-v04.mjs';
import * as c03 from '../03/scene.mjs';
import * as c04 from '../04/scene.mjs';
import * as c05 from '../05/scene.mjs';
import * as c06 from '../06/scene.mjs';
import {CHAPTERS,FPS,locateFrame} from './timeline.mjs';
export const CUES={'01':CAPTIONS,'02':c02.CUES,'03':c03.cues,'04':c04.cues,'05':c05.CUES,'06':c06.CUES};
export const BEATS={'01':c01.CAMERA_BEATS,'02':c02.BEATS,
 '03':[[0,6,'清单完成'],[6,10.5,'约定时段'],[10.5,13,'新增排期'],[13,17,'三种规则'],[17,22,'即时响应'],[22,27,'集中验收'],[27,34,'工作日边界'],[34,39,'团队排期']].map(([start,end,name],i)=>({id:`03-${String.fromCharCode(65+i)}`,start,end,name})),
 '04':[[0,1.6,'排期承接'],[1.6,6.8,'研究方法'],[6.8,15,'研究观察'],[15,20.3,'反馈关系'],[20.3,27,'组织安排'],[27,35.5,'竞争机制'],[35.5,42,'团队标准'],[42,46,'自选补充'],[46,50,'下一轮计划'],[50,55,'常规验收']].map(([start,end,name],i)=>({id:`04-${String.fromCharCode(65+i)}`,start,end,name})),
 '05':c05.BEATS,'06':c06.BEATS};
export const DIRECT_ASSETS=c03.assets;
export function stateAt(id,t){return id==='01'?c01.sampleCameraScene(t):id==='02'?c02.sample(t):id==='03'?c03.state(t):id==='04'?c04.state(t):id==='05'?c05.sample(t):c06.sample(t);}
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
 const refs=Object.fromEntries(Object.entries(DIRECT_ASSETS).map(([id,path])=>[id,resolve(path)]));
 return function render(frame,{captions=true}={}){
  const point=locateFrame(frame),id=point.chapter.id,t=point.localTime,cue=activeCue(id,t);
  let image;
  if(id==='01'){
   const content=c01.drawCameraScene(c01.sampleCameraScene(t),bundle,{captions:false}),assets=used(content,'asset'),poses=used(content,'pose'),key=assets.join(',')+'|'+poses.join(',');
   if(!cache01.has(key)){cache01.set(key,c01.cameraDefinitions({...bundle,assets:Object.fromEntries(assets.map(key=>[key,bundle.assets[key]])),poses:Object.fromEntries(poses.map(key=>[key,bundle.poses[key]]))}));if(cache01.size>12)cache01.delete(cache01.keys().next().value);}
   image=rootSvg(content,cache01.get(key),1920,1080,'当效率成为义务 · 01');
  }
  else if(id==='02'){const content=c05.withoutCaptions(c02.draw(c02.sample(t)));image=c02.svg(content,defsFor(id,content));}
  else if(id==='03'||id==='04')image=(id==='03'?c03:c04).svg(t,refs,{caption:false});
  else {const content=c05.withoutCaptions((id==='05'?c05:c06).draw((id==='05'?c05:c06).sample(t)));image=c06.svg(content,defsFor(id,content));}
  // Insert after the complete root content, never into chapter04's nested prior SVG.
  const at=image.lastIndexOf('</svg>');
  image=image.slice(0,at)+(captions?captionSvg(cue):'')+image.slice(at);
  return {...point,cue,svg:image,beat:BEATS[id].find(b=>t>=b.start&&t<b.end)||BEATS[id].at(-1)};
 };
}
export const GLOBAL_CUES=CHAPTERS.flatMap(c=>CUES[c.id].map(cue=>({...cue,chapterId:c.id,startMs:cue.startMs+c.start*1000,endMs:cue.endMs+c.start*1000})));
export const GLOBAL_BEATS=CHAPTERS.flatMap(c=>BEATS[c.id].map(beat=>({...beat,chapterId:c.id,globalFrame:c.startFrame+Math.round(beat.start*FPS)})));
