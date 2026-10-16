export const W=1920,H=1080,FPS=30,N=1170,DURATION=39;
export const cues=[
 [0,4.4,'在以工时组织的雇佣劳动中，'],[4.4,9.1,'劳动者让渡的是一定期限内的劳动力使用权。'],
 [9.1,13,'清单提前清空，约定工时不会因此自动结束。'],[13,17.6,'企业仍能在约定时段分配其他任务。'],
 [17.6,21.5,'工作能否真正结束，还受响应要求、'],[21.5,25.7,'任务标准和工时界限的约束。'],
 [25.7,30.5,'技术缩短了执行过程，'],[30.5,34.7,'劳动者对劳动时间的决定权'],[34.7,39,'未必同步扩大。']
].map(([a,b,text])=>({text,startMs:a*1000,endMs:b*1000,timestampMs:null,confidence:null}));
export const assets={room:'arts/backgrounds/01/workroom-day-v01.png',desk:'arts/items/01/workstation-painted-v02.png',chair:'arts/items/01/chair-back-rear-painted-v01.png',human:'arts/characters/portraits/01/programmer-neutral-v01.png',focus:'arts/characters/portraits/01/programmer-focus-v01.png',agent:'arts/characters/portraits/01/agent-neutral-v01.png',agentFocus:'arts/characters/portraits/01/agent-focus-v01.png',doc:'arts/items/01/task-document-landscape-v01.png',input:'arts/characters/poses/01/programmer-input-v01.png',rest:'arts/characters/poses/01/programmer-rest-v01.png',lean:'arts/characters/poses/01/programmer-lean-v01.png',agentIdle:'arts/characters/poses/01/agent-idle-v01.png',agentReport:'arts/characters/poses/01/agent-report-v01.png'};
const C={ink:'#263342',paper:'#F6F1E7',blue:'#798DA8',green:'#84B79A',cyan:'#6DBCCB',red:'#CC806F',muted:'#687783',amber:'#E9B468'};
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const clamp=x=>Math.max(0,Math.min(1,x));
const ease=x=>{x=clamp(x);return x*x*(3-2*x)};
const mix=(a,b,u)=>a+(b-a)*ease(u);
const txt=(x,y,s,size=32,fill=C.ink,anchor='start')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" text-anchor="${anchor}">${esc(s)}</text>`;
const rect=(x,y,w,h,fill,r=14,stroke='none')=>`<rect x="${x}" y="${y}" width="${Math.max(0,w)}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
const line=(x,y,X,Y,color=C.blue,width=4,dash='')=>`<path d="M${x} ${y}L${X} ${Y}" fill="none" stroke="${color}" stroke-width="${width}" ${dash?'stroke-dasharray="'+dash+'"':''} stroke-linecap="round"/>`;
const img=(id,x,y,w,h,refs)=>`<image href="${refs[id]}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"/>`;
const check=(x,y)=>`<circle cx="${x}" cy="${y}" r="18" fill="${C.green}"/><path d="M${x-8} ${y}l6 7 12 -15" fill="none" stroke="white" stroke-width="4"/>`;
function document(x,y,label,refs,ok=false){return img('doc',x,y,200,100,refs)+txt(x+100,y+62,label,27,C.ink,'middle')+(ok?check(x+182,y+18):'')}
function avatar(id,x,y,refs,size=140){return img(id,x,y,size,size,refs)}
function notice(x,y,t){const u=ease(t);return `<g opacity="${u}" transform="translate(0 ${-12*(1-u)})">${rect(x,y,62,50,C.amber,12)}${txt(x+31,y+36,'!',34,C.ink,'middle')}</g>`}
export function state(t){
 const inImmediate=t>=17&&t<22, inBatch=t>=22&&t<27;
 const pulses=[18.0,19.4,20.8];const active=inImmediate&&pulses.some(p=>t>=p&&t<p+.55);
 return {t,phase:t<6?'checklist':t<13?'workday':t<17?'rules':t<22?'immediate-response':t<27?'batch-review':t<34?'boundary':'team-schedule',active,taskStates:{'S03-A':'accepted','S03-B':'accepted','S03-C':t<11?'candidate':'scheduled','S03-D':t<31?'not-introduced':t<36.3?'deferred-to-next-workday':'scheduled-next-workday'},workdayEnded:t>=29.5,lateTask:t>=31?'deferred-to-next-workday':null,humanOperation:active?'review':t<3?'review':t>=10.5&&t<11.8?'schedule':'none',audio:false};
}
function vignette(t,s,refs){
 const working=s.active||t<3||(t>=10.5&&t<11.8);let out=`<g transform="translate(40 642) scale(.36)">`+img('desk',0,0,1920,1080,refs);
 out+=rect(596,343,540,268,working?'#A9BCC6':'#3A4552',3);
 out+=img(working?'lean':'rest',610-1024*.43/2,998-1536*.43,1024*.43,1536*.43,refs);
 out+=img('chair',483,663,265,296,refs);
 out+=img(t<3?'agentReport':'agentIdle',1370-1024*.46/2,1000-1536*.46,1024*.46,1536*.46,refs);
 if(working)out+=line(820,660,832,640,C.paper,6)+line(846,665,859,646,C.paper,6);
 out+='</g>';return out;
}
export function svg(t,refs,{background=true,caption=true}={}){
 const s=state(t);let out=background?img('room',0,0,W,H,refs):'';
 out+=rect(565,72,1280,738,C.paper,50,'#D5D6CF');
 out+=txt(615,132,'03',27,C.muted)+txt(678,132,'任务完成之后，时间由谁安排？',35);
 out+=vignette(t,s,refs);
 if(t<13){
  const p=ease((t-5)/1.2);out+=txt(660,204,'本轮任务',29,C.muted);
  out+=avatar(t<3?'focus':'human',635,230,refs,160);
  out+=avatar('agent',1580,255,refs,145);
  for(let i=0;i<2;i++){const u=ease((t-1-i*1.35)/.65);out+=document(850+i*245,260-10*Math.sin(u*Math.PI),i?'S03-B':'S03-A',refs,t>=1.65+i*1.35);}
  if(t>=3.6)out+=`<g opacity="${ease((t-3.6)/.5)}">${check(860,416)}${txt(895,427,'本轮已清空',30)}</g>`;
  out+=`<g opacity="${p}">${txt(660,510,'已约定的工作时段',30)}${rect(660,554,1050,56,'#DDE3E8',12)}${rect(660,554,300,56,C.blue,12)}${line(1710,531,1710,637,C.ink,4)}${txt(1710,680,'工作时段终点',27,C.ink,'middle')}${txt(810,650,'本轮操作',27,C.muted,'middle')}${txt(1260,592,'仍在约定时段内',29,C.ink,'middle')}</g>`;
  if(t>=9.8){const u=ease((t-10.5)/1.1),x=mix(1510,1220,u),y=mix(220,440,u);out+=document(x,y,'S03-C',refs);out+=avatar('focus',x-100,y-70,refs,105);if(t>=11.6)out+=txt(1320,706,'由人排入其他任务',29,C.red,'middle');}
 } else if(t<27){
  out+=avatar(s.active?'focus':'human',635,240,refs,150)+avatar('agentFocus',1580,242,refs,145);
  out+=document(1115,225,'同一任务',refs);
  const labels=['工作时段','响应要求','验收标准'];labels.forEach((v,i)=>{const u=ease((t-13-i*.65)/.5);out+=`<g opacity="${u}">${rect(815+i*287,405,252,62,i===1?'#F1DABB':'#E3E7EA',16)}${txt(941+i*287,447,v,29,C.ink,'middle')}${line(941+i*287,395,1215,343,C.muted,2)}</g>`});
  if(t>=16.4){const batch=t>=22;out+=txt(665,534,batch?'允许次日集中验收':'要求即时查看结果',31);
   out+=txt(665,598,'人的操作',26,C.muted)+rect(865,573,822,32,'#E1E5E5',8);
   out+=txt(665,676,'可连续休息',26,C.muted)+rect(865,647,822,38,'#D8E9DD',8);
   if(!batch){for(const [i,p] of [18,19.4,20.8].entries()){const x=930+i*240;if(t>=p){out+=rect(x,573,34,32,C.blue,3)+rect(x,647,34,38,C.paper,0);out+=notice(x-12,503,t-p);if(t<p+.55)out+=line(x+17,554,x+17,566,C.red,3);}}}
   else{out+=`<g opacity="${ease((t-22)/.5)}">${line(1620,536,1735,536,C.blue,3,'7 6')}${txt(1680,733,'次日统一验收',26,C.muted,'middle')}${check(1648,666)}</g>`;}
   out+=txt(665,770,'机器等待 ≠ 人的操作；无通知的空档不计作劳动',23,C.muted);
  }
 } else {
  const q=ease((t-27)/1.1),end=mix(1710,1410,q);out+=avatar('human',635,235,refs,150)+avatar('agent',1570,160,refs,145);
  out+=txt(845,245,'工作日的界限',35);
  out+=rect(800,320,end-800,72,'#DDE3E8',12)+rect(end,320,1770-end,72,'#D8E9DD',12);
  out+=line(end,284,end,460,C.ink,5)+txt(end,499,'工作日终点',30,C.ink,'middle');
  out+=txt(1030,366,'约定工作时段',28,C.ink,'middle')+txt(1605,366,'工时外',28,C.ink,'middle');
  if(t>=29)out+=txt(815,565,'计时与计件有别',31);
  if(t>=30.3)out+=txt(815,623,'工时边界须另行确定',31);
  if(t>=30.8&&t<34){const u=ease((t-31)/1.4);out+=document(mix(1600,1550,u),mix(435,615,u),'新任务',refs);if(t>=32.4)out+=txt(1650,752,'转入下一工作时段',24,C.red,'middle');}
  if(t>=34){const a=ease((t-34)/.8);out+=`<g opacity="${a}">${rect(805,535,675,202,C.paper,16,'#ABB5BB')}${txt(835,579,'团队排期',29)}${line(825,597,1455,597,C.muted,2)}${txt(850,639,'当前工作日',25,C.muted)}${txt(1170,639,'下一工作日',25,C.muted)}${line(1110,604,1110,714,C.muted,2)}${check(1038,682)}${document(mix(1550,1190,(t-34.8)/1.5),mix(615,643,(t-34.8)/1.5),'S03-D',refs)}</g>`;}
 }
 const foot=t<13?'[03-1] 《资本论》第一卷第四章 · 工时组织情境':t<27?'[03-2] 第五章 · 响应规则为说明性对照':'[03-3] 第八章 · 工作日边界；非普遍法律判断';
 out+=rect(611,824,1190,48,C.paper,10)+txt(625,855,foot,23,C.muted);
 if(caption){const c=cues.find(c=>t*1000>=c.startMs&&t*1000<c.endMs);if(c){const w=c.text.length*44+52;out+=rect((W-w)/2,984,w,72,'#152330',10)+txt(W/2,1034,c.text,44,'#FFFFFF','middle')}}
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"><g font-family="Hiragino Sans GB, PingFang SC, sans-serif" font-weight="500">${out}</g></svg>`;
}
