import {ASSETS,COPY} from '../../static/03/story-assets-v04/assets.mjs';
import {cues} from './scene.mjs';
export {ASSETS,COPY};
export const CUES=cues;
export const CONFIG={version:'S03_STORY v0.5',width:1920,height:1080,fps:30,duration:39,frames:1170,audio:false};
export const BEATS=[
 ['S03-01',0,4.4,'L','薪水与雇佣关系'],['S03-02',4.4,9.1,'L','约定时间内的劳动力使用'],
 ['S03-03',9.1,11.1,'E','查看已完成清单'],['S03-04',11.1,13,'E','14:00发送完成消息'],
 ['S03-05',13,17.6,'E','14:01追加会议报告'],['S03-06',17.6,20,'E','读消息时间并侧看'],
 ['S03-07',20,23,'E','邻桌仍在工作'],['S03-08',23,25.7,'E','看回屏幕并继续'],
 ['S03-09',25.7,30.5,'E','整理会议报告'],['S03-10',30.5,34.7,'L','企业安排与雇员'],
 ['S03-11',34.7,39,'L','执行更快与时间决定权']
].map(([id,start,end,type,name])=>({id,start,end,type,name}));
const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x);};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const rect=(x,y,w,h,fill,r=0,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${extra}/>`;
const text=(x,y,s,size=30,fill='#29313e',anchor='start',weight=500)=>`<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" font-weight="${weight}">${esc(s)}</text>`;
const measure=s=>[...s].reduce((n,c)=>n+(c.charCodeAt(0)<128?15:28),0);
const group=(body,opacity=1,extra='')=>`<g opacity="${clamp(opacity)}" ${extra}>${body}</g>`;
const img=(id,x,y,w,h,refs)=>{if(!refs[id])throw Error('Missing 03 asset '+id);return `<image href="${esc(refs[id])}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"/>`;};
function portrait(id,x,y,size,refs,key){const clip='s03-p-'+key;return `<defs><clipPath id="${clip}">${rect(x,y,size,size,'white',size*.18)}</clipPath></defs><g clip-path="url(#${clip})">${img(id,x,y,size,size,refs)}</g>`;}
const defs=`<defs><clipPath id="s03-left">${rect(0,0,758,1080,'white')}</clipPath><filter id="s03-soft"><feGaussianBlur stdDeviation="15"/></filter><marker id="s03-arrow" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto"><path d="M0 0L8 4L0 8" fill="none" stroke="#728e99" stroke-width="1.5"/></marker></defs>`;
const line=(d,progress=1,arrow=false)=>{const p=clamp(progress),m=d.match(/^M([\d.]+) ([\d.]+)H([\d.]+)$/);if(!p)return '';const path=m?`M${m[1]} ${m[2]}H${+m[1]+(+m[3]-m[1])*p}`:d;return `<path d="${path}" fill="none" stroke="#728e99" stroke-width="4" opacity="${m?1:p}" ${arrow&&p>=.999?'marker-end="url(#s03-arrow)"':''}/>`;};
function typingPose(t){const cycle=[0,1,0,1,1,0,0,1,0,0,0,1];return cycle[Math.floor(Math.max(0,t)*7)%cycle.length]?'typeB':'front';}
export function sample(value){
 if(!Number.isFinite(value))throw Error('Time must be finite');const t=Math.min(39,Math.max(0,value)),beat=BEATS.find(b=>t>=b.start&&t<b.end)||BEATS.at(-1);
 let pose=typingPose(t);
 if(t>=10.3&&t<11.1)pose='read';
 if(t>=13.7&&t<19.2)pose='read';
 if(t>=19.2&&t<19.55)pose='gaze';
 if(t>=19.55&&t<20||t>=23&&t<23.17)pose='look';
 if(t>=23.17&&t<23.4)pose='gaze';
 if(t>=23.4&&t<24.6)pose='read';
 return {t,beatId:beat.id,type:beat.type,phase:t<9.1?'employment-exchange':t<11.1?'checklist':t<13.5?'completion-message':t<19.2?'assignment-message':t<20?'look-right':t<23?'working-colleagues':t<25.7?'return-to-work':t<30.5?'report-draft':'organization-tree',pose,chatCount:t<11.6?4:t<13.5?5:6,completionSent:t>=11.6,assignmentArrived:t>=13.5,assignmentRead:t>=13.7,neighborPose:Math.floor((t-20)*3)%4>=2?'neighborsB':'neighbors',reportProgress:clamp((t-25.7)/4.2),taskStates:{'S03-A':t<9.65?'submitted':'completed','S03-B':t<10.1?'submitted':'completed','S03-C':t<13.5?'not-introduced':t<24.6?'assigned':'in-progress'},humanOperation:t>=9.1&&t<10.3?'check':t>=11.1&&t<11.6?'send-message':t>=13.7&&t<19.2?'read-assignment':t>=19.2&&t<23.4?'look-at-colleagues':t>=24.6&&t<30.5?'write-report':'none',workdayEnded:false,deadline:'17:00',completionTime:'14:00',assignmentTime:'14:01',taskSet:'distinct-S03-scenario',audio:false};
}
function office(refs){return group(img('office',0,0,1920,1080,refs),1,'filter="url(#s03-soft)"')+rect(0,0,1920,1080,'#20303d',0,'opacity=".25"');}
function exchange(t,refs){
 const salary=ease((t-.55)/1),use=ease((t-4.4)/.9),details=ease((t-5.1)/.5);
 let b=rect(64,60,1792,900,'#f8f4ec',22)+text(132,146,COPY.exchange.title,49,'#283846','start',650);
 b+=portrait('manager',208,286,260,refs,'employer')+portrait('portrait',1452,286,260,refs,'employee');
 b+=text(338,608,COPY.employerLabel,36,'#283846','middle')+text(338,653,COPY.representativeLabel,25,'#677681','middle')+text(1582,608,'雇员',39,'#283846','middle');
 b+=line('M525 344H1390',salary,true)+group(text(960,311,COPY.exchange.salary,39,'#916f3e','middle',600)+text(960,391,'货币报酬',25,'#8b8273','middle'),salary);
 b+=line('M1390 516H525',use,true)+group(text(960,480,COPY.exchange.use,34,'#3d6271','middle',600),use);
 b+=group(text(600,642,COPY.exchange.explanation[0],31,'#556875'),ease((t-2.0)/.5));
 b+=group(text(600,704,COPY.exchange.explanation[1],31,'#556875')+text(600,766,COPY.exchange.explanation[2],31,'#556875'),details);
 b+=group(`<path d="M140 818H1780" stroke="#d4cdbf" stroke-width="2"/>`+text(960,889,COPY.exchange.takeaway,39,'#283846','middle',600),ease((t-7.4)/.5));
 b+=text(1785,941,'[03-1] 《资本论》第一卷第四章',19,'#78818a','end');
 return office(refs)+b;
}
function shell(refs,tab='chat'){
 let b=rect(778,30,1112,936,'#f5f5f8',13,'stroke="#d6d5de" stroke-width="2"')+rect(778,30,1112,54,'#4e4c75',13)+rect(778,58,1112,26,'#4e4c75');
 b+=text(805,65,'Teams',24,'#fff','start',600)+rect(960,42,650,30,'#f4f3f9',5)+text(982,64,'搜索聊天和文件',19,'#656477');
 b+=rect(778,84,70,882,'#e9e8f0')+rect(784,133,58,53,'#d8d5eb',7)+text(813,166,'聊天',22,'#59568f','middle')+text(813,241,'会议',22,'#757582','middle')+text(813,315,'文件',22,'#757582','middle');
 b+=rect(848,84,1042,95,'#fff')+portrait('manager',872,101,56,refs,'chat-head')+text(948,127,'负责人',29,'#282733','start',600)+text(948,157,'在线',20,'#757582');
 b+=text(1227,141,'聊天',24,tab==='chat'?'#59568f':'#777681')+text(1318,141,'共享文件',23,tab==='chat'?'#777681':'#59568f')+`<path d="M${tab==='chat'?1218:1307} 176h${tab==='chat'?69:115}" stroke="#726dab" stroke-width="4"/>`;
 return b;
}
function chat(s,refs){
 let b=shell(refs)+text(1370,216,'今天',21,'#82818d','middle');const ys=[229,331,433,535,637,748];
 COPY.messages.slice(0,s.chatCount).forEach((m,i)=>{
  const self=m.by==='me',width=Math.min(self?824:888,Math.max(...m.lines.map(measure))+40),x=self?1840-width:927,y=ys[i],h=m.lines.length>1?94:54;
  const start=i===4?11.6:i===5?13.5:-10,enter=ease((s.t-start)/.2);
  let z=text(self?1838:927,y+15,m.name+' '+m.time,24,'#777681',self?'end':'start',400);
  if(!self)z+=portrait('manager',869,y+29,44,refs,'msg-'+i);
  z+=rect(x,y+27,width,h,self?'#e8e5f5':'#fff',8);
  m.lines.forEach((v,j)=>z+=text(x+20,y+68+j*37,v,28,'#292731'));
  b+=group(z,enter,`transform="translate(0 ${6*(1-enter)})" data-message="${i}"`);
 });
 let draft='输入消息';if(s.t>=11.1&&s.t<11.6)draft=COPY.messages[4].lines[0];
 b+=rect(877,889,979,56,'#fff',7,'stroke="#cfced8" stroke-width="1.5"')+text(897,926,draft,23,draft==='输入消息'?'#8d8b98':'#494455');
 const focus=s.t>=19.2&&s.t<20||s.t>=23&&s.t<23.4?.32:s.t>=23.4&&s.t<23.8?.32+.68*ease((s.t-23.4)/.4):1;return group(b,focus,'data-layer="chat"');
}
function checklist(s,refs){
 let b=shell(refs,'files')+text(928,256,'今天的清单',39,'#29313e','start',600);
 const names=['登录校验','导出页面修复'],snippets=[COPY.messages[1].lines[0],COPY.messages[3].lines[0]];
 names.forEach((label,i)=>{const y=330+i*204,done=s.t>=9.65+i*.45;
  b+=rect(922,y,880,166,'white',10)+text(958,y+53,label,34)+text(958,y+105,snippets[i],25,'#6b7480');
  if(done)b+=`<path d="M1730 ${y+56}l13 14 25-32" fill="none" stroke="#608a78" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
 });
 return b+group(text(926,824,'2项已完成',29,'#608a78'),ease((s.t-10.3)/.25));
}
function report(s,refs){
 let b=shell(refs,'files')+rect(912,215,902,705,'#fff',8)+text(954,274,'会议报告',43,'#29313e','start',600)+text(1760,271,'草稿',24,'#8a795e','end');
 b+=text(955,319,'17:00前 · 汇总今天的改动和测试结果',25,'#7c7a82')+`<path d="M954 343H1770" stroke="#e2e1e5" stroke-width="2"/>`;
 const rows=[['登录校验',34,'#29313e'],['登录校验已补齐，回归测试通过，结果已上传。',27,'#687180'],['导出页面修复',34,'#29313e'],['导出问题已修复，复测通过。',27,'#687180']];
 const reveal=s.reportProgress*rows.reduce((n,[v])=>n+v.length,0);let consumed=0;
 rows.forEach(([v,z,c],i)=>{const n=Math.max(0,Math.min(v.length,Math.floor(reveal-consumed)));consumed+=v.length;if(n)b+=text(955,[411,468,581,638][i],v.slice(0,n),z,c);});
 b+=text(955,867,'尚未提交',24,'#8a795e');return b;
}
function story(s,refs){
 if(s.t>=20&&s.t<23){const zoom=1+.018*ease((s.t-20)/.65),cx=960,cy=520;return group(img(s.neighborPose,0,0,1920,1080,refs),1,`transform="translate(${cx} ${cy}) scale(${zoom}) translate(${-cx} ${-cy})" data-layer="coherent-neighbors"`);}
 const zoom=s.t>=13.7&&s.t<19.2?1+.018*ease((s.t-13.7)/.6):1;
 let b=rect(0,0,1920,1080,'#dfe2e6')+`<g clip-path="url(#s03-left)"><g transform="translate(379 450) scale(${zoom}) translate(-379 -450)" data-pose="${s.pose}">${img(s.pose,0,0,758,1080,refs)}</g></g>`;
 b+=s.t<11.1?checklist(s,refs):s.t<25.7?chat(s,refs):report(s,refs);return b;
}
function tree(t,refs){
 let b=rect(64,60,1792,900,'#f8f4ec',22)+text(132,146,COPY.tree.title,49,'#283846','start',650);
 b+=portrait('manager',876,189,168,refs,'tree-manager')+text(960,395,COPY.employerLabel+' · '+COPY.representativeLabel,29,'#283846','middle');
 const p=ease((t-30.85)/1.0);
 b+=line('M960 416V479H405V542',p)+line('M960 479H1515V542',p)+line('M960 479V542',p)+rect(722,438,476,60,'#f8f4ec',8)+group(text(960,479,COPY.tree.relation,30,'#59727c','middle'),ease((t-31.1)/.35));
 for(const [i,x]of [405,960,1515].entries()){
  const enter=ease((t-(i===1?31.55:32.0))/.45),taskEnter=ease((t-33.0)/.5);let z=portrait(i===1?'portrait':i===0?'coworkerA':'coworkerB',x-77,551,154,refs,'tree-'+i)+text(x,752,'雇员',30,'#526674','middle');
  let task='';if(i===1)task+=text(x,786,COPY.tree.completed,25,'#75817e','middle');const y=i===1?809:775;
  task+=rect(x-213,y,426,64,i===1?'#e9d6b6':'#dce7e5',9)+text(x,y+43,i===1?COPY.tree.tasks[2]:COPY.tree.coworkers[i===0?0:1],30,'#354b58','middle');
  b+=group(z,enter)+group(task,taskEnter);
 }
 b+=group(text(960,913,COPY.tree.takeaway,35,'#283846','middle',600),ease((t-34.7)/.6))+text(1785,946,'[03-2／3] 《资本论》第一卷第五、八章',19,'#78818a','end');
 return office(refs)+b;
}
export function svg(value,refs,{caption=true}={}){
 const s=sample(value);let body=s.t<9.1?exchange(s.t,refs):s.t<30.5?story(s,refs):tree(s.t,refs);
 if(caption){const cue=CUES.find(c=>s.t*1000>=c.startMs&&s.t*1000<c.endMs);if(cue){const w=[...cue.text].reduce((n,c)=>n+(c.charCodeAt(0)<128?.56:1),0)*44+68;body+=`<g data-chapter-caption="03">${rect((1920-w)/2,994,w,68,'#101923',12,'fill-opacity=".78"')}${text(960,1042,cue.text,44,'#fffdf8','middle')}</g>`;}}
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"><style>text{font-family:'PingFang SC','Hiragino Sans GB',sans-serif}</style>${defs}${body}</svg>`;
}
