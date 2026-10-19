// Film caption policy. Source chapter cues/manuscripts stay byte-preserved.
export const CAPTION_STYLE=Object.freeze({family:'Hiragino Sans GB',fallback:'sans-serif',size:44,weight:500,color:'#FFFDF8',background:'#101923',backgroundOpacity:.78,y:994,height:68,radius:12,baseline:1028,minCharacters:10,maxWidth:1800});
// Source start times chosen by syntax: finish a list/clause, or retain a subject with its predicate.
export const MERGE_STARTS=Object.freeze({
 '01':[[0,2200],[8400,10200],[23000,25800],[30000,33600]],
 '02':[[2400,5200],[8000,10300],[13000,16400],[27000,30900]],
 '03':[[30500,34700]],'04':[[23500,27000]],'05':[[400,3000],[16300,19000]],'06':[[8800,12400],[31000,35700]]
});
export const characterCount=text=>[...text.replace(/\s/gu,'')].length;
export function normalizeCues(chapter,cues){
 const groups=MERGE_STARTS[chapter]||[],byStart=new Map(groups.map(g=>[g[0],g])),out=[];
 for(let i=0;i<cues.length;i++){
  const first=cues[i],starts=byStart.get(first.startMs),members=starts?cues.slice(i,i+starts.length):[first];
  if(starts&&members.some((c,j)=>c.startMs!==starts[j]||j&&c.startMs!==members[j-1].endMs))throw Error('Caption merge source drift: '+chapter+'/'+first.startMs);
  out.push({...first,text:members.map(c=>c.text).join(''),endMs:members.at(-1).endMs,mergedFrom:members.map(c=>({startMs:c.startMs,endMs:c.endMs,text:c.text,id:c.id??null}))});
  i+=members.length-1;
 }
 if(out.some(c=>characterCount(c.text)<CAPTION_STYLE.minCharacters))throw Error('Unmerged short subtitle in chapter '+chapter);
 if(out.map(c=>c.text).join('')!==cues.map(c=>c.text).join(''))throw Error('Caption text changed in '+chapter);
 return out;
}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
export function captionSvg(cue){
 if(!cue)return '';const s=CAPTION_STYLE,units=[...cue.text].reduce((n,ch)=>n+(/[\x00-\x7f]/.test(ch)?.56:1),0),w=Math.ceil(units*s.size+68);
 if(w>s.maxWidth)throw Error('Caption needs authored line wrap: '+cue.text);
 // Inline styles win over chapter-wide text selectors. Do not inherit font/weight from the scene.
 const style=`font-family:'${s.family}',${s.fallback};font-size:${s.size}px;font-weight:${s.weight};font-style:normal;font-variant:normal;letter-spacing:0px;word-spacing:0px;fill:${s.color};text-anchor:middle;dominant-baseline:central;text-decoration:none`;
 return `<g data-film-caption="${cue.startMs}" aria-label="${esc(cue.text)}"><rect x="${960-w/2}" y="${s.y}" width="${w}" height="${s.height}" rx="${s.radius}" fill="${s.background}" fill-opacity="${s.backgroundOpacity}"/><text x="960" y="${s.baseline}" style="${style}">${esc(cue.text)}</text></g>`;
}
