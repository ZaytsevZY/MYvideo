// Minimal incoming adapter only. The rest of06 remains the original S06 v0.1 preview.
import * as previous from '../05/story-scene-v03.mjs';
import * as base from './scene.mjs';
export const ASSETS=previous.TERMINAL_ASSETS;
export const entrySvg=(t,refs)=>t<.4?previous.svg(1349/30,refs,{caption:false}):null;
export function sample(t){return {...base.sample(t),entryPlan:{id:'S05-PLAN-01',proposalId:'S05-PROP-01',status:'pending-discussion'},previousTasks:{'S05-T01':'human-accepted','S05-T02':'running'},newStoryImplementation:false};}
