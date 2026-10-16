// S01 performance-v02 compositor: 12-shot framing over intact cel poses. t is supplied by the player; no timers or randomness.
import {asset,label,rootSvg,clamp,smooth,lerp} from '../../characters/rigs/runtime/rig.mjs';
import {programmerMotion,agentMotion,workingAgent,CALIBRATION} from './keyframes.mjs';
import {performanceDefinitions,storyAccents,visualLogic,performanceActors} from './performance.mjs';

export const CAMERA_BEATS=[
 {id:'S01-01',start:0,end:3,name:'正面近景·深夜',mode:'front'},
 {id:'S01-02',start:3,end:5,name:'决定派发',mode:'front'},
 {id:'S01-03',start:5,end:8,name:'越肩·T01交给Agent',mode:'rear'},
 {id:'S01-04',start:8,end:10,name:'关屏·起身',mode:'rear'},
 {id:'S01-05',start:10,end:12,name:'Agent近景·夜到昼',mode:'agent'},
 {id:'S01-06',start:12,end:16,name:'人工验收·T01-R退回',mode:'rear'},
 {id:'S01-07',start:16,end:20,name:'头像交接·派发与审核',mode:'standing'},
 {id:'S01-08',start:20,end:23,name:'离开电脑·执行继续',mode:'standing'},
 {id:'S01-09',start:23,end:30,name:'选择·搬运·进入计划',mode:'standing'},
 {id:'S01-10',start:30,end:37,name:'复核·再次查看·清单增长',mode:'standing'},
 {id:'S01-11',start:37,end:41,name:'拉远揭示清单',mode:'standing'},
 {id:'S01-12',start:41,end:45,name:'跟移终点',mode:'standing'}
];
const SELECT=[24.2,25.8,27.4],REVIEW=[12.8,13.3,13.8],STEPS=[6.4,7,7.6];
const EXTRA=[['docs',34.2],['perf',35],['compat',37],['migrate',38.6],['feedback',42.6]];
export const CAMERA_LAYOUT={version:'S01_CAMERA_PREVIEW v0.2',script:'S01_CAMERA v0.3',
 front:{room:[-8,-5,1936,1090],pose:[510.33,70,899.34,1063.92],monitorBack:[360,844,1200,337.5],push:.03},
 rear:{desk:[180,620,1110,123],deskLegs:[180,659,1110,308],monitor:[600,320,544,374],screen:[627.2,343.8,489.6,275.4],keyboard:[440,649,405,67],mouse:[875,650,43,58],
  chairSeat:[480,813,265,205],chairRear:[483,663,265,296],review:[740,356,366,252],taskPanel:[1170,300,250,180],
  ots:{x:165,y:90,scale:1.15},wide:{x:0,y:0,scale:1},agentCrop:{x:1137.6923,y:250,scale:2.6}},
 standing:{programmer:[84.8,223.32,532.48,798.72],agent:[1394,281.28,491.52,737.28],floor:1008,fill:'#F6F1E7',fillOpacity:.97,
  backdrop:{time:[600,65,1120,390],workflow:[600,65,1120,470],queue:[600,65,2040,360]},textSafeRight:1370,lanes:[[630,'待评估'],[875,'已排期'],[1120,'验收']]},
 human:{reviewClicks:REVIEW,select:SELECT,approveT01R:31.6,checkT01R:32,mergeT01R:[32.6,33.6]},
 endpoint:{reference:1015,referenceFrom:35.5,final:2560,move:[41,44.2]},
 logic:{stage:'acting cartoon avatars + folded documents',vignette:[106,692,510,308],performanceModule:'performance.mjs'},
 layerOrder:['room (blurred, own parallax)','local diagram backdrop','documents','acting avatars','screen-space workstation vignette + intact actors','action accents','debug only'],
 note:'Every pose drawn once at native aspect; front uses explicit rects, rear uses CALIBRATION baselines, logic uses compact workstation actor states. No limb assembly or body crossfades.'};
const R=CAMERA_LAYOUT.rear,S=CAMERA_LAYOUT.standing;
const fmt=n=>+(+n).toFixed(4);

const REVIEW_KEYS=[[12.2,[1060,580]],[12.6,[985,420]],[12.95,[985,420]],[13.15,[985,460]],[13.45,[985,460]],[13.65,[985,500]],[13.95,[985,500]],[14.4,[1045,550]]];
const FLOW_KEYS=[[23.3,[760,500]]];
SELECT.forEach((c,i)=>{const y=210+64*i;FLOW_KEYS.push([c-.15,[790,y]],[c+.3,[790,y]],[c+1.1,[1035,y]]);});
FLOW_KEYS.push([29,[1035,488]],[30.6,[1035,488]],[31.45,[1280,338]],[31.9,[1280,338]],[33.5,[900,520]]);
function interp(keys,t){
 const i=keys.findLastIndex(k=>k[0]<=t);if(i<0)return keys[0][1];
 const a=keys[i],b=keys[Math.min(i+1,keys.length-1)],v=a===b?0:smooth((t-a[0])/(b[0]-a[0]));
 return [lerp(a[1][0],b[1][0],v),lerp(a[1][1],b[1][1],v)];
}
function cursorAt(t){
 const keys=t>=12.2&&t<14.4?REVIEW_KEYS:t>=23.3&&t<33.5?FLOW_KEYS:null;if(!keys)return null;
 const [x,y]=interp(keys,t),H=CAMERA_LAYOUT.human,click=[...H.reviewClicks,...H.select,H.approveT01R].find(c=>t>=c&&t-c<.35);
 return {actor:'human',x:fmt(x),y:fmt(y),click:click??null};
}
function taskStates(t){
 const s={T00:t<23?null:'accepted',
  T01:t<5?'unfinished':t<6.6?'handoff':t<11.2?'running':t<12?'generated':t<13.8?'reviewing':t<33.6?'partial':'accepted',
  'T01-R':t<13.8?null:t<15.6?'returned':t<30?'rework':t<31.6?'awaiting-review':t<33.6?'approved':'merged'};
 ['test','interface','feature'].forEach((k,i)=>s[k]=t<23?null:t<SELECT[i]?'candidate':t<SELECT[i]+1.1?'selected':'scheduled');
 for(const [k,at] of EXTRA)s[k]=t<at?null:k==='feedback'?'candidate':'scheduled';
 return s;
}

export function sampleCameraScene(t){
 t=clamp(Number(t)||0,0,45);
 const beat={...(CAMERA_BEATS.find(b=>t>=b.start&&t<b.end)||CAMERA_BEATS.at(-1))};
 const seated={id:'programmer-input',x:610,baseline:1008,flip:false};
 let programmer=null,agent=null,interaction=null,camera={x:0,y:0,scale:1,bgShift:0,actorScale:1,actorDx:0};
 if(t<5){
  const s=1+CAMERA_LAYOUT.front.push*smooth(clamp(t/3));
  camera={...camera,x:960*(1-1/s),y:540*(1-1/s),scale:s};
  const blink=t>=1.68&&t<1.85;
  const tap=t<2.6?Math.exp(-14*((t+.09)%.28)):0;
  const settle=t>=3&&t<3.28?-3*Math.sin((t-3)/.28*Math.PI):0;
  programmer={id:blink?'programmer-front-fatigue':t<3?'programmer-front-neutral':'programmer-front-dispatch',rect:CAMERA_LAYOUT.front.pose.map((v,i)=>i===1?v+tap*1.8+settle:v)};
 }else if(t<8){
  programmer=seated;interaction={...agentMotion('receive',(t-5)/2.6),doc:'T01'};agent=interaction.actor;camera={...camera,...R.ots};
 }else if(t<10){
  programmer=t<8.8?programmerMotion('release',(t-8)/.8):programmerMotion('rise',.8*(t-8.8)/1.2);agent=workingAgent(t-8);camera={...camera,...R.wide};
 }else if(t<12){
  agent=t<11.2?workingAgent(t-8):{id:'agent-hold-file',x:1580,baseline:1008,rotation:0};camera={...camera,...R.agentCrop};
 }else if(t<16){
  programmer=seated;camera={...camera,...R.ots};
  if(t<14.4)agent={id:'agent-idle',x:1580,baseline:1008,rotation:0};
  else{interaction={...agentMotion('receive',(t-14.4)/1.6),doc:'T01-R'};agent=interaction.actor;}
 }else{
  ({programmer,agent}=performanceActors(t));
  if(t>=37){const p=smooth((t-37)/4),q=smooth((t-41)/3.2);camera={x:300*p+260*q,y:0,scale:1-.2*p,bgShift:30*p+16*q,actorScale:1-.1*p,actorDx:-24*q};}
 }
 if(programmer&&[3,8.18,8.5,8.98,9.24,9.61,9.89].some(at=>t>=at&&t<at+2/30))programmer.motionBlur=true;
 const E=CAMERA_LAYOUT.endpoint,endpoint=t<E.referenceFrom?null:t<E.move[0]?E.reference:lerp(E.reference,E.final,smooth((t-E.move[0])/(E.move[1]-E.move[0])));
 return {t,beat,mode:beat.mode,programmer,agent,interaction,day:smooth((t-10)/1.6),camera,taskStates:taskStates(t),cursor:cursorAt(t),endpoint};
}

export function cameraDefinitions(bundle){
 let s='<clipPath id="cam-frame"><rect width="1920" height="1080"/></clipPath>'
  +'<filter id="cam-blur-bg" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="3"/></filter>'
  +'<filter id="cam-blur-fg" x="-5%" y="-10%" width="110%" height="120%"><feGaussianBlur stdDeviation="4"/></filter>';
 for(const [id,a] of Object.entries(bundle.assets))s+='<symbol id="asset-'+id+'" viewBox="0 0 '+a.width+' '+a.height+'" preserveAspectRatio="none"><image href="'+a.dataUri+'" width="'+a.width+'" height="'+a.height+'"/></symbol>';
 for(const [id,a] of Object.entries(bundle.poses))s+='<symbol id="pose-'+id+'" viewBox="0 0 '+a.width+' '+a.height+'"><image href="'+a.dataUri+'" width="'+a.width+'" height="'+a.height+'"/></symbol>';
 return '<defs>'+s+'<filter id="cam-pose-smear"><feGaussianBlur stdDeviation="2.2 .5"/></filter>'+performanceDefinitions()+'</defs>';
}

function drawPose(q,bundle){
 if(q?.motionBlur){const clean={...q,motionBlur:false};return '<g data-motion="pose-buffer" filter="url(#cam-pose-smear)">'+drawPose(clean,bundle)+'</g>';}
 const d=q&&bundle.poses[q.id];if(!d)return '';
 if(q.rect){const [x,y,w,h]=q.rect;return '<use data-pose="'+q.id+'" href="#pose-'+q.id+'" x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'"/>';}
 const c=CALIBRATION[q.id]||{},ag=q.id.startsWith('agent'),s=q.scaleOverride??c.scale??(ag?.47:.53),bottom=c.bottom??(ag?1515:1462),center=c.center??d.width/2;
 return '<g data-pose="'+q.id+'" transform="translate('+fmt(q.x)+' '+fmt(q.baseline)+') rotate('+fmt(q.rotation||0)+')'+(q.flip?' scale(-1 1)':'')+'"><use href="#pose-'+q.id+'" x="'+fmt(-center*s)+'" y="'+fmt(-bottom*s)+'" width="'+fmt(d.width*s)+'" height="'+fmt(d.height*s)+'"/></g>';
}
const paper=({x,y,rotation=0},doc)=>'<g data-document="'+doc+'" transform="translate('+fmt(x)+' '+fmt(y)+') rotate('+fmt(rotation)+' 30 37)"><path d="M0 0H60V74H0Z" fill="#F6F1E7" stroke="#263342" stroke-width="1.5"/><path d="M13 24H47M13 35H47M13 46H43" fill="none" stroke="#777779" stroke-width="3" stroke-linecap="round"/></g>';
const chip=(x,y,w,text,id)=>'<g data-chip="'+id+'"><rect x="'+x+'" y="'+y+'" width="'+w+'" height="44" rx="6" fill="#FFFDF8" stroke="#263342" stroke-width="2"/>'+label(x+12,y+31,text,24)+'</g>';
function cursorSvg(c){
 if(!c)return '';
 return '<g data-actor="human-cursor" data-click="'+(c.click??'')+'">'+(c.click!=null?'<circle cx="'+c.x+'" cy="'+c.y+'" r="22" fill="none" stroke="#E9B468" stroke-width="4"/>':'')+asset('cursor',fmt(c.x-4),fmt(c.y-2),32,44)+'</g>';
}

function drawFront(state,bundle){
 const F=CAMERA_LAYOUT.front;
 return '<g data-layer="background" filter="url(#cam-blur-bg)">'+asset('room-reverse-night',...F.room)+'</g>'+drawPose(state.programmer,bundle)
  +'<g data-layer="foreground" filter="url(#cam-blur-fg)">'+asset('monitor-back',...F.monitorBack)+'</g>';
}
function drawReview(t){
 const [x,y,w,h]=R.review;
 let s='<g data-layer="review"><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="6" fill="#F6F1E7" opacity=".96"/>'+label(758,392,'T01 人工验收',28);
 ['编写代码','运行测试','整理结果'].forEach((n,i)=>{
  const ry=432+40*i,st=t<REVIEW[i]?'pending':i<2?'pass':'rework';
  s+='<g data-step="'+i+'" data-review="'+st+'">'+label(758,ry,n,26)+(st==='pending'?label(972,ry,'待核',26,'#8A8F96'):st==='pass'?asset('status-check',972,ry-26,30,30)+label(1008,ry,'通过',26,'#4F7F52'):asset('status-rework',972,ry-26,30,30)+label(1008,ry,'返工',26,'#B4553F'))+'</g>';
 });
 if(t>=13.8)s+=label(758,590,'T01 · 部分验收',28,'#9A7A1E');
 return s+'</g>';
}
function drawRear(state,bundle){
 const {t,interaction:ia}=state,heldByProgrammer=!ia||ia.owner==='programmer';
 const screen=t<5?'screen-idle':t<8.7?'screen-running':'screen-off';
 let s='<g data-layer="background"'+(state.mode==='agent'?' filter="url(#cam-blur-bg)"':'')+'>'+asset('room-night',0,0,1920,1080)+'<g opacity="'+fmt(state.day)+'">'+asset('room-day',0,0,1920,1080)+'</g>'
  +asset('desk-legs',...R.deskLegs)+asset('computer-tower',1045,693,170,255)+asset('desk-surface',...R.desk)+asset('monitor-frame',...R.monitor)+asset(screen,...R.screen)
  +asset('keyboard',...R.keyboard)+asset('mouse',...R.mouse)+asset('desk-lamp',185,333,220,346)+asset('chair-seat',...R.chairSeat)+'</g>';
 if(t>=5&&t<8&&heldByProgrammer)s+=chip(900,470,160,'T01 未完成','T01');
 if(t>=12){s+=drawReview(t);if(t>=13.8&&heldByProgrammer&&t<16)s+=chip(995,530,100,'T01-R','T01-R');s+=cursorSvg(state.cursor);}
 s+=drawPose(state.programmer,bundle)+asset('chair-back-rear',...R.chairRear);
 s+='<g data-layer="foreground-agent">'+drawPose(state.agent,bundle)+'</g>';
 if(ia?.file)s+=paper(ia.file,ia.doc);
 return s;
}

export function drawCameraScene(state,bundle,{debug=false}={}){
 const c=state.camera,cam='scale('+fmt(c.scale)+') translate('+fmt(-c.x)+' '+fmt(-c.y)+')';
 let s='<g clip-path="url(#cam-frame)" data-shot="'+state.beat.id+'" data-mode="'+state.mode+'">';
 s+=state.mode==='standing'?visualLogic({...state,t:Math.min(state.t,44.2)},bundle,drawPose):'<g data-layer="camera" transform="'+cam+'">'+(state.mode==='front'?drawFront(state,bundle):drawRear(state,bundle))+storyAccents(state)+'</g>';
 s+='</g><g data-layer="screen">';

 if(debug){
  s+='<g data-layer="debug">'+label(85,105,state.beat.id+' '+state.beat.name+' t='+state.t.toFixed(2),24)
   +label(85,135,'cam x'+fmt(c.x)+' y'+fmt(c.y)+' s'+fmt(c.scale)+' · '+(state.programmer?.id||'-')+' / '+(state.agent?.id||'-'),24);
  if(state.mode==='standing')s+='<path d="M0 1008H1920" stroke="#CC806F" stroke-width="3" stroke-dasharray="12 8"/>';
  s+='</g>';
 }
 return s+'</g>';
}
export function renderCameraScene(state,bundle,options={}){return rootSvg(drawCameraScene(state,bundle,options),cameraDefinitions(bundle));}
