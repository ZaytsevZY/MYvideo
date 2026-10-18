import COPY from './screen-copy.json' with {type:'json'};
export {COPY};
export const ASSETS={
 lunchBefore:'arts/static/04/lunch-panel-v02.png',lunchEat:'arts/backgrounds/04/lunch-eat-v03.png',lunchType:'arts/backgrounds/04/lunch-type-v03.png',
 meetingType:'arts/backgrounds/04/premeeting-type-v03.png',meetingLook:'arts/backgrounds/04/premeeting-look-v03.png',
 eveningPack:'arts/backgrounds/04/evening-pack-v03.png',eveningReopen:'arts/backgrounds/04/evening-reopen-v03.png',eveningType:'arts/backgrounds/04/evening-type-v03.png',
 collab:'arts/backgrounds/04/collaboration-review-v03.png',collabRelief:'arts/backgrounds/04/collaboration-relief-v03.png',
 traditional:'arts/backgrounds/04/traditional-type-v03.png',traditionalLoss:'arts/backgrounds/04/traditional-disappointed-v03.png',
 room:'arts/backgrounds/04/meeting-whiteboard-room-v03.png',managerReady:'arts/characters/poses/04/manager-ready-v03.png',managerStrike:'arts/characters/poses/04/manager-strike-v03.png',managerWrite:'arts/characters/poses/04/manager-write-v03.png',
 hrEdit:'arts/backgrounds/04/hr-edit-v03.png',hrReview:'arts/backgrounds/04/hr-review-v03.png',hrPortrait:'arts/characters/portraits/04/hr-neutral-v03.png',
 companyA:'arts/items/04/company-a-v03.png',companyB:'arts/items/04/company-b-v03.png',companyC:'arts/items/04/company-c-v03.png',
 agent:'arts/characters/portraits/01/agent-neutral-v01.png',document:'arts/items/01/task-document-portrait-v01.png',office:'arts/backgrounds/shared/office-workstations-day-v01.png'
};
export const LAYOUT={
 canvas:[1920,1080],subtitleSafe:[40,997,1840,65],
 parallel:{panels:[[24,40,608,912],[656,40,608,912],[1288,40,608,912]],characters:['C-P','C-C-A','C-C-B'],layers:['office-background','scene-plate-per-window','window-labels','execution-feedback','evidence','subtitle-safe']},
 performance:{panels:[[24,32,924,924],[972,32,924,924]],layers:['office-background','coherent-workstation-left','coherent-workstation-right','performance-feedback','evidence','subtitle-safe']},
 board:{surface:[650,116,1190,510],managerRect:[320,142,716.8,1075.2],oldText:[960,310],newText:[960,514],markerTips:{ready:[941,309],strike:[1022,275],write:[980,480]},foregroundTableClip:[0,958,1920,122],layers:['meeting-room','board-text-and-stroke','whole-manager-alpha','foreground-table','evidence','subtitle-safe']},
 hr:{plate:[0,0,688,995],window:[716,30,1174,940],jobId:'S04-JOB-01',layers:['office-background','coherent-hr-desk','careers-window','editable-requirements','application-list','evidence','subtitle-safe']},
 competition:{companies:[{id:'company-a',name:'企业甲',color:'#6e9faf'},{id:'company-b',name:'企业乙',color:'#c98372'},{id:'company-c',name:'企业丙',color:'#91aa85'}],pie:[1510,535,240],layers:['office-background','warm-paper','bitmap-companies','cycle-text','bitmap-agent-markers','shared-market-pie','evidence','subtitle-safe']},
 notes:['所有图像保持比例','原生文字／图表与主体绘稿分层','手写口播和四段故事不改','关键态用于检查素材；不是55秒成片']
};
// Normalized weights are fictional staging values, never displayed as empirical percentages.
export const COMPETITION_STATES=[
 {id:'initial',cycles:['1年','1年','1年'],agents:[0,0,0],weights:[.34,.33,.33]},
 {id:'first-adoption',cycles:['3个月','1年','1年'],agents:[1,0,0],weights:[.54,.25,.21]},
 {id:'diffusion',cycles:['3个月','3个月','3个月'],agents:[1,1,1],weights:[.37,.34,.29]},
 {id:'next-round',cycles:['3个月','1个月','3个月'],agents:[1,3,1],weights:[.28,.49,.23]}
];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const rect=(x,y,w,h,fill,r=0,attrs='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${attrs}/>`;
const text=(x,y,s,size=30,fill='#293c49',weight=500,anchor='start')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" font-weight="${weight}" text-anchor="${anchor}">${esc(s)}</text>`;
const image=(href,x,y,w,h,fit='xMidYMid slice')=>`<image href="${esc(href)}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="${fit}"/>`;
const layer=(name,body)=>`<g data-layer="${name}">${body}</g>`;
export const root=body=>`<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"><style>text{font-family:'PingFang SC','Hiragino Sans GB',sans-serif}</style><defs><filter id="soft"><feGaussianBlur stdDeviation="18"/></filter><filter id="shadow" x="-15%" y="-15%" width="130%" height="140%"><feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#243849" flood-opacity=".15"/></filter></defs>${body}</svg>`;
function bg(h){return layer('office-background',`<g filter="url(#soft)">${image(h.office,0,0,1920,1080)}</g>`+rect(0,0,1920,1080,'#ece7dc',0,'opacity=".7"'));}
function tag(s,x=null,y=960,w=null){w??=[...s].reduce((n,c)=>n+(c.charCodeAt(0)<128?12:23),36);x??=1890-w;return layer('evidence',rect(x,y,w,32,'#f8f4ec',7)+text(x+18,y+24,s,23,'#63737c'));}
function photo(href,box,id){const[x,y,w,hh]=box;return `<defs><clipPath id="${id}">${rect(x,y,w,hh,'white',14)}</clipPath></defs><g clip-path="url(#${id})">${image(href,x,y,w,hh)}</g>`;}
function portrait(href,x,y,s,id){return photo(href,[x,y,s,s],id);}

function parallel(h,state){
 const frames=state===0?[h.lunchEat,h.meetingType,h.eveningPack]:state===1?[h.lunchBefore,h.meetingType,h.eveningReopen]:[h.lunchType,h.meetingLook,h.eveningType];
 let b=bg(h);
 LAYOUT.parallel.panels.forEach((box,i)=>{b+=layer('scene-window-'+i,photo(frames[i],box,'panel-'+i));b+=layer('window-label-'+i,rect(box[0]+18,box[1]+18,142,58,'#fbf7ef',9)+text(box[0]+89,box[1]+58,COPY.parallel[i],33,'#293c49',600,'middle'));});
 if(state>0)for(let i=0;i<3;i++){const x=LAYOUT.parallel.panels[i][0]+536,y=820;b+=layer('execution-feedback-'+i,rect(x-20,y-24,44,44,'#f8f3e9',22)+`<g transform="translate(${x+2} ${y-2}) rotate(${state*34+i*18})"><path d="M-11 0H11M0-11V11M-8-8L8 8M-8 8L8-8" stroke="#b6744e" stroke-width="3" stroke-linecap="round"/></g>`);}
 return b+tag(COPY.evidence.study);
}
function performance(h,state){
 let b=bg(h)+layer('left-workstation',photo(state?h.collabRelief:h.collab,LAYOUT.performance.panels[0],'perf-left'))+layer('right-workstation',photo(state?h.traditionalLoss:h.traditional,LAYOUT.performance.panels[1],'perf-right'));
 if(state)for(let i=0;i<2;i++){const x=i?1000:52;b+=layer('performance-feedback-'+i,rect(x,60,215,116,i?'#f4ded7':'#e1eee5',14)+text(x+24,101,'绩效',28,i?'#955f55':'#4d7668')+text(x+157,149,i?'M':'A',70,i?'#955f55':'#4d7668',650,'middle'));}
 return b+tag(COPY.evidence.performance);
}
function sector(cx,cy,r,start,fraction){const a=start*2*Math.PI-Math.PI/2,z=(start+fraction)*2*Math.PI-Math.PI/2;return `M${cx} ${cy}L${cx+r*Math.cos(a)} ${cy+r*Math.sin(a)}A${r} ${r} 0 ${fraction>.5?1:0} 1 ${cx+r*Math.cos(z)} ${cy+r*Math.sin(z)}Z`;}
function competition(h,state){
 const d=COMPETITION_STATES[Math.min(3,state)];let b=bg(h)+rect(48,40,1824,916,'#f8f4ec',22);
 b+=text(466,156,COPY.cycleLabel,34,'#657882')+text(1510,176,COPY.marketLabel,39,'#293c49',600,'middle');
 let total=0;
 LAYOUT.competition.companies.forEach((c,i)=>{
  const y=194+i*233;
  b+=layer('company-'+i,image(h[['companyA','companyB','companyC'][i]],102,y,242,207,'xMidYMid meet')+text(375,y+81,c.name,36,c.color,650)+text(624,y+99,d.cycles[i],65,'#293c49',650,'middle'));
  for(let j=0;j<d.agents[i];j++)b+=layer('agent-adoption-'+i+'-'+j,portrait(h.agent,782+j*91,y+45,78,'agent-'+i+'-'+j));
  if(i<2)b+=`<path d="M122 ${y+220}H1083" stroke="#d7d3c8" stroke-width="2"/>`;
  b+=layer('market-sector-'+i,`<path d="${sector(1510,535,240,total,d.weights[i])}" fill="${c.color}" stroke="#f8f4ec" stroke-width="5"/>`);total+=d.weights[i];
  b+=rect(1248+i*184,829,22,22,c.color,5)+text(1280+i*184,851,COPY.companies[i],25,'#61717a');
 });
 return b+tag(COPY.evidence.competition);
}
function board(h,state){
 const pose=state===1?'managerStrike':state===2?'managerWrite':'managerReady';
 let content=text(960,310,COPY.board.before,68,'#35434b',550);
 if(state>=1)content+=`<path d="M955 275H${state===1?1023:1450}" stroke="#ad665a" stroke-width="6" stroke-linecap="round"/>`;
 if(state===2)content+=`<defs><clipPath id="writing-reveal">${rect(950,425,36,110,'white')}</clipPath></defs><g clip-path="url(#writing-reveal)">${text(960,514,COPY.board.after,68,'#35434b',600)}</g>`;
 if(state===3)content+=text(960,514,COPY.board.after,68,'#35434b',600);
 const foreground=`<defs><clipPath id="foreground-table">${rect(...LAYOUT.board.foregroundTableClip,'white')}</clipPath></defs><g clip-path="url(#foreground-table)">${image(h.room,0,0,1920,1080)}</g>`;
 return layer('meeting-room',image(h.room,0,0,1920,1080))+layer('board-copy',content)+layer('whole-manager-alpha',image(h[pose],...LAYOUT.board.managerRect,'xMidYMid meet'))+layer('foreground-table',foreground)+tag(COPY.evidence.organization);
}
function browserShell(){let b=rect(716,30,1174,940,'#f6f7f8',14,'stroke="#ced5d9" stroke-width="2"');b+=rect(716,30,1174,52,'#e4e8eb',14)+rect(716,58,1174,24,'#e4e8eb');b+=rect(744,39,270,39,'#f8fafb',8)+text(766,66,'招聘管理',21,'#526773');b+=rect(738,90,1126,44,'#fff',8)+text(764,120,'company.example/careers/jobs/S04-JOB-01',22,'#71818b');return b;}
function careers(h,state){
 let b=browserShell()+rect(716,146,1174,100,'#fff')+text(756,207,'公司招聘',36,'#293c49',650)+text(1696,205,'职位管理',27,'#6e848d');
 b+=text(766,295,COPY.job.title,39,'#293c49',650)+text(766,335,'研发 · 全职',24,'#83919a');
 if(state<2){
  b+=rect(1660,263,180,60,'#507f88',9)+text(1750,303,'发布职位',27,'#fff',600,'middle');
  b+=rect(752,365,1100,510,'#fff',12,'stroke="#d8dfe3" stroke-width="2"')+text(784,420,'Job Description',30,'#687d87')+text(784,476,COPY.job.section,33,'#293c49',600);
  b+=rect(780,511,1044,239,'#fbfcfd',8,'stroke="#9ab8c2" stroke-width="2"');
  const lines=state?COPY.job.after:COPY.job.before;
  lines.forEach((s,i)=>b+=text(808,576+i*70,s,42,'#293c49',i?500:600));
  if(state===0)b+=rect(800,532,350,58,'#a5c4d0',4,'opacity=".2"');
  if(state===1)b+=`<path d="M1200 607V650" stroke="#466f7f" stroke-width="3"/>`;
  b+=text(784,826,'岗位信息已保存',24,'#81919b');
 }else{
  b+=rect(1660,263,180,60,'#e3efe7',9)+text(1750,303,'已发布',27,'#537b69',600,'middle');
  b+=rect(752,360,1100,216,'#fff',12)+text(784,406,COPY.job.section,29,'#7c8c95');
  COPY.job.after.forEach((s,i)=>b+=text(784,464+i*65,s,39,'#293c49',600));
  b+=text(766,632,COPY.job.applications,33,'#293c49',650);
  const count=state===2?1:4;
  for(let i=0;i<count;i++){const y=650+i*69;b+=layer('application-'+(i+1),rect(752,y,1100,63,'#fff',7)+image(h.document,768,y+6,42,51,'xMidYMid meet')+text(833,y+41,'简历 '+String(i+1).padStart(2,'0'),27,'#354c5a',550)+text(1082,y+41,COPY.job.title,26,'#6b7f8b')+text(1712,y+41,'待查看',25,'#8b9c9c'));}
 }
 return layer('careers-window',b);
}
function hr(h,state){return bg(h)+layer('coherent-hr-desk',image(state>=2?h.hrReview:h.hrEdit,...LAYOUT.hr.plate))+careers(h,state)+tag(COPY.evidence.organization);}
function study(h){return bg(h)+rect(230,180,1460,650,'#f8f4ec',24)+text(960,350,'一家科技公司',74,'#293c49',650,'middle')+text(960,499,'8个月田野研究',47,'#58727e',500,'middle')+text(960,590,'40余次访谈',47,'#58727e',500,'middle')+text(960,738,'UC Berkeley Haas · H1',28,'#7a868c',500,'middle');}
function closing(h){return bg(h)+text(960,425,COPY.closing.after,88,'#293c49',650,'middle')+layer('delivery-and-acceptance-controls',rect(690,672,620,82,'#faf5ea',12,'stroke="#b8a484" stroke-width="2"')+text(1000,728,COPY.closing.control,39,'#645847',600,'middle'))+tag('理论归纳');}
export const SCENES={study:{label:'研究定位',states:1},parallel:{label:'三窗并行',states:3},performance:{label:'工作与绩效',states:2},competition:{label:'企业竞争',states:4},board:{label:'白板改人数',states:4},hr:{label:'HR与招聘',states:4},closing:{label:'标准接05',states:1}};
export function scene(name,h,state=0){if(!SCENES[name])throw Error('Unknown04 composition: '+name);state=Math.max(0,Math.min(SCENES[name].states-1,Math.floor(state)));return ({study,parallel,performance,competition,board,hr,closing})[name](h,state);}
