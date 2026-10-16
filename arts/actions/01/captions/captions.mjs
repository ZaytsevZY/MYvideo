import {CAPTIONS} from './caption-data.mjs';
export {CAPTIONS};
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
export function activeCaption(t){
 const ms=Math.max(0,Math.min(Number(t)||0,44.999))*1000;
 return CAPTIONS.find(c=>c.startMs<=ms&&ms<c.endMs)||null;
}
export function drawCaptions(t){
 const c=activeCaption(t);if(!c)return '';
 const units=[...c.text].reduce((n,ch)=>n+(ch.charCodeAt(0)<128?.56:1),0);
 const w=Math.ceil(units*44+68),x=960-w/2;
 return `<g data-layer="captions" data-caption-start="${c.startMs}" aria-label="${escape(c.text)}"><rect x="${x}" y="994" width="${w}" height="68" rx="12" fill="#101923" fill-opacity=".78"/><text x="960" y="1028" text-anchor="middle" dominant-baseline="central" font-family="Hiragino Sans GB, PingFang SC, sans-serif" font-size="44" font-weight="500" fill="#FFFDF8">${escape(c.text)}</text></g>`;
}
