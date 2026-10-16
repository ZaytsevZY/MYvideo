import {ENTRY} from './entry-v03.mjs';
import {CUES,INHERITED,smooth,clamp,svg} from './scene.mjs';
export {CUES,INHERITED,smooth,clamp,svg};
const fmt=n=>+n.toFixed(4),mix=(a,b,u)=>a+(b-a)*u;
export const ink='#263342',paper='#F6F1E7',blue='#7186A6',orange='#DA7852',gray='#687783';
export const txt=(x,y,s,size=28,color=ink,anchor='middle')=>`<text x="${fmt(x)}" y="${fmt(y)}" text-anchor="${anchor}" font-family="PingFang SC,Noto Sans CJK SC,sans-serif" font-weight="500" font-size="${size}" fill="${color}">${s}</text>`;
export const art=(id,x,y,w,h)=>`<use href="#asset-${id}" x="${fmt(x)}" y="${fmt(y)}" width="${fmt(w)}" height="${fmt(h)}"/>`;
export const box=(x,y,w,h,fill=paper,stroke='none',r=18)=>`<rect x="${fmt(x)}" y="${fmt(y)}" width="${fmt(Math.max(0,w))}" height="${fmt(h)}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`;
export const alpha=(v,s)=>v<=0?'':`<g opacity="${fmt(clamp(v))}">${s}</g>`;
export function caption(c){if(!c)return '';const w=[...c.text].length*44+68;return `<g data-layer="captions">${box(960-w/2,994,w,68,'#101923','none',12).replace('fill="#101923"','fill="#101923" fill-opacity=".78"')}${txt(960,1043,c.text,44,'#FFFDF8').replace('PingFang SC,Noto Sans CJK SC,sans-serif','Hiragino Sans GB, PingFang SC, sans-serif')}</g>`;}
export function doc(id,name,x,y,scale=.8,status='candidate',font=36){
 return `<g data-task="${id}" data-state="${status}" transform="translate(${fmt(x)} ${fmt(y)}) scale(${fmt(scale)})">${art('document-portrait',0,0,176,180)}${txt(88,150,name,font)}${status==='scheduled'?'<circle cx="144" cy="32" r="5" fill="#7186A6"/><circle cx="141" cy="144" r="5" fill="#7186A6"/>':'<path d="M35 170H141" stroke="#8A929B" stroke-width="2" stroke-dasharray="5 5"/>'}</g>`;
}
export function avatar(role,x,y,focus=false,w=135.2){return art('avatar-'+role+'-'+(focus?'focus':'neutral'),x-w/2,y-w/2,w,w);}
const keys=['T00','T01','test','interface','feature','docs','perf','compat','migrate'];
export function inheritedRail(t,exit=0){
 const u=smooth((t-.4)/2);let s='';
 keys.forEach((k,i)=>{const x=mix(64+152*i,80+139*i,u),y=mix(128,54,u)-exit*185,scale=mix(.8,108/176,u);s+=`<g transform="translate(${fmt(x)} ${fmt(y)}) scale(${fmt(scale)}) translate(${-640-190*i} -160)">${ENTRY.cards[k]}</g>`;});return s;
}
function backdrop(t){
 const u=smooth((t-.4)/2),old=[0,76.8,28.8,30.4,168,40,1608,32,1744,38.4,1744,136,1734.4,312,1716.8,384,1576,384,176,393.6,9.6,384,1.6,288],dst=[640,240,640,190,690,190,1770,190,1820,190,1820,240,1820,870,1820,920,1770,920,690,920,640,920,640,870],p=old.map((v,i)=>fmt(mix(v,dst[i],u)));
 return `<path d="M${p[0]} ${p[1]}Q${p.slice(2,6).join(' ')}L${p.slice(6,8).join(' ')}Q${p.slice(8,12).join(' ')}L${p.slice(12,14).join(' ')}Q${p.slice(14,18).join(' ')}L${p.slice(18,20).join(' ')}Q${p.slice(20,24).join(' ')}Z" fill="${paper}" fill-opacity=".95"/>`;
}
export function sampleOpening(t){
 const starts=[5.5,7,8.5],initial=[1260,1500,1390],dx=[270,330,270],ys=[520,390,680];
 return {t,candidates:initial.map((x,i)=>({id:['feedback','N02-A','N02-B'][i],name:['反馈','候选A','候选B'][i],x:x-dx[i]*smooth((t-starts[i])/1.2),y:ys[i]}))};
}
export function plot(state,{mini=0}={}){
 const t=state.t,s=mix(1,.5,mini),tx=-265*mini,ty=135*mini;let c='';
 const labelSize=26/s;
 c+=`<path d="M720 800L1530 314V290H720Z" fill="#6DBCCB" fill-opacity=".14"/><path d="M720 800V290M720 800H1530" stroke="${ink}" stroke-width="3" fill="none"/><path d="M720 800L1530 314" stroke="${blue}" stroke-width="3" stroke-dasharray="9 9"/>`;
 if(mini<.8)c+=txt(740,267,'预期收益 ↑',26,gray,'start')+txt(1490,846,'开发投入 →',26,gray)+txt(860,350,'可行区',30,'#397D87');
 for(const [i,a]of state.candidates.entries()){
  const size=.6,x=a.x-52.8,y=a.y-54;
  c+=doc(a.id,mini>.8?['反馈','A','B'][i]:a.name,x,y,size,'candidate',mini>.8?36/s:36);
  if(t>=5.5&&mini===0){const old=[1260,1500,1390][i];if(a.x<old)c+=`<path d="M${a.x+64} ${a.y+15}H${old}" stroke="#CC806F" stroke-width="3" stroke-dasharray="5 6"/>`;}
  if(t>=9.8&&mini<.2)c+=box(a.x-91,a.y+73,182,34)+txt(a.x,a.y+99,i<2?'可行 · 未排期':'仍搁置',24,i<2?'#397D87':gray);
 }
 return `<g data-layer="cost-plot" transform="translate(${fmt(tx)} ${fmt(ty)}) scale(${fmt(s)})">${c}</g>`;
}
export function drawOpening(t,{captions=true}={}){
 const state=sampleOpening(t),u=smooth((t-.4)/2);let s=art(t>=4.6&&t<5.8?'stage-lean':'stage',0,0,1920,1080);
 if(t<=.4){s+=ENTRY.graphic;}
 else{
  s+=backdrop(t)+inheritedRail(t);
  s+=alpha(1-smooth((t-.4)/.8),`<g transform="scale(.8) translate(-560 0)"><path d="M640 250H2560" stroke="${blue}" stroke-width="3" opacity=".6"/>${ENTRY.flags.join('')}</g>`);
  if(t<2.4){const a=state.candidates[0],x=mix(1432,a.x-52.8,u),y=mix(128,a.y-54,u),scale=mix(.8,.6,u);s+=`<g transform="translate(${fmt(x)} ${fmt(y)}) scale(${fmt(scale)}) translate(-2350 -160)">${ENTRY.cards.feedback}</g>`;}
  else s+=plot(state);
  const scale=mix(.8,1,u),x=mix(1312.592,1710,u),y=mix(336.728,350,u);
  s+=`<g transform="translate(${fmt(x)} ${fmt(y)}) scale(${fmt(scale)}) translate(-2200.74 -420.91)">${ENTRY.avatar}</g>`;
  if(t>=2.4)s+=avatar('programmer',1710,650,t>=4.5&&t<5.5)+box(1620,720,180,52,t>=5.2?'#D2E7E9':'#FFFDF8',blue,12)+txt(1710,755,'使用 Agent',26)+txt(1410,899,'成本收益示意，非实测 · [02-1]',22,gray);
  if(t>=4.3&&t<5.65){const p=smooth((t-4.3)/.9);s+=art('cursor',mix(1785,1745,p),mix(815,748,p),30,42);}
  if(t>=5.2&&t<9.8)s+=`<g transform="translate(1780 280) rotate(${fmt(t*130)})"><path d="M0 -15L4 -4 15 0 4 4 0 15 -4 4 -15 0 -4 -4Z" fill="#E9B468" stroke="${ink}"/></g>`;
 }
 if(captions)s+=caption(CUES.find(c=>c.startMs<=t*1000&&t*1000<c.endMs));return s;
}
