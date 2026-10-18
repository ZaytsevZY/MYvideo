// Chapter02 composition study: deterministic native layers; no flattened panel screenshots.
export const WIDTH=1920,HEIGHT=1080,DURATION=12;
export const ART={room:'../../../backgrounds/01/workroom-day-v01.png',desk:'../../../items/01/workstation-painted-v02.png',chair:'../../../items/01/chair-back-rear-painted-v01.png',input:'../../../characters/poses/01/programmer-input-v01.png',relax:'../../../characters/poses/02/programmer-relax-rear-v01.png',think:'../../../characters/poses/02/programmer-think-up-right-v01.png',choose:'../../../characters/poses/02/programmer-choose-right-v01.png',agent:'../../../characters/poses/01/agent-receive-v01.png'};
Object.assign(ART,{
 mealRoom:'../../../backgrounds/02/breakroom-meal-day-v01.png',
 eatDown:'../../../characters/poses/02/programmer-eat-down-v01.png',
 eatScoop:'../../../characters/poses/02/programmer-eat-scoop-v01.png',
 eatBite:'../../../characters/poses/02/programmer-eat-bite-v01.png',
 release:'../../../characters/poses/01/programmer-release-half-v01.png',
 review:'../../../characters/poses/02/programmer-review-current-v01.png',
 agentIdle:'../../../characters/poses/01/agent-idle-v01.png',
 agentInspect:'../../../characters/poses/01/agent-inspect-file-v01.png',
 agentOffer:'../../../characters/poses/01/agent-offer-file-v01.png',
 document:'../../../items/01/task-document-portrait-v01.png'
});
export const LAYOUT={canvas:[WIDTH,HEIGHT],left:[44,68,888,862],right:[984,68,888,862],foreground:[10,184,584,876],thought:[592,170,576,310],subtitleSafe:[24,982,1872,80],layerOrder:['background','left-option','right-option','programmer','thought','selected-right-front']};
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const ease=x=>{x=clamp(x);return x*x*(3-2*x);};
const mix=(a,b,p)=>a+(b-a)*p;
const f=n=>+(+n).toFixed(3);
const size=id=>['room','mealRoom','desk'].includes(id)?[1672,941]:id==='chair'?[1055,1491]:id==='document'?[1086,1448]:[1024,1536];
const image=(id,x,y,w,h,fit='xMidYMid meet')=>{const[sw,sh]=size(id);return `<svg x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" viewBox="0 0 ${sw} ${sh}" preserveAspectRatio="${fit}"><use href="#s02-${id}" width="${sw}" height="${sh}"/></svg>`;};
const rect=(x,y,w,h,fill,r=0,extra='')=>`<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${f(r)}" fill="${fill}" ${extra}/>`;
export function definitions(hrefs){
 return `<filter id="s02-bg-blur" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="9"/></filter><filter id="s02-card-shadow" x="-10%" y="-10%" width="120%" height="140%"><feGaussianBlur stdDeviation="14"/></filter>`+Object.keys(ART).map(k=>{const[w,h]=size(k);return `<symbol id="s02-${k}" viewBox="0 0 ${w} ${h}"><image href="${hrefs[k]}" width="${w}" height="${h}"/></symbol>`;}).join('');
}
export function sample(seconds){
 const t=clamp(Number(seconds)||0,0,DURATION),enter=ease((t-3.2)/.8),bubble=ease((t-4)/.6)*(1-ease((t-6.9)/.3)),expand=ease((t-8.75)/1.5);
 const pulse=t>=7.35&&t<=8.55?Math.sin((t-7.35)/1.2*Math.PI*2)**2:0;
 const meal=t%4.8,work=t%4.2;
 // Whole drawings switch at action keys; head, bowl and seat stay anchored.
 const eatPose=meal<.65?'eatDown':meal<1.2?'eatScoop':meal<2.55?'eatBite':meal<3.05?'eatScoop':'eatDown';
 const personPose=work<2.5?(Math.floor(t*5)%2?'release':'input'):'review';
 const agentPose=work<.65?'agentIdle':work<1.4?'agent':work<2.5?'agentInspect':'agentOffer';
 return {t,enter,bubble,expand,pulse,eatPose,personPose,agentPose,work,meal,pose:t<7.3?'think':'choose',rightFront:t>=8.75,chart:ease((t-4.5)/1.35)};
}
function mealInterior(w,h,state){
 // Reusing an exact foreground crop of the background makes the table occlude the waist.
 const scale=h/862,actorW=440*scale,actorH=660*scale;
 const edge=h*.676;
 return `<g data-sub-layer="dining-room">${image('mealRoom',0,0,w,h,'xMidYMid slice')}</g><g data-sub-layer="eating-person" data-eating-pose="${state.eatPose}">${image(state.eatPose,(w-actorW)/2,5*scale,actorW,actorH)}</g><clipPath id="s02-table-front">${rect(0,edge,w,h-edge,'white')}</clipPath><g data-sub-layer="table-front" clip-path="url(#s02-table-front)">${image('mealRoom',0,0,w,h,'xMidYMid slice')}</g>`;
}
export function optionInterior(id,w,h,state){
 if(id==='left')return mealInterior(w,h,state);
 const s=mix(w/1700,w/1920,clamp((w-888)/(1920-888))),dy=(h-1080*s)*.62;
 let content=`<g data-sub-layer="room">${image('room',0,0,w,h,'xMidYMid slice')}</g>`;
 content+=`<g transform="translate(0 ${f(dy)}) scale(${f(s)})"><g data-sub-layer="workstation">${image('desk',0,0,1920,1080)}</g>`;
 content+=`<g data-sub-layer="screen-symbols">${rect(596,343,540,268,'#20313f',3)}`;
 if(state.screenContent)content+=state.screenContent;
 else {
 content+=rect(782,394,145,150,'#f6f1e7',8)+`<path d="M810 430H896M810 458H878M810 486H888" stroke="#aab5bc" stroke-width="8" stroke-linecap="round"/>`;
 content+=`<g transform="rotate(${f(state.t*180)} 1000 500)"><circle cx="1000" cy="500" r="28" fill="none" stroke="#d2a660" stroke-width="10" stroke-dasharray="90 86"/></g>`;
 // Large code strokes pulse while the Agent processes; no tiny explanatory text.
 for(let i=0;i<3;i++)content+=rect(626,388+i*51,88+i*21,9,'#91b8b2',4,`opacity="${f(.35+.65*(.5+.5*Math.sin(state.t*4-i)))}"`);
 }
 content+='</g>';
 content+=`<g data-sub-layer="complete-person" data-work-pose="${state.personPose}" data-task-id="H02-current" data-status="${state.personPose.startsWith('review')?'reviewing':'dispatching'}">${image(state.personPose,389.84,379.34,440.32,660.48)}</g><g data-sub-layer="chair-front">${image('chair',483,663,265,296)}</g>`;
 content+=`<g data-sub-layer="agent" data-agent-pose="${state.agentPose}" data-task-id="H02-new1" data-status="processing-or-awaiting-review">${image(state.agentPose,1180,270,470,705)}</g>`;
 // The free paper exists only in flight; held-paper drawings take over at contact.
 if(state.work>=.65&&state.work<1.4){const p=ease((state.work-.65)/.75);content+=`<g data-sub-layer="paper-in-flight" data-task-id="H02-new1" transform="translate(${f(mix(886,1308,p))} ${f(mix(440,420,p)-65*Math.sin(Math.PI*p))}) rotate(${f(-8+16*p)})">${image('document',-42,-56,84,112)}</g>`;}
 return content+'</g>';
}
function card(id,box,state){
 let [x,y,w,h]=box;
 if(id==='right'){x=mix(x,0,state.expand);y=mix(y,0,state.expand);w=mix(w,WIDTH,state.expand);h=mix(h,HEIGHT,state.expand);}
 const r=mix(24,0,id==='right'?state.expand:0),labelOpacity=id==='right'?1-state.expand:1;
 const shadowOpacity=id==='right'?.22*(1-state.expand):.22;
 let b=`<g data-layer="${id}-option" data-native-layers="true">`;
 b+=`<g opacity="${f(shadowOpacity)}" filter="url(#s02-card-shadow)">${rect(x+5,y+22,w,h,'#263542',r)}</g>`;
 b+=`<clipPath id="s02-clip-${id}">${rect(x,y,w,h,'white',r)}</clipPath><g clip-path="url(#s02-clip-${id})"><svg x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" viewBox="0 0 ${f(w)} ${f(h)}">${optionInterior(id,w,h,state)}</svg></g>`;
 b+=rect(x,y,w,h,'none',r,`stroke="#f8f3e8" stroke-width="${f(5*(1-state.expand))}"`);
 if(id==='right')b+=`<g data-soft-cue="border" opacity="${f((.16+.74*state.pulse)*(1-state.expand))}">${rect(x-2,y-2,w+4,h+4,'none',r+2,'stroke="#d8ad68" stroke-width="9"')}</g>`;
 b+=`<g opacity="${f(labelOpacity)}">${rect(x+28,y+26,id==='left'?128:214,60,'#fbf7ef',13)}<text x="${f(x+49)}" y="${f(y+69)}" font-size="38" fill="#2b3b48">${id==='left'?'休息':'继续工作'}</text></g>`;
 return b+'</g>';
}
export function kpiSymbol({progress=1}={}){
 // Deliberately symbolic: no axes, ticks, measured data, numbers, legend or arrowhead.
 return `<g data-kpi="abstract-expectations"><text x="68" y="72" font-family="sans-serif" font-size="52" font-weight="700" fill="#715435">KPI</text><path d="M100 245L193 218L272 232L360 154L441 176L535 73" fill="none" stroke="#c48e45" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="520" stroke-dashoffset="${f(520*(1-clamp(progress)))}"/><circle cx="535" cy="73" r="16" fill="#c48e45" opacity="${f(ease((progress-.88)/.12))}"/></g>`;
}
function thought(state){
 if(state.bubble<=0)return '<g data-layer="thought" opacity="0"/>';
 const[x,y,w,h]=LAYOUT.thought;
 return `<g data-layer="thought" opacity="${f(state.bubble)}"><g filter="url(#s02-card-shadow)" opacity=".18">${rect(x+6,y+16,w,h,'#263542',42)}</g>${rect(x,y,w,h,'#fbf7ef',42,'stroke="#c9baa2" stroke-width="2"')}<circle cx="${x-30}" cy="${y+h-50}" r="18" fill="#fbf7ef"/><circle cx="${x-68}" cy="${y+h-85}" r="10" fill="#fbf7ef"/><svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 640 320">${kpiSymbol({progress:state.chart})}</svg></g>`;
}
export function render(seconds,{hidden=[],state:override}={}){
 const state=override||sample(seconds),isHidden=k=>hidden.includes(k),layers=[];
 layers.push(isHidden('background')?'':`<g data-layer="background"><g filter="url(#s02-bg-blur)">${image('room',-22,-14,1964,1108,'xMidYMid slice')}</g>${rect(0,0,WIDTH,HEIGHT,'#d9d4c8',0,'opacity=".3"')}</g>`);
 if(!isHidden('left-option'))layers.push(card('left',LAYOUT.left,state));
 if(!isHidden('right-option')&&!state.rightFront)layers.push(card('right',LAYOUT.right,state));
 if(!isHidden('programmer')){
  const[x,y,w,h]=LAYOUT.foreground;
  layers.push(`<g data-layer="programmer" opacity="${f(state.enter)}" transform="translate(0 ${f(115*(1-state.enter))})">${image(state.pose,x,y,w,h)}</g>`);
 }
 if(!isHidden('thought'))layers.push(thought(state));
 // Selected window comes forward only when expanding, covering foreground naturally.
 if(!isHidden('right-option')&&state.rightFront)layers.push(`<g data-layer="selected-right-front">${card('right',LAYOUT.right,state)}</g>`);
 return `<g data-scene-version="S02_LAYERED v0.3" data-time="${f(state.t)}">${layers.join('')}</g>`;
}
export const root=(body,defs)=>`<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"><style>text{font-family:'PingFang SC','Noto Sans CJK SC',sans-serif}</style><defs>${defs}</defs>${body}</svg>`;
