// performance.mjs — S01 animation direction layer. Frame-driven: every value derives from state.t; no timers, randomness or imports.
const INK='#263342',PAPER='#F6F1E7',BLUE='#7186A6',ORANGE='#DA7852',GREEN='#72A589',SKIN='#F4D7BE';
const F='PingFang SC,Noto Sans CJK SC,sans-serif';
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const smooth=v=>{v=clamp(v);return v*v*(3-2*v);};
const lerp=(a,b,u)=>a+(b-a)*u;
const fmt=n=>+(+n).toFixed(2);
const bump=u=>u<=0||u>=1?0:Math.sin(Math.PI*u);
const settle=d=>d<=0?0:Math.exp(-7*d)*Math.sin(d*20);
const frac=v=>v-Math.floor(v);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const txt=(x,y,s,size=28,fill=INK)=>`<text x="${fmt(x)}" y="${fmt(y)}" font-family="${F}" font-weight="500" font-size="${fmt(size)}" fill="${fill}" text-anchor="middle">${esc(s)}</text>`;
const quad=(a,c,b,u)=>[lerp(lerp(a[0],c[0],u),lerp(c[0],b[0],u),u),lerp(lerp(a[1],c[1],u),lerp(c[1],b[1],u),u)];

const SELECT=[24.2,25.8,27.4],REVIEW=[12.8,13.3,13.8];
const EXTRA={docs:34.2,perf:35,compat:37,migrate:38.6,feedback:42.6};
const QUEUE=['T00','T01','test','interface','feature','docs','perf','compat','migrate','feedback'];
const LAB={T00:'旧任务',T01:'T01',test:'测试',interface:'界面',feature:'需求',docs:'补测',perf:'调整',compat:'新需',migrate:'迁移',feedback:'反馈'};
const ICON={test:'test',docs:'test',interface:'ui',perf:'ui',feature:'pause'};
const CAND={test:0,interface:1,feature:2};
const TRIG=[...SELECT,31.6,33.6,34.2,35,37,38.6,42.6];
const ARRIVE=[19.4,...SELECT.map(s=>s+1.1),34.2,35,37,38.6,42.6];

export function performanceDefinitions(){
 return '<filter id="perf-smear" x="-40%" y="-20%" width="180%" height="140%"><feGaussianBlur stdDeviation="7 0.6"/></filter>'
  +'<clipPath id="perf-vignette"><path d="M120 722Q110 690 160 692L580 698Q620 700 616 740L612 984Q610 1000 590 1000H132Q106 998 106 970Z"/></clipPath>';
}

function starPath(r,ri=r*.42){let d='';for(let i=0;i<16;i++){const a=Math.PI*i/8-Math.PI/2,rr=i%2?ri:r;d+=(i?'L':'M')+fmt(Math.cos(a)*rr)+' '+fmt(Math.sin(a)*rr);}return d+'Z';}
const star=(x,y,r,rot,fill,stroke='none')=>`<path transform="translate(${fmt(x)} ${fmt(y)}) rotate(${fmt(rot)})" d="${starPath(r)}" fill="${fill}" stroke="${stroke}" stroke-width="1.5" stroke-linejoin="round"/>`;
function burst(x,y,u,color,r=26){
 if(u<0||u>1)return '';const e=smooth(u*1.4);let d='';
 for(let i=0;i<8;i++){const a=Math.PI*i/4+.2,r0=r*(.3+.4*e),r1=r*(.5+e);d+=`M${fmt(x+Math.cos(a)*r0)} ${fmt(y+Math.sin(a)*r0)}L${fmt(x+Math.cos(a)*r1)} ${fmt(y+Math.sin(a)*r1)}`;}
 return `<path d="${d}" stroke="${color}" stroke-width="4" stroke-linecap="round" opacity="${fmt(1-u)}"/>`;
}
const check=(x,y,s=1)=>`<g transform="translate(${fmt(x)} ${fmt(y)}) scale(${fmt(s)})"><circle r="14" fill="${GREEN}" stroke="${INK}" stroke-width="2"/><path d="M-6 0L-2 5L7 -5" stroke="${PAPER}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`;
// Painted subjects retain native aspect; only labels and action/status marks remain procedural.
const raster=(id,x,y,w,h,opacity=1)=>`<use href="#asset-${id}" x="${fmt(x)}" y="${fmt(y)}" width="${fmt(w)}" height="${fmt(h)}" opacity="${fmt(opacity)}"/>`;
function smear(p,prev,cx,cy){
 if(!p||!prev)return '';
 const dx=p.x-prev.x,dy=p.y-prev.y,l=Math.hypot(dx,dy);if(l<3)return '';
 const ux=dx/l,uy=dy/l,len=Math.min(90,l*9);let d='';
 for(const k of [-14,0,14])d+=`M${fmt(cx-ux*(24+len)-uy*k)} ${fmt(cy-uy*(24+len)+ux*k)}L${fmt(cx-ux*24-uy*k)} ${fmt(cy-uy*24+ux*k)}`;
 return `<path d="${d}" stroke="${INK}" stroke-width="5" stroke-linecap="round" opacity=".35" />`;
}
function paperDoc({x,y,w=190,h=96,rot=0,label,state,id,human=false,ok=false}){
 const p=clamp((h-96)/84),mark=state==='candidate'?'#8A929B':state==='selected'||state==='partial'||state==='rework'||state==='awaiting-review'?ORANGE:state==='scheduled'?BLUE:GREEN;
 return `<g data-task="${id}" data-state="${state}"${human?' data-source="human"':''} transform="translate(${fmt(x)} ${fmt(y)}) rotate(${fmt(rot)} ${fmt(w/2)} ${fmt(h/2)})">`
  +raster('document-landscape',0,0,w,h,1-p)+raster('document-portrait',0,0,w,h,p)
  +txt(w/2,lerp(h*.59,h-30,p),label,lerp(30,36,p))
  +(state==='candidate'?`<path d="M${fmt(w*.2)} ${fmt(h-10)}H${fmt(w*.8)}" stroke="${mark}" stroke-width="2" stroke-dasharray="5 5"/>`:`<circle cx="${fmt(w*.82)}" cy="${fmt(h*.18)}" r="5" fill="${mark}"/>`)
  +(state==='partial'?`<path d="M${fmt(w*.2)} ${fmt(h-12)}H${fmt(w*.5)}" stroke="${ORANGE}" stroke-width="4" stroke-linecap="round"/>`:'')
  +(human?`<circle cx="${fmt(w*.8)}" cy="${fmt(h*.8)}" r="5" fill="${BLUE}"/>`:'')+(ok?check(w*.83,h*.12):'')+'</g>';
}
function avatar(kind,x,y,s=1,mood=''){
 const role=kind==='human'?'programmer':'agent',expression=mood==='focus'||mood==='think'?'focus':'neutral';
 return `<g data-avatar="${kind}" data-expression="${expression}" transform="translate(${fmt(x)} ${fmt(y)}) scale(${fmt(s*1.45)})">${raster('avatar-'+role+'-'+expression,-52,-62,104,124)}</g>`;
}

export function storyAccents(state){
 const t=state.t;if(t>=16)return '';let s='';
 if(t<2.65){
  for(let i=0;i<5;i++){const v=t*7+i*1.7,k=Math.floor(v),p=frac(v),x=800+(k*53+i*97)%300,y=846-(k*31)%22-p*16;
   s+=`<path d="M${fmt(x)} ${fmt(y)}v-9M${fmt(x+8)} ${fmt(y+2)}l5 -7" stroke="${PAPER}" stroke-width="3" stroke-linecap="round" opacity="${fmt((1-p)*.75)}"/>`;}
  
 }
 s+=burst(1050,826,(t-4.2)/.4,ORANGE,30);
 if(t>=6.6&&t<11.2){
  const o=smooth((t-6.6)/.3)*(1-smooth((t-10.95)/.25));
  s+=`<g data-agent-thinking="loading" opacity="${fmt(o)}">`+star(1700,305,17,t*140,ORANGE,INK);
  for(let i=0;i<3;i++)s+=`<circle cx="${1728+13*i}" cy="318" r="${fmt(2.5+2*bump(frac(t*1.6-i*.22)))}" fill="${INK}"/>`;
  s+='</g>';
 }
 if(t>=11.2&&t<12){
  const p=smooth((t-11.2)/.22)*(1-smooth((t-11.8)/.2));
  s+=`<g data-agent-thinking="feedback" transform="translate(1700 300) scale(${fmt(p)})"><path d="M-26 -22H26Q32 -22 32 -16V14Q32 20 26 20H-6L-16 30L-14 20H-26Q-32 20 -32 14V-16Q-32 -22 -26 -22Z" fill="${PAPER}" stroke="${INK}" stroke-width="2"/>${raster('document-portrait',-21,-17,24,32)}${check(12,4,.55)}</g>`
   +burst(1700,300,(t-11.2)/.4,ORANGE,38);
 }
 const ia=state.interaction,f=ia?.file;
 if(f&&ia.owner==='transfer'){const pv={x:f.x-9*bump(ia.progress*1.9),y:f.y};s+=smear(f,{x:f.x-12,y:pv.y+2},f.x+30,f.y+37);}
 s+=burst(1432,462,(t-6.35)/.45,ORANGE,32);
 REVIEW.forEach((c,i)=>s+=burst(987,421+40*i,(t-c)/.35,i<2?GREEN:ORANGE,24));
 return `<g data-layer="perf-accents">${s}</g>`;
}

function backdrop(q){
 const R=lerp(1860,2740,q),B=lerp(610,480,q);
 return `<path data-layer="diagram-backdrop" d="M560 96Q596 38 770 50L${fmt(R-170)} 40Q${fmt(R)} 48 ${fmt(R)} 170L${fmt(R-12)} ${fmt(B-90)}Q${fmt(R-34)} ${fmt(B)} ${fmt(R-210)} ${fmt(B)}L780 ${fmt(B+12)}Q572 ${fmt(B)} 562 ${fmt(B-120)}Z" fill="${PAPER}" fill-opacity=".95"/>`;
}
function fileA(t){
 if(t<16.4)return null;
 if(t<17){const v=smooth((t-16.4)/.6);return {x:lerp(730,830,v),y:lerp(300,330,v)-30*bump(v),rot:lerp(-8,0,v)};}
 if(t<19.4){const v=smooth((t-17)/2.4),[x,y]=quad([830,330],[1080,620],[1340,330],v);return {x,y,rot:-4*Math.sin(v*Math.PI*2)};}
 return {x:1340,y:330,rot:5*settle(t-19.4)};
}
function phaseA(t){
 const f=fileA(t),o=smooth((t-19.6)/.7),hl=1-smooth((t-19.2)/.6),hr=smooth((t-20.6)/.5),rv=smooth((t-21.4)/.4);
 let s=`<g data-gap="offline" opacity="${fmt(o)}"><path d="M740 250Q1090 110 1450 250" fill="none" stroke="${BLUE}" stroke-width="3" stroke-dasharray="10 8" opacity=".6"/><path d="M1098 176A26 26 0 1 0 1098 224A20 20 0 1 1 1098 176Z" fill="${BLUE}"/><rect x="1060" y="244" width="46" height="72" fill="none" stroke="${INK}" stroke-width="3"/><path d="M1060 244L1092 254V324L1060 316Z" fill="${PAPER}" stroke="${INK}" stroke-width="2"/></g>`;
 s+=`<g opacity="${fmt(hl)}">${avatar('human',680,300+6*bump((t-16.1)/.3)-14*bump((t-16.4)/.4),1,t<17?'focus':'')}${txt(680,445,'派发')}</g>`;
 if(f){
  const pa=fileA(clamp(t,17,19.4)),go=smooth((t-19.6)/.6),ax=lerp(pa.x+130,1210,go),ay=lerp(pa.y-50,520,go);
  s+=`<g opacity="${fmt(smooth((t-16.7)/.3))}">${avatar('agent',ax,ay,.9,t<19.4?'think':'happy')}</g>`;
  if(t<19.4)s+=smear(f,fileA(t-.05),f.x+60,f.y+37);
  s+=paperDoc({...f,w:120,h:74,label:'T01',state:'partial',id:'T01',human:t>=22.2})+burst(1400,367,(t-19.4)/.4,ORANGE,30);
 }
 s+=`<g opacity="${fmt(hr)}">${avatar('human',1530-30*rv,300,1,rv>0&&t<22.6?'focus':'happy')}${txt(1530,445,'审核')}</g>`;
 const m=bump((t-21.4)/1.1);
 if(m)s+=`<g opacity="${fmt(Math.min(1,m*2))}"><circle cx="1392" cy="360" r="22" fill="none" stroke="${INK}" stroke-width="4"/><path d="M1408 376L1424 392" stroke="${INK}" stroke-width="6" stroke-linecap="round"/></g>`;
 return s+burst(1400,367,(t-22.2)/.4,BLUE,34);
}

const slot=i=>({x:1110+(i>2?(i-3)*80:0),y:i<3?190+110*i:80,rot:i%2?2:-2});
const qpos=k=>({x:640+190*QUEUE.indexOf(k),y:160,rot:0,w:176,h:180});
function docPosB(k,t){
 if(k in CAND){
  const i=CAND[k],S=SELECT[i],home={x:760,y:190+110*i,rot:-2+2*i},u=(t-S-.2)/.9;
  if(u<=0)return {...home,x:home.x+6*bump((t-S+.1)/.3)};
  if(u<1){const v=smooth(u),[x,y]=quad([home.x,home.y],[960,home.y-130],[slot(i).x,slot(i).y],v);return {x,y,rot:lerp(home.rot,slot(i).rot,v)};}
  const d=t-S-1.1;return {...slot(i),rot:slot(i).rot+6*settle(d),y:slot(i).y+4*settle(d)};
 }
 if(k==='docs'||k==='perf'){const sl=slot(k==='docs'?3:4),v=smooth((t-EXTRA[k])/.6),[x,y]=quad([1420,40],[1300,0],[sl.x,sl.y],v);return {x,y,rot:sl.rot+6*settle(t-EXTRA[k]-.6)};}
 if(k==='T00')return {x:1460,y:160,rot:0};
 return {x:1460,y:270,rot:0};
}
function posAt(k,t,q){
 if(t>=35.5&&k in EXTRA&&EXTRA[k]>=37){const p=qpos(k),d=t-EXTRA[k];return {...p,y:p.y-150*(1-smooth(d/.5)),rot:5*settle(d-.5)};}
 const a=docPosB(k,t),b=qpos(k);return {x:lerp(a.x,b.x,q),y:lerp(a.y,b.y,q),rot:lerp(a.rot,0,q),w:lerp(190,176,q),h:lerp(96,180,q)};
}
const HK=[[23.3,[640,560]]];
SELECT.forEach((S,i)=>HK.push([S-.55,[650,230+110*i]],[S+.35,[650,230+110*i]]));
HK.push([28.2,[640,560]],[30.6,[640,560]],[31.3,[1560,540]],[32.2,[1560,540]],[33.2,[640,560]]);
function interp(keys,t){
 const i=keys.findLastIndex(k=>k[0]<=t);if(i<0)return keys[0][1];
 const a=keys[i],b=keys[Math.min(i+1,keys.length-1)],v=a===b?0:smooth((t-a[0])/(b[0]-a[0]));
 return [lerp(a[1][0],b[1][0],v),lerp(a[1][1],b[1][1],v)];
}
function agentAt(t,q){
 for(const k of Object.keys(CAND)){const S=SELECT[CAND[k]];if(t>=S+.2&&t<S+1.1){const p=docPosB(k,t);return [p.x+65,Math.max(115,p.y-110),'think'];}}
 for(const k of ['docs','perf'])if(t>=EXTRA[k]&&t<EXTRA[k]+.6){const p=docPosB(k,t);return [p.x+65,Math.max(115,p.y-110),'think'];}
 if(t<37){const b=qpos('perf');return [lerp(1390,b.x+90,q),lerp(540,b.y+290,q),''];}
 for(const k of ['compat','migrate'])if(t>=EXTRA[k]&&t<EXTRA[k]+.5){const p=posAt(k,t,1);return [p.x+90,Math.max(400,p.y+290),'think'];}
 if(t<39.1){const p=qpos(t<38.6?'compat':'migrate');return [p.x+90,p.y+290,'happy'];}
 const keys=['test','interface','feature','docs','perf','compat','migrate'],tt=Math.min(t,44.2),h=(tt-39.1)/.9,i=Math.floor(h)%keys.length,j=(i+1)%keys.length,u=smooth(frac(h));
 const a=qpos(keys[i]),b=qpos(keys[j]);return [lerp(a.x,b.x,u)+90,lerp(a.y,b.y,u)+290-40*bump(u),''];
}
function docs(state,q){
 const {t,taskStates:ts}=state;
 let s=`<g opacity="${fmt(1-q)}">${raster('plan-tray',1070,480,290,85)}</g>`;
 if(state.endpoint!=null)s+=`<path d="M640 250H${fmt(state.endpoint)}" stroke="${BLUE}" stroke-width="3" opacity="${fmt(q*.6)}"/>`;
 const ap=agentAt(t,q);
 for(const k of QUEUE){
  const st=ts[k];if(!st)continue;const p=posAt(k,t,q);
  if(k in CAND&&t>SELECT[CAND[k]]+.2&&t<SELECT[CAND[k]]+1.1){const prev=posAt(k,t-1/30,q);s+=smear(p,prev,p.x+80,p.y+36);}
  s+=paperDoc({...p,label:LAB[k],state:st,id:k,ico:ICON[k],human:st==='scheduled'||st==='selected',ok:st==='accepted'});
  if(k in CAND)s+=burst(p.x+90,p.y+50,(t-SELECT[CAND[k]]-1.1)/.32,BLUE,26);
  if(k in CAND)s+=burst(p.x+10,p.y+40,(t-SELECT[CAND[k]])/.4,ORANGE,34);
 }
 s+=`<g opacity="${fmt(1-q)}"><svg x="1070" y="534" width="290" height="31" viewBox="0 54 290 31" overflow="hidden">${raster('plan-tray',0,0,290,85)}</svg></g>`;
 if(ts['T01-R']&&t<33.6){
  const m=smooth((t-32.6)/1),x=lerp(1640,1460,m),y=lerp(410,270,m);
  s+=`<g opacity="${fmt(1-m)}">${paperDoc({x,y,label:'T01-R',state:ts['T01-R'],id:'T01-R',human:t>=31.6,ok:t>=32})}</g>`+burst(1650,450,(t-31.6)/.4,BLUE,34)+burst(1460,310,(t-33.6)/.4,GREEN,40);
 }
 s+=burst(1460,310,(t-33.6)/.4,GREEN,40);
 s+=avatar('agent',ap[0],ap[1],.9,ap[2]);
 if(ap[2]==='think')s+=star(ap[0]+64,ap[1]-60,9,t*150,ORANGE);
 if(t<35.5){const [hx,hy]=interp(HK,t),hit=TRIG.slice(0,4).some(c=>t>c-.12&&t<c+.2);
  s+=`<g opacity="${fmt(smooth((t-23)/.4))}">${avatar('human',hx+(hit?16:0),hy,.95,hit?'focus':'')}</g>`;}
 if(state.endpoint!=null){
  const e=state.endpoint,flag=(x,o,c)=>`<g data-endpoint="${fmt(x)}" opacity="${fmt(o)}"><path d="M${fmt(x)} 430V328" stroke="${INK}" stroke-width="4"/><path d="M${fmt(x)} 330L${fmt(x+42)} 344L${fmt(x)} 358Z" fill="${c}"/><ellipse cx="${fmt(x)}" cy="432" rx="16" ry="5" fill="${INK}" opacity=".4"/></g>`;
  if(e>1016)s+=flag(1015,.3,'#B9B2A4');
  s+=flag(e,smooth((t-35.5)/.6),ORANGE);
 }
 return s;
}

function progPose(t){
 if(t<23.3)return t<18?'input':t<18.8?'release-half':t<21.4?'rest':t<21.6?'release-half':t<22.6?'lean':'input';
 const c=[...TRIG].reverse().find(x=>t>=x-.35);if(c==null||t>=44.2)return 'input';
 const d=t-c;return d<-.15?'release-half':d<.8?'lean':'input';
}
function agentPose(t){
 if(t<23)return t>=17&&t<19.4?'inspect-file':t>=19.4&&t<20.6?'report':'idle';
 const win=[...SELECT.map(s=>s+.2),34.2,35,37,38.6].find(a=>t>=a&&t<a+2);
 return win==null||t>=44.2?'idle':t<win+.9?'inspect-file':'report';
}
export function performanceActors(t){
 const c=TRIG.find(x=>t>=x-.35&&t<x),dip=c?3*bump((t-c+.35)/.25):0;
 return {programmer:{id:'programmer-'+progPose(t),x:263.5,baseline:982.8+dip,flip:false,scaleOverride:.1505},agent:{id:'agent-'+agentPose(t),x:545,baseline:1000,rotation:0,scaleOverride:.16}};
}
function vignette(state,bundle,drawPose){
 const t=state.t,pp=progPose(t),c=TRIG.find(x=>t>=x-.35&&t<x),dip=c?3*bump((t-c+.35)/.25):0;
 const lit=pp==='lean'||pp==='input',screen=pp==='rest'?'#3A4552':pp==='lean'?'#E3EEF0':'#A9BCC6';
 let s=`<g data-layer="vignette" clip-path="url(#perf-vignette)"><path d="M120 722Q110 690 160 692L580 698Q620 700 616 740L612 984Q610 1000 590 1000H132Q106 998 106 970Z" fill="${PAPER}" fill-opacity=".5"/>`
  +`<g transform="translate(50 630) scale(.35)">${raster('workstation-painted',0,0,1920,1080)}</g>`
  +`<rect x="258.6" y="750.05" width="189" height="93.8" rx="2" fill="${screen}" opacity=".65"/>`
  +(lit&&pp==='lean'?star(423,764,7,t*90,ORANGE):'');
 const actors=performanceActors(t);s+=drawPose(actors.programmer,bundle)
  +`<g transform="translate(50 630) scale(.35)">${raster('chair-back-painted',483,663,265,296)}</g>`+drawPose(actors.agent,bundle);
 const arr=ARRIVE.filter(a=>a<=t);
 arr.forEach((a,i)=>{const d=t-a,y=847-9*(i+1)-40*(1-smooth(d/.25));s+=`<g transform="rotate(${fmt((i%2?2:-2)+4*settle(d-.25))} 150 ${fmt(y+4)})">${raster('document-landscape',116,y-20,68,34)}</g>`;});
 const nx=ARRIVE.find(a=>t>=a-.35&&t<a);
 if(nx!=null){const v=smooth((t-nx+.35)/.35),[x,y]=quad([520,760],[330,690],[150,820],v),[px,py]=quad([520,760],[330,690],[150,820],Math.max(0,v-.12));
  s+=smear({x,y},{x:px,y:py},x,y)+raster('document-portrait',x-14,y-17,28,34);}
 return s+'</g>';
}

export function visualLogic(state,bundle,drawPose){
 const t=state.t,c=state.camera,q=smooth((t-35.5)/1.5),cam=`scale(${fmt(c.scale)}) translate(${fmt(-c.x)} ${fmt(-c.y)})`;
 return `<g data-layer="background" filter="url(#cam-blur-bg)" transform="translate(${fmt(-(c.bgShift||0))} 0)"><use href="#asset-room-day" x="-60" y="-34" width="2040" height="1148"/></g>`
  +`<g data-layer="camera" transform="${cam}">${backdrop(q)}${t<23?phaseA(t):docs(state,q)}</g>`+vignette(state,bundle,drawPose);
}
