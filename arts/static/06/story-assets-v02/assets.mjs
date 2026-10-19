import COPY from './screen-copy.json' with {type:'json'};
import * as previous from '../../../actions/05/story-scene-v03.mjs';
export {COPY};
export const ASSETS={
 settled:'arts/backgrounds/06/office-choice-settled-v02.png',extra:'arts/backgrounds/06/office-choice-extra-work-v02.png',standing:'arts/backgrounds/06/office-standing-with-bag-v02.png',departed:'arts/backgrounds/06/office-leave-doorway-v02.png',
 developer:'arts/backgrounds/06/meeting-developer-scope-v02.png',tester:'arts/backgrounds/06/meeting-tester-needs-v02.png',writing:'arts/backgrounds/06/meeting-manager-write-v02.png',agreed:'arts/backgrounds/06/meeting-joint-confirm-v02.png',review:'arts/backgrounds/06/office-review-deliverable-v02.png',accepted:'arts/backgrounds/06/office-accept-deliverable-v02.png',
 bookSelect:'arts/backgrounds/06/bookshop-select-v02.png',bookBuy:'arts/backgrounds/06/bookshop-purchase-v02.png',theatreSettle:'arts/backgrounds/06/theatre-settle-v02.png',theatreEnjoy:'arts/backgrounds/06/theatre-enjoy-v02.png',homeRead:'arts/backgrounds/06/home-reading-v02.png',homeTurn:'arts/backgrounds/06/home-page-turn-v02.png',
 programmer:'arts/characters/portraits/03/programmer-front-v04.png',coworkerA:'arts/characters/portraits/03/coworker-a-v04.png',coworkerB:'arts/characters/portraits/03/coworker-b-v04.png',manager:'arts/characters/portraits/03/manager-neutral-v04.png',agent:'arts/characters/portraits/01/agent-neutral-v01.png',company:'arts/items/04/company-a-v03.png',document:'arts/items/01/task-document-portrait-v01.png',documentWide:'arts/items/01/task-document-landscape-v01.png',office:'arts/backgrounds/shared/office-workstations-day-v01.png'
};
export const LAYOUT={canvas:[1920,1080],subtitleSafe:[40,994,1840,70],choices:{source:[64,180,430,750],left:[560,250,615,650],right:[1220,250,615,650],companyNode:[855,104],employeeNode:[1528,104]},meeting:{paperQuad:[[631,810],[1412,808],[1555,954],[500,954]],labels:[[745,910],[1045,910],[1340,910]],penContact:[960,808],feedback:[1530,865,280,64]},work:{raster:[24,24,950,950],resultWindow:[1028,150,828,730]},conditions:{plan:[566,30,788,220],quote:[75,245,850,660],institution:[995,245,850,660]},layers:['coherent-raster-scene','physical-paper-editable-copy','task-or-participation-contents','action-feedback','optional-caption-safe-check'],notes:['首段两窗为互斥逻辑对照，同人双视图不计两个人','人物／道具／座椅同透视绘稿，不拆肢体','纸张文字避开食指及笔尖；角色画面无烘焙事实文字','standing/departed同时复用于分支和真实履约离席','生活书／纸袋／双扣工作包保持，书页只作片尾视觉匹配','本文件仅24个素材构图关键态，非58秒新动态']};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const box=(x,y,w,h,c='#f8f4ec',r=0,a='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c}" ${a}/>`;
const txt=(x,y,s,size=34,c='#385765',anchor='middle',weight=500)=>`<text x="${x}" y="${y}" font-size="${size}" fill="${c}" text-anchor="${anchor}" font-weight="${weight}">${esc(s)}</text>`;
const g=(s,a='')=>`<g ${a}>${s}</g>`;
const img=(h,id,x,y,w,hh=w,fit='xMidYMid meet')=>{if(!h[id])throw Error('Missing06 art '+id);return `<image href="${esc(h[id])}" x="${x}" y="${y}" width="${w}" height="${hh}" preserveAspectRatio="${fit}"/>`;};
const line=(d,c='#8198a0',w=4,a='')=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${a}/>`;
const arrow=(d,c='#8198a0')=>line(d,c,4,'marker-end="url(#s06-arrow)"');
function portrait(h,id,x,y,s,key){return `<defs><clipPath id="${key}">${box(x,y,s,s,'white',s*.16)}</clipPath></defs>`+g(img(h,id,x,y,s,s,'xMidYMid slice'),`clip-path="url(#${key})" data-participant="${id}"`);}
export const root=b=>`<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"><style>text{font-family:'PingFang SC','Hiragino Sans GB',sans-serif}</style><defs><filter id="s06-soft"><feGaussianBlur stdDeviation="16"/></filter><marker id="s06-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0L7 4L0 8" fill="none" stroke="#8198a0" stroke-width="1.7"/></marker></defs>${b}</svg>`;
function bg(h,panel=true){return g(img(h,'office',0,0,1920,1080),'filter="url(#s06-soft)"')+box(0,0,1920,1080,'#ece5d9',0,'opacity=".82"')+(panel?box(42,32,1836,930,'#f8f4ec',22):'');}
function paper(h,x,y,w,hh,title,lines=[]){return img(h,'documentWide',x,y,w,hh)+txt(x+w/2,y+hh*.44,title,w>900?43:35,'#385765','middle',600)+lines.map((s,i)=>txt(x+w/2,y+hh*(.6+i*.14),s,w>900?34:30,'#6a7e87')).join('');}
function window(h,id,key,rect,active=false,color='#7a9eaa'){const[x,y,w,hh]=rect;return `<defs><clipPath id="${key}">${box(x,y,w,hh,'white',18)}</clipPath></defs>`+g(img(h,id,x,y,w,hh,'xMidYMid slice'),`clip-path="url(#${key})" data-raster-state="${id}"`)+box(x,y,w,hh,'none',18,`stroke="${active?color:'#c6cec9'}" stroke-width="${active?6:2}"`);}
function choices(h,state){let b=bg(h);
 b+=portrait(h,'programmer',110,310,140,'source-human')+portrait(h,'agent',303,310,140,'source-agent')+txt(280,506,'人 + Agent',38)+img(h,'document',211,563,138,175)+txt(280,801,COPY.choices.source,44,'#3f6675','middle',600);
 b+=arrow('M474 600H546')+arrow('M474 680H520V932H1190V575H1207');
 b+=img(h,'company',714,53,140,123)+portrait(h,'manager',879,66,96,'choice-manager')+portrait(h,'programmer',1477,55,102,'choice-worker');
 b+=txt(868,220,COPY.choices.more,42,'#806950','middle',600)+txt(1528,220,COPY.choices.time,42,'#4b7882','middle',600);
 b+=window(h,state>=1?'extra':'settled','choice-left',LAYOUT.choices.left,state===1,'#c4a26c');
 b+=window(h,state===2?'standing':state>=3?'departed':'settled','choice-right',LAYOUT.choices.right,state===2||state===3);
 if(state===1)b+=line('M814 187H936','#bc9864',5);if(state===2||state===3)b+=line('M1473 181H1583','#709fa6',5);
 if(state===4)b+=g(box(535,235,1330,700,'#f4eee3',20,'opacity=".86"')+paper(h,617,315,1130,520,COPY.plan.heading,[COPY.plan.pending]),'data-object-id="S05-PLAN-01" data-proposal-state="pending-discussion"');
 return g(b,'data-logic-scene="conditional-allocation"');}
function physicalPlan(state){let b='';const fields=COPY.plan.fields;
 [0,1,2].forEach(i=>{if(i<=Math.min(2,state))b+=txt(LAYOUT.meeting.labels[i][0],LAYOUT.meeting.labels[i][1],fields[i],34,i===state?'#436e80':'#6e7d82')+line(`M${[648,932,1247][i]} 932H${[841,1163,1450][i]}`,i===state?'#7394a4':'#a0acae',3);});
 if(state===3)b+=line('M1433 900l10 9 18-22','#72967f',4);
 return g(b,'data-layer="physical-planning-copy" data-object-id="S05-PLAN-01"');}
function meeting(h,state){const id=['developer','tester','writing','agreed'][state];let b=g(img(h,id,0,0,1920,1080,'xMidYMid slice'),`data-raster-state="${id}"`)+physicalPlan(state);
 if(state===3)b+=g(box(1530,865,280,64,'#e5efe5',12)+txt(1670,908,COPY.plan.agreed,34,'#56816e','middle',600),'data-action-feedback="joint-confirmed"');return b;}
function conditions(h,state){let b=bg(h);b+=paper(h,566,30,788,220,COPY.plan.heading,[state?COPY.plan.agreed:COPY.plan.pending]);
 b+=arrow('M850 236V262H525V310')+arrow('M1100 236V262H1425V310');
 b+=img(h,'documentWide',75,265,850,620)+txt(500,477,'"'+COPY.conditions.quoteLines[0],52,'#3d5b69','middle',600)+txt(500,553,COPY.conditions.quoteLines[1]+'"',52,'#3d5b69','middle',600)+txt(500,690,COPY.conditions.source,30,'#77858a');
 b+=img(h,'documentWide',995,265,850,620)+txt(1420,455,COPY.conditions.union[0],46,'#3d5b69','middle',600)+txt(1420,510,COPY.conditions.union[1],46,'#3d5b69','middle',600);
 b+=portrait(h,'coworkerA',1162,545,82,'union-a')+portrait(h,'coworkerB',1262,545,82,'union-b')+arrow('M1368 588H1510')+portrait(h,'manager',1540,545,82,'union-employer')+txt(1420,675,COPY.conditions.subject,33,'#6d8089')+txt(1420,718,COPY.conditions.unionSource,29,'#77858a');return g(b,'data-logic-scene="control-and-participation"');}
function work(h,state){let b=bg(h,false);b+=window(h,state?'accepted':'review','work-main',LAYOUT.work.raster,false);const[x,y,w,hh]=LAYOUT.work.resultWindow;
 b+=g(box(x,y,w,hh,'#fbfaf5',20,'stroke="#c0ccc9" stroke-width="2"')+box(x,y,w,88,'#e6eeec',20)+txt(x+48,y+60,COPY.work.title,42,'#496774','start',600)+img(h,'document',x+72,y+177,154,204)+txt(x+480,y+251,'约定交付',42,'#496774','middle',600)+txt(x+480,y+318,state?COPY.work.accepted:COPY.work.review,38,state?'#59816c':'#a28758')+line(`M${x+48} ${y+435}H${x+w-48}`,'#cbd4ce',2)+txt(x+52,y+504,COPY.work.later,34,'#6e8288','start')+box(x+455,y+551,307,76,state?'#ddeadd':'#e1e9ec',12)+txt(x+608,y+600,state?COPY.work.accepted:COPY.work.reviewAction,36,'#4d7580','middle',600),`data-object-id="T06-final" data-state="${state?'human-accepted':'review'}"`);
 return b;}
function leave(h,state){return g(img(h,state?'departed':'standing',430,0,1080,1080,'xMidYMid meet'),'data-layer="whole-departure-pose"') ;}
function references(h,state){let b=bg(h,false)+box(108,65,1704,895,'#f8f4ec',24);b+=txt(220,168,COPY.references.title+'  '+(state?'2 / 2':'1 / 2'),46,'#385765','start',600);
 if(!state){COPY.references.first.forEach(([a,c],i)=>{const y=292+i*150;b+=txt(240,y,a,38,'#385765','start',600)+txt(240,y+57,c,31,'#78868b','start');});}
 else{COPY.references.second.forEach(([a,c,d],i)=>{const y=[288,475,650][i];b+=txt(240,y,a,38,'#385765','start',600)+txt(240,y+52,c,31,'#78868b','start');if(d)b+=txt(240,y+99,d,29,'#78868b','start');});b+=txt(240,835,COPY.references.note,28,'#78868b','start')+txt(240,909,COPY.references.member,34,'#556e79','start');}return g(b,'data-layer="references"');}
export const SCENES={entry:{label:'05末态接续',states:1},choices:{label:'双窗配置与偏好',states:5},meeting:{label:'开发／测试／记录／核对',states:4},conditions:{label:'共同控制与参与资料',states:2},work:{label:'查看与人工验收',states:2},leave:{label:'持包起身与离开',states:2},bookshop:{label:'选书与购买',states:2},theatre:{label:'入座与观看演出',states:2},home:{label:'阅读与翻页',states:2},references:{label:'两张来源页',states:2}};
export function scene(name,h,state=0){if(!SCENES[name])throw Error('Unknown06 art scene '+name);state=Math.max(0,Math.min(SCENES[name].states-1,Math.floor(state)));if(name==='entry')return previous.svg(1349/30,h,{caption:false}).replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'');
 if(name==='choices')return choices(h,state);if(name==='meeting')return meeting(h,state);if(name==='conditions')return conditions(h,state);if(name==='work')return work(h,state);if(name==='leave')return bg(h,false)+leave(h,state);if(name==='references')return references(h,state);
 const id=name==='bookshop'?(state?'bookBuy':'bookSelect'):name==='theatre'?(state?'theatreEnjoy':'theatreSettle'):(state?'homeTurn':'homeRead');return g(img(h,id,0,0,1920,1080,'xMidYMid slice'),`data-raster-state="${id}"`);}
