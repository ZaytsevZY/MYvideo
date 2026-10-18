// Current script is an immutable input. Native layers share the approved composition.
import {CUES,draw as legacyDraw,sample as legacySample} from './full-scene.mjs';
import {INHERITED} from './scene.mjs';
import {ART as LAYER_ART,sample as layerSample,render as layerRender,optionInterior} from '../../static/02/story-assets-v01/scene-layered-v03.mjs';
export {CUES};
export const CONFIG={version:'S02_STORY v0.4',duration:38,fps:30,frames:1140,width:1920,height:1080,globalStartFrame:1350,audio:false};
export const BEATS=[
 ['S02-E1',0,5,'打开搁置需求'],['S02-L1',5,13,'可行边界'],['S02-E2',13,17,'休息与继续工作'],
 ['S02-L2',17,23,'同一份节约'],['S02-E3',23,27,'KPI与选择'],['S02-L3',27,32,'投入与任务规模'],['S02-E4',32,38,'连续审核']
].map(([id,start,end,name])=>({id,start,end,name}));
const sizes=id=>['room','mealRoom','desk'].includes(id)?[1672,941]:id==='chair'?[1055,1491]:id==='document'?[1086,1448]:[1024,1536];
export const REGISTRY=Object.fromEntries(Object.entries(LAYER_ART).map(([id,p])=>{const[w,h]=sizes(id);return ['s02-'+id,{path:'arts/'+p.replace('../../../',''),width:w,height:h}];}));
Object.assign(REGISTRY,{
 's02-backlogList':{path:'arts/items/shared/backlog-list-v01.png',width:1440,height:900},
 's02-backlogOpen':{path:'arts/items/shared/backlog-open-v01.png',width:1440,height:900},
 's02-reviewNext':{path:'arts/characters/poses/02/programmer-review-next-v01.png',width:1024,height:1536}
});
export const FILTERS='<filter id="s02-bg-blur" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="9"/></filter><filter id="s02-card-shadow" x="-10%" y="-10%" width="120%" height="140%"><feGaussianBlur stdDeviation="14"/></filter>';
const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x);},mix=(a,b,p)=>a+(b-a)*p,f=x=>+(+x).toFixed(3);
const adapt=s=>s.replace(/href="#s02-([^"]+)"/g,'href="#asset-s02-$1"');
const rect=(x,y,w,h,fill='#f6f1e7',r=16,extra='')=>`<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${r}" fill="${fill}" ${extra}/>`;
const txt=(x,y,s,size=32,fill='#263342',anchor='start')=>`<text x="${f(x)}" y="${f(y)}" font-size="${size}" font-family="PingFang SC,Hiragino Sans GB,sans-serif" fill="${fill}" text-anchor="${anchor}">${s}</text>`;
const art=(id,x,y,w,h,fit='xMidYMid meet')=>{const a=REGISTRY['s02-'+id];return `<svg x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" viewBox="0 0 ${a.width} ${a.height}" preserveAspectRatio="${fit}"><use href="#asset-s02-${id}" width="${a.width}" height="${a.height}"/></svg>`;};
const alpha=(p,s)=>`<g opacity="${f(clamp(p))}">${s}</g>`;
export function sample(t){
 if(!Number.isFinite(t)||t<0||t>38)throw Error('Expected chapter time 0..38');
 const beat=BEATS.find(b=>t>=b.start&&t<b.end)||BEATS.at(-1),local=t-13;
 const layer={...layerSample(Math.max(0,local)%12),t:Math.max(0,local),enter:ease((t-23)/.55),bubble:ease((t-23.5)/.4)*(1-ease((t-25)/.25)),chart:ease((t-23.85)/.9),pose:t<25.3?'think':'choose',pulse:t>=25.3&&t<=26.1?Math.sin((t-25.3)/.8*Math.PI*2)**2:0,expand:ease((t-26.1)/.9),rightFront:t>=26.1};
 // Before a choice, both windows are counterfactual alternatives, not two realized outcomes.
 const selected=t>=25.3,review=t<34.25?'review':t<35.45?'reviewNext':t<36.65?'review':'reviewNext';
 return {t,beat:beat.id,layer,caption:CUES.find(c=>c.startMs<=t*1000&&t*1000<c.endMs)||null,tasks:{...INHERITED,'N02-A':'candidate','N02-B':'candidate'},
  choice:selected?'expand-output':null,alternatives:'mutually-exclusive',savingToken:{id:'saving-02',owner:t<17?'common':t<19.2?'A':t<20.3?'common':t<23?'B':'allocated-to-B'},
  hypothetical:{distinctFromInheritedTasks:true,extraTasks:!selected?[]:[{id:'H02-new1',status:t<27?'scheduled':t<34.25?'awaiting-review':'reviewing'},{id:'H02-new2',status:'queued'}]},
  reviewPose:review,currentReview:t<34.25?'H02-current':'H02-new1',unitWidth:mix(170,110,ease((t-27.5)/1.5)),humanAccepted:[],source:'S02_STORY_LOGIC v0.4'};
}
function workRoom(t,{pose='input',agent='agentIdle',screen=null,queue=false}={}){
 const z={...layerSample(t%12),t,personPose:pose,agentPose:agent,work:0,screenContent:screen?art(screen,600,344,532,264,'none'):null};
 // Keep workstation, person, chair, screen and Agent as independent native layers.
 let body=adapt(optionInterior('right',1920,1080,z));
 if(queue){body+=`<g data-review-queue="H02-new2" data-status="queued">`;
  for(let i=0;i<3;i++)body+=`<g transform="translate(${1070+i*24} ${642-i*8}) matrix(1 .04 -.5 .3 0 0)">${art('document',0,0,140,185)}</g>`;
  body+='</g>';
 }
 return body;
}
function camera(body,z,cx=850,cy=540){return `<g data-layer="camera" transform="translate(${f(960-cx*z)} ${f(540-cy*z)}) scale(${f(z)})">${body}</g>`;}
function paper(id,name,x,y,s=.8){return `<g data-task="${id}" data-state="candidate" transform="translate(${f(x)} ${f(y)})">${art('document',-66*s,-85*s,132*s,170*s)}${txt(0,54*s,name,32*s,'#263342','middle')}</g>`;}
function opening(s){
 const t=s.t;if(t<.3)return legacyDraw(legacySample(0)).replace(/<g data-layer="captions">[\s\S]*?<\/g>$/,'');
 const z=mix(1,1.45,ease((t-.3)/1.2)),body=workRoom(t,{pose:t<1.8?'release':'input',screen:t<2.5?'backlogList':'backlogOpen'});
 let out=camera(body,z,845,505);
 if(t<1.6){const p=ease((t-.3)/1.3);out+=paper('feedback','反馈',mix(1432,990,p),mix(128,395,p),mix(.95,.65,p));}
 if(t>=1.8&&t<2.9){const p=ease((t-1.8)/.7);out+=`<g data-action="open-backlog"><use href="#asset-cursor" x="${f(mix(1350,1265,p))}" y="${f(mix(580,447,p))}" width="30" height="42"/><circle cx="1265" cy="447" r="${f(12+40*ease((t-2.5)/.4))}" fill="none" stroke="#e9b468" stroke-width="4" opacity="${f(1-ease((t-2.5)/.4))}"/></g>`;}
 if(t>4.3)out+=paper('feedback','反馈',mix(990,1260,ease((t-4.3)/1.9)),mix(395,520,ease((t-4.3)/1.9)),.75);
 return out;
}
function cost(s){
 const t=s.t,p=ease((t-5)/.7);let out=workRoom(t,{pose:'review',screen:'backlogOpen'});
 out+=alpha(p,rect(640,148,1200,780,'#f6f1e7',30,'stroke="#c8bda9" stroke-width="2"'));
 let graph=`<path d="M740 795V285M740 795H1680" fill="none" stroke="#7186a6" stroke-width="4"/><path d="M740 795L1680 295V285H740Z" fill="#6dbccb" fill-opacity=".16"/><path d="M740 795L1680 295" fill="none" stroke="#7186a6" stroke-width="4"/>${txt(770,254,'预期收益',30)}${txt(1510,866,'开发投入',30)}${txt(830,350,'可行区',34,'#397d87')}`;
 const a=[['feedback','反馈',1330,505,315,6],['N02-A','候选A',1560,390,310,7.5],['N02-B','候选B',1510,702,250,9]];
 let carried='';
 for(const[id,name,x,y,dx,at]of a){const q=ease((t-at)/1.3),travel=ease(t-5),xx=(id==='feedback'?mix(1073, x,travel):x)-dx*q,yy=id==='feedback'?mix(433,y,travel):y;
  if(id==='feedback')carried=paper(id,name,xx,yy,mix(.75,.8,travel));else graph+=paper(id,name,xx,yy,.8);
  if(t>=11)graph+=txt(xx,y+112,id==='N02-B'?'仍搁置':'可行 · 未排期',27,'#687783','middle');}
 out+=alpha(p,graph)+carried;
 return out;
}
function saving(s){
 if(s.t<17||s.t>=23)return '';
 const t=s.t;let out='';
 for(const [x,label]of [[106,'保持交付 · 缩短工时'],[1046,'增加任务 · 维持工时']])out+=rect(x,813,700,105,'#f6f1e7',15)+txt(x+25,851,label,30)+rect(x+25,873,650,18,'#dde2e4',7)+rect(x+25,873,410,18,'#798da8',7);
 let x=860,y=936;
 if(t<19.2){const p=ease((t-17)/.8)*(1-ease((t-18.7)/.5));x=mix(860,575,p);y=mix(936,861,p);}
 else if(t>=20.3){const p=ease((t-20.3)/.9);x=mix(860,1515,p);y=mix(936,861,p);}
 return out+`<g data-saving-token="saving-02" data-owner="${s.savingToken.owner}">${rect(x,y,210,42,'#e9b468',10)}${txt(x+105,y+30,'节约',29,'#263342','middle')}</g>`;
}
function paired(s){return adapt(layerRender(0,{state:s.layer}))+saving(s);}
function comparison(s){
 let out=adapt(layerRender(0,{state:{...s.layer,expand:1,rightFront:true,enter:1,bubble:0}}));
 const p=ease((s.t-27)/.5)*(1-ease((s.t-31.45)/.55));
 let diagram=rect(842,156,1015,742,'#f6f1e7',28,'stroke="#c8bda9" stroke-width="2"')+txt(890,220,'单项投入 × 任务规模',37)+txt(890,280,'原范围',29,'#687783')+txt(890,520,'效率提高后',29);
 for(const [row,y,n,w]of [[0,376,2,170],[1,619,4,s.unitWidth]])for(let i=0;i<n;i++){
  const x=944+i*207;diagram+=`<g data-human-unit="${row?'current':'reference'}-${i}" data-task-id="${row&&i>=2?'H02-new'+(i-1):'H02-base'+i}">${art('document',x,y-90,75,95)}${rect(x-30,y,w*.68,22,'#798da8',5)}${rect(x-30+w*.68,y,w*.32,22,'#cc806f',5)}</g>`;
 }
 diagram+=rect(915,693,25,17,'#798da8',3)+txt(952,709,'操作',25)+rect(1065,693,25,17,'#cc806f',3)+txt(1101,709,'审核',25);
 diagram+=txt(890,796,'人的总投入',29)+rect(1080,768,Math.max(340,s.unitWidth*4),30,'#798da8',6);
 if(s.t>=30.2)diagram+=txt(1600,820,'未必下降',31);
 return out+alpha(p,`<g data-layer="human-input-comparison">${diagram}</g>`);
}
function review(s){
 const body=workRoom(s.t,{pose:s.reviewPose,agent:'agentIdle',queue:true}).replace('data-task-id="H02-current"',`data-task-id="${s.currentReview}"`);
 let out=camera(body,1.18,870,582);
 if(s.t>=34.25&&s.t<34.8||s.t>=36.65&&s.t<37.2){const p=(s.t>=36.65?s.t-36.65:s.t-34.25)/.55;out+=`<circle data-action="review-next" cx="915" cy="416" r="${f(26+30*p)}" fill="none" stroke="#d3ac71" stroke-width="4" opacity="${f(1-p)}"/>`;}
 return `<g data-layer="review-scene" data-current-task="${s.currentReview}" data-queued-task="H02-new2">${out}</g>`;
}
export function draw(s){return `<g data-version="S02_STORY v0.4" data-beat="${s.beat}" data-time="${f(s.t)}">${s.t<5?opening(s):s.t<13?cost(s):s.t<27?paired(s):s.t<32?comparison(s):review(s)}</g>`;}
export const svg=(content,defs='')=>`<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"><defs>${FILTERS}${defs}</defs>${content}</svg>`;
