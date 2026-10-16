import {CALIBRATION,programmerMotion,walking} from '../01/keyframes.mjs';
export const CONFIG={version:'S06 v0.1',duration:58,fps:30,frames:1740,width:1920,height:1080,globalStartFrame:6660,audio:false};
export const CUES=[
 ['效率收益可以转化为更多交付，',0,4700],['也可以转化为更短工时。',4700,8800],
 ['区别在于谁决定生产规模，',8800,12400],['谁分配节约的时间。',12400,16000],
 ['让劳动者参与确定任务边界，',16000,21300],['并获得实际可支配的时间，',21300,26000],
 ['技术进步才有机会转化为人的自由。',26000,31000],
 ['效率何时成为义务，',31000,35700],['取决于谁有权为工作画上句号。',35700,44000]
].map(([text,startMs,endMs])=>({text,startMs,endMs,timestampMs:null,confidence:null}));
export const BEATS=[['S06-01',0,2],['S06-02',2,4.7],['S06-03',4.7,6],['S06-04',6,16],['S06-05',16,20.5],['S06-06',20.5,25],['S06-07',25,31],['S06-08',31,35],['S06-09',35,38.5],['S06-10',38.5,44],['S06-11',44,51],['S06-12',51,58]].map(([id,start,end])=>({id,start,end}));
export const clamp=x=>Math.max(0,Math.min(1,x));
const ease=x=>{x=clamp(x);return x*x*(3-2*x)},mix=(a,b,u)=>a+(b-a)*u,fmt=x=>+x.toFixed(3),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const C={ink:'#263342',paper:'#F6F1E7',blue:'#798DA8',teal:'#6DBCCB',green:'#84B79A',amber:'#E9B468',orange:'#CC806F',gray:'#687783',line:'#B9C1C7'};
export const text=(x,y,s,size=28,color=C.ink,anchor='middle')=>`<text x="${fmt(x)}" y="${fmt(y)}" text-anchor="${anchor}" font-family="PingFang SC,Noto Sans CJK SC,sans-serif" font-weight="500" font-size="${size}" fill="${color}">${esc(s)}</text>`;
const box=(x,y,w,h,fill=C.paper,r=12,stroke='none')=>`<rect x="${fmt(x)}" y="${fmt(y)}" width="${fmt(Math.max(0,w))}" height="${fmt(h)}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
const art=(id,x,y,w,h)=>`<use href="#asset-${id}" x="${fmt(x)}" y="${fmt(y)}" width="${fmt(w)}" height="${fmt(h)}"/>`;
const group=(s,attrs='')=>`<g ${attrs}>${s}</g>`;
const avatar=(who,x,y,focus=false,w=135.2)=>art('avatar-'+who+'-'+(focus?'focus':'neutral'),x-w/2,y-w/2,w,w);
const line=(x,y,x2,y2,color=C.blue,dash=false)=>`<path d="M${fmt(x)} ${fmt(y)}L${fmt(x2)} ${fmt(y2)}" fill="none" stroke="${color}" stroke-width="4"${dash?' stroke-dasharray="8 7"':''}/>`;
function doc(id,label,x,y,status='scheduled',scale=.65){
 return group(`${art('document-portrait',-66,-88,132,176)}${text(0,40,label,27)}${status==='accepted'?`<path d="M-16 60l11 10 23-25" stroke="${C.green}" stroke-width="6" fill="none"/>`:text(0,78,status==='review'?'待审核':status==='generated'?'已生成':status==='candidate'?'候选':'已排期',19,C.gray)}`,`data-task="${id}" data-state="${status}" transform="translate(${fmt(x)} ${fmt(y)}) scale(${scale})"`);
}
function click(x,y,t,at){
 if(t<at-.65||t>at+.4)return '';
 const u=ease((t-at+.65)/.65),px=mix(x+90,x,u),py=mix(y+65,y,u);
 return art('cursor',px,py,30,40)+(t>=at?`<circle cx="${x+3}" cy="${y+3}" r="${fmt(10+(t-at)*65)}" stroke="${C.amber}" stroke-width="4" fill="none" opacity="${fmt(1-(t-at)/.4)}"/>`:'');
}
function pose(q){
 const c=CALIBRATION[q.id]||{},a=q.id.startsWith('agent'),scale=q.scaleOverride??c.scale??(a?.47:.53),bottom=c.bottom??(a?1515:1462),center=c.center??512;
 return group(art(q.id,-center*scale,-bottom*scale,1024*scale,1536*scale),`data-pose="${q.id}" transform="translate(${fmt(q.x)} ${fmt(q.baseline)})"`);
}
function humanPose(t){
 if(t>=38.5){const p=walking(clamp((t-38.5)/2.8));return {...p,x:mix(263.5,-100,ease((t-38.5)/2.8)),baseline:982.8,scaleOverride:(CALIBRATION[p.id]?.scale||.53)*.35};}
 if(t>=36.8){const p=programmerMotion('rise',(t-36.8)/1.7);return {...p,x:263.5,baseline:982.8,scaleOverride:p.scaleOverride*.35};}
 const review=t>=31.7&&t<34.6,choosing=[2,6,20.5].some(a=>Math.abs(t-a)<.65),rest=t>=10&&t<16||t>=35;
 return {id:'programmer-'+(review||choosing?'lean':rest?'rest':'input'),x:263.5,baseline:982.8,scaleOverride:.1505};
}
function vignette(t){
 const q=humanPose(t),screen=t>=35?'#3A4552':'#A9BCC6';
 let s=box(106,692,510,308,'#F6F1E7',24).replace('fill="#F6F1E7"','fill="#F6F1E7" fill-opacity=".5"');
 s+=group(art('workstation-painted',0,0,1920,1080),'transform="translate(50 630) scale(.35)"');
 s+=box(258.6,750.05,189,93.8,screen,2)+(t<38.5?pose(q):'');
 s+=group(art('chair-back-painted',483,663,265,296),'transform="translate(50 630) scale(.35)"');
 if(t>=38.5)s+=pose(q);
 s+=pose({id:'agent-idle',x:545,baseline:1000,scaleOverride:.16});
 if(t>=35)s+=`<circle cx="419" cy="763" r="7" fill="${C.teal}"/>`;
 return group(s,'data-layer="vignette" clip-path="url(#vignette-clip)"');
}
export function sample(t){
 if(!Number.isFinite(t)||t<0||t>58)throw Error('Expected chapter06 time0..58');
 const phase=t<16?'allocation':t<31?'decision':t<44?'ending':t<51?'references1':'references2';
 const choice=t<2?'common':t<4.7?'more':t<6?'reset':t<16?'time':'time';
 return {t,phase,choice,beat:(BEATS.find(b=>t>=b.start&&t<b.end)||BEATS.at(-1)).id,caption:CUES.find(c=>c.startMs<=t*1000&&t*1000<c.endMs)||null,
 saving:{id:'saving-06',owner:choice==='more'?'production':choice==='time'?'personal':'common',fraction:choice==='more'?ease((t-2)/1.2):choice==='reset'?1-ease((t-4.7)/1.2):choice==='time'?ease((t-6)/1.4):0},
 control:{workerParticipates:t>=20.5,scope:'conditional co-decision scenario'},
 tasks:{'D06-1':t<31?'illustrative':t<32?'generated':t<32.5?'review':'accepted','D06-2':t<31?'illustrative':t<33?'generated':t<33.7?'review':'accepted'},
 boundary:t>=35,personDeparted:t>=41.3,requiresImmediateResponse:false,machineCountsAsHumanLabor:false};
}
function lanes(s){
 const {t,choice,saving}=s,x=940,width=650,base=420,p=saving.fraction;
 let out=text(780,460,'人的操作',28,C.gray)+text(780,580,'机器执行',28,C.gray)+text(780,700,'个人时间',28,C.gray);
 out+=box(x,430,width,40,'#E3E7E7')+box(x,550,width,40,'#E3E7E7')+box(x,670,width,40,'#E3E7E7');
 out+=box(x,430,base,40,C.blue)+text(x+base/2,459,'原交付范围',25,C.paper);
 // Only one allocation resource exists. Its destination is a counterfactual, never cumulative.
 let yy=choice==='more'?mix(360,430,p):choice==='reset'?mix(430,360,1-p):choice==='time'?mix(360,670,p):360;
 const color=choice==='time'&&p>.99?C.green:C.amber;
 out+=group(box(x+base,yy,230,40,color)+text(x+base+115,yy+29,choice==='more'?'新增投入':choice==='time'&&p>.99?'可自主安排':'节约',25,C.ink),`data-saving-token="saving-06" data-owner="${saving.owner}"`);
 out+=box(x,550,650,40,C.teal)+text(1265,579,'后台执行',25,C.ink);
 const dot=x+(t*90)%640;out+=`<circle cx="${fmt(dot+5)}" cy="570" r="5" fill="${C.paper}"/>`;
 out+=text(1265,752,choice==='more'?'工作范围扩大':choice==='reset'?'回到同一起点':choice==='time'?'保持约定产出 · 需相应缩短工时安排':'同一交付范围 · 同一效率变化',25,C.gray);
 return out;
}
function allocation(s){
 const {t,choice}=s;let out=text(1225,215,'同一份节约，如何配置？',36);
 for(const [name,x,id]of [['更多交付',1010,'more'],['较短工时',1420,'time']])out+=box(x-150,255,300,54,choice===id?'#DCE9E3':'#FFFDF8',12,C.line)+text(x,292,name,29);
 out+=lanes(s);
 out+=click(1030,278,t,2)+click(1440,278,t,6);
 if(t>=2&&t<6){const w=t<4.7?ease((t-2)/1.2):1-ease((t-4.7)/1.2);out+=group(doc('H06-extra','新增',mix(1570,1620,w),mix(340,430,w),'scheduled',.55),`opacity="${t<4.7?1:w}"`);}
 const go=ease((t-2)/1.2),back=ease((t-3.2)/.8),active=t>=2&&t<4;
 const ag=active?{x:mix(mix(1740,1710,go),1740,back),y:mix(mix(350,300,go),350,back)}:{x:1740,y:350};
 out+=avatar('agent',ag.x,ag.y,t>=2&&t<3.3)+avatar('programmer',1740,690,[2,6].some(a=>Math.abs(t-a)<.6));
 out+=text(1220,825,choice==='more'?'方案A':choice==='time'?'方案B':choice==='reset'?'重置':'排期与收益配置',27,C.gray);
 out+=text(1220,875,'方案先后演示，不相加 · 非实测 · [06-1]',23,C.gray);
 return out;
}
function decision(s){
 const {t}=s,u=ease((t-16)/2),shared=t>=20.5;
 let out=text(1225,215,'谁能参与决定？',36);
 const nodeY=mix(290,390,u);
 out+=box(1010,nodeY-45,500,90,shared?'#DBE9DF':'#FFFDF8',16,C.line)+text(1260,nodeY+10,'排期规则 · 收益配置',31);
 out+=avatar('programmer',mix(1740,820,ease((t-16)/1)),mix(690,390,ease((t-17)/1)),t<21.2);
 out+=avatar('agent',1740,350,false);
 out+=line(920,390,1010,nodeY,shared?C.green:C.line,!shared);
 out+=text(845,497,shared?'劳动者参与':'参与决定',29,C.ink);
 out+=text(1260,nodeY-60,shared?'共同确定任务边界':'决定节点',25,C.gray);
 out+=click(1130,390,t,20.5);
 if(shared){out+=line(1260,435,1260,540,C.green)+`<path d="M1248 526l12 14 12-14" fill="none" stroke="${C.green}" stroke-width="4"/>`;}
 out+=box(940,560,700,65,'#E2E7E3')+box(940,560,shared?700*ease((t-20.5)/1.3):0,65,C.green)+text(1260,604,shared?'可实际支配的连续时间':'需落实为实际时间安排',31);
 for(const [i,label]of ['休息','学习','生活'].entries()){const a=shared?ease((t-21.5-i*.7)/.5):0;out+=group(text(1020+i*240,689,label,30),`opacity="${a}"`);}
 if(t>=25){out+=text(1230,778,'"工作日的缩短是根本条件"',35)+text(1230,822,'《资本论》第三卷 · 第48章第Ⅲ节 · [06-2]',23,C.gray)+text(1230,871,'共同控制与人的发展；短工时不是消除全部异化的充分条件',22,C.gray);}
 else out+=text(1230,871,'条件性方案 · 工具操作权与劳动决策权有别',23,C.gray);
 return out;
}
function ending(s){
 const {t}=s;let out=text(1210,215,'当效率成为义务',36);
 out+=text(800,458,'人的投入',29,C.gray)+text(800,598,'后台执行',29,C.gray)+text(800,738,'个人时间',29,C.gray);
 out+=box(940,425,760,43,'#E3E7E7')+box(940,425,310,43,C.blue);
 out+=box(940,565,760,43,C.teal)+text(1330,648,'无需即时响应',25,C.gray);
 const dot=960+((t-31)*110)%720;out+=`<circle cx="${fmt(dot)}" cy="586" r="6" fill="${C.paper}"/>`;
 out+=box(940,705,760,43,'#E3E7E7');
 if(s.boundary){out+=box(1250,705,450*ease((t-35)/1.2),43,C.green)+text(1470,789,'连续的个人时间',28,C.ink);
 const f=ease((t-35)/1);out+=`<path data-boundary="work-end" d="M1250 408V${fmt(408+370*f)}" stroke="${C.orange}" stroke-width="5"/>`+text(1250,856,'约定的工作边界',27,C.ink);}
 for(const [i,id]of ['D06-1','D06-2'].entries()){
  const x=1020+i*175;out+=doc(id,'本轮'+(i+1),x,340,s.tasks[id],.65);
  out+=click(x+40,370,t,i===0?32.5:33.7);
 }
 if(t<35){out+=avatar('programmer',1510,385,true)+avatar('agent',1740,585,false)+text(1510,477,'人工验收',25,C.gray);}
 else{out+=avatar('agent',1740,585,false);out+=click(1250,430,t,35);}
 out+=text(1240,907,'共同确定边界 · 验收后结束本轮投入',21,C.gray);
 return out;
}
function references(s){
 let out=box(160,110,1600,860,C.paper,28,C.line);
 if(s.phase==='references1'){
  out+=text(260,214,'参考文献  1 / 2',39,C.ink,'start');
  const rows=[['《资本论》第一卷','第1、4、5、8、10、13、17章 · C1—C7'],['《资本论》第三卷','第48章「三位一体的公式」第Ⅲ节 · C8'],['《1844年经济学哲学手稿》','第一手稿：异化劳动和私有财产 · P1'],['《政治经济学批判（1857—1858年手稿）》','机器体系与可自由支配时间相关段落 · G1']];
  rows.forEach(([a,b],i)=>{const y=330+i*145;out+=text(280,y,a,34,C.ink,'start')+text(280,y+49,b,27,C.gray,'start');});
  out+=text(280,916,'中文电子文本：马克思主义文库 · 完整定位见随附文献清单',25,C.gray,'start');
 }else{
  out+=text(260,214,'参考文献  2 / 2',39,C.ink,'start');
  out+=text(280,330,'UC Berkeley Haas · 研究者访谈',35,C.ink,'start')+text(280,382,'Laura Counts · 2026-02-18 · H1',28,C.gray,'start')+text(280,430,'AI promised to free up workers’ time.',27,C.ink,'start')+text(280,468,'UC Berkeley Haas researchers found the opposite.',27,C.ink,'start')+text(280,510,'单一公司研究的机构报道；不作为普遍因果结论',24,C.gray,'start');
  out+=text(280,575,'Anthropic · Building effective agents',35,C.ink,'start')+text(280,625,'2024-12-19 · T1 · 供应商技术说明',28,C.gray,'start');
  out+=line(280,692,1640,692,C.line)+text(280,755,'人物情境、时间轨与机制图均为示意。',28,C.ink,'start')+text(280,812,'完整来源、网址与方法限定见随附文献清单。',26,C.gray,'start')+text(280,900,'课程成员：待填写',29,C.gray,'start');
 }
 return out;
}
function caption(c){
 if(!c)return '';const w=[...c.text].length*44+68;
 return group(box(960-w/2,994,w,68,'#101923',12).replace('fill="#101923"','fill="#101923" fill-opacity=".78"')+text(960,1043,c.text,44,'#FFFDF8').replace('PingFang SC,Noto Sans CJK SC,sans-serif','Hiragino Sans GB, PingFang SC, sans-serif'),'data-layer="captions"');
}
export function draw(s){
 let out=art('stage-room',0,0,1920,1080);
 if(s.t<44){out+=box(640,150,1190,790,C.paper,32,C.line);out+=s.phase==='allocation'?allocation(s):s.phase==='decision'?decision(s):ending(s);out+=vignette(s.t)+caption(s.caption);}
 else out+=references(s);
 return out;
}
export const svg=(content,defs='')=>`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1920" height="1080" viewBox="0 0 1920 1080"><defs><clipPath id="vignette-clip"><rect x="50" y="680" width="566" height="320"/></clipPath>${defs}</defs>${content}</svg>`;
