// Speech-led delivery wraps the adopted painted renderer. Historical v10 remains reproducible.
import {createRenderer as createPaintedRenderer} from './scenes.mjs';
import {captionSvg} from './captions.mjs';
export function createSpeechRenderer(bundle,alignment,captions,resolve){
 const paint=createPaintedRenderer(bundle,resolve),frames=alignment.frames;
 return frame=>{
  frame=Math.max(0,Math.min(frames-1,Math.floor(frame)));const time=frame/30;
  const segment=alignment.segments.find(s=>time>=s.start-1e-8&&time<s.end-1e-8)||alignment.segments.at(-1);
  const sourceTime=segment.sourceStart+(segment.sourceEnd-segment.sourceStart)*(time-segment.start)/(segment.end-segment.start);
  const result=paint(Math.min(8399,Math.floor(sourceTime*30+1e-6)),{captions:false});
  const cue=captions.find(c=>c.startMs<=time*1000&&time*1000<c.endMs)||null;
  const at=result.svg.lastIndexOf('</svg>');
  return {...result,frame,time,sourceTime,cue,svg:result.svg.slice(0,at)+captionSvg(cue)+result.svg.slice(at)};
 };
}
