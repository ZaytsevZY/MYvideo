// Only the incoming 0.4s is adapted. Chapter05's original body and its 45s budget remain in scene.mjs.
import * as previous from '../04/story-scene-v05.mjs';
import * as base from './scene.mjs';
export const ASSETS=Object.fromEntries(['office','hrReview','document','boardExcerpt','lunchType','meetingType','eveningType'].map(k=>[k,previous.ASSETS[k]]));
export function sample(t){return {...base.sample(t),entryRequirement:{jobId:'S04-JOB-01',text:'熟练调度多个Agent',relation:'organization-requirement-to-actual-tool-use'},inheritedTasks:{},hrIsDirectSupervisor:false,cvIsToolTask:false};}
export function entrySvg(t,refs){return t<.4?previous.svg(1649/30,refs,{caption:false}):null;}
