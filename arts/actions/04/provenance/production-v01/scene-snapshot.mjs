import {assets as inheritedAssets,svg as priorSvg} from '../03/scene.mjs';
export const W=1920,H=1080,FPS=30,N=1650,DURATION=55;
export const assets={...inheritedAssets};
export const cues=[
[.5,4.7,'一家科技公司的田野研究记录到，'],[4.7,8.3,'部分员工主动扩大任务范围，'],[8.3,12.3,'将生成式 AI 工作延伸到午餐、会前和晚间。'],[12.3,16,'新增能力带来更多产出，'],[16,20,'组织预期也随之提高。'],
[20,24.4,'竞争进一步强化这种压力：'],[24.4,28.5,'新方法普及后，'],[28.5,33,'原有的效率优势逐渐消退，'],[33,37.4,'企业仍有缩短周期、增加交付的动力。'],[37.4,42.2,'当更高产出进入排期和考核，'],[42.2,47.3,'额外贡献就可能转为岗位的新基准。'],
[47.3,51,'从我能多做，到我必须做到，'],[51,55,'转变发生在任务标准之中。']
].map(([a,b,text])=>({text,startMs:a*1000,endMs:b*1000,timestampMs:null,confidence:null}));
const C={ink:'#263342',paper:'#F6F1E7',blue:'#798DA8',green:'#84B79A',cyan:'#6DBCCB',red:'#CC806F',muted:'#687783',amber:'#E9B468'};
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const cl=x=>Math.max(0,Math.min(1,x)),e=x=>{x=cl(x);return x*x*(3-2*x)},mix=(a,b,t)=>a+(b-a)*e(t);
const tx=(x,y,s,z=30,c=C.ink,a='start')=>`<text x="${x}" y="${y}" font-size="${z}" fill="${c}" text-anchor="${a}">${esc(s)}</text>`;
const box=(x,y,w,h,c=C.paper,r=14,stroke='none')=>`<rect x="${x}" y="${y}" width="${Math.max(0,w)}" height="${h}" rx="${r}" fill="${c}" stroke="${stroke}" stroke-width="2"/>`;
const ln=(x,y,X,Y,c=C.blue,w=4)=>`<path d="M${x} ${y}L${X} ${Y}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
const im=(id,x,y,w,h,refs)=>`<image href="${refs[id]}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"/>`;
const avatar=(id,x,y,refs,z=130)=>im(id,x,y,z,z,refs);
const ok=(x,y)=>`<circle cx="${x}" cy="${y}" r="16" fill="${C.green}"/><path d="M${x-7} ${y}l5 6 10 -13" fill="none" stroke="white" stroke-width="4"/>`;
function doc(x,y,label,refs,w=190){return im('doc',x,y,w,w/2,refs)+tx(x+w/2,y+w*.31,label,26,C.ink,'middle')}
function arrow(d,color=C.blue,p=1){if(p<=0)return '';return `<path d="${d}" fill="none" stroke="${color}" stroke-width="4" pathLength="1" stroke-dasharray="${cl(p)} 1" ${p>=1?'marker-end="url(#s04-arrow)"':''}/>`}
function hint(x,y,t){return `<g opacity="${e(t/.25)*(1-e((t-.7)/.25))}">${ln(x-15,y,x-25,y-8,C.red,3)}${ln(x+15,y,x+25,y-8,C.red,3)}${ln(x,y-12,x,y-25,C.red,3)}</g>`}
export function state(t){
 const phase=t<1.6?'handoff':t<15?'study':t<27?'feedback':t<42?'competition':'standards';
 const starts=[6.8,9.2,11.6],pulses=[...starts,16.4,21.3,25.2,37.7,43.2,47.6,51.1];
 const active=pulses.some(s=>t>=s&&t<s+.75);
 return {t,phase,evidenceType:t<15?'single-company-qualitative-study':t<27?'researchers-mechanism-interpretation':'theoretical-application',active,humanOperation:active?'prompt-or-schedule':'none',companyAAdopted:t>=28.3,companyBAdopted:t>=32.3,taskId:t>=42?'S04-X':null,extraTaskState:t<42?null:t<46?'voluntary-extra':t<50?'next-plan':'routine-acceptance',decisionOrigin:'human-or-organization',inheritedTasks:{'S03-D':'scheduled-next-workday'},audio:false};
}
function vignette(t,refs){const s=state(t);let z=`<g transform="translate(40 642) scale(.36)">`+im('desk',0,0,1920,1080,refs)+box(596,343,540,268,s.active?'#A9BCC6':'#3A4552',3)+im(s.active?'lean':'rest',389.84,337.52,440.32,660.48,refs)+im('chair',483,663,265,296,refs)+im(s.active?'agentReport':'agentIdle',1134.48,293.44,471.04,706.56,refs);if(s.active)z+=ln(820,660,832,640,C.paper,6)+ln(846,665,859,646,C.paper,6);return z+'</g>'}
function badge(t){const isStudy=t<15,isResearch=t<27;return box(620,164,isResearch?1080:1030,47,isResearch?'#E0EAE7':'#F2E1D8',10)+tx(642,196,isStudy?'研究观察｜单一公司／进行中定性研究':isResearch?'研究者的机制解释｜反馈关系，未估计因果系数':'理论应用／机制示意｜非实测数据',25)}
function study(t,refs){let z='';
 const nums=[['约 200 人','美国科技公司'],['8 个月','民族志观察'],['40 余次','半结构访谈']];
 nums.forEach(([num,label],i)=>{const x=675+i*370;z+=`<g opacity="${e((t-1.5-i*.55)/.6)}">${tx(x,315,num,51)}${tx(x,363,label,29,C.muted)}</g>`});
 z+=ln(665,410,1735,410,'#C6CEC9',2);
 ['午餐','会前','晚间'].forEach((label,i)=>{const x=655+i*370,a=[6.8,9.2,11.6][i],p=e((t-a)/.7);z+=box(x,459,340,270,'#EEEDE6',20)+tx(x+26,507,label,32);z+=ln(x+25,537,x+310,537,'#CAD0CC',2);if(t>=a){z+=avatar('focus',x+12,560,refs,108)+doc(mix(x+95,x+135,(t-a)/.7),mix(510,579,(t-a)/.7),'启动任务',refs,180)+hint(x+67,550,t-a);z+=tx(x+170,700,'任务范围扩展',24,C.muted,'middle');}else z+=tx(x+170,639,'原有间歇',26,C.muted,'middle');});
 return z+tx(660,778,'卡通仅作说明，不是受访者影像或访谈复原',23,C.muted);
}
function loop(t,refs){
 let z='';const nodes=[[795,260,'能力','#DCECEE'],[1435,260,'产出','#DCE9DF'],[1435,574,'预期','#F1DABB'],[795,574,'排期与验收','#E2E5EB']];
 const ps=[(t-15.2)/1.4,(t-18)/1.4,(t-20.3)/1.4,(t-23.7)/1.4];
 z+=arrow('M1045 302H1420',C.cyan,ps[0])+arrow('M1555 358V555',C.green,ps[1])+arrow('M1420 616H1060',C.red,ps[2])+arrow('M780 614Q680 614 680 475V400Q680 302 780 302',C.blue,ps[3]);
 for(const [i,[x,y,label,color]] of nodes.entries())z+=`<g opacity="${e((t-15-i*.45)/.45)}">${box(x,y,250,88,color,20)}${tx(x+125,y+57,label,32,C.ink,'middle')}</g>`;
 z+=avatar('agentFocus',1068,254,refs,120)+avatar(t>=20.5?'focus':'human',666,643,refs,120);
 if(t>=16.4){const p=e((t-16.4)/1.3);z+=doc(mix(1100,1215,p),mix(355,365,p),'新增交付',refs,180);}
 if(t>=19.8)z+=`<g opacity="${e((t-19.8)/.5)}">${tx(1190,475,'组织安排',29,C.muted,'middle')}${tx(1190,514,'把新增产出带入下一轮',26,C.muted,'middle')}</g>`;
 if(t>=21.3&&t<24.2){const p=e((t-21.3)/1.5);z+=doc(mix(1360,1100,p),mix(685,685,p),'下一轮任务',refs,180)+hint(740,666,t-21.3);}
 return z+tx(1720,768,'[04-1] 研究解释',23,C.muted,'end');
}
function competition(t,refs){let z='';const ap=e((t-28.3)/1),bp=e((t-32.3)/1);const ax=mix(990,1300,ap),bx=t<32.3?990:mix(990,1300,bp);
 for(const [i,label] of ['企业 A','企业 B'].entries()){const y=276+i*188;z+=tx(665,y+40,label,33)+ln(865,y+106,1515,y+106,'#C9CECE',3);z+=box(835,y,200,54,(i===0?t>=28.3:t>=32.3)?C.cyan:'#E4E5DF',12)+tx(935,y+36,(i===0?t>=28.3:t>=32.3)?'采用新方法':'原有方法',26,C.ink,'middle');z+=doc(i===0?ax:bx,y+40,'交付',refs,160);}
 z+=tx(1535,396,'交付节奏',24,C.muted);
 if(t>=29.6&&t<33.5)z+=tx(1730,300,'先发优势',29,C.red,'end');
 if(t>=34)z+=`<g opacity="${e((t-34)/.6)}">${tx(1730,300,'相对优势缩小',29,C.muted,'end')}${ln(1500,348,1500,540,C.muted,3)}</g>`;
 if(t>=35.5){const p=e((t-35.5)/.7);z+=`<g opacity="${p}">${arrow('M1260 649H1370',C.red,1)}${tx(1060,657,'竞争压力',30,C.red)}${box(1380,602,335,90,'#E2E5EB',16)}${tx(1547,638,'计划与评价',30,C.ink,'middle')}${tx(1547,673,'交付周期 · 验收标准',23,C.muted,'middle')}</g>`;}
 if(t>=37.7){z+=arrow('M1545 700V730H1160',C.blue,e((t-37.7)/.8))+avatar('focus',1018,674,refs,112)+tx(1170,775,'团队接收新的安排',26,C.muted);}
 return z;
}
function standards(t,refs){let z='';const stages=['自选补充','下轮计划','常规验收'],xs=[700,1070,1440];
 xs.forEach((x,i)=>{z+=box(x,294,300,336,i===2?'#E1E9E2':'#E9E9E3',18)+tx(x+150,345,`第${i+1}轮`,25,C.muted,'middle')+tx(x+150,398,stages[i],32,C.ink,'middle')+ln(x+28,429,x+272,429,'#BBC4BE',2);if(i<2)z+=arrow(`M${x+313} 463H${x+352}`,C.blue,e((t-(i?47.1:43))/.8));});
 const x=t<46?750:t<50?mix(750,1120,(t-46)/1.2):mix(1120,1490,(t-50)/1.2),y=469;
 z+=doc(x,y,'额外测试',refs,200)+tx(x+100,611,'S04-X',23,C.muted,'middle');
 if(t<46)z+=avatar('focus',625,605,refs,120)+tx(775,719,'员工自选补充',28,C.muted);
 else if(t<50)z+=avatar('focus',1003,651,refs,105)+hint(1070,652,t-47.6)+tx(1160,750,'经人列入排期',27,C.muted);
 else z+=avatar('focus',1370,652,refs,105)+hint(1430,651,t-51.1)+ok(1698,566)+tx(1505,750,'成为验收要求',28,C.red);
 z+=tx(660,249,'同一项额外工作，进入三轮组织安排',30);
 if(t>=52)z+=box(690,672,620,82,'#E2E5EB',14)+tx(1000,725,'交付周期 · 验收标准',33,C.ink,'middle');
 return z;
}
export function svg(t,refs,{caption=true}={}){
 if(t<.4)return priorSvg(1169/30,refs,{caption:false});
 const s=state(t);let z=im('room',0,0,W,H,refs)+box(565,72,1280,738,C.paper,50,'#D5D6CF')+vignette(t,refs);
 let layer=tx(615,132,'04',27,C.muted)+tx(678,132,'额外贡献，怎样成为正常要求？',35)+badge(t);
 layer+=t<15?study(t,refs):t<27?loop(t,refs):t<42?competition(t,refs):standards(t,refs);
 if(t<1.6){z=priorSvg(1169/30,refs,{caption:false});z+=`<g opacity="${e((t-.4)/1.2)}">${box(565,72,1280,738,C.paper,50,'#D5D6CF')}${layer}</g>`;}else z+=layer;
 const foot=t<15?'[04-1] UC Berkeley Haas · 2026-02-18 · 单一公司研究':t<27?'[04-1] Haas 研究者的反馈解释 · 非因果效应估计':t<42?'[04-2] 《资本论》第一卷第十章 · 理论应用／机制示意':'[04-3] Haas／《资本论》第十章 · 标准重设的条件性机制';
 if(t>=1.6)z+=box(611,824,1190,48,C.paper,10)+tx(625,855,foot,23,C.muted);
 if(caption){const c=cues.find(c=>t*1000>=c.startMs&&t*1000<c.endMs);if(c){const width=[...c.text].reduce((a,ch)=>a+(/[\x00-\x7f]/.test(ch)?.56:1),0)*44+52;z+=box((W-width)/2,984,width,72,'#152330',10)+tx(W/2,1034,c.text,44,'#FFFFFF','middle');}}
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"><defs><marker id="s04-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="${C.blue}"/></marker></defs><g font-family="Hiragino Sans GB, PingFang SC, sans-serif" font-weight="500">${z}</g></svg>`;
}
