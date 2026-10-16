// Whole-figure keyframes; smooth root motion, discrete cel drawings, no limb assembly.
import {clamp,smooth,lerp} from '../../characters/rigs/runtime/rig.mjs';
export const TRACKS={
 release:[[0,'input'],[.22,'release-half'],[.62,'rest']],
 rise:[[0,'rest'],[.12,'lean'],[.30,'rise'],[.54,'rise-high'],[.76,'stand'],[.9,'turn-left']],
 sit:[[0,'turn-left'],[.12,'stand'],[.28,'rise-high'],[.48,'rise'],[.7,'lean'],[.85,'rest'],[.97,'input']],
 walk:[[0,'walk-a'],[.24,'walk-recover'],[.5,'walk-pass'],[.76,'walk-recover']],
 receive:[[0,'idle'],[.08,'reach-half'],[.20,'receive'],[.32,'pregrasp'],[.52,'grasp-file'],[.62,'pull-file'],[.74,'hold-file'],[.84,'inspect-file']],
 deliver:[[0,'inspect-file'],[.12,'hold-file'],[.25,'pull-file'],[.40,'grasp-file'],[.50,'offer-file'],[.66,'pregrasp'],[.78,'receive'],[.88,'reach-half'],[.98,'idle']],
 explain:[[0,'idle'],[.16,'reach-half'],[.32,'receive'],[.52,'pregrasp'],[.72,'report']]
};
export const CALIBRATION={
 'programmer-input':{scale:.43,bottom:1462},'programmer-release-half':{scale:.43,bottom:1462},'programmer-rest':{scale:.43,bottom:1462},
 'programmer-lean':{scale:.43,bottom:1431},'programmer-rise':{scale:.49,bottom:1491},'programmer-rise-high':{scale:.515,bottom:1493},
 'programmer-stand':{scale:.53,bottom:1489},'programmer-turn-left':{scale:.53,bottom:1478},
 'programmer-walk-a':{scale:.53,bottom:1461,center:490},'programmer-walk-pass':{scale:.53,bottom:1463,center:495},'programmer-walk-recover':{scale:.53,bottom:1472,center:494},
 'agent-hold-file':{scale:.477,bottom:1496,center:500}
};
export function key(track,u){return TRACKS[track].filter(([at])=>at<=clamp(u)).at(-1)[1];}
const HEIGHT={input:619,'release-half':619,rest:619,lean:579,rise:721,'rise-high':766,stand:777,'turn-left':772};
const TOP={input:23,'release-half':22,rest:22,lean:84,rise:20,'rise-high':6,stand:23,'turn-left':22};
export function programmerMotion(track,u){
 u=clamp(u);const frames=TRACKS[track],i=Math.max(0,frames.findLastIndex(([at])=>at<=u)),a=frames[i],b=frames[Math.min(i+1,frames.length-1)];
 const v=a===b?0:clamp((u-a[0])/(b[0]-a[0])),pose=v<.5?a[1]:b[1],c=CALIBRATION['programmer-'+pose];
 const height=lerp(HEIGHT[a[1]],HEIGHT[b[1]],smooth(v));
 return {id:'programmer-'+pose,x:610,baseline:1008,flip:false,scaleOverride:height/(c.bottom-TOP[pose])};
}
export function walking(u,returning=false){
 const travel=smooth(u),phase=(u*3.2)%1;
 return {id:'programmer-'+key('walk',phase),x:lerp(returning?-240:610,returning?610:-240,travel),baseline:1008-2*Math.sin(phase*Math.PI*2)**2,flip:returning};
}
export function agentMotion(kind,u){
 u=clamp(u);const pose=key(kind==='deliver'?'deliver':kind==='explain'?'explain':'receive',u);
 const reach=kind==='receive'?Math.sin(Math.PI*u):kind==='deliver'?Math.sin(Math.PI*u):0;
 const actor={id:'agent-'+pose,x:1580-5*reach,baseline:1008,rotation:-.3*reach};
 let file=null,owner='agent';
 if(kind==='receive'&&u>=.15&&u<.52){
  const v=smooth((u-.15)/.37);
  file={x:lerp(995,1402-5*reach,v),y:lerp(487,425,v)-26*Math.sin(Math.PI*v),rotation:lerp(0,-9,v)};owner='transfer';
 }else if(kind==='receive'&&u<.52)owner='programmer';
 if(kind==='deliver'&&u>=.66){
  const v=smooth((u-.66)/.34);
  file=u<.98?{x:lerp(1363,995,v),y:lerp(431,487,v)-22*Math.sin(Math.PI*v),rotation:lerp(-12,0,v)}:null;owner=u<.98?'transfer':'programmer';
 }
 return {actor,file,owner,phase:pose,kind,progress:u};
}
export function workingAgent(t){
 // Looking down at the held result, then returning to the neutral hold. Motion pauses serve reading.
 const phase=(t%3)/3,id=phase<.65?'inspect-file':'hold-file';
 return {id:'agent-'+id,x:1580+1.2*Math.sin(t*1.8),baseline:1008,rotation:.12*Math.sin(t*1.8)};
}
