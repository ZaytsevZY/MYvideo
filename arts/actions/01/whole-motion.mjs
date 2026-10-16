// Active complete-pose compositor. No IK, limb scaling or duplicated foreground arms.
import {asset,label,rootSvg,clamp,smooth,lerp} from '../../characters/rigs/runtime/rig.mjs';
import {BEATS} from './motion.mjs';
import {key,programmerMotion,walking,agentMotion,workingAgent,CALIBRATION} from './keyframes.mjs';
export {BEATS};
export const ACTIONS=[
 {id:'P01',name:'背面操作',duration:2}, {id:'P02',name:'派发任务',duration:2},
 {id:'P03',name:'完整坐姿收手',duration:1}, {id:'P04',name:'前倾→起身→转身',duration:1.2},
 {id:'P05',name:'向左离席（补充经过位）',duration:1.8}, {id:'P06',name:'返回工位',duration:1.5},
 {id:'P07',name:'站姿→半蹲→入座',duration:1}, {id:'P08',name:'面向屏幕验收',duration:2},
 {id:'P09',name:'同一任务退回',duration:1.5}, {id:'P10',name:'人物保持，图解展开',duration:2},
 {id:'A01',name:'Agent 伸手接过文件',duration:2.4}, {id:'A02',name:'Agent 收到身前查看',duration:3},
 {id:'A03',name:'Agent 递回结果',duration:2.4}
];
export const LAYOUT={version:'S01_WHOLE_PREVIEW v0.3',camera:'behind programmer; screen faces programmer, chair rear shell faces viewer',
 desk:[180,620,1110,123],deskLegs:[180,659,1110,308],monitor:[600,320,544,374],screen:[627.2,343.8,489.6,275.4],keyboard:[440,649,405,67],mouse:[875,650,43,58],
 chairSeat:[480,813,265,205],chairRear:[483,663,265,296],programmerCenter:610,floor:1008,
 layerOrder:['room','desk legs/tower','desktop','monitor and screen','keyboard/lamp','chair seat','complete programmer','chair rear shell','diagram backdrop','diagram content','foreground Agent','task overlays'],
 note:'All complete PNG poses rendered once with uniform scale. No limb seams, masks or independent forearms. Hands are visually aligned with keyboard, not numerically proven finger contact.'};
const p=(pose='input',extra={})=>({id:'programmer-'+pose,x:610,baseline:1008,flip:false,...extra});
const agent=(pose='idle')=>({id:'agent-'+pose,x:1580,baseline:1008});
export function sampleScene(t){
 t=clamp(t,0,45);const beat=BEATS.find(b=>t>=b.start&&t<b.end)||BEATS.at(-1),u=clamp((t-beat.start)/(beat.end-beat.start));
 let programmer=p(),a=agent(),interaction=null;
 if(t>=2.2&&t<3.2)programmer=programmerMotion('release',u);
 else if(t>=3.2&&t<4.3)programmer=programmerMotion('rise',u);
 else if(t>=4.3&&t<6)programmer=walking(u);
 else if(t>=6&&t<9)programmer=null;
 else if(t>=9&&t<10.5)programmer=walking(u,true);
 else if(t>=10.5&&t<11.5)programmer=programmerMotion('sit',u);
 else if(t>=16&&t<16.6)programmer=programmerMotion('release',(t-16)/.6);
 else if(t>=16.6)programmer=p('rest');
 if(t>=1.1&&t<3.2)interaction=agentMotion('receive',(t-1.1)/2.1);
 else if(t>=3.2&&t<9) a=workingAgent(t-3.2);
 else if(t>=9&&t<11.5)interaction=agentMotion('deliver',(t-9)/2.5);
 else if(t>=13.5&&t<15.8)interaction=agentMotion('receive',(t-13.5)/2.3);
 else if(t>=15.8&&t<17.2)a=workingAgent(t-15.8);
 else if(t>=17.2&&t<18.5)interaction=agentMotion('deliver',(t-17.2)/1.3);
 else if(t>=18.5&&t<20)interaction=agentMotion('explain',(t-18.5)/1.5);
 else if(t>=20)a=agent('report');
 if(interaction)a=interaction.actor;
 return {t,beat,programmer,agent:a,interaction,day:smooth((t-6)/3)};
}
export function sampleAction(id,t){
 const state=sampleScene(0),a=ACTIONS.find(a=>a.id===id),u=clamp(t/a.duration);state.beat={id,name:a.name};state.day=1;
 if(id==='P02'){Object.assign(state,sampleScene(1.1+u*2.1));state.day=1;state.beat={id,name:a.name};}
 if(id==='P03')state.programmer=programmerMotion('release',u);
 if(id==='P04')state.programmer=programmerMotion('rise',u);
 if(id==='P05')state.programmer=walking(u);
 if(id==='P06')state.programmer=walking(u,true);
 if(id==='P07')state.programmer=programmerMotion('sit',u);
 if(id==='P08')state.t=12;
 if(id==='P09'){Object.assign(state,sampleScene(13.5+u*2.3));state.day=1;state.beat={id,name:a.name};}
 if(id==='P10'){state.t=18.5+u*4.4;state.programmer=p('rest');state.interaction=agentMotion('explain',u);state.agent=state.interaction.actor;}
 if(id==='A01'||id==='A03'){
  state.interaction=agentMotion(id==='A01'?'receive':'deliver',u);state.agent=state.interaction.actor;state.t=id==='A01'?1.5:10;
 }
 if(id==='A02'){state.t=7;state.agent=workingAgent(t);}
 return state;
}
export function definitions(bundle){
 let s='';for(const [id,a] of Object.entries(bundle.assets))s+='<symbol id="asset-'+id+'" viewBox="0 0 '+a.width+' '+a.height+'" preserveAspectRatio="none"><image href="'+a.dataUri+'" width="'+a.width+'" height="'+a.height+'"/></symbol>';
 for(const [id,a] of Object.entries(bundle.poses))s+='<symbol id="pose-'+id+'" viewBox="0 0 1024 1536"><image href="'+a.dataUri+'" width="1024" height="1536"/></symbol>';
 return '<defs>'+s+'</defs>';
}
export function drawPose(q){
 if(!q)return '';
 const c=CALIBRATION[q.id]||{},s=q.scaleOverride??c.scale??(q.id.startsWith('agent')?.47:.53),bottom=c.bottom??(q.id.startsWith('agent')?1515:1462),center=c.center??512;
 const y=q.baseline-bottom*s;
 return '<g data-pose="'+q.id+'" transform="translate('+q.x+' '+q.baseline+') rotate('+(q.rotation||0)+') translate(0 '+(-bottom*s)+') scale('+(q.flip?-s:s)+' '+s+')"><use href="#pose-'+q.id+'" x="'+(-center)+'" width="1024" height="1536"/></g>';
}
const paper=({x,y,rotation=0})=>'<g data-document="T01" transform="translate('+x+' '+y+') rotate('+rotation+' 30 37)"><path d="M0 0H60V74H0Z" fill="#F6F1E7" stroke="#263342" stroke-width="1.5"/><path d="M13 24H47M13 35H47M13 46H43" fill="none" stroke="#777779" stroke-width="3" stroke-linecap="round"/></g>';
export function drawRoom(state,bundle,{debug=false}={}){
 let s=asset('room-night',0,0,1920,1080)+'<g opacity="'+state.day+'">'+asset('room-day',0,0,1920,1080)+'</g>';
 s+=asset('desk-legs',...LAYOUT.deskLegs)+asset('computer-tower',1045,693,170,255)+asset('desk-surface',...LAYOUT.desk);
 s+=asset('monitor-frame',...LAYOUT.monitor)+asset(state.t<.8?'screen-idle':state.t>=3.2&&state.t<9?'screen-off':state.t<11.5?'screen-running':state.t<15?'screen-review':'screen-running',...LAYOUT.screen);
 s+=asset('keyboard',...LAYOUT.keyboard)+asset('mouse',...LAYOUT.mouse)+asset('desk-lamp',185,333,220,346);
 s+=asset('chair-seat',...LAYOUT.chairSeat);
 const walking=state.programmer?.id.includes('walk');
 if(!walking)s+=drawPose(state.programmer);
 s+=asset('chair-back-rear',...LAYOUT.chairRear);
 if(walking)s+=drawPose(state.programmer); // aisle is nearer to camera than chair
 const t=state.t;
 if(t>=16)s+=drawLogicBackground(state,bundle)+drawLogic(state);
 s+='<g data-layer="foreground-agent">'+drawPose(state.agent)+'</g>';
 if(state.interaction?.file)s+=paper(state.interaction.file);
 if(state.interaction)s+=label(1320,248,'T01 · '+(state.interaction.kind==='receive'?'接收文件':state.interaction.kind==='deliver'?'返还结果':'解释时间分配'),27);
 if(t>=3.2&&t<9)s+=label(1370,248,'T01 · 执行中'+'.'.repeat(Math.floor(t*2)%4),27);
 if(t>=9&&t<11.5&&!state.interaction)s+=label(1370,248,'T01 · 待验收',27);
 s+=label(85,70,'情境示意',26);
 if(debug){
  s+='<path d="M180 620H1290M483 663H748M180 1008H1780" stroke="#CC806F" fill="none" stroke-width="3" stroke-dasharray="12 8"/>';
  s+=label(85,105,'完整姿态单次绘制；椅背前景遮挡',24);
 }
 return s;
}
function drawLogicBackground({t},bundle){
 const c=bundle.diagramPanels,kind=t<23?'time':t<37?'workflow':'queue',r=c.bounds[kind];
 return '<g data-layer="diagram-backdrop" transform="'+c.transform+'"><rect x="'+r[0]+'" y="'+r[1]+'" width="'+r[2]+'" height="'+r[3]+'" rx="'+c.radius+'" fill="'+c.fill+'" fill-opacity="'+c.fillOpacity+'" stroke="'+c.stroke+'" stroke-width="'+c.strokeWidth+'"/></g>';
}
function drawLogic({t}){
 let s='<g data-layer="diagram-content" transform="translate(650 20) scale(.8)">';
 if(t<23){s+=label(18,38,'人物操作与后台执行',34)+asset('time-tracks-base',0,55,1500,350)+asset('human-dispatch',286,117,170,60)+asset('human-review',1216,117,170,60)+asset('machine-execution',456,257,760,60)+label(520,225,'离线区间不直接标为自由时间',28);}
 else if(t<37){
  s+=label(18,38,'候选任务进入项目计划',34);
  for(const [x,name] of [[0,'evaluation'],[520,'scheduled'],[1040,'acceptance']])s+=asset('lane-'+name,x,65,410,350);
  const k=clamp((t-23)/14);
  for(const [i,name] of ['test','interface','feature'].entries())s+=asset('task-'+name,45+520*clamp(k*3-i),175+i*43,320,140);
  s+=asset('connector-arrow',420,222,88,30)+asset('connector-arrow',940,222,88,30);
 }else{
  const q=smooth((t-37)/8),end=580+780*q;s+=label(18,38,'新的要求继续进入',34)+'<path d="M40 145H1460" stroke="#657E91" stroke-width="3"/>';
  for(let i=0;i<5;i++){const x=30+i*260-120*q;s+=asset('task-'+['test','interface','feature'][i%3],x,90,260,114);if(i<2)s+=asset('status-check',x+170,205,36,36);}
  s+=asset('endpoint-marker',end,70,60,126)+label(end-35,280,'本轮终点',26)+label(18,375,'机制示意，不表示实测增幅',26);
 }
 return s+'</g>';
}
export function renderScene(state,bundle,{debug=false}={}){return rootSvg(drawRoom(state,bundle,{debug}),definitions(bundle));}
