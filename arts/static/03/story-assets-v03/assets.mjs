export const ASSETS={
 room:'arts/backgrounds/03/office-main-over-shoulder-v01.png',neighbors:'arts/backgrounds/03/office-neighbor-desks-v01.png',
 type:'arts/characters/poses/03/programmer-office-type-v02.png',click:'arts/characters/poses/03/programmer-office-click-v01.png',read:'arts/characters/poses/03/programmer-office-read-v01.png',look:'arts/characters/poses/03/programmer-office-look-right-v01.png',
 coworkerA:'arts/characters/poses/03/coworker-type-a-v01.png',coworkerA2:'arts/characters/poses/03/coworker-type-b-v01.png',coworkerB:'arts/characters/poses/03/coworker-paper-a-v01.png',coworkerB2:'arts/characters/poses/03/coworker-paper-b-v01.png',
 manager:'arts/characters/poses/shared/manager-assign-left-v01.png',portrait:'arts/characters/portraits/01/programmer-neutral-v01.png',document:'arts/items/01/task-document-portrait-v01.png'
};
export const LAYOUT={canvas:[1920,1080],sourceCanvas:[1672,941],programmer:[450,170,770,1155],coworkerA:[180,235,660,990],coworkerB:[1045,245,455,682.5],chat:[1120,70,660,480],clock:[1150,140,550,350],subtitleSafe:[24,994,1872,68],screenQuad:[[883,312],[1292,320],[1280,536],[872,512]],layers:['room','screen-ui','complete-person-and-chair','message-or-clock','caption-safe']};
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
const rect=(x,y,w,h,fill='#fbf7ef',r=18,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${extra}/>`;
const text=(x,y,s,size=36,color='#263542',anchor='start')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${color}" text-anchor="${anchor}">${esc(s)}</text>`;
const image=(href,x,y,w,h,fit='xMidYMid meet')=>`<image href="${href}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="${fit}"/>`;
export const root=(body,w=1920,h=1080)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><style>text{font-family:'PingFang SC','Hiragino Sans GB',sans-serif;font-weight:500}</style>${body}</svg>`;
export const UI_SIZES={chatEmpty:[660,480],chatSent:[660,480],chatReply:[660,480],complete:[960,540],report:[960,540],working:[960,540],clock:[550,350],exchange:[1120,650],tree:[1120,720]};
function portrait(id,x,y,size,h){
 const vb=id==='portrait'?'0 0 512 512':id==='manager'?'270 0 480 480':'190 0 500 450';
 return rect(x-5,y-5,size+10,size+10,'#f4efe5',18,'stroke="#b9ad99" stroke-width="3"')+`<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="${vb}" overflow="hidden">${image(h[id],0,0,id==='portrait'?512:1024,id==='portrait'?512:1536)}</svg>`;
}
const check=(x,y)=>`<circle cx="${x}" cy="${y}" r="24" fill="#84a58e"/><path d="M${x-11} ${y}l8 9 16-21" fill="none" stroke="#fbf7ef" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;
export function ui(name,h){
 if(name==='working'){
  let b=rect(0,0,960,540,'#20313f',8)+rect(560,85,280,365,'#f4efe5',10);
  for(let i=0;i<5;i++)b+=rect(65,105+i*76,320-(i%3)*55,13,i%2?'#81aaa8':'#aab9bf',6);
  for(let i=0;i<4;i++)b+=rect(602,145+i*70,190-(i%2)*40,12,'#a8b6bd',6);
  return b;
 }
 if(name.startsWith('chat')){
  let b=rect(0,0,660,480,'#fbf7ef',25,'stroke="#b9ad99" stroke-width="2"')+rect(1,1,658,116,'#e8e5dc',24)+portrait('manager',28,22,76,h)+text(130,70,'雇主',36);
  if(name==='chatEmpty')return b+rect(30,370,600,74,'#e9eceb',13);
  b+=rect(272,150,355,88,'#d6e8e4',18)+text(596,206,'工作已完成',38,'#263542','end');
  if(name==='chatReply')b+=rect(32,273,594,154,'#f0e4cf',18)+text(58,333,'17:00前准备一个',38)+text(58,387,'会议报告',38);
  return b;
 }
 if(name==='complete'||name==='report'){
  let b=rect(0,0,960,540,'#20313f',8);
  for(let i=0;i<2;i++)b+=rect(50,60+i*140,860,112,'#304553',15)+rect(92,84+i*140,72,64,'#f5f0e5',6)+`<path d="M108 ${104+i*140}h40M108 ${123+i*140}h31" stroke="#acb7bc" stroke-width="7" stroke-linecap="round"/>`+check(845,115+i*140);
  if(name==='report')b+=rect(50,361,860,130,'#465362',15)+text(92,439,'会议报告',42,'#f3e6ce')+`<circle cx="845" cy="426" r="23" fill="none" stroke="#cfa76b" stroke-width="6"/>`;
  return b;
 }
 if(name==='clock'){
  let b=rect(0,0,550,350,'#fbf7ef',24,'stroke="#b9ad99" stroke-width="2"')+`<circle cx="152" cy="170" r="117" fill="#e9e5db" stroke="#7c898d" stroke-width="5"/>`;
  for(let i=0;i<12;i++)b+=`<path d="M152 65v14" transform="rotate(${i*30} 152 170)" stroke="#71818a" stroke-width="4"/>`;
  b+=`<path d="M152 170V105" transform="rotate(125 152 170)" stroke="#263542" stroke-width="8" stroke-linecap="round"/><path d="M152 170V78" transform="rotate(60 152 170)" stroke="#263542" stroke-width="5" stroke-linecap="round"/><circle cx="152" cy="170" r="8" fill="#263542"/>`;
  return b+text(300,125,'约定工时',32)+rect(300,190,200,18,'#dbe3e3',7)+`<path d="M500 175v49" stroke="#8d795a" stroke-width="4"/><circle cx="369" cy="199" r="13" fill="#d0a166"/>`+text(500,270,'下班',31,'#6b7b83','end');
 }
 if(name==='exchange'){
  return rect(0,0,1120,650,'#fbf7ef',28,'stroke="#c8baa2" stroke-width="2"')+portrait('manager',75,170,190,h)+portrait('portrait',855,170,190,h)+text(170,421,'雇主',35,'#263542','middle')+text(950,421,'雇员',35,'#263542','middle')+`<path d="M300 215H820M820 442H300" stroke="#99aeb6" stroke-width="4"/>`+rect(425,139,260,115,'#e6c991',15)+`<path d="M434 152l121 67 121-67" fill="none" stroke="#9d7840" stroke-width="4"/>`+text(555,304,'薪水',35,'#715c3d','middle')+rect(410,402,290,68,'#d8e6e8',12)+`<path d="M425 412v49M685 412v49" stroke="#71818a" stroke-width="4"/>`+text(555,530,'约定工时',35,'#263542','middle');
 }
 if(name==='tree'){
  let b=rect(0,0,1120,720,'#fbf7ef',28,'stroke="#c8baa2" stroke-width="2"')+`<path d="M560 235V300H200V352M560 300H920V352M560 300V352" fill="none" stroke="#99aab1" stroke-width="5"/>`;
  b+=portrait('manager',485,45,150,h)+text(560,235,'雇主',34,'#263542','middle');
  for(const [id,x]of [['portrait',125],['coworkerA',485],['coworkerB',845]])b+=portrait(id,x,365,150,h);
  b+=text(200,554,'雇员',32,'#263542','middle')+`<g data-task="S03-C" data-status="in-progress">${rect(65,574,280,70,'#f0e4cf',14)}${text(205,621,'会议报告',32,'#263542','middle')}</g>`;
  for(let i=0;i<2;i++)b+=`<g data-task="S03-${i?'B':'A'}" data-status="completed">${image(h.document,363+i*78,568,62,77)}<g transform="translate(${415+i*78} 581) scale(.5)">${check(0,0)}</g></g>`;
  b+=rect(65,659,280,14,'#d9e4e4',5)+`<path d="M65 650v32M345 650v32" stroke="#7d8e96" stroke-width="4"/>`+text(205,710,'约定工时',28,'#263542','middle');
  return b;
 }
 throw Error('Unknown UI '+name);
}
export function scene(name,h,{state=0,hidden=[]}={}){
 const hide=k=>hidden.includes(k);let b='';
 if(name==='neighbors'){
  if(!hide('background'))b+=image(h.neighbors,0,0,1672,941);
  if(!hide('screen'))b+=`<g data-layer="neighbor-screens"><g transform="matrix(.314 -.004 -.01 .39 697 311)">${ui('working',h)}</g><g transform="matrix(.234 -.006 -.007 .267 1385 291)">${ui('working',h)}</g></g>`;
  if(!hide('person')){b+=image(h[state?'coworkerB2':'coworkerB'],...LAYOUT.coworkerB);b+=image(h[state?'coworkerA2':'coworkerA'],...LAYOUT.coworkerA);}
 }else{
  if(!hide('background'))b+=image(h.room,0,0,1672,941);
  if(!hide('screen'))b+=`<g data-layer="screen-ui" transform="matrix(.419 .008 -.022 .379 890 312)">${ui(['typing','tree','reply','look'].includes(name)?'report':'complete',h)}</g>`;
  const pose=name==='completed'?'click':name==='look'?'look':name==='typing'?'type':'read';
  if(!hide('person'))b+=`<g data-layer="complete-person-and-chair">${image(h[pose],...LAYOUT.programmer)}</g>`;
 }
 b=`<g transform="scale(${1920/1672} ${1080/941})">${b}</g>`;
 if(!hide('overlay')){
  if(name==='reply'||name==='completed')b+=`<svg x="1120" y="70" width="660" height="480" viewBox="0 0 660 480" data-layer="chat">${ui(name==='reply'?'chatReply':'chatSent',h)}</svg>`;
  if(name==='look')b+=`<svg x="1150" y="140" width="550" height="350" viewBox="0 0 550 350" data-layer="clock">${ui('clock',h)}</svg>`;
  if(name==='tree'||name==='exchange')b+=`<svg x="1070" y="85" width="800" height="${name==='tree'?514.286:464.286}" viewBox="0 0 1120 ${name==='tree'?720:650}" data-layer="relation">${ui(name,h)}</svg>`;
 }
 return `<g data-composition="${name}" data-sample-only="true">${b}</g>`;
}
