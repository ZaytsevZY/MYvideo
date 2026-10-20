// Deterministic complete-cel animation. Source time is the existing chapter clock;
// narration and camera budgets are unchanged. No opacity animation between bodies.
import DATA from './motion-v09.json' with {type:'json'};
export const MOTION=DATA;
const groups=Object.fromEntries(DATA.groups.map(g=>[g.id,g]));
const clamp=x=>Math.max(0,Math.min(1,x));
const ease=x=>{x=clamp(x);return x*x*(3-2*x);};
const loop=(t,period)=>.5-.5*Math.cos(Math.max(0,t)/period*2*Math.PI);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
export function motionAt(chapter,t){
 const out=[];
 function add(id,phase,extra=[]){const g=groups[id];if(!g)return;phase=clamp(phase);const frame=g.frames.reduce((best,f)=>Math.abs(f.at-phase)<Math.abs(best.at-phase)?f:best,g.frames[0]);out.push({id,phase,frame,aliases:[...new Set([...g.keys.map(k=>k.path),...extra])]});}
 function run(id,a,b,extra=[]){add(id,ease((t-a)/(b-a)),extra);}
 const p='arts/characters/poses/01/';
 const rear=[p+'programmer-input-v01.png',p+'programmer-release-half-v01.png','arts/characters/poses/02/programmer-review-current-v01.png','arts/characters/poses/02/programmer-review-next-v01.png'];
 if(chapter==='01'){
  if(t>=1.45&&t<2.45)add('front-fatigue',loop(t-1.45,1));
  if(t>=2.8&&t<5)run('front-intent',2.8,4.05);
  if(t>=5&&t<8)run('agent-receive',5,7.6);
  if(t>=8&&t<8.8)run('release',8,8.8);
  if(t>=8&&t<12)add('agent-inspect',loop(t-8,3));
  if(t>=14.4&&t<16)run('agent-receive',14.4,16);
  if(t>=18&&t<21.4)run('release',18,18.8);
  if(t>=21.4&&t<21.8)add('release',1-ease((t-21.4)/.4));
  if(t>=21.8&&t<23)add('lean',loop(t-21.8,1.2),[p+'programmer-release-half-v01.png']);
  for(const at of [24.2,25.8,27.4,31.6,33.6,34.2,35,37,38.6,42.6])if(t>=at-.35&&t<at+1)add('lean',loop(t-at+.35,1.35),[p+'programmer-release-half-v01.png']);
  for(const [a,b]of [[16.8,19.4],[23.9,29.6],[33.8,40.6]]){
   if(t>=a&&t<a+.5)run('idle-inspect',a,a+.5);
   else if(t>=a+.5&&t<b)add('agent-report',loop(t-a-.5,2.3));
   else if(t>=b&&t<b+.55)add('report-idle',ease((t-b)/.55),[p+'agent-inspect-file-v01.png']);
  }
 }
 if(chapter==='02'){
  if(t>=.3&&t<1.8)add('release',1-ease((t-.3)/1.5));
  if(t>=1.8&&t<5)add('typing-rear',loop(t-1.8,2.2),rear);
  if(t>=5&&t<13)add('lift-review',1);
  if(t>=13&&t<32){const cycle=(t-13)%4.8;
   add('meal',loop(t-13,4.8));add('agent-cycle',cycle/4.8);
   if(cycle<3)add('typing-rear',loop(cycle,2.4),rear);else add('lift-review',ease((cycle-3)/.65),rear);
   if(t>=23.9)run('choose',23.9,25.85);
  }
  if(t>=32&&t<=38)add('review-next',loop(t-32,3.8));
 }
 if(chapter==='03'){
  if(t>=9.1&&t<30.5)add('typing-front',loop(t-9.1,1.8));
  if(t>=10.05&&t<11.1)run('front-read',10.05,10.65,['arts/backgrounds/03/programmer-front-desk-b-v05.png']);
  if(t>=11.1&&t<11.55)add('front-read',1-ease((t-11.1)/.45),['arts/backgrounds/03/programmer-front-desk-b-v05.png']);
  if(t>=13.5&&t<19.2)run('front-read',13.5,14.05,['arts/backgrounds/03/programmer-front-desk-b-v05.png']);
  if(t>=19.05&&t<20)run('look-aside',19.05,19.9);
  if(t>=20&&t<23)add('neighbor-work',loop(t-20,2.6));
  if(t>=23&&t<23.8)add('look-aside',1-ease((t-23)/.65));
  if(t>=23.8&&t<24.6)add('front-read',1);
 }
 if(chapter==='04'){
  if(t>=.4&&t<12.3)run('lunch-agent',.85,3.55);
  if(t>=4.3&&t<6.5)add('premeeting',loop(t-4.3,2.2));
  if(t>=6.9&&t<12.3)run('evening-reopen',6.9,9.65);
  if(t>=15.15&&t<20)run('collab-relief',15.15,16.1);
  if(t>=16.1&&t<20)run('appraisal-reaction',16.1,17.1);
  if(t>=35.8&&t<37.65)run('manager-reach',35.8,36.8);
  if(t>=37.65&&t<38.6)add('manager-reach',1-ease((t-37.65)/.85));
  if(t>=39.05&&t<41.2)run('manager-write',39.05,39.85);
  if(t>=41.2&&t<42.2)add('manager-write',1-ease((t-41.2)/.8));
  if(t>=48.1&&t<=55)run('hr-review',48.1,49.1);
 }
 if(chapter==='05'){
  if(t>=21.8&&t<25.6)run('handover',21.8,23.8);
  if(t>=25.6&&t<29.4)run('agent-wait',25.6,26.45);
  if(t>=31.6&&t<33.8)run('resume',32.3,33.25);
 }
 if(chapter==='06'){
  if(t>=2.9&&t<16){run('extra-work',2.9,3.65);out.at(-1).aliases=[groups['extra-work'].keys.at(-1).path];}
  if(t>=5.2&&t<6.3)run('rise-with-bag',5.2,6.3);
  if(t>=6.3&&t<16)run('depart',6.3,8.3);
  if(t>=18.3&&t<21.2)run('meeting-turn',18.3,19.25);
  if(t>=20.8&&t<23)run('meeting-record',20.8,21.7);
  if(t>=22.7&&t<23.4)run('meeting-check',22.7,23.38);
  if(t>=27.8&&t<29)run('accept-result',27.8,28.7);
  if(t>=29&&t<29.95)run('rise-with-bag',29,29.95);
  if(t>=29.95&&t<31)run('depart',29.95,30.95);
  if(t>=31&&t<33.4)run('book-reach',31.25,32.9);
  if(t>=33.4&&t<35.7)run('book-bag',33.4,34.8);
  if(t>=37.95&&t<40.3)run('theatre-settle',37.95,38.95);
  if(t>=42.8&&t<44)run('page-turn',42.8,43.8);
 }
 return out;
}
export function applyMotion(svg,chapter,t,resolve){
 const active=motionAt(chapter,t),replacement=new Map();
 // Later actions replace earlier ones only on the same source illustration.
 for(const clip of active)for(const p of clip.aliases){const original=resolve(p);if(original)replacement.set(esc(original),{href:esc(resolve(clip.frame.path)),clip});}
 if(replacement.size)svg=svg.replace(/<image\b[^>]*\bhref="([^"]+)"[^>]*\/>/g,(tag,href)=>{const r=replacement.get(href);return r?tag.replace('href="'+href+'"','href="'+r.href+'" data-motion-family="'+r.clip.id+'" data-motion-phase="'+r.clip.frame.at+'"'):tag;});
 if(chapter==='01'){
  const human=active.findLast(c=>c.id==='lean'||c.id==='release');
  if(human)svg=svg.replace(/(<use href="#pose-programmer-(?:input|lean|release-half|rest)" )x="[-\d.]+" y="[-\d.]+" width="([\d.]+)" height="([\d.]+)"/g,(_,head,w,h)=>{const scale=+h/1536,bottom=human.id==='lean'?1462-31*human.frame.at:1462;return head+`x="${-512*scale}" y="${-bottom*scale}" width="${w}" height="${h}"`;});
 }
 if(chapter==='01'){
  const agent=active.findLast(c=>c.aliases.some(p=>/\/agent-[^/]+\.png$/.test(p)));
  if(agent){const keys=groups[agent.id].keys;let i=keys.findIndex(k=>k.at>=agent.frame.at);if(i<0)i=keys.length-1;const a=keys[Math.max(0,i-1)],b=keys[i],u=a.at===b.at?0:(agent.frame.at-a.at)/(b.at-a.at);const cal=k=>k.path.includes('agent-hold-file')?[500,1496]:[512,1515];const ca=cal(a),cb=cal(b),center=ca[0]+(cb[0]-ca[0])*u,bottom=ca[1]+(cb[1]-ca[1])*u;
   svg=svg.replace(/(<use href="#pose-agent-[^"]+" )x="[-\d.]+" y="[-\d.]+" width="([\d.]+)" height="([\d.]+)"/g,(_,head,w,h)=>{let scale=+w/1024;if(Math.abs(scale-.477)<.001)scale=.47;return head+`x="${-center*scale}" y="${-bottom*scale}" width="${1024*scale}" height="${1536*scale}"`;});
  }
 }
 // The old discussion zoom restarted at each speaking turn. Keep the shared camera steady.
 if(chapter==='06'&&t>=16&&t<23.4)svg=svg.replace(/transform="translate\([-\d.]+ [-\d.]+\) scale\([\d.]+\)"/,'transform="translate(-19.2 -10.8) scale(1.02)"');
 return svg;
}
