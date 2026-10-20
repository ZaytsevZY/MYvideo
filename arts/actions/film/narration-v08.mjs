// Reviewed narration and semantic time mapping. The six chapter budgets remain fixed.
import DATA from './narration-v08.json' with {type:'json'};
export const NARRATION=DATA;
export const AUTHORED_CUES=Object.fromEntries(Object.entries(DATA.cues).map(([id,cues])=>[id,cues.map(c=>({...c,mergedFrom:[{...c}]}))]));
export const CLOCKS={
 '01':[[0,0],[16,16],[24,23],[31.6,30],[37.4,37],[45,45]],
 '02':[[0,0],[5.1,5],[14.2,13],[21.3,23],[27.2,27],[32.5,32],[38,38]],
 '03':[[0,0],[9.6,9.1],[14,13.5],[21,23],[23,25.7],[26.2,30.5],[39,39]],
 '04':[[0,0],[.4,.4],[14,12.3],[21.5,20],[26.8,24.6],[31.8,29.6],[36,32.6],[44.6,50.6],[55,55]],
 '05':[[0,0],[.4,.4],[7,6],[12.8,17.3],[16,21.8],[19,25.6],[21.7,29.4],[26.8,33.8],[39.5,37.4],[42,40.6],[44.5,43.8],[45,45]],
 '06':[[0,0],[58,58]]
};
function interpolate(points,t){
 const i=points.findIndex(p=>p[0]>t);if(i===0)return points[0][1];if(i<0)return points.at(-1)[1];
 const a=points[i-1],b=points[i];return a[1]+(b[1]-a[1])*(t-a[0])/(b[0]-a[0]);
}
export const sourceTime=(id,t)=>interpolate(CLOCKS[id],t);
export const filmTime=(id,t)=>interpolate(CLOCKS[id].map(([a,b])=>[b,a]),t);
export function retimeBeats(id,beats){return beats.map(b=>({...b,sourceStart:b.start,sourceEnd:b.end,start:Math.ceil(filmTime(id,b.start)*30-1e-6)/30,end:Math.ceil(filmTime(id,b.end)*30-1e-6)/30}));}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
// Only editable screen text changes here; complete raster characters retain their perspective.
export function alignScreenCopy(id,svg,t){
 if(id==='01'){
  svg=svg.replace(/>整理结果</g,'>整理文档<');
  if(t>=16&&t<24)svg=svg.replace(/>派发</g,'>发送<').replace(/>审核</g,'>接受<');
 }
 if(id==='02')svg=svg.replace(/>未必下降</g,'>继续投入<');
 if(id==='05')svg=svg.replace(/>工具调用</g,'>指挥“虚拟员工”<').replace(/>组织管理</g,'>目标与收益决定权<');
 return svg;
}
// The expenditure lives beside the worker's active desktop, rather than becoming another full slide.
export function costFeedback(id,t,documentUri){
 if(id!=='05'||t<16||t>=26.8)return '';
 const opacity=Math.min(1,(t-16)/.4,(26.8-t)/.4),money=t>=18.5;
 const text=(x,y,s,size=30)=>`<text x="${x}" y="${y}" style="font-family:'Hiragino Sans GB',sans-serif;font-size:${size}px;fill:#405c69;font-weight:500">${esc(s)}</text>`;
 let body=`<rect x="1280" y="74" width="530" height="220" rx="18" fill="#f8f4ec" fill-opacity=".96" stroke="#c8bda9" stroke-width="2"/>`+text(1310,121,'维持生产力优势',32);
 // A quiet time receipt becomes a call-renewal receipt when money is mentioned.
 body+=text(1310,181,'时间')+text(1420,181,'等待 · 检查 · 继续输入',26);
 if(money){
  const v=Math.min(1,(t-18.5)/.35);
  body+=`<g opacity="${v.toFixed(3)}"><image href="${esc(documentUri)}" x="1728" y="195" width="45" height="61" preserveAspectRatio="xMidYMid meet"/>`+text(1310,251,'金钱')+text(1420,251,'追加调用 / 续费',26)+`</g>`;
 }
 return `<g data-narration-cost="time-and-money" opacity="${opacity.toFixed(3)}">${body}</g>`;
}
