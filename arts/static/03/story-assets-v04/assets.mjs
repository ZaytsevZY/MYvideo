import COPY from './screen-copy.json' with {type:'json'};
export {COPY};
export const ASSETS={front:'arts/backgrounds/03/programmer-front-desk-a-v05.png',typeB:'arts/backgrounds/03/programmer-front-desk-b-v05.png',read:'arts/backgrounds/03/programmer-front-read-v05.png',look:'arts/backgrounds/03/programmer-front-look-v05.png',gaze:'arts/backgrounds/03/programmer-front-glance-v05.png',neighbors:'arts/backgrounds/03/neighbor-work-a-v05.png',neighborsB:'arts/backgrounds/03/neighbor-work-b-v05.png',manager:'arts/characters/portraits/03/manager-neutral-v04.png',coworkerA:'arts/characters/portraits/03/coworker-a-v04.png',coworkerB:'arts/characters/portraits/03/coworker-b-v04.png',portrait:'arts/characters/portraits/03/programmer-front-v04.png',office:'arts/backgrounds/shared/office-workstations-day-v01.png'};
export const LAYOUT={canvas:[1920,1080],frontPlate:[0,0,758,1080],chat:[778,30,1112,936],relation:[64,60,1792,900],subtitleSafe:[40,995,1840,70],layers:['coherent-scene-plate','enterprise-chat-or-relation','subtitle-safe'],retired:['standalone-clock','rear-view-cutout','neighbor-person-on-desk-composite','decorative-motion-arrows']};
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;');
const rect=(x,y,w,h,c,r=0,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c}" ${extra}/>`;
const txt=(x,y,s,size=30,c='#29313e',anchor='start',weight=500)=>`<text x="${x}" y="${y}" font-size="${size}" fill="${c}" text-anchor="${anchor}" font-weight="${weight}">${esc(s)}</text>`;
const img=(h,x,y,w,hh,fit='xMidYMid slice')=>`<image href="${h}" x="${x}" y="${y}" width="${w}" height="${hh}" preserveAspectRatio="${fit}"/>`;
export const root=body=>`<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"><style>text{font-family:'PingFang SC','Hiragino Sans GB',sans-serif}</style><defs><filter id="soft"><feGaussianBlur stdDeviation="15"/></filter><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto"><path d="M0 0L8 4L0 8" fill="none" stroke="#728e99" stroke-width="1.5"/></marker></defs>${body}</svg>`;
function portrait(h,x,y,s,id){return `<defs><clipPath id="p${id}"><rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${s*.18}"/></clipPath></defs>${rect(x,y,s,s,'#eee9df',s*.18)}<g clip-path="url(#p${id})">${img(h,x,y,s,s)}</g>`;}
function chat(h,reply=true,report=false){
 let b=rect(778,30,1112,936,'#f5f5f8',13,'stroke="#d6d5de" stroke-width="2"');
 b+=rect(778,30,1112,54,'#4e4c75',13)+rect(778,58,1112,26,'#4e4c75');
 b+=txt(805,65,'Teams',24,'#fff','start',600)+rect(960,42,650,30,'#f4f3f9',5)+txt(982,64,'搜索聊天和文件',19,'#656477');
 b+=rect(778,84,70,882,'#e9e8f0')+rect(784,133,58,53,'#d8d5eb',7)+txt(813,166,'聊天',22,'#59568f','middle')+txt(813,241,'会议',22,'#757582','middle')+txt(813,315,'文件',22,'#757582','middle');
 b+=rect(848,84,1042,95,'#fff')+portrait(h.manager,872,101,56,'chat-head')+txt(948,127,'负责人',29,'#282733','start',600)+txt(948,157,'在线',20,'#757582');
 b+=txt(1227,141,'聊天',24,'#59568f')+txt(1318,141,'共享文件',23,'#777681')+`<path d="M1218 176h69" stroke="#726dab" stroke-width="4"/>`;
 b+=txt(1370,216,'今天',21,'#82818d','middle');
 const y=[229,331,433,535,637,748];
 COPY.messages.slice(0,reply?6:5).forEach((m,i)=>{
  const self=m.by==='me',measure=s=>[...s].reduce((n,c)=>n+(c.charCodeAt(0)<128?15:28),0),w=Math.min(self?824:888,Math.max(...m.lines.map(measure))+40),x=self?1840-w:927,top=y[i],height=m.lines.length>1?94:54;
  b+=txt(self?1838:927,top+15,m.name+' '+m.time,24,'#777681',self?'end':'start',400);
  if(!self)b+=portrait(h.manager,869,top+29,44,'chat-'+i);
  b+=rect(x,top+27,w,height,self?'#e8e5f5':'#fff',8);
  m.lines.forEach((line,j)=>b+=txt(x+20,top+68+j*37,line,28,'#292731'));
 });
 b+=rect(877,889,979,56,'#fff',7,'stroke="#cfced8" stroke-width="1.5"')+txt(897,926,report?'正在整理：会议报告':'输入消息',23,'#8d8b98');
 return `<g data-layer="enterprise-chat">${b}</g>`;
}
function relation(h,type){
 let b=rect(64,60,1792,900,'#f8f4ec',22)+txt(132,146,type==='exchange'?COPY.exchange.title:COPY.tree.title,49,'#283846','start',650);
 if(type==='exchange'){
  b+=portrait(h.manager,208,286,260,'employer')+portrait(h.portrait,1452,286,260,'employee');
  b+=txt(338,608,COPY.employerLabel,36,'#283846','middle')+txt(338,653,COPY.representativeLabel,25,'#677681','middle')+txt(1582,608,'雇员',39,'#283846','middle');
  b+=`<path d="M525 344H1390" fill="none" stroke="#728e99" stroke-width="4" marker-end="url(#arrow)"/><path d="M1390 516H525" fill="none" stroke="#728e99" stroke-width="4" marker-end="url(#arrow)"/>`;
  b+=txt(960,311,COPY.exchange.salary,39,'#916f3e','middle',600)+txt(960,480,COPY.exchange.use,34,'#3d6271','middle',600);
  b+=txt(960,391,'货币报酬',25,'#8b8273','middle');
  COPY.exchange.explanation.forEach((s,i)=>b+=txt(600,642+i*62,s,31,'#556875'));
  b+=`<path d="M140 818H1780" stroke="#d4cdbf" stroke-width="2"/>`+txt(960,889,COPY.exchange.takeaway,39,'#283846','middle',600);
 }else{
  b+=portrait(h.manager,876,189,168,'tree-manager')+txt(960,395,COPY.employerLabel+' · '+COPY.representativeLabel,29,'#283846','middle');
  b+=`<path d="M960 416V479H405V542M960 479H1515V542M960 479V542" fill="none" stroke="#728e99" stroke-width="4"/>`+rect(722,438,476,60,'#f8f4ec',8)+txt(960,479,COPY.tree.relation,30,'#59727c','middle');
  for(const [i,x] of [405,960,1515].entries()){
   b+=portrait(i===1?h.portrait:i===0?h.coworkerA:h.coworkerB,x-77,551,154,'tree-employee-'+i)+txt(x,752,'雇员',30,'#526674','middle');
   if(i===1)b+=txt(x,786,COPY.tree.completed,25,'#75817e','middle');
   const cardY=i===1?809:775;
   b+=rect(x-213,cardY,426,64,i===1?'#e9d6b6':'#dce7e5',9)+txt(x,cardY+43,i===1?COPY.tree.tasks[2]:COPY.tree.coworkers[i===0?0:1],30,'#354b58','middle');
  }
  b+=txt(960,913,COPY.tree.takeaway,35,'#283846','middle',600);
 }
 return `<g data-layer="near-fullscreen-relation">${b}</g>`;
}
export function scene(name,h,{state=0}={}){
 if(name==='neighbors')return img(h[state?'neighborsB':'neighbors'],0,0,1920,1080);
 if(['exchange','tree'].includes(name))return `<g filter="url(#soft)">${img(h.office,0,0,1920,1080)}</g>`+rect(0,0,1920,1080,'#20303d',0,'opacity=".25"')+relation(h,name);
 const pose=name==='turn'?'gaze':name==='look'?'look':name==='reply'?'read':state?'typeB':'front';
 const chatLayer=chat(h,name!=='completed',name==='typing');
 return img(h.office,0,0,1920,1080)+rect(758,0,1162,1080,'#dfe2e6')+`<g data-layer="coherent-front-scene">${img(h[pose],0,0,758,1080)}</g>`+(['look','turn'].includes(name)?`<g opacity=".32">${chatLayer}</g>`:chatLayer);
}
