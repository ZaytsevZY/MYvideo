// S01 camera-v02 compositor: 12-shot framing over intact cel poses. t is supplied by the player; no timers or randomness.
import {asset,label,rootSvg,clamp,smooth,lerp} from '../../characters/rigs/runtime/rig.mjs';
import {programmerMotion,agentMotion,workingAgent,CALIBRATION} from './keyframes.mjs';

export const CAMERA_BEATS=[
 {id:'S01-01',start:0,end:3,name:'正面近景·深夜',mode:'front'},
 {id:'S01-02',start:3,end:5,name:'决定派发',mode:'front'},
 {id:'S01-03',start:5,end:8,name:'越肩·T01交给Agent',mode:'rear'},
 {id:'S01-04',start:8,end:10,name:'关屏·起身',mode:'rear'},
 {id:'S01-05',start:10,end:12,name:'Agent近景·夜到昼',mode:'agent'},
 {id:'S01-06',start:12,end:16,name:'人工验收·T01-R退回',mode:'rear'},
 {id:'S01-07',start:16,end:20,name:'派发/审核与机器执行分轨',mode:'standing'},
 {id:'S01-08',start:20,end:23,name:'离线区间',mode:'standing'},
 {id:'S01-09',start:23,end:30,name:'人选择排期',mode:'standing'},
 {id:'S01-10',start:30,end:37,name:'复核并入，清单延长',mode:'standing'},
 {id:'S01-11',start:37,end:41,name:'拉远揭示清单',mode:'standing'},
 {id:'S01-12',start:41,end:45,name:'跟移终点',mode:'standing'}
];
const SELECT=[24.2,25.8,27.4],REVIEW=[12.8,13.3,13.8],STEPS=[6.4,7,7.6];
const EXTRA=[['docs',34.2],['perf',35],['compat',37],['migrate',38.6],['feedback',42.6]];
export const CAMERA_LAYOUT={version:'S01_CAMERA_PREVIEW v0.1',script:'S01_CAMERA v0.2',
 front:{room:[-8,-5,1936,1090],pose:[510.33,70,899.34,1063.92],monitorBack:[360,844,1200,337.5],push:.03},
 rear:{desk:[180,620,1110,123],deskLegs:[180,659,1110,308],monitor:[600,320,544,374],screen:[627.2,343.8,489.6,275.4],keyboard:[440,649,405,67],mouse:[875,650,43,58],
  chairSeat:[480,813,265,205],chairRear:[483,663,265,296],review:[740,356,366,252],taskPanel:[1170,300,250,180],
  ots:{x:165,y:90,scale:1.15},wide:{x:0,y:0,scale:1},agentCrop:{x:1137.6923,y:250,scale:2.6}},
 standing:{programmer:[84.8,223.32,532.48,798.72],agent:[1394,281.28,491.52,737.28],floor:1008,fill:'#F6F1E7',fillOpacity:.97,
  backdrop:{time:[600,65,1120,390],workflow:[600,65,1120,470],queue:[600,65,2040,360]},textSafeRight:1370,lanes:[[630,'待评估'],[875,'已排期'],[1120,'验收']]},
 human:{reviewClicks:REVIEW,select:SELECT,approveT01R:31.6,checkT01R:32,mergeT01R:[32.6,33.6]},
 endpoint:{reference:1015,referenceFrom:35.5,final:2560,move:[41,44.2]},
 layerOrder:['room (blurred, own parallax)','workstation silhouette','diagram backdrop','diagram content + human cursor','programmer','foreground Agent','screen-space label/debug'],
 note:'Every pose drawn once at native aspect; front/standing use explicit rects, rear uses CALIBRATION baselines. No limb assembly or body crossfades.'};
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
  programmer={id:t<3?'programmer-front-neutral':'programmer-front-dispatch',rect:CAMERA_LAYOUT.front.pose};
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
  programmer={id:'programmer-logic-stand-right',rect:S.programmer};
  const report=(t>=17.5&&t<20)||(t>=23&&t<30)||t>=41.5;
  agent={id:report?'agent-report':'agent-idle',rect:S.agent};
  if(t>=37){const p=smooth((t-37)/4),q=smooth((t-41)/4);camera={x:300*p+260*q,y:0,scale:1-.2*p,bgShift:30*p+16*q,actorScale:1-.1*p,actorDx:-24*q};}
 }
 const E=CAMERA_LAYOUT.endpoint,endpoint=t<E.referenceFrom?null:t<E.move[0]?E.reference:lerp(E.reference,E.final,smooth((t-E.move[0])/(E.move[1]-E.move[0])));
 return {t,beat,mode:beat.mode,programmer,agent,interaction,day:smooth((t-10)/1.6),camera,taskStates:taskStates(t),cursor:cursorAt(t),endpoint};
}

export function cameraDefinitions(bundle){
 let s='<clipPath id="cam-frame"><rect width="1920" height="1080"/></clipPath>'
  +'<filter id="cam-blur-bg" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="3"/></filter>'
  +'<filter id="cam-blur-fg" x="-5%" y="-10%" width="110%" height="120%"><feGaussianBlur stdDeviation="4"/></filter>';
 for(const [id,a] of Object.entries(bundle.assets))s+='<symbol id="asset-'+id+'" viewBox="0 0 '+a.width+' '+a.height+'" preserveAspectRatio="none"><image href="'+a.dataUri+'" width="'+a.width+'" height="'+a.height+'"/></symbol>';
 for(const [id,a] of Object.entries(bundle.poses))s+='<symbol id="pose-'+id+'" viewBox="0 0 '+a.width+' '+a.height+'"><image href="'+a.dataUri+'" width="'+a.width+'" height="'+a.height+'"/></symbol>';
 return '<defs>'+s+'</defs>';
}

function drawPose(q,bundle){
 const d=q&&bundle.poses[q.id];if(!d)return '';
 if(q.rect){const [x,y,w,h]=q.rect;return '<use data-pose="'+q.id+'" href="#pose-'+q.id+'" x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'"/>';}
 const c=CALIBRATION[q.id]||{},ag=q.id.startsWith('agent'),s=q.scaleOverride??c.scale??(ag?.47:.53),bottom=c.bottom??(ag?1515:1462),center=c.center??d.width/2;
 return '<g data-pose="'+q.id+'" transform="translate('+fmt(q.x)+' '+fmt(q.baseline)+') rotate('+fmt(q.rotation||0)+')'+(q.flip?' scale(-1 1)':'')+'"><use href="#pose-'+q.id+'" x="'+fmt(-center*s)+'" y="'+fmt(-bottom*s)+'" width="'+fmt(d.width*s)+'" height="'+fmt(d.height*s)+'"/></g>';
}
const paper=({x,y,rotation=0},doc)=>'<g data-document="'+doc+'" transform="translate('+fmt(x)+' '+fmt(y)+') rotate('+fmt(rotation)+' 30 37)"><path d="M0 0H60V74H0Z" fill="#F6F1E7" stroke="#263342" stroke-width="1.5"/><path d="M13 24H47M13 35H47M13 46H43" fill="none" stroke="#777779" stroke-width="3" stroke-linecap="round"/></g>';
const COL={unfinished:'#687783',candidate:'#687783',selected:'#E9B468',scheduled:'#798DA8',accepted:'#84B79A',partial:'#E9B468','awaiting-review':'#CC806F',approved:'#84B79A'};
function card(x,y,w,h,text,state,id,{size=26,check=state==='accepted',extra=''}={}){
 return '<g data-task="'+id+'" data-state="'+state+'"'+(state==='scheduled'?' data-source="human"':'')+extra+'><rect x="'+fmt(x)+'" y="'+fmt(y)+'" width="'+w+'" height="'+h+'" rx="8" fill="'+(state==='selected'?'#FFF1DE':'#FFFDF8')+'" stroke="'+(COL[state]||'#657E91')+'" stroke-width="3"'+(state==='candidate'?' stroke-dasharray="8 6"':'')+'/>'
  +label(fmt(x+14),fmt(y+h/2+size*.36),text,size)+(check?asset('status-check',fmt(x+w-24),fmt(y-14),32,32):'')+'</g>';
}
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
function taskPanel({t,taskStates:ts},rect=R.taskPanel){
 if(t<5||(t>=12&&t<15.6))return '';
 const [x,y,w,h]=rect;let title,foot,steps=[];
 if(t<12){
  title='T01 · '+(ts.T01==='handoff'?'接收中':ts.T01==='running'?'执行中':'已生成');foot=ts.T01==='generated'?'待人工验收':'未验收';
  const n=STEPS.filter(s=>t>=s).length;steps=['编写代码','运行测试','整理结果'].slice(0,n).map((s,i)=>[s,i===n-1&&ts.T01==='running']);
 }else{title='T01-R · 返工';foot='完成后回到人工复核';}
 let s='<g data-layer="task-panel" data-task="T01" data-state="'+ts.T01+'"><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="10" fill="#F6F1E7" opacity=".95" stroke="#657E91" stroke-width="2"/>'+label(x+16,y+34,title,26);
 steps.forEach(([n,cur],i)=>s+='<circle cx="'+(x+24)+'" cy="'+(y+62+32*i)+'" r="7" fill="'+(cur?'#6DBCCB':'#B9B2A4')+'"/>'+label(x+40,y+70+32*i,n,24,cur?'#263342':'#777779'));
 return s+label(x+16,y+h-14,foot,24,'#8E6FB0')+'</g>';
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
 return s+(state.mode==='agent'?'':taskPanel(state));
}

function timeTracks(t){
 const a=smooth((t-16.4)/.6),b=smooth((t-17.2)/.6),g=smooth((t-18)/1.2),o=smooth((t-20.3)/.7);
 let s=label(640,115,'人工操作与机器执行',34)+label(640,214,'人工',28)+label(640,334,'机器',28)+'<path d="M730 205H1360M730 325H1360" stroke="#B9B2A4" stroke-width="3"/>';
 s+='<g data-node="dispatch" data-actor="human" opacity="'+fmt(a)+'"><rect x="770" y="176" width="150" height="58" rx="10" fill="#E9B468"/>'+label(812,215,'派发',28,'#263342')+label(790,165,'当晚',26)+'</g>';
 s+='<g data-node="review" data-actor="human" opacity="'+fmt(b)+'"><rect x="1195" y="176" width="150" height="58" rx="10" fill="#E9B468"/>'+label(1237,215,'审核',28,'#263342')+label(1215,165,'次日',26)+'</g>';
 s+='<g data-track="machine"><rect x="860" y="305" width="'+fmt(320*g)+'" height="40" rx="8" fill="#6DBCCB"/><g opacity="'+fmt(smooth((g-.5)/.5))+'">'+label(880,334,'执行 T01',26,'#263342')+'</g></g>';
 s+='<g data-segment="offline-gap" data-between="dispatch,review" opacity="'+fmt(o)+'"><rect x="935" y="180" width="245" height="50" fill="#D9CFB8" fill-opacity=".45" stroke="#8C7F66" stroke-dasharray="8 6"/>'
  +'<path d="M935 236V350M1180 236V350" stroke="#8C7F66" stroke-width="2" stroke-dasharray="6 6"/>'+label(1000,272,'离线区间',30)+'</g>';
 return s+label(640,386,'示意，不表示实测时长',26,'#687783')+label(640,430,'离线区间不直接等同自由时间',26,'#687783');
}
function workflow(state){
 const {t,taskStates:ts}=state,q=smooth((t-35.5)/1.5);
 const movingCard=(k,n,x,y)=>{const i=QUEUE.findIndex(a=>a[0]===k);return card(lerp(x,640+190*i,q),lerp(y,135,q),lerp(200,176,q),lerp(54,72,q),n,ts[k],k,{size:lerp(26,33,q)});};
 let s=label(640,112,q>.5?'清单继续延长':t<30?'由人决定进入计划':'旧任务验收，新任务排期',34);
 s+='<g opacity="'+fmt(1-q)+'">';
 S.lanes.forEach(([x,n],i)=>{s+='<g data-lane="'+['evaluation','scheduled','acceptance'][i]+'">'+label(x+14,166,n,28)+'<path d="M'+x+' 176H'+(x+220)+'" stroke="#B9B2A4" stroke-width="2"/></g>';if(i)s+=asset('connector-arrow',x-24,300,22,24);});
 s+='</g><path d="M640 222H2620" stroke="#657E91" stroke-width="3" opacity="'+fmt(q)+'"/>';
 [['test','补齐测试'],['interface','优化界面'],['feature','搁置需求']].forEach(([k,n],i)=>s+=movingCard(k,n,lerp(640,885,smooth((t-SELECT[i]-.3)/.8)),180+64*i));
 [['docs','测试补充'],['perf','界面调整']].forEach(([k,n],i)=>{if(ts[k])s+='<g opacity="'+fmt(smooth((t-EXTRA[i][1])/.5))+'">'+movingCard(k,n,885,372+64*i)+'</g>';});
 s+=movingCard('T00','旧任务',1130,180)+movingCard('T01',ts.T01==='accepted'?'T01 已验收':'T01 部分验收',1130,244);
 if(t>=30&&t<33.6){
  const m=smooth((t-32.6)/1);
  s+='<g opacity="'+fmt(1-m)+'">'+card(1130,lerp(308,244,m),200,54,ts['T01-R']==='awaiting-review'?'T01-R 待复核':'T01-R 已通过',ts['T01-R'],'T01-R',{check:t>=CAMERA_LAYOUT.human.checkT01R})+'</g>';
 }
 s+='<g opacity="'+fmt(1-q)+'">'+label(886,510,'人工排期 · 待验收',26,'#687783')+'</g>';
 if(state.endpoint!=null){const x=state.endpoint;s+='<g data-endpoint="'+fmt(x)+'" opacity="'+fmt(smooth((t-35.5)/.6))+'">'+asset('endpoint-marker',x-17,lerp(135,210,q),34,72)+label(lerp(1240,x-64,q),lerp(112,316,q),'本轮终点',lerp(28,32,q))+'</g>';}
 return s+cursorSvg(state.cursor);
}
const QUEUE=[['T00','旧任务'],['T01','T01 已验收'],['test','补齐测试'],['interface','优化界面'],['feature','搁置需求'],['docs','测试补充'],['perf','界面调整'],['compat','后续需求'],['migrate','新增任务'],['feedback','待评估项']];
function queue(state){
 const {t,taskStates:ts}=state,appear=Object.fromEntries(EXTRA);
 let s=label(640,112,'清单继续延长',36)+'<path d="M640 222H2620" stroke="#657E91" stroke-width="3"/>';
 QUEUE.forEach(([k,n],i)=>{if(!ts[k])return;s+='<g opacity="'+fmt(k in appear?smooth((t-appear[k])/.5):1)+'">'+card(640+190*i,135,176,72,n,ts[k],k,{size:33,extra:k==='feedback'?' data-next-chapter="02"':''})+'</g>';});
 const x=state.endpoint;
 return s+'<g data-endpoint="'+fmt(x)+'">'+asset('endpoint-marker',fmt(x-17),210,34,72)+label(fmt(x-64),316,'本轮终点',32)+'</g>'+label(640,365,'人的项目清单 · 新增项尚未验收',32,'#687783');
}
function drawStanding(state,bundle,cam){
 const {t,camera:c}=state,kind=t<23?'time':t<37?'workflow':'queue';
 let [bx,by,bw,bh]=S.backdrop[kind];
 if(t>=35.5&&t<37){const q=smooth((t-35.5)/1.5);bw=lerp(bw,S.backdrop.queue[2],q);bh=lerp(bh,360,q);}
 let s='<g data-layer="background" filter="url(#cam-blur-bg)" transform="translate('+fmt(-c.bgShift)+' 0)">'+asset('room-day',-60,-34,2040,1148)
  +'<g opacity=".35">'+asset('desk-legs',...R.deskLegs)+asset('desk-surface',...R.desk)+asset('monitor-frame',...R.monitor)+asset('screen-off',...R.screen)+'</g></g>';
 s+='<g data-layer="camera" transform="'+cam+'"><g data-layer="diagram" data-diagram="'+kind+'"><rect data-layer="diagram-backdrop" x="'+bx+'" y="'+by+'" width="'+bw+'" height="'+bh+'" rx="18" fill="'+S.fill+'" fill-opacity="'+S.fillOpacity+'" stroke="#C9C0AE" stroke-width="2"/>'
  +(kind==='time'?timeTracks(t):kind==='workflow'?workflow(state):queue(state))+'</g></g>';
 return s+'<g data-layer="actors" transform="translate('+fmt(960+c.actorDx)+' 1008) scale('+fmt(c.actorScale)+') translate(-960 -1008)">'+drawPose(state.programmer,bundle)
  +'<g data-layer="foreground-agent">'+drawPose(state.agent,bundle)+'</g></g>';
}

export function drawCameraScene(state,bundle,{debug=false}={}){
 const c=state.camera,cam='scale('+fmt(c.scale)+') translate('+fmt(-c.x)+' '+fmt(-c.y)+')';
 let s='<g clip-path="url(#cam-frame)" data-shot="'+state.beat.id+'" data-mode="'+state.mode+'">';
 s+=state.mode==='standing'?drawStanding(state,bundle,cam):'<g data-layer="camera" transform="'+cam+'">'+(state.mode==='front'?drawFront(state,bundle):drawRear(state,bundle))+'</g>';
 s+='</g><g data-layer="screen"><rect x="68" y="12" width="152" height="46" rx="6" fill="#F6F1E7" fill-opacity=".94"/>'+label(85,45,'情境示意',26);
 if(state.mode==='agent')s+='<g transform="translate(-1327.5 -225) scale(1.25)">'+taskPanel(state)+'</g>';
 if(debug){
  s+='<g data-layer="debug">'+label(85,105,state.beat.id+' '+state.beat.name+' t='+state.t.toFixed(2),24)
   +label(85,135,'cam x'+fmt(c.x)+' y'+fmt(c.y)+' s'+fmt(c.scale)+' · '+(state.programmer?.id||'-')+' / '+(state.agent?.id||'-'),24);
  if(state.mode==='standing')s+='<path d="M0 1008H1920" stroke="#CC806F" stroke-width="3" stroke-dasharray="12 8"/>';
  s+='</g>';
 }
 return s+'</g>';
}
export function renderCameraScene(state,bundle,options={}){return rootSvg(drawCameraScene(state,bundle,options),cameraDefinitions(bundle));}
