import {draw as draw06,sample as sample06,svg,text} from '../06/scene.mjs';
export {svg};
export const CONFIG={version:'S05 v0.1',duration:45,fps:30,frames:1350,width:1920,height:1080,globalStartFrame:5310,audio:false};
export const CUES=[
 ['调度多个 Agent，',0,3000],['扩大的是执行能力，',3000,6500],['未必改变产品目标、',6500,9800],['交付周期和成果分配的决定权。',9800,14000],
 ['社会劳动创造的生产力量，',14000,18000],['在特定的占有和组织关系中，',18000,22000],['反过来成为约束劳动者的外在力量。',22000,26000],
 ['这是劳动异化的一个切口：',26000,28500],['指令由人发出，劳动的目的与尺度仍可能由他人设定。',28500,34000],
 ['拥有工具调用权限，',34000,37000],['不会自动获得修改排期、',37000,40000],['拒绝额外任务或分享效率收益的权力。',40000,45000]
].map(([text,startMs,endMs])=>({text,startMs,endMs,timestampMs:null,confidence:null}));
export const BEATS=[['S05-01',0,1.6],['S05-02',1.6,4.3],['S05-03',4.3,6.8],['S05-04',6.8,10],['S05-05',10,14],['S05-06',14,18.5],['S05-07',18.5,22],['S05-08',22,26],['S05-09',26,31],['S05-10',31,35],['S05-11',35,40],['S05-12',40,42],['S05-13',42,45]].map(([id,start,end])=>({id,start,end}));
const C={ink:'#263342',paper:'#F6F1E7',blue:'#798DA8',teal:'#6DBCCB',green:'#84B79A',orange:'#CC806F',gray:'#687783',line:'#B9C1C7',amber:'#E9B468'};
const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x)},mix=(a,b,u)=>a+(b-a)*u,fmt=x=>+x.toFixed(3);
const group=(s,attrs='')=>`<g ${attrs}>${s}</g>`;
const art=(id,x,y,w,h)=>`<use href="#asset-${id}" x="${fmt(x)}" y="${fmt(y)}" width="${fmt(w)}" height="${fmt(h)}"/>`;
const box=(x,y,w,h,fill=C.paper,r=12,stroke='none')=>`<rect x="${fmt(x)}" y="${fmt(y)}" width="${fmt(Math.max(0,w))}" height="${fmt(h)}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
const avatar=(who,x,y,focus=false,w=135.2)=>art('avatar-'+who+'-'+(focus?'focus':'neutral'),x-w/2,y-w/2,w,w);
const path=(d,color=C.blue,dash=false,w=4)=>`<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}"${dash?' stroke-dasharray="8 7"':''}/>`;
function extractGroup(s,tag){const start=s.indexOf('<g '+tag);if(start<0)throw Error('Missing '+tag);const re=/<g\b[^>]*>|<\/g>/g;re.lastIndex=start;let n=0,m;while((m=re.exec(s))){n+=m[0].startsWith('</')?-1:1;if(n===0)return s.slice(start,re.lastIndex);}throw Error('Unbalanced group');}
export function withoutCaptions(s){const c=s.indexOf('<g data-layer="captions"');return c<0?s:s.slice(0,c)+s.slice(c+extractGroup(s,'data-layer="captions"').length);}
export const MATCH06_GRAPHIC=withoutCaptions(draw06(sample06(0)));
const VIGNETTES={idle:extractGroup(draw06(sample06(0)),'data-layer="vignette"'),lean:extractGroup(draw06(sample06(2)),'data-layer="vignette"')};
const CALLS=[1.6,4.3,6.8,31.8];
export function sample(t){
 if(!Number.isFinite(t)||t<0||t>45)throw Error('Expected chapter05 time0..45');
 const phase=t<14?'tools':t<31?'relations':t<40?'authority':t<42?'handoff':'match06';
 return {t,phase,beat:(BEATS.find(b=>t>=b.start&&t<b.end)||BEATS.at(-1)).id,caption:CUES.find(c=>c.startMs<=t*1000&&t*1000<c.endMs)||null,
 availableAgents:t<4.3?1:t<6.8?2:3,decisionOwner:'organization',workerDecisionRights:'not_automatically_granted',workerParticipatesInDecision:false,
 feedbackOrigin:'organization-delivery-standard',agentIsEmployer:false,acceptedTaskCount:0,illustrativeTasks:true,pose:CALLS.some(a=>Math.abs(t-a)<.65)||[35.7,37.9,39.2].some(a=>Math.abs(t-a)<.5)?'lean':'idle'};
}
function click(x,y,t,at){if(t<at-.6||t>at+.4)return '';const u=ease((t-at+.6)/.6);return art('cursor',mix(x+80,x,u),mix(y+70,y,u),30,40)+(t>=at?`<circle cx="${x+3}" cy="${y+3}" r="${fmt(10+(t-at)*60)}" fill="none" stroke="${C.amber}" stroke-width="4" opacity="${fmt(1-(t-at)/.4)}"/>`:'');}
function node(id,label,x,y,w=260,highlight=false){return group(box(x,y,w,70,highlight?'#E4E8ED':'#FFFDF8',12,C.line)+text(x+w/2,y+45,label,29)+`<circle cx="${x+w-18}" cy="${y+16}" r="5" fill="${C.gray}"/>`,`data-decision-node="${id}" data-owner="organization"`);}
function org(s){
 const {t}=s;let out=text(775,343,'组织层',27,C.gray);
 for(const [i,label]of ['产品目标','交付周期','成果分配'].entries())out+=node(['product-goal','schedule','distribution'][i],label,910+i*280,290,260,t>=10&&t<14||t>=35&&Math.floor((t-35)/1.7)===i);
 out+=text(1575,405,t<14?'本情境未改变决策安排':'占有与组织关系',24,C.gray);
 return out;
}
function task(id,label,x,y,progress=0){return group(art('document-portrait',x-43,y-57,86,114)+text(x,y+28,label,21)+box(x-33,y+64,66,8,'#DDE2E4',4)+box(x-33,y+64,66*clamp(progress),8,C.teal,4),`data-task="${id}" data-state="${progress>=1?'generated':'running'}"`);}
function tools(s,retire=0){
 const {t}=s,count=t<14?s.availableAgents:3,alpha=1-retire;let out='';
 out+=group(path('M880 710H905V497H1570',C.blue)+text(790,585,'工具调用',27,C.gray),`opacity="${fmt(alpha)}"`);
 const humanX=mix(820,1740,retire),humanY=mix(710,690,retire);
 if(t>=40)return group(avatar('programmer',humanX,humanY,false),'data-main-human="operator"')+group(avatar('agent',mix(1010,1740,retire),mix(565,350,retire),false,mix(104,135.2,retire)),'data-agent-instance="A05-0"');
 out+=group(avatar('programmer',humanX,humanY,s.pose==='lean'),'data-main-human="operator"');
 for(let i=0;i<count;i++){
  const start=[1.6,4.3,6.8][i],x=1010+i*250,p=ease((t-start)/1.1);
  const agentX=i===0?mix(x,1740,retire):x,agentY=i===0?mix(565,350,retire):565,w=i===0?mix(104,135.2,retire):104;
  out+=group(avatar('agent',agentX,agentY,t>=start&&t<start+1.2,w),`data-agent-instance="A05-${i}" opacity="${i===0?1:fmt(alpha)}"`);
  out+=group(path(`M${x} 497V510`,C.blue)+text(x,644,'Agent '+['A','B','C'][i],24,C.gray)+task('H05-task'+i,['代码','测试','文档'][i],x,731,p),`opacity="${fmt(alpha)}"`);
  if(t<14)out+=click(x-18,731,t,start);
 }
 if(t>=31&&t<40){
  out+=click(1000,731,t,31.8)+text(1270,845,'调用入口保持开放',29,C.ink);
  for(const [i,a]of [35.7,37.9,39.2].entries())if(t>=a-.6&&t<a+.7)out+=click(1030+i*280,326,t,a);
  if(t>=35)out+=text(1270,890,'排期、额外任务与收益安排：需另行约定',23,C.gray);
 }else if(t<14)out+=text(1240,854,'调用权限增加，决定节点不自动移交',27,C.ink)+text(1250,897,'本情境示意 · 非普遍权属判断 · [05-1]',22,C.gray);
 return out;
}
function relations(s){
 const {t}=s;let out='';
 for(const [i,label]of ['知识','协作','代码工具'].entries()){
  const x=1040+i*250,u=ease((t-14-i*.65)/1.5);
  out+=group(group(art('document-portrait',x-38,510,76,100)+text(x,580,label,21),`data-resource="H05-resource${i}"`),`opacity="${fmt(ease((t-14-i*.65)/.6))}"`);
  out+=path(`M${x} 622L${fmt(mix(x,1320,u))} ${fmt(mix(622,667,u))}`,C.teal);
 }
 out+=group(box(1060,670,570,70,'#E1EDF0',16,C.line)+text(1345,716,'社会劳动的生产系统',31),'data-production-system="social"');
 const rule=ease((t-18.5)/1.2);
 out+=group(path('M1320 360V430',C.orange)+box(1160,430,320,62,'#F0E0D8',12,C.line)+text(1320,471,'交付标准',29)+path('M1160 461H900V650L866 677',C.orange)+`<path d="M866 661v16h16" fill="none" stroke="${C.orange}" stroke-width="4"/>`+text(810,610,'规则反馈',25,C.gray),`data-feedback-origin="organization-delivery-standard" opacity="${fmt(rule)}"`);
 out+=avatar('programmer',820,730,true)+text(820,835,'劳动者',27,C.gray);
 if(t>=22&&t<26)out+=text(1340,815,'"劳动条件使用工人"',34)+text(1340,862,'《资本论》第一卷 · 第13章第4节 · [05-2]',23,C.gray);
 else if(t>=26)out+=text(1340,815,'活动与成果，反过来成为外在力量',29)+text(1340,862,'异化的一个切口 · 《1844年手稿》 · [05-3]',23,C.gray);
 else out+=text(1340,825,'组织制定尺度，技术执行任务',29,C.ink);
 out+=text(1330,908,'机制示意；反馈来自组织规则，机器不是雇主',22,C.gray);
 return out;
}
function caption(c){if(!c)return '';const w=[...c.text].length*44+68;return group(box(960-w/2,994,w,68,'#101923',12).replace('fill="#101923"','fill="#101923" fill-opacity=".78"')+text(960,1043,c.text,44,'#FFFDF8').replace('PingFang SC,Noto Sans CJK SC,sans-serif','Hiragino Sans GB, PingFang SC, sans-serif'),'data-layer="captions"');}
export function draw(s){
 const {t}=s;if(t>=42)return MATCH06_GRAPHIC+caption(s.caption);
 let out=art('stage-room',0,0,1920,1080)+box(640,150,1190,790,C.paper,32,C.line)+text(1225,215,t<14?'执行能力与决定权':t<31?'生产力量如何成为约束？':'工具调用 ≠ 决定权',36);
 const retire=ease((t-40)/1.4);
 if(t<40)out+=org(s);
 out+=s.phase==='relations'?relations(s):tools(s,retire);
 if(t>=40)out+=text(1225,835,'排期与收益配置',31,C.gray);
 out+=VIGNETTES[s.pose]+caption(s.caption);
 return out;
}
