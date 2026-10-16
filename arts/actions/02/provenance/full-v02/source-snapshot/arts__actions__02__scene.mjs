// S02 opening candidate. Deterministic chapter-local time; no random/timers.
export const CONFIG={id:'02-opening-v02',duration:13,fps:30,width:1920,height:1080,frames:390,globalStartFrame:1350,audio:false};
export const BEATS=[{id:'S02-01',start:0,end:2.4},{id:'S02-02',start:2.4,end:5.2},{id:'S02-03',start:5.2,end:9.8},{id:'S02-04',start:9.8,end:13}];
export const CUES=[
 {text:'工作量不是固定的存量。',startMs:0,endMs:2400,timestampMs:null,confidence:null},
 {text:'开发成本下降，',startMs:2400,endMs:5200,timestampMs:null,confidence:null},
 {text:'会改变项目的成本收益边界，',startMs:5200,endMs:8000,timestampMs:null,confidence:null},
 {text:'使一部分原先不值得开展的需求',startMs:8000,endMs:10300,timestampMs:null,confidence:null},
 {text:'变得可行。',startMs:10300,endMs:13000,timestampMs:null,confidence:null}
];
export const INHERITED={T00:'accepted',T01:'accepted','T01-R':'merged',test:'scheduled',interface:'scheduled',feature:'scheduled',docs:'scheduled',perf:'scheduled',compat:'scheduled',migrate:'scheduled',feedback:'candidate'};
const names=['旧任务','T01','测试','界面','需求','补测','调整','新需','迁移'];
export const candidates=[{id:'feedback',name:'反馈',x:1260,y:520,dx:270,start:5.5},{id:'N02-A',name:'候选A',x:1500,y:390,dx:330,start:7},{id:'N02-B',name:'候选B',x:1390,y:680,dx:270,start:8.5}];
export const clamp=v=>Math.max(0,Math.min(1,v));
export const smooth=v=>{v=clamp(v);return v*v*(3-2*v);};
const mix=(a,b,u)=>a+(b-a)*u,fmt=n=>+n.toFixed(3);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const text=(x,y,s,size=28,fill='#263342',anchor='middle')=>`<text x="${fmt(x)}" y="${fmt(y)}" font-family="Hiragino Sans GB, PingFang SC, sans-serif" font-size="${size}" font-weight="500" fill="${fill}" text-anchor="${anchor}">${esc(s)}</text>`;
const art=(id,x,y,w,h)=>`<use href="#asset-${id}" x="${fmt(x)}" y="${fmt(y)}" width="${fmt(w)}" height="${fmt(h)}"/>`;
const opacity=(v,s)=>`<g opacity="${fmt(clamp(v))}">${s}</g>`;
const arrow=(x,y)=>`<path d="M${x} ${y}l12 -7v14Z" fill="#7186A6"/>`;
export function sample(t){
 if(!Number.isFinite(t)||t<0||t>13)throw Error('Expected time 0..13');
 const u=smooth(t/2.4);
 return {t,beat:(BEATS.find(b=>t>=b.start&&t<b.end)||BEATS.at(-1)).id,u,
  tasks:{...INHERITED,'N02-A':t>=2.4?'candidate':null,'N02-B':t>=2.4?'candidate':null},
  candidates:candidates.map(c=>{const p=smooth((t-c.start)/1.2),x=c.x-c.dx*p;return {...c,p,x,feasible:c.y<=800-.6*(x-720),status:'candidate'};}),
  caption:CUES.find(c=>c.startMs<=t*1000&&t*1000<c.endMs)||null};
}
function doc(id,name,x,y,w,h,kind){
 return `<g data-task="${id}" data-state="${kind}">${art('document-portrait',x,y,w,h)}${text(x+w/2,y+h*.72,name,w>.1?Math.min(30,w*.24):24)}${kind==='accepted'?`<circle cx="${fmt(x+w*.83)}" cy="${fmt(y+h*.12)}" r="11" fill="#72A589"/><path d="M${fmt(x+w*.79)} ${fmt(y+h*.12)}l4 4 7 -8" fill="none" stroke="white" stroke-width="2"/>`:kind==='scheduled'?`<circle cx="${fmt(x+w*.84)}" cy="${fmt(y+h*.18)}" r="4" fill="#7186A6"/>`:''}</g>`;
}
function avatar(role,x,y,focus=false){return art('avatar-'+role+'-'+(focus?'focus':'neutral'),x-70,y-70,140,140);}
function caption(c){if(!c)return '';const w=[...c.text].length*44+68;return `<g data-layer="captions"><rect x="${960-w/2}" y="994" width="${w}" height="68" rx="12" fill="#101923" fill-opacity=".78"/>${text(960,1043,c.text,44,'#FFFDF8')}</g>`;}
export function draw(state){
 const {t,u}=state,fade=smooth((t-1.4)/1),px=mix(0,640,u),py=mix(38,190,u),pw=mix(1740,1180,u),ph=mix(354,730,u);
 let s='<use href="#asset-stage" x="0" y="0" width="1920" height="1080"/>';
 s+=`<rect x="${fmt(px)}" y="${fmt(py)}" width="${fmt(pw)}" height="${fmt(ph)}" rx="${fmt(mix(100,35,u))}" fill="#F6F1E7" fill-opacity=".97" stroke="#B9C1C7" stroke-width="1"/>`;
 // Retain accepted/scheduled identities on their own rail, never reclassify as candidates.
 names.forEach((name,i)=>{const id=Object.keys(INHERITED).filter(k=>k!=='T01-R'&&k!=='feedback')[i];s+=doc(id,name,mix(64+152*i,80+139*i,u),mix(128,54,u),mix(140.8,108,u),mix(144,110,u),INHERITED[id]);});
 s+=opacity(u,text(1460,111,'既有任务',26,'#687783')+text(1460,149,'状态保持',22,'#687783'));
 // Old endpoint retires; it does not turn into a cost-benefit boundary.
 s+=opacity(1-smooth(t/.8),'<path d="M1600 346V262l34 12 -34 12" stroke="#263342" stroke-width="4" fill="#CC806F"/>');
 const graph=`<path d="M720 800L1530 314L1530 290L720 290Z" fill="#6DBCCB" fill-opacity=".14"/>
  <path d="M720 800V290M720 800H1530" stroke="#263342" stroke-width="3" fill="none"/>
  <path d="M720 800L1530 314" stroke="#7186A6" stroke-width="3" stroke-dasharray="9 9" fill="none"/>
  ${text(740,267,'预期收益 ↑',26,'#687783','start')}${text(1490,846,'开发投入 →',26,'#687783')}
  ${text(860,350,'可行区',30,'#397D87')}${text(1450,899,'成本收益示意，非实测 · [02-1]',22,'#687783')}`;
 s+=opacity(fade,graph);
 const a=state.candidates[0],fx=mix(1432,a.x-48,u),fy=mix(128,a.y-62,u),fw=mix(140.8,96,u),fh=mix(144,128,u);
 s+=doc('feedback','反馈',fx,fy,fw,fh,'candidate');
 for(const c of state.candidates.slice(1)){
  const v=smooth((t-2.4-(c.id==='N02-A'?0:.45))/.8);
  s+=opacity(v,doc(c.id,c.name,c.x-48+100*(1-v),c.y-62,96,128,'candidate'));
 }
 for(const c of state.candidates){
  if(c.p>0)s+=`<path d="M${c.x+58} ${c.y+16}H${c.id==='feedback'?1260: c.id==='N02-A'?1500:1390}" stroke="#CC806F" stroke-width="3" stroke-dasharray="5 6" opacity=".7"/>`;
  if(t>=c.start&&t<c.start+1.2)s+=arrow(fmt(c.x+65),fmt(c.y+16));
  if(t>=9.8)s+=opacity(smooth((t-9.8)/.5),`<rect x="${fmt(c.x-91)}" y="${fmt(c.y+73)}" width="182" height="34" rx="9" fill="#F6F1E7"/>`+text(c.x,c.y+99,c.feasible?'可行 · 未排期':'仍搁置',24,c.feasible?'#397D87':'#687783'));
 }
 // Human decides to use the tool; Agent shifts estimated input, not acceptance.
 s+=avatar('agent',mix(1313,1710,u),mix(330,350,u),t>=5.2&&t<9.8);
 s+=opacity(fade,avatar('programmer',1710,650,t>=4.5&&t<5.5));
 s+=opacity(fade,`<rect x="1620" y="720" width="180" height="52" rx="12" fill="${t>=5.2?'#D2E7E9':'#FFFDF8'}" stroke="#7186A6" stroke-width="2"/>${text(1710,755,'使用 Agent',26)}`);
 if(t>=4.3&&t<5.65){const q=smooth((t-4.3)/.9),x=mix(1785,1745,q),y=mix(815,748,q);s+=art('cursor',x,y,30,42);if(t>=5.2)s+=`<circle cx="1748" cy="751" r="${fmt(12+30*(t-5.2)/.45)}" fill="none" stroke="#E9B468" stroke-width="4" opacity="${fmt(1-(t-5.2)/.45)}"/>`;}
 if(t>=5.2&&t<9.8){s+=`<g transform="translate(1780 285) rotate(${fmt((t-5.2)*130)})"><path d="M0 -15L4 -4 15 0 4 4 0 15 -4 4 -15 0 -4 -4Z" fill="#E9B468" stroke="#263342"/></g>`;}
 // Inset follows a complete existing human pose, never limb assembly.
 s+=caption(state.caption);
 return s;
}
export function svg(content,defs=''){return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1920" height="1080" viewBox="0 0 1920 1080"><defs>${defs}</defs>${content}</svg>`;}
