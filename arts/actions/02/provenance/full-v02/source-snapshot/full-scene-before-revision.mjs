// Chapter02 complete candidate. Opening remains an immutable reuse dependency.
import {CUES as OPEN_CUES,draw as drawOpening,sample as sampleOpening,svg,INHERITED,smooth,clamp} from './scene.mjs';
export {svg};
export const CONFIG={version:'S02_FULL v0.2',duration:38,fps:30,frames:1140,width:1920,height:1080,globalStartFrame:1350,audio:false};
export const CUES=[...OPEN_CUES,
 {text:'效率收益既可用于减少劳动，',startMs:13000,endMs:16400,timestampMs:null,confidence:null},
 {text:'也可用于扩大产出。',startMs:16400,endMs:19200,timestampMs:null,confidence:null},
 {text:'以价值增殖为目的的生产，',startMs:19200,endMs:22700,timestampMs:null,confidence:null},
 {text:'有将节约重新投入生产的动力。',startMs:22700,endMs:27000,timestampMs:null,confidence:null},
 {text:'单项任务耗时缩短，',startMs:27000,endMs:30900,timestampMs:null,confidence:null},
 {text:'总劳动投入仍取决于任务规模。',startMs:30900,endMs:38000,timestampMs:null,confidence:null}
];
export const BEATS=[
 {id:'S02-01',start:0,end:2.4},{id:'S02-02',start:2.4,end:5.2},{id:'S02-03',start:5.2,end:9.8},{id:'S02-04',start:9.8,end:13},
 {id:'S02-05',start:13,end:14.3},{id:'S02-06',start:14.3,end:16.4},{id:'S02-07',start:16.4,end:17.6},
 {id:'S02-08',start:17.6,end:22.7},{id:'S02-09',start:22.7,end:27},{id:'S02-10',start:27,end:30.9},{id:'S02-11',start:30.9,end:35.2},{id:'S02-12',start:35.2,end:38}
];
const mix=(a,b,u)=>a+(b-a)*u,fmt=n=>+n.toFixed(3),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const INK='#263342',PAPER='#F6F1E7',BLUE='#798DA8',TEAL='#6DBCCB',AMBER='#E9B468',ORANGE='#CC806F',GRAY='#687783';
const text=(x,y,s,size=28,color=INK,anchor='middle')=>`<text x="${fmt(x)}" y="${fmt(y)}" text-anchor="${anchor}" font-family="Hiragino Sans GB, PingFang SC, sans-serif" font-size="${size}" font-weight="500" fill="${color}">${esc(s)}</text>`;
const art=(id,x,y,w,h)=>`<use href="#asset-${id}" x="${fmt(x)}" y="${fmt(y)}" width="${fmt(w)}" height="${fmt(h)}"/>`;
const alpha=(v,s)=>`<g opacity="${fmt(clamp(v))}">${s}</g>`;
const box=(x,y,w,h,fill=PAPER,stroke='none',r=12)=>`<rect x="${fmt(x)}" y="${fmt(y)}" width="${fmt(Math.max(0,w))}" height="${fmt(h)}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
const avatar=(role,x,y,focus=false,w=140)=>art('avatar-'+role+'-'+(focus?'focus':'neutral'),x-w/2,y-w/2,w,w);
const doc=(id,name,x,y,status='candidate',scale=1)=>`<g data-task="${id}" data-state="${status}" transform="translate(${fmt(x)} ${fmt(y)}) scale(${scale})">${art('document-portrait',-43,-57,86,114)}${text(0,26,name,24)}${status==='scheduled'?'<circle cx="34" cy="-39" r="4" fill="#798DA8"/>':''}</g>`;
function caption(c){if(!c)return '';const w=[...c.text].length*44+68;return `<g data-layer="captions">${box(960-w/2,994,w,68,'#101923','none',12).replace('fill="#101923"','fill="#101923" fill-opacity=".78"')}${text(960,1043,c.text,44,'#FFFDF8')}</g>`;}
export function sample(t){
 if(!Number.isFinite(t)||t<0||t>38)throw Error('Expected chapter time 0..38');
 const branch=t<14.3?'common':t<16.4?'A':t<17.6?'reset':'B';
 let token={id:'saving-02',owner:'common',fraction:0};
 if(branch==='A')token={...token,owner:'A',fraction:smooth((t-14.3)/.9)};
 if(branch==='reset')token={...token,owner:t<17.3?'A-returning':'common',fraction:1-smooth((t-16.4)/.9)};
 if(branch==='B')token={...token,owner:'B',fraction:smooth((t-17.6)/1.1)};
 const scale=clamp((t-30.9)/3.3),efficient=180-70*smooth((t-27.7)/1.3);
 const newWeights=[smooth((t-31.4)/1),smooth((t-32.9)/1)];
 return {t,beat:(BEATS.find(b=>t>=b.start&&t<b.end)||BEATS.at(-1)).id,
 caption:CUES.find(c=>c.startMs<=t*1000&&t*1000<c.endMs)||null,
 tasks:{...INHERITED,'N02-A':'candidate','N02-B':'candidate'},branch,token,
 hypothetical:{distinctFromInheritedTasks:true,choice:t>=17.6?'expand-output':t>=14.3&&t<16.4?'shorter-hours':null,extraTasks:t<18.2?[]:[{id:'H02-new1',status:t<19?'selected':'scheduled'},...(t<20?[]:[{id:'H02-new2',status:t<20.8?'selected':'scheduled'}])]},
 comparison:{unitHuman:efficient,baselineHuman:360,taskWeights:[1,1,...newWeights],totalHuman:efficient*(2+newWeights[0]+newWeights[1]),expanded:scale},
 pose:t>=14.7&&t<16.5?'rest':t>=18.1&&t<19.4||t>=20&&t<21.3||t>=31.4&&t<32.5||t>=32.9&&t<34?'lean':'idle'};
}
function sideGraph(){
 return `${box(65,205,495,390,PAPER,'#B9C1C7',24)}${text(310,248,'候选项目',30)}
 <path d="M115 535V295M115 535H505M115 535L505 301" stroke="${BLUE}" stroke-width="2" fill="none"/>
 <path d="M115 535L505 301V290H115Z" fill="${TEAL}" fill-opacity=".12"/>
 ${text(125,281,'预期收益',21,GRAY,'start')}${text(459,567,'开发投入',21,GRAY)}
 ${doc('feedback','反馈',250,407,'candidate',.63)}${doc('N02-A','候选A',355,345,'candidate',.63)}${doc('N02-B','候选B',330,475,'candidate',.63)}
 ${text(315,615,'可行 ≠ 已排期',25,GRAY)}`;
}
function trigger(x,y,t,at){
 if(t<at-.55||t>at+.65)return '';
 const u=smooth((t-at+.55)/.55),cx=mix(x+70,x,u),cy=mix(y+85,y,u);
 return art('cursor',cx,cy,28,40)+(t>=at?`<circle cx="${x+4}" cy="${y+4}" r="${fmt(12+30*(t-at)/.65)}" fill="none" stroke="${AMBER}" stroke-width="4" opacity="${fmt(1-(t-at)/.65)}"/>`:'');
}
function savingPart(state){
 const {t,branch,token}=state,change=smooth((t-13)/1.3),p=token.fraction;
 let s=box(640,190,1180,730,PAPER,'#B9C1C7',35)+text(1110,250,'同一份节约，两种配置',36)+text(1110,291,'方案示意 · 同一初始条件',23,GRAY);
 const commonY=370,ay=520,by=710,x=900,w=650,used=420,saved=230;
 s+=text(725,commonY+34,'起点',27,GRAY,'start')+box(x,commonY,w,44,'#DDE2E4')+box(x,commonY,used,44,BLUE)+text(x+used/2,commonY+31,'同一交付范围',26,PAPER);
 s+=alpha(branch==='A'?1:.3,text(735,ay+34,'方案A',28,branch==='A'?INK:GRAY,'start')+box(x,ay,w,44,'#E8EBE9')+box(x,ay,used,44,BLUE)+text(x+used/2,ay+31,'原有交付',25,PAPER));
 s+=alpha(branch==='B'?1:.3,text(735,by+34,'方案B',28,branch==='B'?INK:GRAY,'start')+box(x,by,w,44,'#E8EBE9')+box(x,by,used,44,BLUE)+text(x+used/2,by+31,'原有交付',25,PAPER));
 // Exactly one amber token exists, returning to the same origin before branch B.
 const dest=token.owner==='B'?by:ay,ty=mix(commonY,dest,p);
 s+=`<g data-saving-token="saving-02" data-owner="${token.owner}">${box(x+used,ty,saved,44,AMBER)}${text(x+used+saved/2,ty+30,branch==='B'&&p>.8?'新增投入':'节约',25,INK)}</g>`;
 s+=alpha(branch==='A'?smooth((t-14.9)/.4):0,text(1180,605,'保持交付 · 缩短工时',31)+text(1180,646,'需相应安排，时段才可自主支配',23,GRAY));
 s+=alpha(branch==='reset'?1:0,text(1150,621,'回到同一起点',31,GRAY));
 s+=text(1225,815,branch==='B'?'增加任务 · 维持工时':'两种方案先后演示，不相加',27,branch==='B'?INK:GRAY);
 // Human clicks add-task control; Agent carries hypothetical new work, without approving it.
 s+=avatar('programmer',1710,650,t>=17.3&&t<18.6||t>=19.6&&t<20.6);
 s+=box(1620,720,180,52,t>=17.6?'#D2E7E9':'#FFFDF8',BLUE)+text(1710,755,'追加任务',26);
 s+=trigger(1740,746,t,17.6)+trigger(1740,746,t,20);
 let ax=1710,agentY=350;
 for(const [i,at]of [18.2,20].entries()){
  if(t<at)continue;const q=smooth((t-at)/.8),dx=mix(1620,1370+i*115,q),dy=mix(470,627,q)-50*Math.sin(q*Math.PI);
  if(q<1){ax=dx+65;agentY=dy-90;}
  s+=doc('H02-new'+(i+1),'新增'+(i+1),dx,dy,q<1?'selected':'scheduled',.8);
 }
 s+=avatar('agent',ax,agentY,t>=18.2&&t<21.1);
 s+=text(1430,896,'配置示意，非实测 · [02-2]',22,GRAY);
 return alpha(change,s);
}
function comparisonPart(state){
 const {t,comparison:c}=state,open=smooth((t-27)/1.2),unit=c.unitHuman;
 let s=box(640,190,1180,730,PAPER,'#B9C1C7',35)+text(1120,250,'单项投入 × 任务规模',36)+text(1100,292,'只示意人的操作与审核，不计机器等待',23,GRAY);
 s+=text(745,366,'原范围',28,GRAY,'start')+text(745,559,'效率提高后',28,INK,'start');
 function taskUnit(x,y,uw,id,label,dim=false){
  return `<g data-human-unit="${id}">${doc(id,label,x+uw/2,y-72,'scheduled',.55)}${box(x,y,uw*.68,30,dim?'#ADB7C1':BLUE)}${box(x+uw*.68,y,uw*.32,30,dim?'#C7AEA2':ORANGE)}<circle cx="${fmt(x+uw*.84)}" cy="${y+15}" r="6" fill="none" stroke="${PAPER}" stroke-width="2"/></g>`;
 }
 for(let i=0;i<2;i++)s+=taskUnit(900+i*250,420,180,'H02-ref'+i,'原任务',true);
 for(let i=0;i<4;i++){
  const weight=c.taskWeights[i],x=880+i*200;
  if(weight<=0)continue;
  const dy=i<2?0:-80*(1-weight);
  s+=alpha(weight,taskUnit(x,635+dy,unit,['H02-base1','H02-base2','H02-new1','H02-new2'][i],i<2?'原任务':'新增',false));
  if(i>=2)s+=trigger(x+50,563,t,i===2?31.4:32.9);
 }
 s+=box(810,731,24,17,BLUE)+text(844,747,'操作',22,GRAY,'start')+box(929,731,24,17,ORANGE)+text(966,747,'审核',22,GRAY,'start');
 s+=text(744,819,'人的总投入',27,INK,'start')+box(940,790,c.totalHuman,35,BLUE);
 s+=`<path d="M1300 774V842" stroke="${GRAY}" stroke-width="2" stroke-dasharray="5 5"/>`+text(1300,868,'原范围参照',22,GRAY);
 if(t>=34.1)s+=alpha(smooth((t-34.1)/.6),text(1575,817,'未必下降',30,INK));
 s+=avatar('agent',1710,370,t>=31.4&&t<34)+avatar('programmer',1710,650,t>=31.4&&t<34);
 s+=text(1390,895,'定性示意 · 成本与价值有别 · [02-1]',22,GRAY);
 return alpha(open,s);
}
export function draw(state){
 if(state.t<13){let c=drawOpening(sampleOpening(state.t));if(state.t>=4.6&&state.t<5.8)c=c.replace('href="#asset-stage"','href="#asset-stage-lean"');return c;}
 const t=state.t,enter=smooth((t-13)/1.3);
 const id=state.pose==='rest'?'stage-rest':state.pose==='lean'?'stage-lean':'stage';
 let s=art(id,0,0,1920,1080);
 // Retain the existing rail through its exact opening layout, at the same screen anchors.
 const frozen=drawOpening(sampleOpening(13)).replace('<use href="#asset-stage" x="0" y="0" width="1920" height="1080"/>','');
 s+=alpha(1-enter,frozen);
 s+=alpha(enter,sideGraph());
 const transition=smooth((t-27)/1.2);
 s+=alpha(1-transition,savingPart({...state,t:Math.min(t,27)}));
 if(t>=27)s+=comparisonPart(state);
 s+=alpha(enter,text(310,125,'投入下降，候选范围扩大',28));
 return s+caption(state.caption);
}
