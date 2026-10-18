// Chapter02 composition study: deterministic native layers; no flattened panel screenshots.
export const WIDTH=1920,HEIGHT=1080,DURATION=10.2;
export const ART={room:'../../../backgrounds/01/workroom-day-v01.png',desk:'../../../items/01/workstation-painted-v02.png',chair:'../../../items/01/chair-back-rear-painted-v01.png',input:'../../../characters/poses/01/programmer-input-v01.png',relax:'../../../characters/poses/02/programmer-relax-rear-v01.png',think:'../../../characters/poses/02/programmer-think-up-right-v01.png',choose:'../../../characters/poses/02/programmer-choose-right-v01.png',agent:'../../../characters/poses/01/agent-receive-v01.png'};
export const LAYOUT={canvas:[WIDTH,HEIGHT],left:[44,68,888,862],right:[984,68,888,862],foreground:[10,184,584,876],thought:[592,170,576,310],subtitleSafe:[24,982,1872,80],layerOrder:['background','left-option','right-option','programmer','thought','selected-right-front']};
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const ease=x=>{x=clamp(x);return x*x*(3-2*x);};
const mix=(a,b,p)=>a+(b-a)*p;
const f=n=>+(+n).toFixed(3);
const size=id=>['room','desk'].includes(id)?[1672,941]:id==='chair'?[1055,1491]:[1024,1536];
const image=(id,x,y,w,h,fit='xMidYMid meet')=>{const[sw,sh]=size(id);return `<svg x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" viewBox="0 0 ${sw} ${sh}" preserveAspectRatio="${fit}"><use href="#s02-${id}" width="${sw}" height="${sh}"/></svg>`;};
const rect=(x,y,w,h,fill,r=0,extra='')=>`<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${f(r)}" fill="${fill}" ${extra}/>`;
export function definitions(hrefs){
 return `<filter id="s02-bg-blur" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="9"/></filter><filter id="s02-card-shadow" x="-10%" y="-10%" width="120%" height="140%"><feGaussianBlur stdDeviation="14"/></filter>`+Object.keys(ART).map(k=>{const[w,h]=size(k);return `<symbol id="s02-${k}" viewBox="0 0 ${w} ${h}"><image href="${hrefs[k]}" width="${w}" height="${h}"/></symbol>`;}).join('');
}
export function sample(seconds){
 const t=clamp(Number(seconds)||0,0,DURATION),enter=ease((t-.95)/.8),bubble=ease((t-1.95)/.6)*(1-ease((t-5.05)/.3)),expand=ease((t-6.85)/1.5);
 const pulse=t>=5.45&&t<=6.65?Math.sin((t-5.45)/1.2*Math.PI*2)**2:0;
 return {t,enter,bubble,expand,pulse,pose:t<5.4?'think':'choose',rightFront:t>=6.85,chart:ease((t-2.5)/1.35)};
}
// Each option remains a room/props/body/chair/Agent stack in its own viewport.
function optionInterior(id,w,h){
 const s=mix(w/1700,w/1920,clamp((w-888)/(1920-888))),dy=(h-1080*s)*.62;
 let content=`<g data-sub-layer="room">${image('room',0,0,w,h,'xMidYMid slice')}</g>`;
 content+=`<g transform="translate(0 ${f(dy)}) scale(${f(s)})"><g data-sub-layer="workstation">${image('desk',0,0,1920,1080)}</g>`;
 content+=`<g data-sub-layer="screen-symbols">${rect(596,343,540,268,'#20313f',3)}`;
 // Large silent visual marks only: no tiny headings or state labels inside the scene.
 content+=rect(782,394,145,150,'#f6f1e7',8)+`<path d="M810 430H896M810 458H878M810 486H888" stroke="#aab5bc" stroke-width="8" stroke-linecap="round"/>`;
 if(id==='left')content+=`<circle cx="1000" cy="500" r="33" fill="#7d9d90"/><path d="M982 500l13 13 23-30" fill="none" stroke="#f6f1e7" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`;
 else content+=`<circle cx="1000" cy="500" r="28" fill="none" stroke="#d2a660" stroke-width="10" stroke-dasharray="90 86"/>`;
 content+='</g>';
 const key=id==='left'?'relax':'input';
 content+=`<g data-sub-layer="complete-person">${image(key,389.84,key==='input'?379.34:371.6,440.32,660.48)}</g><g data-sub-layer="chair-front">${image('chair',483,663,265,296)}</g>`;
 if(id==='right')content+=`<g data-sub-layer="agent">${image('agent',1180,270,470,705)}</g>`;
 return content+'</g>';
}
function card(id,box,state){
 let [x,y,w,h]=box;
 if(id==='right'){x=mix(x,0,state.expand);y=mix(y,0,state.expand);w=mix(w,WIDTH,state.expand);h=mix(h,HEIGHT,state.expand);}
 const r=mix(24,0,id==='right'?state.expand:0),labelOpacity=id==='right'?1-state.expand:1;
 const shadowOpacity=id==='right'?.22*(1-state.expand):.22;
 let b=`<g data-layer="${id}-option" data-native-layers="true">`;
 b+=`<g opacity="${f(shadowOpacity)}" filter="url(#s02-card-shadow)">${rect(x+5,y+22,w,h,'#263542',r)}</g>`;
 b+=`<clipPath id="s02-clip-${id}">${rect(x,y,w,h,'white',r)}</clipPath><g clip-path="url(#s02-clip-${id})"><svg x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" viewBox="0 0 ${f(w)} ${f(h)}">${optionInterior(id,w,h)}</svg></g>`;
 b+=rect(x,y,w,h,'none',r,`stroke="#f8f3e8" stroke-width="${f(5*(1-state.expand))}"`);
 if(id==='right')b+=`<g data-soft-cue="border" opacity="${f((.16+.74*state.pulse)*(1-state.expand))}">${rect(x-2,y-2,w+4,h+4,'none',r+2,'stroke="#d8ad68" stroke-width="9"')}</g>`;
 b+=`<g opacity="${f(labelOpacity)}">${rect(x+28,y+26,id==='left'?128:214,60,'#fbf7ef',13)}<text x="${f(x+49)}" y="${f(y+69)}" font-size="38" fill="#2b3b48">${id==='left'?'休息':'继续工作'}</text></g>`;
 return b+'</g>';
}
export function kpiSymbol({progress=1}={}){
 // Deliberately symbolic: no axes, ticks, measured data, numbers, legend or arrowhead.
 return `<g data-kpi="abstract-expectations"><path d="M100 245L193 218L272 232L360 154L441 176L535 73" fill="none" stroke="#c48e45" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="520" stroke-dashoffset="${f(520*(1-clamp(progress)))}"/><circle cx="535" cy="73" r="16" fill="#c48e45" opacity="${f(ease((progress-.88)/.12))}"/></g>`;
}
function thought(state){
 if(state.bubble<=0)return '<g data-layer="thought" opacity="0"/>';
 const[x,y,w,h]=LAYOUT.thought;
 return `<g data-layer="thought" opacity="${f(state.bubble)}"><g filter="url(#s02-card-shadow)" opacity=".18">${rect(x+6,y+16,w,h,'#263542',42)}</g>${rect(x,y,w,h,'#fbf7ef',42,'stroke="#c9baa2" stroke-width="2"')}<circle cx="${x-30}" cy="${y+h-50}" r="18" fill="#fbf7ef"/><circle cx="${x-68}" cy="${y+h-85}" r="10" fill="#fbf7ef"/><svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 640 320">${kpiSymbol({progress:state.chart})}</svg></g>`;
}
export function render(seconds,{hidden=[]}={}){
 const state=sample(seconds),isHidden=k=>hidden.includes(k),layers=[];
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
 return `<g data-scene-version="S02_LAYERED v0.2" data-time="${f(state.t)}">${layers.join('')}</g>`;
}
export const root=(body,defs)=>`<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"><style>text{font-family:'PingFang SC','Noto Sans CJK SC',sans-serif}</style><defs>${defs}</defs>${body}</svg>`;
