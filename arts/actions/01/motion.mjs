import {poseBase,keyboard,setArm,worldToLocal,localToWorld,clamp,smooth,lerp,mix,asset,label,drawCharacter,rootSvg} from '../../characters/rigs/runtime/rig.mjs';
export const ACTIONS=[
 {id:'P01',actor:'programmer',name:'输入准备',kind:'input',duration:2,contact:'双手键盘'},
 {id:'P02',actor:'programmer',name:'键盘派发',kind:'dispatch',duration:2,contact:'双手键盘，按键触发任务'},
 {id:'P03',actor:'programmer',name:'收手',kind:'release',duration:1,contact:'解除键盘接触'},
 {id:'P04',actor:'programmer',name:'起身',kind:'rise',duration:1.2,contact:'脚部回到站姿，骨盆上移'},
 {id:'P05',actor:'programmer',name:'离开工位',kind:'exit',duration:1.8,contact:'先切换向左视向，再交替迈步'},
 {id:'P06',actor:'programmer',name:'返回工位',kind:'return',duration:1.5,contact:'向右步入并停在座位'},
 {id:'P07',actor:'programmer',name:'入座',kind:'sit',duration:1,contact:'骨盆落向座垫，屈膝'},
 {id:'P08',actor:'programmer',name:'核对结果',kind:'review',duration:2,contact:'双手键盘，头部轻倾'},
 {id:'P09',actor:'programmer',name:'退回修改',kind:'rework',duration:1.5,contact:'键盘确认，触发同一任务退回'},
 {id:'P10',actor:'programmer',name:'指向图解',kind:'explain',duration:2,contact:'近侧手臂指向浮层方向'},
 {id:'A01',actor:'agent',name:'接收任务',kind:'receive',duration:1.2,contact:'手势与任务到达点相连'},
 {id:'A02',actor:'agent',name:'执行任务',kind:'work',duration:2.5,contact:'有限前臂动作，可循环'},
 {id:'A03',actor:'agent',name:'报告结果',kind:'report',duration:1.2,contact:'展示结果，等待人工审核'}
];
export const BEATS=[
 {start:0,end:.8,id:'P01',name:'输入准备'}, {start:.8,end:2.2,id:'P02',name:'派发'},
 {start:2.2,end:3.2,id:'P03',name:'收手'}, {start:3.2,end:4.3,id:'P04',name:'起身'},
 {start:4.3,end:6,id:'P05',name:'离席'}, {start:6,end:9,id:'A02',name:'后台执行／夜转晨'},
 {start:9,end:10.5,id:'P06',name:'返回'}, {start:10.5,end:11.5,id:'P07',name:'入座'},
 {start:11.5,end:13.5,id:'P08',name:'验收'}, {start:13.5,end:15,id:'P09',name:'退回修改'},
 {start:15,end:16,id:'A02',name:'继续执行'}, {start:16,end:23,id:'P10',name:'人的操作／机器执行'},
 {start:23,end:37,id:'P01',name:'候选需求进入排期'}, {start:37,end:45,id:'P10',name:'新增任务／终点后移'}
];
export const STAGE_OVERRIDES={chairBack:[480,455,265,374],chairSeat:[480,770,265,242],monitor:[740,400,544,374],screen:[767.2,423.8,489.6,275.4],programmerPelvis:[600,790],agentPelvis:[1550,735],note:'Only action-stage overrides. Original static assets/layout unchanged. Keyboard is the contact device; no mouse reach is claimed.'};
export function actorPose(id,kind,u,config,phase=0){
 const e=smooth(u);
 const o=id==='programmer'?{root:[600,790],seated:1}:{root:[1550,735],scale:.85,seated:0};
 if(id==='programmer'){
  if(kind==='rise'){o.seated=1-e;o.root=[600,lerp(790,710,e)];}
  if(kind==='sit'){o.seated=e;o.root=[600,lerp(710,790,e)];}
  if(kind==='exit'){o.seated=0;o.facing=-1;o.root=[lerp(600,-280,e),710-3*Math.sin(phase*2)];o.walk=Math.sin(Math.PI*u);o.walkPhase=phase;}
  if(kind==='return'){o.seated=0;o.facing=1;o.root=[lerp(-280,600,e),710-3*Math.sin(phase*2)];o.walk=Math.sin(Math.PI*u);o.walkPhase=phase;}
 }
 const p=poseBase(id,config,{...o,action:kind});
 if(id==='programmer'){
  if(['input','dispatch','review','rework'].includes(kind)){
   keyboard(p,config,kind==='review'?smooth(Math.min(u*5,1)):1,{point:kind==='dispatch'||kind==='rework'});
   p.headTilt=kind==='review'?3:kind==='rework'?1.5:0;
  }
  if(kind==='release')keyboard(p,config,1-e);
  if(kind==='explain'){
   const raised=smooth(Math.min(u*3,1))*smooth(Math.min((1-u)*3,1));
   const target=worldToLocal(p,[850,480]);
   setArm(p,'near',mix(p.arms.near.wrist,target,raised),config,{hand:'handPoint',handAngle:-125});
   p.frontArms.near=raised>.2;p.headTilt=-4*raised;
  }
 }else{
  if(['receive','report'].includes(kind)){
   const reach=Math.sin(Math.PI*clamp(u));
   const target=worldToLocal(p,[1400,590]);
   // A left-pointing hand: palm center is 22 units left of the wrist.
   target[0]+=22;
   setArm(p,'far',mix(p.arms.far.wrist,target,smooth(reach)),config,{hand:'handRelax',handAngle:90});
   p.headTilt=kind==='report'?-3*reach:0;
  }
  if(kind==='work'){
   const swing=Math.sin(phase),pulse=(Math.cos(phase)+1)/2,weight=Math.min(smooth(u*5),smooth((1-u)*5));
   setArm(p,'far',mix(p.arms.far.wrist,[-145,-130+7*swing],weight),config,{hand:'handPoint',handAngle:105});
   setArm(p,'near',mix(p.arms.near.wrist,[-15,-110+7*pulse],weight),config,{hand:'handRelax',handAngle:45});
   p.headTilt=-2*pulse*weight;
  }
 }
 return p;
}
export function sampleAction(id,t,config){
 const a=ACTIONS.find(x=>x.id===id);if(!a)throw Error('Unknown action '+id);
 const u=clamp(t/a.duration),pose=actorPose(a.actor,a.kind,u,config,t*7);
 return {action:a,time:clamp(t,0,a.duration),u,pose};
}
export function sampleScene(t,config){
 t=clamp(t,0,45);const beat=BEATS.find(x=>t>=x.start&&t<x.end)||BEATS.at(-1);
 let p=actorPose('programmer','input',0,config),a=actorPose('agent','idle',0,config);
 const u=(t-beat.start)/(beat.end-beat.start),kind=ACTIONS.find(x=>x.id===beat.id)?.kind;
 if(t<6)p=actorPose('programmer',kind,u,config,(t-beat.start)*7);
 else if(t<9)p=actorPose('programmer','exit',1,config);
 else if(t<11.5)p=actorPose('programmer',kind,u,config,(t-beat.start)*7);
 else if(t<15)p=actorPose('programmer',kind,u,config);
 else if(t<16)p=actorPose('programmer','input',0,config);
 else if(t<16.6)p=actorPose('programmer','release',(t-16)/.6,config);
 else if(t<23)p=actorPose('programmer','explain',clamp((t-16.6)/6.4),config);
 else p=actorPose('programmer','idle',0,config);
 if(t>=1.1&&t<2.8)a=actorPose('agent','receive',(t-1.1)/1.7,config);
 else if(t>=2.8&&t<9.5)a=actorPose('agent','work',(t-2.8)/6.7,config,(t-2.8)*5);
 else if(t>=9.5&&t<11.5)a=actorPose('agent','report',(t-9.5)/2,config);
 else if(t>=13.5&&t<15.5)a=actorPose('agent','receive',(t-13.5)/2,config);
 else if(t>=15.5)a=actorPose('agent','work',clamp((t-15.5)/2,0,.5),config,(t-15.5)*4);
 return {t,beat,programmer:p,agent:a,day:smooth((t-6)/3)};
}
export function drawRoom(state,bundle,{debug=false}={}){
 const c=bundle.config,p=state.programmer,a=state.agent;
 let s=asset('room-night',0,0,1920,1080);
 s+='<g opacity="'+state.day+'">'+asset('room-day',0,0,1920,1080)+'</g>';
 s+=asset('chair-back',...STAGE_OVERRIDES.chairBack)+asset('chair-seat',...STAGE_OVERRIDES.chairSeat);
 s+=asset('desk-legs',180,746,1110,308)+asset('computer-tower',1045,780,170,255);
 s+=drawCharacter(p,c,'body',debug);
 s+=asset('desk-surface',180,707,1110,123)+asset('monitor-frame',...STAGE_OVERRIDES.monitor);
 let screen=state.t<.8?'screen-idle':state.t<11.5?'screen-running':state.t<15?'screen-review':'screen-running';
 s+=asset(screen,...STAGE_OVERRIDES.screen)+asset('keyboard',625,734,385,70,'preserveAspectRatio="none"')+asset('mouse',1040,733,43,58)+asset('desk-lamp',185,420,220,346);
 s+=drawCharacter(p,c,'front',debug)+drawCharacter(a,c,'all',debug);
 if(state.t>1.1&&state.t<2.8){
  const q=smooth((state.t-1.1)/1.7),pos=mix([1050,580],[1400,590],q);
  s+=asset('task-feature',pos[0]-140,pos[1]-80,230,100);
 }
 if(state.t>13.5&&state.t<15.5){
  const q=smooth((state.t-13.5)/2),pos=mix([1050,580],[1400,590],q);
  s+=asset('task-feature',pos[0]-140,pos[1]-80,230,100)+asset('status-rework',pos[0]+65,pos[1]-35,40,40);
 }
 s+=label(90,75,'情境示意 · 动作工艺试验',27);
 if(state.t>=16)s+=drawLogic(state);
 if(debug){
  for(const v of [[759.75,765.11],[868.83,765.11]])s+='<circle cx="'+v[0]+'" cy="'+v[1]+'" r="8" fill="none" stroke="#C74F48" stroke-width="3"/>';
 }
 return s;
}
function drawLogic(state){
 const t=state.t;let s='<g transform="translate(650 20) scale(.8)">';
 if(t<23){
  s+=label(18,38,'人物操作与后台执行',34)+asset('time-tracks-base',0,55,1500,350);
  s+=asset('human-dispatch',286,117,170,60)+asset('human-review',1216,117,170,60)+asset('machine-execution',456,257,760,60);
  s+=label(520,225,'离线区间不直接标为自由时间',28);
 }else if(t<37){
  s+=label(18,38,'候选任务进入项目计划',34);
  for(const [x,name] of [[0,'evaluation'],[520,'scheduled'],[1040,'acceptance']])s+=asset('lane-'+name,x,65,410,350);
  const k=clamp((t-23)/14),progress=[clamp(k*3),clamp(k*3-1),clamp(k*3-2)];
  for(const [i,name] of ['test','interface','feature'].entries()){
   const x=45+520*progress[i];
   s+=asset('task-'+name,x,175+i*43,320,140);
  }
  s+=asset('connector-arrow',420,222,88,30)+asset('connector-arrow',940,222,88,30);
 }else{
  s+=label(18,38,'任务逐项完成，新的要求继续进入',34);
  const q=smooth((t-37)/8),end=580+780*q;
  s+='<path d="M40 145H1460" stroke="#657E91" stroke-width="3"/>';
  for(let i=0;i<5;i++){
   const x=30+i*260-120*q;
   const name=['test','interface','feature'][i%3];
   s+=asset('task-'+name,x,90,260,114);
   if(i<2)s+=asset('status-check',x+170,205,36,36);
  }
  s+=asset('endpoint-marker',end,70,60,126)+label(end-35,280,'本轮终点',26);
  s+=label(18,375,'任务与终点为说明性情境，不表示实测增幅',26);
 }
 return s+'</g>';
}
export function renderScene(state,bundle,{defs='',debug=false}={}){
 return rootSvg(drawRoom(state,bundle,{debug}),defs);
}
export function renderPose(pose,bundle,{defs='',debug=false,w=600,h=640}={}){
 const copy={...pose,root:[w/2,355],scale:.72};
 return rootSvg(drawCharacter(copy,bundle.config,'all',debug),defs,w,h,pose.id+' '+pose.action);
}

