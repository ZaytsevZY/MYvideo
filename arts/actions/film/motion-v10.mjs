// Pure painted-cel supplements. All other actions, including entire chapter06,
// use the original pre-flow chapter renderers without any image replacement.
import DATA from './motion-v10.json' with {type:'json'};
export const MOTION=DATA;const groups=Object.fromEntries(DATA.groups.map(g=>[g.id,g]));
const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x);},loop=(t,period)=>.5-.5*Math.cos(Math.max(0,t)/period*2*Math.PI);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
export function motionAt(chapter,t){
 const out=[];const add=(id,phase,extra=[])=>{const g=groups[id];phase=clamp(phase);const frame=g.frames.reduce((best,f)=>Math.abs(f.at-phase)<Math.abs(best.at-phase)?f:best,g.frames[0]);out.push({id,phase,frame,aliases:[...new Set([...g.keys.map(k=>k.path),...extra])]});};
 if(chapter==='02'){
  const rear=['arts/characters/poses/01/programmer-input-v01.png','arts/characters/poses/01/programmer-release-half-v01.png','arts/characters/poses/02/programmer-review-current-v01.png','arts/characters/poses/02/programmer-review-next-v01.png'];
  if(t>=5&&t<13)add('lift-review',1);
  if(t>=13&&t<32){const cycle=(t-13)%4.8;add('meal',loop(t-13,4.8));if(cycle>=3)add('lift-review',ease((cycle-3)/.65),rear);if(t>=23.9)add('choose',ease((t-23.9)/1.95));}
 }
 if(chapter==='04'){
  if(t>=35.8&&t<36.93)add('manager-reach',ease((t-35.8)/1));
  if(t>=37.65&&t<38.6)add('manager-reach',1-ease((t-37.65)/.85));
 }
 return out;
}
export function applyMotion(svg,chapter,t,resolve){
 const replacements=new Map();for(const clip of motionAt(chapter,t))for(const p of clip.aliases){const original=resolve(p);if(original)replacements.set(esc(original),{clip,uri:esc(resolve(clip.frame.path))});}
 return svg.replace(/<image\b[^>]*\bhref="([^"]+)"[^>]*\/>/g,(tag,href)=>{const r=replacements.get(href);return r?tag.replace('href="'+href+'"','href="'+r.uri+'" data-motion-family="'+r.clip.id+'" data-motion-phase="'+r.clip.frame.at+'"'):tag;});
}
