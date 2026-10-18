import {ASSETS as ART,COPY,LAYOUT,COMPETITION_STATES,root} from '../../static/04/story-assets-v03/assets.mjs';
import * as prior from '../03/story-scene-v05.mjs';
import captions from './captions/04-narration-v05.json' with {type:'json'};
export {COPY};
export const ASSETS={...ART,...Object.fromEntries(Object.entries(prior.ASSETS).map(([k,v])=>['entry03_'+k,v]))};
export const CUES=captions;
export const CONFIG={version:'S04_STORY v0.5',width:1920,height:1080,fps:30,duration:55,frames:1650,globalStartFrame:3660,audio:false};
export const BEATS=[
 ['S04-01',0,12.3,'E','三窗并行'],['S04-02',12.3,14.6,'E','成果交接'],['S04-03',14.6,17.3,'E','绩效与反应'],['S04-04',17.3,20,'L','产出与组织预期'],
 ['S04-05',20,21.8,'L','共同市场'],['S04-06',21.8,24.6,'L','率先采用'],['S04-07',24.6,29.6,'L','方法普及'],['S04-08',29.6,32.6,'L','再压缩周期'],['S04-09',32.6,35.8,'L','进入排期考核'],
 ['S04-10',35.8,39,'E','划去原人数'],['S04-11',39,42.2,'E','重写产品线安排'],['S04-12',42.2,45.6,'E','提高招聘要求'],['S04-13',45.6,50.6,'E','发布与简历增加'],['S04-14',50.6,55,'L','额外贡献成为常规要求']
].map(([id,start,end,type,name])=>({id,start,end,type,name}));
const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x);},p=(t,a,b)=>ease((t-a)/(b-a)),mix=(a,b,u)=>a+(b-a)*u,f=x=>+x.toFixed(3);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const group=(b,a='')=>`<g ${a}>${b}</g>`;
const box=(x,y,w,h,color,r=0,attrs='')=>`<rect x="${f(x)}" y="${f(y)}" width="${f(Math.max(0,w))}" height="${f(h)}" rx="${r}" fill="${color}" ${attrs}/>`;
const text=(x,y,s,size=30,color='#293c49',weight=500,anchor='start')=>`<text x="${f(x)}" y="${f(y)}" font-size="${size}" fill="${color}" font-weight="${weight}" text-anchor="${anchor}">${esc(s)}</text>`;
const img=(h,k,x,y,w,hh,fit='xMidYMid slice')=>{if(!h[k])throw Error('Missing04 asset '+k);return `<image href="${esc(h[k])}" x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(hh)}" preserveAspectRatio="${fit}"/>`;};
const path=(d,color='#728d9a',width=4,attrs='')=>`<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${attrs}/>`;
const arrow=d=>path(d,'#728d9a',4,'marker-end="url(#relation-arrow)"');
const fade=(b,u,attrs='')=>u<=0?'':group(b,`opacity="${f(clamp(u))}" ${attrs}`);
function photo(h,k,b,id,zoom=1){const[x,y,w,hh]=b;return `<defs><clipPath id="${id}">${box(x,y,w,hh,'white',14)}</clipPath></defs>`+group(img(h,k,x-w*(zoom-1)/2,y-hh*(zoom-1)/2,w*zoom,hh*zoom),`clip-path="url(#${id})" data-raster-pose="${k}"`);}
const portrait=(h,k,x,y,w,id)=>photo(h,k,[x,y,w,w],id);
function bg(h){return group(img(h,'office',0,0,1920,1080),'filter="url(#soft)"')+box(0,0,1920,1080,'#ece7dc',0,'opacity=".7"');}
function star(x,y,t,alpha=1){return fade(box(x-22,y-22,44,44,'#f8f3e9',22)+group(path('M-11 0H11M0-11V11M-8-8L8 8M-8 8L8-8','#b6744e',3),`transform="translate(${x} ${y}) rotate(${f(t*145)})"`),alpha,'data-execution="running"');}
function cursor(x,y,t,at,dx=80,dy=65){if(t<at-.55||t>=at+.45)return '';const u=p(t,at-.55,at),v=clamp((t-at)/.45);return group(`<path d="M0 0L4 34L13 24L21 40L29 36L21 20L34 20Z" fill="#fbfcfd" stroke="#3b5666" stroke-width="2"/>`,`transform="translate(${f(x+(1-u)*dx)} ${f(y+(1-u)*dy)})"`)+(t>=at?`<circle cx="${x}" cy="${y}" r="${f(9+v*21)}" fill="none" stroke="#ce9d58" stroke-width="3" opacity="${f(1-v)}"/>`:'');}
export function sample(value){
 if(!Number.isFinite(value))throw Error('Expected finite04 time');const t=Math.max(0,Math.min(55,value)),beat=BEATS.find(b=>t>=b.start&&t<b.end)||BEATS.at(-1);
 const agents=[t>=22.2?1:0,t>=29.9?3:t>=25?1:0,t>=26.2?1:0],cycles=[t>=22.5?'3个月':'1年',t>=30.5?'1个月':t>=25.3?'3个月':'1年',t>=26.5?'3个月':'1年'];
 let weights=[...COMPETITION_STATES[0].weights];for(const [i,a,b]of [[1,23.1,23.9],[2,27.2,28.2],[3,31,31.8]])weights=weights.map((w,j)=>mix(w,COMPETITION_STATES[i].weights[j],p(t,a,b)));
 return {t,beat:beat.id,type:beat.type,phase:t<.4?'entry':t<12.3?'parallel':t<17.3?'performance':t<20?'feedback':t<32.6?'competition':t<35.8?'planning':t<42.2?'board':'hr',
  inheritedTasks:{},previousScenarioTasks:t<.4?prior.sample(1169/30).taskStates:null,scenarioRelation:'distinct-research-scenario',
  poses:{lunch:t<1.7?'lunchEat':t<2.8?'lunchBefore':'lunchType',meeting:t<4.8?'meetingType':t<6?'meetingLook':'meetingType',evening:t<7.4?'eveningPack':t<9.1?'eveningReopen':'eveningType',collaboration:t<15.55?'collab':'collabRelief',traditional:t<16.55?'traditional':'traditionalLoss'},
  appraisal:{author:'manager',left:t>=15.2?'A':null,right:t>=16.2?'M':null},feedbackNodes:t<17.3?0:t<18.1?2:t<18.6?3:4,
  agents,cycles,marketWeights:weights,marketIsMeasured:false,marketFrozen:t>=32.6,planningOrder:t>=33.4?'S04-PLAN-01':null,planCycle:t>=33.4?'1个月':null,
  board:{strike:p(t,36.7,37.5),writing:p(t,39.7,40.9),before:COPY.board.before,after:COPY.board.after,insert:t>=36.93&&t<37.65||t>=40&&t<41.2},
  job:{id:'S04-JOB-01',independentResponsibility:t>=43.3,multipleAgents:t>=44.2,published:t>=46.3,cvCount:[46.6,47.4,48.3,49.2].filter(a=>t>=a).length,requirements:t>=44.2?COPY.job.after:t>=43.3?[COPY.job.after[0]]:COPY.job.before},
  routine:{extra:p(t,50.8,51.3),plan:p(t,51.6,52.1),required:p(t,52.6,53.2)},terminalHeld:t>=54.2,
  caption:CUES.find(c=>t*1000>=c.startMs&&t*1000<c.endMs)||null};
}
function parallel(s,h){const{t}=s;let b=bg(h);const poses=[s.poses.lunch,s.poses.meeting,s.poses.evening],starts=[1,4.2,7.4];
 LAYOUT.parallel.panels.forEach((r,i)=>{
  b+=group(photo(h,poses[i],r,'s04-panel-'+i,1+.009*p(t,starts[i],starts[i]+1.8)),`data-window="${i}"`);
  const highlight=p(t,[7.6,8.9,10.5][i],[7.85,9.15,10.75][i]);
  b+=box(r[0]+18,r[1]+18,142,58,highlight>.5?'#f1ddbc':'#fbf7ef',9)+text(r[0]+89,r[1]+58,COPY.parallel[i],33,'#293c49',600,'middle');
  const a=p(t,[2.8,4.3,9.1][i],[3.05,4.55,9.35][i]);if(a)b+=star(r[0]+548,820,t+2*i,a);
 });
 return group(b,'data-entry="new-study"')+group(box(...LAYOUT.parallel.footnote,'#f8f4ec',7)+text(42,974,COPY.researchFootnote,26,'#61727b'),'data-layer="research-footnote"');
}
function performance(s,h){const{t}=s;let b=bg(h);const zoom=1+.012*p(t,14.6,15);
 b+=photo(h,s.poses.collaboration,LAYOUT.performance.panels[0],'s04-perf-left',zoom)+photo(h,s.poses.traditional,LAYOUT.performance.panels[1],'s04-perf-right',zoom);
 if(t>=14.85)b+=fade(portrait(h,'managerPortrait',920,190,80,'s04-appraiser'),p(t,14.85,15.1),'data-appraiser="organization"');
 for(const[i,a]of[15.2,16.2].entries())if(t>=a){const x=i?1000:52,col=i?'#955f55':'#4d7668',u=p(t,a,a+.22);b+=group(box(x,60,215,116,i?'#f4ded7':'#e1eee5',14)+text(x+24,101,'绩效',28,col)+text(x+157,149,i?'M':'A',70,col,650,'middle'),`opacity="${f(u)}" data-grade="${i?'M':'A'}"`);}
 if(t>=17.3){b+=fade(box(972,32,924,924,'#283744',14,'opacity=".28"'),p(t,17.3,17.65));let ribbon=box(...LAYOUT.performance.feedbackRibbon,'#f8f4ec',16);const times=[17.3,17.3,18.1,18.6],colors=['#dcecee','#dce9df','#f1dabb','#e2e5eb'];
  COPY.feedback.forEach((label,i)=>{const x=62+i*216,u=p(t,times[i],times[i]+.25);ribbon+=fade(box(x,807,180,65,colors[i],12)+text(x+90,850,label,29,'#293c49',600,'middle')+(i?arrow(`M${x-29} 840H${x-9}`):''),u,`data-feedback-node="${i}"`);});
  ribbon+=portrait(h,'agent',120,888,64,'s04-feedback-agent');ribbon+=fade(portrait(h,'managerPortrait',552,888,64,'s04-feedback-manager'),p(t,18.1,18.3));
  if(t>=18.6){const u=p(t,18.6,19.15);ribbon+=img(h,'document',mix(552,778,u),mix(888,884,u),62,74,'xMidYMid meet');}
  b+=fade(ribbon,p(t,17.3,17.6),'data-layer="ability-output-expectation"');
 }
 return b;
}
function sector(cx,cy,r,start,fraction){const a=start*2*Math.PI-Math.PI/2,z=(start+fraction)*2*Math.PI-Math.PI/2;return `M${cx} ${cy}L${f(cx+r*Math.cos(a))} ${f(cy+r*Math.sin(a))}A${r} ${r} 0 ${fraction>.5?1:0} 1 ${f(cx+r*Math.cos(z))} ${f(cy+r*Math.sin(z))}Z`;}
function order(h,x,y,w,hh,size=1,cycle=true){return group(img(h,'documentWide',x,y,w,hh,'xMidYMid meet')+text(x+w*.5,y+hh*.36,COPY.organization.planning,32*size,'#657782',500,'middle')+(cycle?text(x+w*.5,y+hh*.75,'1个月',51*size,'#293c49',650,'middle'):''),'data-object-id="S04-PLAN-01"');}
function competition(s,h){const{t}=s;let b=box(48,40,1824,916,'#f8f4ec',22)+text(466,156,COPY.cycleLabel,34,'#657882')+text(1510,176,COPY.marketLabel,39,'#293c49',600,'middle'),total=0;
 LAYOUT.competition.companies.forEach((c,i)=>{const y=194+i*233;b+=img(h,['companyA','companyB','companyC'][i],102,y,242,207,'xMidYMid meet')+text(375,y+81,c.name,36,c.color,650)+text(624,y+99,s.cycles[i],65,'#293c49',650,'middle');
  for(let j=0;j<s.agents[i];j++){const start=i===0?22.2:i===2?26.2:j===0?25:29.9+(j-1)*.15,u=p(t,start,start+.35);b+=fade(portrait(h,'agent',782+j*91, y+45,78,'s04-agent-'+i+'-'+j),u,`data-adoption="${i}-${j}"`);}
  if(i<2)b+=path(`M122 ${y+220}H1083`,'#d7d3c8',2);
  b+=group(`<path d="${sector(1510,535,240,total,s.marketWeights[i])}" fill="${c.color}" stroke="#f8f4ec" stroke-width="5"/>`,`data-market-sector="${i}"`);total+=s.marketWeights[i];
  b+=box(1248+i*184,829,22,22,c.color,5)+text(1280+i*184,851,COPY.companies[i],25,'#61717a');
 });
 let result=bg(h)+group(b,`data-layer="shared-market" opacity="${f(1-.5*p(t,32.6,33.05))}"`);
 if(t>=32.9){let relay=box(1010,782,834,176,'#f8f4ec',16)+portrait(h,'managerPortrait',1036,802,128,'s04-relay-manager')+order(h,1186,792,620,154,1,false);const u=p(t,33.4,34.4);
  if(t>=33.4)relay+=text(mix(624,1496,u),mix(526,907.5,u),'1个月',mix(65,51,u),'#293c49',650,'middle');
  result+=fade(relay,p(t,32.9,33.25),'data-layer="planning-to-team-relay"');
 }
 return result;
}
function board(s,h){const{t}=s,v=s.board;let copy=text(960,310,COPY.board.before,68,'#35434b',550);
 if(v.strike>0)copy+=path(`M955 275H${f(mix(955,1450,v.strike))}`,'#ad665a',6);
 if(v.writing>0)copy+=`<defs><clipPath id="s04-writing">${box(950,425,Math.max(1,600*v.writing),110,'white')}</clipPath></defs>`+group(text(960,514,COPY.board.after,68,'#35434b',600),'clip-path="url(#s04-writing)"');
 let scene=img(h,'room',0,0,1920,1080)+group(copy,'data-layer="board-copy"')+order(h,1515,137,300,157,.66);
 const pose=t<36.3?'managerReady':t<37.65?'managerStrike':t<39.3?'managerReady':t<41.2?'managerWrite':'managerReady';
 if(!v.insert)scene+=group(img(h,pose,...LAYOUT.board.managerRect,'xMidYMid meet'),`data-whole-manager="${pose}"`);
 // Board inserts hide the hand after contact. We do not drag a fixed full-body pose across the board to fake an arm rig.
 if(v.insert){const writing=t>=40,scale=writing?1.63:1.58,cx=writing?1240:1220,cy=writing?450:283;scene=group(scene,`transform="translate(960 510) scale(${scale}) translate(${-cx} ${-cy})" data-camera="board-insert"`);}
 else scene+=`<defs><clipPath id="s04-table">${box(...LAYOUT.board.foregroundTableClip,'white')}</clipPath></defs>`+group(img(h,'room',0,0,1920,1080),'clip-path="url(#s04-table)"');
 return group(scene,'data-layer="meeting-board"');
}
function shell(){return box(716,30,1174,940,'#f6f7f8',14,'stroke="#ced5d9" stroke-width="2"')+box(716,30,1174,52,'#e4e8eb',14)+box(716,58,1174,24,'#e4e8eb')+box(744,39,270,39,'#f8fafb',8)+text(766,66,'招聘管理',21,'#526773')+box(738,90,1126,44,'#fff',8)+text(764,120,'company.example/careers/jobs/software-engineer',22,'#71818b');}
function hr(s,h){const{t}=s,j=s.job,review=t>=48.65;let b=bg(h)+group(img(h,review?'hrReview':'hrEdit',...LAYOUT.hr.plate),'data-layer="coherent-hr-desk"');
 let w=shell()+box(716,146,1174,100,'#fff')+text(756,207,'公司招聘',36,'#293c49',650)+text(1696,205,'职位管理',27,'#6e848d')+text(766,295,COPY.job.title,39,'#293c49',650)+text(766,335,'研发 · 全职',24,'#83919a');
 if(!j.published){w+=box(1660,263,180,60,'#507f88',9)+text(1750,303,'发布职位',27,'#fff',600,'middle')+box(752,365,1100,510,'#fff',12,'stroke="#d8dfe3" stroke-width="2"')+text(784,420,'Job Description',30,'#687d87')+text(784,476,COPY.job.section,33,'#293c49',600)+box(780,511,1044,239,'#fbfcfd',8,'stroke="#9ab8c2" stroke-width="2"');
  if(t>=42.6&&t<43.3)w+=fade(box(800,532,350,58,'#a5c4d0',4,'opacity=".3"'),p(t,42.6,42.9),'data-edit-selection="old-requirement"');
  j.requirements.forEach((line,i)=>{let visible=line;if(i===0&&j.independentResponsibility)visible=[...line].slice(0,Math.max(1,Math.ceil([...line].length*clamp((t-43.3)/.65)))).join('');if(i===1)visible=[...line].slice(0,Math.max(1,Math.ceil([...line].length*clamp((t-44.2)/.85)))).join('');w+=text(808,576+i*70,visible,42,'#293c49',i?500:600);});
  if(t>=43.3&&t<45.15){const i=t>=44.2?1:0,start=i?44.2:43.3,u=clamp((t-start)/(i?.85:.65)),units=[...j.requirements[i]].reduce((n,c)=>n+(/[\x00-\x7f]/.test(c)?.56:1),0);w+=path(`M${f(808+units*42*u+5)} ${535+i*70}V${581+i*70}`,'#466f7f',3);}
  w+=text(784,826,t<45.15?'编辑中…':'岗位信息已保存',24,'#81919b')+cursor(1148,562,t,42.6,-80,75)+cursor(1748,293,t,45.9);
 }else{w+=box(1660,263,180,60,'#e3efe7',9)+text(1750,303,'已发布',27,'#537b69',600,'middle')+box(752,360,1100,216,'#fff',12)+text(784,406,COPY.job.section,29,'#7c8c95');
  COPY.job.after.forEach((line,i)=>w+=text(784,464+i*65,line,39,'#293c49',600));w+=text(766,632,COPY.job.applications,33,'#293c49',650);
  const compact=p(t,50.6,50.95),height=mix(63,36,compact),gap=mix(69,40,compact);
  for(let i=0;i<j.cvCount;i++){const y=650+i*gap,u=p(t,[46.6,47.4,48.3,49.2][i],[46.9,47.7,48.6,49.5][i]);w+=fade(box(752,y,1100,height,'#fff',7)+img(h,'document',768,y+4,30,height-8,'xMidYMid meet')+text(833,y+mix(41,27,compact),'简历 '+String(i+1).padStart(2,'0'),mix(27,24,compact),'#354c5a',550)+text(1082,y+mix(41,27,compact),COPY.job.title,mix(26,24,compact),'#6b7f8b')+text(1712,y+mix(41,27,compact),'待查看',mix(25,24,compact),'#8b9c9c'),u,`data-application="${i+1}"`);}
  if(t<50.6&&j.cvCount)w+=text(1798,632,String(j.cvCount),28,'#537b69',600,'middle');
  if(t>=50.6){let band=box(...LAYOUT.hr.routineRibbon,'#f8f0e3',10),extra=text(886,847,COPY.routine[0],26,'#405d6b',600,'middle');['lunchType','meetingType','eveningType'].forEach((id,i)=>extra+=photo(h,id,[780+i*75,855,70,105],'s04-routine-'+i));band+=fade(extra,s.routine.extra);
   band+=fade(text(1255,847,COPY.routine[1],26,'#405d6b',600,'middle')+img(h,'boardExcerpt',1140,852,226,110,'xMidYMid meet')+arrow('M1025 910H1110'),s.routine.plan);
   band+=fade(arrow('M1384 908H1817V538H1253')+text(1650,604,COPY.routine[2],30,'#a96959',600,'middle')+path('M784 482H1123M784 546H1226','#ba8070',3),s.routine.required);
   w+=fade(band,p(t,50.6,50.9),'data-layer="extra-to-routine-inset"');
  }
 }
 return b+group(w,'data-job-id="S04-JOB-01" data-layer="careers-window"');
}
function caption(c){if(!c)return '';const units=[...c.text].reduce((n,x)=>n+(/[\x00-\x7f]/.test(x)?.56:1),0),w=units*44+68;return group(box(960-w/2,994,w,68,'#101923',12,'fill-opacity=".78"')+text(960,1042,c.text,44,'#fffdf8',500,'middle'),'data-chapter-caption="04"');}
export function svg(value,h,{caption:showCaption=true}={}){const s=sample(value);if(s.t<.4){const refs=Object.fromEntries(Object.keys(prior.ASSETS).map(k=>[k,h['entry03_'+k]]));return prior.svg(1169/30,refs,{caption:false});}
 let body=s.t<12.3?parallel(s,h):s.t<20?performance(s,h):s.t<35.8?competition(s,h):s.t<42.2?board(s,h):hr(s,h);
 return root(body+(showCaption?caption(s.caption):''));}
