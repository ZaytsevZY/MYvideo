// Word-boundary aligned regenerated narration, fixed280s chapter budgets, adopted painted scenes.
// Maps only scene time; every character image remains an existing complete painting.
import DATA from './narration-v16.json' with {type:'json'};
import {createRenderer as createPreviousRenderer,BEATS as PREVIOUS_BEATS,stateAt as previousStateAt} from './scenes-v15.mjs';
import {CHAPTERS,locateFrame} from './timeline.mjs';import {captionSvg} from './captions.mjs';
export const NARRATION=DATA,CUES=DATA.cues,RAW_CUES=DATA.cues,CLOCKS=DATA.clocks;
function interp(points,t){const j=points.findIndex(p=>p[0]>t);if(j===0)return points[0][1];if(j<0)return points.at(-1)[1];const a=points[j-1],b=points[j];return a[1]+(b[1]-a[1])*(t-a[0])/(b[0]-a[0]);}
export const sourceTime=(id,t)=>interp(CLOCKS[id],t),filmTime=(id,t)=>interp(CLOCKS[id].map(([a,b])=>[b,a]),t);
export const BEATS=Object.fromEntries(Object.entries(PREVIOUS_BEATS).map(([id,beats])=>[id,beats.map(b=>({...b,previousStart:b.start,previousEnd:b.end,start:Math.ceil(filmTime(id,b.start)*30-1e-6)/30,end:Math.ceil(filmTime(id,b.end)*30-1e-6)/30}))]));
export const GLOBAL_CUES=CHAPTERS.flatMap(c=>CUES[c.id].map(x=>({...x,startMs:x.startMs+c.start*1000,endMs:x.endMs+c.start*1000})));
export const GLOBAL_BEATS=CHAPTERS.flatMap(c=>BEATS[c.id].map(b=>({...b,chapterId:c.id,globalFrame:c.startFrame+Math.round(b.start*30)})));
export const activeCue=(id,t)=>CUES[id].find(c=>c.startMs<=t*1000&&t*1000<c.endMs)||null;
export const stateAt=(id,t)=>({...previousStateAt(id,sourceTime(id,t)),timelineTime:t,caption:activeCue(id,t)});
export function createRenderer(bundle,resolve){
 const prior=createPreviousRenderer(bundle,resolve);
 return (value,{captions=true}={})=>{
  const point=locateFrame(value),id=point.chapter.id,local=sourceTime(id,point.localTime),sourceFrame=Math.min(point.chapter.endFrame-1,point.chapter.startFrame+Math.floor(local*30+1e-6)),result=prior(sourceFrame,{captions:false}),cue=activeCue(id,point.localTime);
  const at=result.svg.lastIndexOf('</svg>');
  return {...result,...point,sourceFrame,previousLocalTime:local,cue,beat:BEATS[id].find(b=>point.localTime>=b.start&&point.localTime<b.end)||BEATS[id].at(-1),svg:captions?result.svg.slice(0,at)+captionSvg(cue)+result.svg.slice(at):result.svg};
 };
}
