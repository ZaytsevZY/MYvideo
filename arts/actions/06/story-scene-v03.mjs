// S06_STORY v0.3: one deterministic chapter clock; complete raster poses, editable paper and UI.
import {ASSETS,COPY,root,scene} from '../../static/06/story-assets-v02/assets.mjs';
import * as previous from '../05/story-scene-v03.mjs';
import timing from './provenance/storyboard-v02/shot-timing.json' with {type:'json'};
import CUES from './captions/06-narration-v03.json' with {type:'json'};
export {ASSETS,COPY,CUES};
export const CONFIG={version:'S06_STORY v0.3',duration:58,fps:30,frames:1740,width:1920,height:1080,globalStartFrame:6660,audio:false};
export const BEATS=timing.shots.map(({id,title:name,start,end,type})=>({id,name,start,end,type}));
const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x);},mix=(a,b,u)=>a+(b-a)*u,n=x=>+x.toFixed(3);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const g=(s,a='')=>`<g ${a}>${s}</g>`;
const box=(x,y,w,h,c='#f8f4ec',r=0,a='')=>`<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="${r}" fill="${c}" ${a}/>`;
const txt=(x,y,s,size=34,c='#385765',anchor='middle',weight=500)=>`<text x="${x}" y="${y}" font-size="${size}" fill="${c}" text-anchor="${anchor}" font-weight="${weight}">${esc(s)}</text>`;
const img=(h,id,x,y,w,hh=w,fit='xMidYMid meet')=>{if(!h[id])throw Error('Missing06 '+id);return `<image href="${esc(h[id])}" x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(hh)}" preserveAspectRatio="${fit}"/>`;};
const line=(d,c='#8198a0',w=4,a='')=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${a}/>`;
const fade=(s,u)=>g(s,`opacity="${n(clamp(u))}"`);
function stroke(d,u,c='#8198a0',w=4){return line(d,c,w,`pathLength="1" stroke-dasharray="${n(clamp(u))} 1"`);}
function portrait(h,id,x,y,s,key){return `<defs><clipPath id="${key}">${box(x,y,s,s,'white',s*.16)}</clipPath></defs>`+g(img(h,id,x,y,s,s,'xMidYMid slice'),`clip-path="url(#${key})"`);}
function bg(h,panel=true){return g(img(h,'office',0,0,1920,1080),'filter="url(#s06-soft)"')+box(0,0,1920,1080,'#ece5d9',0,'opacity=".82"')+(panel?box(42,32,1836,930,'#f8f4ec',22):'');}
function paper(h,x,y,w,hh,title,subtitle){return img(h,'documentWide',x,y,w,hh)+txt(x+w/2,y+hh*.44,title,43*w/1130,'#385765','middle',600)+txt(x+w/2,y+hh*.64,subtitle,34*w/1130,'#6a7e87');}
function window(h,id,key,x,y,w,hh,emphasis=0,color='#7a9eaa'){
 return `<defs><clipPath id="${key}">${box(x,y,w,hh,'white',18)}</clipPath></defs>`+g(img(h,id,x,y,w,hh,'xMidYMid slice'),`clip-path="url(#${key})" data-raster-state="${id}"`)+box(x,y,w,hh,'none',18,`stroke="${color}" stroke-opacity="${n(.35+.65*emphasis)}" stroke-width="${n(2+4*emphasis)}"`);
}
function movingPaper(h,t,at,from,to,duration=.65){if(t<at||t>=at+duration)return '';const u=ease((t-at)/duration);return g(img(h,'document',mix(from[0],to[0],u)-24,mix(from[1],to[1],u)-32,48,64),'data-moving-object="single-allocation-or-instruction"');}
function pulse(x,y,t,at,r=26){const u=(t-at)/.6;return u>=0&&u<1?`<circle cx="${x}" cy="${y}" r="${n(r+u*17)}" fill="none" stroke="#c2a36d" stroke-width="3" opacity="${n(1-u)}"/>`:'';}
function camera(b,z=1,x=960,y=540){return g(b,`transform="translate(${n(x*(1-z))} ${n(y*(1-z))}) scale(${n(z)})"`);}
export function sample(time){
 if(!Number.isFinite(time))throw Error('Expected finite chapter06 time');const t=Math.max(0,Math.min(58,time)),beat=BEATS.find(b=>t>=b.start&&t<b.end)||BEATS.at(-1);
 return {t,beat:beat.id,newStoryImplementation:true,phase:t<.4?'entry':t<16?'conditional-choices':t<23.4?'discussion':t<27?'conditions':t<29?'later-fulfilment':t<31?'leave':t<44?'life':'references',
 entryPlan:{id:'S05-PLAN-01',proposalId:'S05-PROP-01',status:t<16?'pending-discussion':t<23.4?'in-discussion':'jointly-confirmed-in-scenario'},
 plan:{id:'S05-PLAN-01',version:t<23.4?'proposal':'agreed-scenario',workerCoDecision:t>=23.4},proposal:{id:'S05-PROP-01',status:t<16?'pending-discussion':t<23.4?'in-discussion':'jointly-confirmed-in-scenario'},
 previousTasks:{'S05-T01':'human-accepted','S05-T02':'running'},tasks:{'T06-final':t<27?'not-introduced':t<28.3?'review':'human-accepted'},humanAccepted:t>=28.3,
 agentIsEmployer:false,allocationOwner:'human-organizational-agreement',allocationIsConditionalScenario:true,twoAlternativesAreCumulative:false,savingResourceCount:1,branch:t<2.5?'common-start':t<4.7?'more-delivery':t<8.8?'shorter-hours':'comparison',
 jointConfirmed:t>=23.4,lifeInterruptedAfter31s:false,pose:t<16?null:t<18.8?'developer':t<21.2?'tester':t<23?'writing':t<23.4?'agreed':t<27?null:t<28.3?'review':t<29?'accepted':t<30?'standing':t<31?'departed':t<33.4?'bookSelect':t<35.7?'bookBuy':t<38.4?'theatreSettle':t<40.3?'theatreEnjoy':t<43.2?'homeRead':t<44?'homeTurn':null,
 caption:CUES.find(c=>t*1000>=c.startMs&&t*1000<c.endMs)||null,terminalHold:t>=57.2};
}
function choices(t,h){
 const T=Math.min(t,15.3),entry=ease((T-.4)/.65),left=T>=2.5&&T<4.7?1:T>=8.8?.55:.2,right=T>=4.7&&T<8.8?1:T>=8.8?.55:.2;
 let b=bg(h);b+=portrait(h,'programmer',110,310,140,'source-human')+portrait(h,'agent',303,310,140,'source-agent')+txt(280,506,'人 + Agent',38)+img(h,'document',211,563,138,175)+txt(280,801,COPY.choices.source,44,'#3f6675','middle',600);
 let branches=img(h,'company',714,53,140,123)+portrait(h,'manager',879,66,96,'choice-manager')+portrait(h,'programmer',1477,55,102,'choice-worker');
 branches+=txt(868,220,COPY.choices.more,42,'#806950','middle',600)+txt(1528,220,COPY.choices.time,42,'#4b7882','middle',600);
 branches+=window(h,T>=2.9?'extra':'settled','choice-left',560,250,615,650,left,'#c4a26c');
 branches+=window(h,T<5.6?'settled':T<6.8?'standing':'departed','choice-right',1220,250,615,650,right);
 branches+=stroke('M474 600H546',entry)+stroke('M474 680H520V932H1190V575H1207',entry);
 if(T>=2.5)branches+=line('M814 187H936','#bc9864',T<4.7?5:3);
 if(T>=4.7)branches+=line('M1473 181H1583','#709fa6',T<8.8?5:3);
 // Additional work originates at the organizational node before the worker types.
 branches+=movingPaper(h,T,2.5,[927,165],[868,360],.4)+pulse(868,220,T,2.5,45);
 branches+=movingPaper(h,T,4.7,[280,650],[1190,575],.65)+pulse(1528,220,T,4.7,45);
 if(T>=2.9&&T<3.8)branches+=g(txt(1114,337,'✳',38,'#a78651'),`transform="rotate(${n((T-2.9)*180)} 1114 323)" data-action-feedback="agent-executes-after-human-assignment"`);
 b+=fade(branches,entry);
 if(T>=12.4){const u=ease((T-12.4)/.9);b+=fade(box(535,235,1330,700,'#f4eee3',20,'opacity=".9"'),u);b+=g(paper(h,mix(211,617,u),mix(563,315,u),mix(138,1130,u),mix(175,520,u),COPY.plan.heading,COPY.plan.pending),`data-object-id="S05-PLAN-01" data-proposal-state="pending-discussion"`);}
 return g(b,'data-logic-scene="conditional-allocation" data-saving-count="1"');
}
function meeting(t,h){
 const s=sample(t),stage=t<18.8?0:t<21.2?1:2,starts=[16,18.8,21.2];let b=img(h,s.pose,0,0,1920,1080,'xMidYMid slice');
 for(let i=0;i<=stage;i++){const u=ease((t-starts[i]-.12)/.65);b+=fade(txt([745,1045,1340][i],910,COPY.plan.fields[i],34,i===stage?'#436e80':'#6e7d82'),u)+stroke(`M${[648,932,1247][i]} 932H${[841,1163,1450][i]}`,u,i===stage?'#7394a4':'#a0acae',3);}
 // The third whole pose is pen contact; the fourth is a withdrawn pen and joint checking.
 // No checkmark or accepted status is shown until the joint-confirmation boundary23.4.
 const start=starts[stage],z=t>=23?1:1+.025*ease((t-start)/1.2);return camera(g(b,`data-raster-state="${s.pose}" data-object-id="S05-PLAN-01" data-state="in-discussion"`),z,stage===0?745:stage===1?1260:1000,720);
}
function conditions(t,h){
 let b=scene('conditions',h,1);const u=ease((t-23.4)/.4);
 // Both source papers settle together. Reading is completely still from23.8 through26.6.
 b=g(b,`transform="translate(0 ${n((1-u)*28)})"`);
 b+=fade(box(800,195,320,10,'#dbe7df',5)+box(800,195,320*ease((t-23.4)/.4),10,'#8eaa96',5),u);
 return g(b,'data-object-id="S05-PLAN-01" data-state="jointly-confirmed-in-scenario"');
}
function work(t,h){const accepted=t>=28.3;let b=scene('work',h,accepted?1:0);
 if(t>=27.75&&t<28.65){const u=ease((t-27.75)/.55),x=mix(1410,1636,u),y=mix(622,738,u);b+=g('<path d="M0 0L0 29L8 22L15 35L22 31L15 19L26 18Z" fill="#f8f4ec" stroke="#486673" stroke-width="2"/>',`transform="translate(${n(x)} ${n(y)})"`)+pulse(1636,738,t,28.3,24);}
 return g(b,`data-fulfilment="later-agreed-deliverable" data-human-accepted="${accepted}"`);
}
function life(t,h){const s=sample(t),part=t<35.7?'bookshop':t<40.3?'theatre':'home',state=['bookBuy','theatreEnjoy','homeTurn'].includes(s.pose)?1:0;
 let z=1;if(part==='bookshop')z=1+.018*ease((t-(state?33.4:31))/(state?1.2:1.8));if(part==='home')z=1+.032*ease((t-40.3)/3.5);
 return camera(scene(part,h,state),z,part==='home'?900:960,part==='home'?660:540);
}
function caption(c){if(!c)return '';const units=[...c.text].reduce((n,ch)=>n+(/[\x00-\x7f]/.test(ch)?.56:1),0),w=Math.ceil(units*44+68);return g(box(960-w/2,994,w,68,'#101923',12,'fill-opacity=".78"')+txt(960,1043,c.text,44,'#fffdf8'),'data-chapter-caption="06"');}
export function svg(time,h,{caption:captions=true}={}){const s=sample(time),t=s.t;if(t<.4)return previous.svg(1349/30,h,{caption:false});
 const b=t<16?choices(t,h):t<23.4?meeting(t,h):t<27?conditions(t,h):t<29?work(t,h):t<31?scene('leave',h,t>=30?1:0):t<44?life(t,h):scene('references',h,t>=51?1:0);
 return root(b+(captions?caption(s.caption):''));}
