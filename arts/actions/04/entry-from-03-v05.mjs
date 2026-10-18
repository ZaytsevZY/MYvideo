// Only the existing 1.6-second chapter entry is adapted; study/body/audio remain authored by scene.mjs.
import * as base from './scene.mjs';
import * as prior from '../03/story-scene-v05.mjs';
export const assets=base.assets,cues=base.cues;
export function state(t){const s=base.state(t);return {...s,inheritedTasks:{},previousScenarioTasks:t<1.6?prior.sample(1169/30).taskStates:null,scenarioRelation:'distinct-research-scenario',entryVersion:'S03_STORY v0.5 → S04 v0.2'};}
export function svg(t,priorRefs,refs,{caption=false}={}){
 if(t>=1.6)return base.svg(t,refs,{caption});
 const previous=prior.svg(1169/30,priorRefs,{caption:false});if(t<.4)return previous;
 const x=Math.max(0,Math.min(1,(t-.4)/1.2)),opacity=x*x*(3-2*x);
 const incoming=base.svg(1.6,refs,{caption:false});
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">${previous}<g opacity="${opacity}" data-entry="new-study">${incoming}</g></svg>`;
}
