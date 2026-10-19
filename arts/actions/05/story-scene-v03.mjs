// S05_STORY v0.3. Authored 45s clock; coherent raster key poses plus causal diagram motion.
import {ASSETS as ART,COPY,root,scene} from '../../static/05/story-assets-v02/assets.mjs';
import * as previous from '../04/story-scene-v05.mjs';
import CUES from './captions/05-narration-v03.json' with {type:'json'};
export {CUES,COPY};
const ENTRY_KEYS=['office','hrReview','document','boardExcerpt','lunchType','meetingType','eveningType'];
export const ASSETS={...ART,...Object.fromEntries(ENTRY_KEYS.map(k=>['entry04_'+k,previous.ASSETS[k]]))};
export const TERMINAL_ASSETS=Object.fromEntries(['office','coworkerA','coworkerB','document','company','manager','documentWide','programmer','agent'].map(k=>[k,ART[k]]));
export const CONFIG={version:'S05_STORY v0.3',duration:45,fps:30,frames:1350,width:1920,height:1080,globalStartFrame:5310,audio:false};
export const BEATS=[
 ['岗位要求接入',0,3],['员工调度多个Agent',3,6],['企业与员工关系',6,9.4],['目标周期与分配',9.4,13.3],['调整排期的另一通道',13.3,17.3],['额外任务与收益安排',17.3,21.8],['成果交付与人工验收',21.8,25.6],['完成之后仍等新指令',25.6,29.4],['广告标语与工位反应',29.4,33.8],['从场景抽出规则反馈',33.8,37.4],['具体指令仍由人发出',37.4,40.6],['目的尺度另有来源',40.6,43],['同一排期页留给06',43,45]
].map(([name,start,end],i)=>({id:`S05-${String(i+1).padStart(2,'0')}`,name,start,end,type:i>=6&&i<=8?'E':'L'}));
const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x);},mix=(a,b,u)=>a+(b-a)*u,fmt=x=>+x.toFixed(3);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const group=(s,a='')=>`<g ${a}>${s}</g>`;
const box=(x,y,w,h,c='#f8f4ec',r=0,a='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c}" ${a}/>`;
const txt=(x,y,s,size=32,color='#405c69',anchor='middle',weight=500)=>`<text x="${x}" y="${y}" font-size="${size}" fill="${color}" text-anchor="${anchor}" font-weight="${weight}">${esc(s)}</text>`;
const img=(h,id,x,y,w,hh=w,fit='xMidYMid meet')=>{if(!h[id])throw Error('Missing05 '+id);return `<image href="${esc(h[id])}" x="${fmt(x)}" y="${fmt(y)}" width="${w}" height="${hh}" preserveAspectRatio="${fit}"/>`;};
const line=(d,c='#718e9b',w=4,a='')=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${a}/>`;
function route(d,u=1,c='#718e9b',width=4){u=clamp(u);return line(d,'#d8d9d1',2)+line(d,c,width,`pathLength="1" stroke-dasharray="${fmt(u)} 1"${u===1?' marker-end="url(#s05-arrow)"':''}`);}
const fade=(s,u)=>group(s,`opacity="${fmt(clamp(u))}"`);
function portrait(h,id,x,y,s,key){return `<defs><clipPath id="${key}">${box(x,y,s,s,'white',s*.16)}</clipPath></defs>`+group(img(h,id,x,y,s,s,'xMidYMid slice'),`clip-path="url(#${key})" data-participant="${id}"`);}
const bg=h=>group(img(h,'office',0,0,1920,1080),'filter="url(#s05-soft)"')+box(0,0,1920,1080,'#eee8dd',0,'opacity=".78"')+box(64,40,1792,920,'#f8f4ec',22);
function pulse(x,y,t,at,size=36){const u=(t-at)/.65;return u>=0&&u<1?`<circle cx="${x}" cy="${y}" r="${fmt(size+u*14)}" fill="none" stroke="#c2a36d" stroke-width="3" opacity="${fmt(1-u)}"/>`:'';}
function movingPaper(h,t,at,from,to,key,duration=.65,w=42){const u=ease((t-at)/duration);if(t<at||t>at+duration+.25)return '';return group(img(h,'document',mix(from[0],to[0],u)-w/2,mix(from[1],to[1],u)-w*.65,w,w*1.3),`data-moving-object="${key}"`);}
function cursor(x,y,t,at){if(t<at-.45||t>at+.3)return '';const u=ease((t-at+.45)/.45);return group(`<path d="M0 0L0 29L8 22L15 35L22 31L15 19L26 18Z" fill="#f8f4ec" stroke="#486673" stroke-width="2"/>`,`transform="translate(${fmt(x+(1-u)*55)} ${fmt(y+(1-u)*45)})"`)+pulse(x,y,t,at,18);}
export function sample(time){
 if(!Number.isFinite(time))throw Error('Expected finite chapter05 time');const t=Math.max(0,Math.min(45,time)),beat=BEATS.find(b=>t>=b.start&&t<b.end)||BEATS.at(-1);
 return {t,beat:beat.id,phase:t<.4?'entry':t<21.8?'relations':t<25.6?'delivery':t<29.4?'waiting':t<33.8?'signage-reaction':'feedback',decisionOwner:'organization',instructionOwner:'employee',agentIsEmployer:false,cvIsToolTask:false,hrIsDirectSupervisor:false,inheritedTasks:{},entryRequirement:{jobId:'S04-JOB-01',text:'熟练调度多个Agent',relation:'organization-requirement-to-actual-tool-use'},caption:CUES.find(c=>t*1000>=c.startMs&&t*1000<c.endMs)||null,
 activeAgents:t<3?1:t<3.7?1:t<4.45?2:3,goals:[6.6,9.7,11.1].map(a=>t>=a),proposal:{id:'S05-PROP-01',origin:'employee',destination:'organization',status:t<13.3?'not-introduced':'pending-discussion'},plan:{id:'S05-PLAN-01',owner:'organization',workerCoDecision:false},
 tasks:{'S05-T01':t<21.1?'executing':t<24.8?'generated':'human-accepted','S05-T02':t<25.6?'not-introduced':t<32.6?'awaiting-human-input':t<33.2?'prompted-by-human':'running'},
 humanAccepted:t>=24.8,requestVisible:t>=25.6&&t<29.4,reactionVisible:t>=25.9&&t<29.4,pose:t<23.1?'delivery':t<25.9?'review':t<29.4?'waiting':t<31.6?'signage':t<32.6?'pause':'resume',terminalHold:t>=43.8};
}
function relations(t,h){
 let b=bg(h);b+=txt(480,119,'工具调用',44,'#395d6b','middle',600)+txt(1430,119,'组织管理',44,'#876d5c','middle',600);
 b+=portrait(h,'programmer',393,175,174,'rel-human')+txt(480,396,'员工',34)+img(h,'company',1330,163,200,180)+txt(1430,396,'企业',34);
 // Both relations are present from the first diagram frame. Only emphasis changes.
 b+=line('M480 414V460H224V492M480 460H736V492M480 460V492','#bccbd0',3)+route('M1430 414V460H1174V492M1430 460H1686V492M1430 460V492',ease((t-6)/.75),t>=6?'#a59685':'#c9c5bd');
 const calls=[.75,3.4,4.15],xs=[224,480,736];
 xs.forEach((x,i)=>{const start=calls[i],u=ease((t-start)/.55),running=t>=start+.5&&t<start+1.3; b+=portrait(h,running?'agentFocus':'agent',x-66,502,132,'rel-agent-'+i)+txt(x,684,'Agent '+['A','B','C'][i],30,'#5b737c')+txt(x,729,COPY.relations.capabilities[i],32);
 b+=route(`M480 414V460H${x}V492`,u,'#6f9caa');b+=movingPaper(h,t,start,[480,420],[x,484],'invocation-'+i,.55)+cursor(480,335,t,start)+pulse(x,568,t,start+.55,72);
 if(running)b+=group(txt(x+78,534,'✳',35,'#bc9055'),`transform="rotate(${fmt((t-start)*180)} ${x+78} 520)"`);
 if(t>=start+1.3)b+=line(`M${x+54} 631l10 10l19-22`,'#79a18e',4);
 });
 ['coworkerA','programmer','coworkerB'].forEach((id,i)=>{const x=[1174,1430,1686][i];b+=portrait(h,id,x-66,502,132,'rel-employee-'+i)+txt(x,684,'员工',32,'#5b737c');});
 b+=fade(line('M1544 230H1586','#a59685',3)+portrait(h,'manager',1598,185,76,'rel-author')+txt(1636,306,'负责人',30,'#6d7b80'),ease((t-6.1)/.5));
 [6.6,9.7,11.1].forEach((at,i)=>{const x=1070+i*257,u=ease((t-at)/.5),active=i===0?t<9.4:i===1?t<11.1:t<13.3;b+=fade(box(x,755,232,75,active?'#eee1c7':'#e8e4dc',11)+txt(x+116,804,COPY.relations.goals[i],32,'#675f56','middle',600),u);});
 if(t>=13.3){const u=ease((t-13.3)/.75),v=ease((t-14.4)/.7);b+=route('M382 286H130V870H290',u,'#7799a9');b+=fade(group(img(h,'documentWide',302,782,355,177)+txt(480,883,'调整排期',34,'#4c6d7b','middle',600),'data-object-id="S05-PROP-01"'),u);
 b+=route('M668 865H996',v,'#a98d62')+fade(box(1015,852,229,66,'#f0e3c9',12)+txt(1129,897,'待讨论',32,'#8c7651','middle',600),v);
 b+=movingPaper(h,t,14.4,[668,865],[986,865],'adjustment-proposal',.7,40);
 }
 if(t>=17.3){const u=ease((t-17.3)/.65);b+=fade(txt(1430,723,'额外任务',32,'#8a755e'),u)+pulse(1430,792,t,17.3,62)+pulse(1700,792,t,19,62);}
 if(t>=21.1)b+=group(img(h,'document',818,570,80,108), 'data-object-id="S05-T01" data-state="generated"');
 return b;
}
function request(){return group(box(1050,590,430,87,'#fbf7ee',15,'stroke="#a1b2b8" stroke-width="2"')+line('M1050 630L1018 607L1050 606','#a1b2b8',2)+txt(1265,645,COPY.waiting.agent,32,'#354e5c'),'data-action-feedback="agent-request"');}
function story(t,h){
 let b,zoom=1;
 if(t<25.6){const review=t>=23.1;b=scene('delivery',h,review?1:0,{feedback:false});if(t>=24.8)b+=group(box(696,809,150,57,'#e1eee6',10)+txt(771,849,'已验收',30,'#487a63','middle',600),'data-action-feedback="human-reviewed"');zoom=1+.012*ease((t-21.8)/3.2);}
 else if(t<29.4){b=t<25.9?scene('delivery',h,1,{feedback:false}):scene('waiting',h,0);b+=request();if(t>=26.45)b+=fade(box(1620,714,266,63,'#f5f9fa',10,'stroke="#b9cbd0" stroke-width="2"')+txt(1753,757,'等待新指令',32,'#567984'),ease((t-26.45)/.25));}
 else if(t<31.6){b=scene('signage',h);}
 else{b=scene('reaction',h,t>=32.6?1:0);if(t>=32.6&&t<33.2)b+=pulse(640,959,t,32.6,42);if(t>=33.2)b+=group(box(1280,820,290,63,'#e8f0eb',10)+txt(1425,862,'正在执行下一项',32,'#597e70'),'data-action-feedback="human-started-next"');}
 return group(b,`transform="translate(${fmt(960*(1-zoom))} ${fmt(540*(1-zoom))}) scale(${fmt(zoom)})" data-shot-pose="${sample(t).pose}" data-task-id="S05-T01" data-task-state="${sample(t).tasks['S05-T01']}"`);
}
function feedback(t,h){
 const T=Math.min(t,43.8),u=ease((T-33.8)/.65);let b=bg(h);
 // The accepted physical document becomes the collective-result anchor, not a new task.
 b+=img(h,'document',mix(1150,512,u),mix(740,197,u),150,190)+fade(txt(587,437,'共同劳动成果',35,'#566f78','middle',600),ease((T-34.45)/.25));
 b+=fade(portrait(h,'coworkerA',135,180,112,'shared-a')+portrait(h,'coworkerB',286,180,112,'shared-b'),u);
 b+=fade(img(h,'company',1484,149,200,175)+portrait(h,'manager',1271,188,112,'rule-author')+txt(1430,382,'目标与标准',39,'#5b6b72','middle',600),ease((T-34.3)/.5));
 b+=fade(route('M715 310H1190V244H1260',ease((T-34.65)/.7)),ease((T-34.65)/.2));b+=movingPaper(h,T,34.65,[715,310],[1245,244],'collective-to-organization',.7);
 b+=fade(route('M1327 320V405',ease((T-35.25)/.5),'#a18c70'),ease((T-35.25)/.2));
 const page=img(h,'documentWide',1155,416,600,350)+txt(1455,545,'排期与收益配置',38,'#3d5965','middle',600)+txt(1455,612,'产品目标 · 交付标准',32,'#6e8088')+txt(1455,674,'调整提议：待讨论',32,'#997a4f');
 b+=fade(group(page,'data-object-id="S05-PLAN-01" data-owner="organization"'),ease((T-35.45)/.5));
 b+=fade(portrait(h,'programmer',282,652,146,'end-human')+portrait(h,'agent',722,652,146,'end-agent')+img(h,'document',934,682,93,120),ease((T-35.8)/.5));
 const instruction=T<37.4?0:ease((T-37.4)/.7),organization=T>=40.6?ease((T-40.6)/.7):ease((T-36)/.65);
 b+=fade(route('M456 727H695',instruction,'#6999a8',T>=37.4&&T<40.6?6:4)+txt(576,685,'具体指令',33,'#456b7b')+route('M882 727H921',ease((T-38.6)/.6)),ease((T-36)/.5));
 b+=movingPaper(h,T,37.6,[456,727],[695,727],'human-instruction',.7)+cursor(408,770,T,37.6);
 b+=fade(route('M1445 752V848H451V810',organization,'#a18b70',T>=40.6?6:4)+txt(1050,892,'工作要求',35,'#907462'),ease((T-36)/.65));
 b+=movingPaper(h,T,40.8,[1445,848],[451,848],'organization-requirement',.8,42);
 b+=fade(group(box(129,858,438,73,'#e9e1d0',12)+txt(348,907,'调整提议 · 待讨论',32,'#8d7858'),'data-object-id="S05-PROP-01" data-state="pending-discussion"'),ease((T-42.5)/.5));
 return group(b,'data-logic-scene="organization-feedback" data-object-id="S05-T01" data-state="human-accepted"');
}
function caption(c){if(!c)return '';const units=[...c.text].reduce((n,ch)=>n+(/[\x00-\x7f]/.test(ch)?.56:1),0),w=Math.ceil(units*44+68);return group(box(960-w/2,994,w,68,'#101923',12,'fill-opacity=".78"')+txt(960,1043,c.text,44,'#fffdf8'),'data-chapter-caption="05"');}
export function svg(time,h,{caption:captions=true}={}){const s=sample(time),t=s.t;if(t<.4){return previous.svg(1649/30,Object.fromEntries(ENTRY_KEYS.map(k=>[k,h['entry04_'+k]])),{caption:false});}return root((t<21.8?relations(t,h):t<33.8?story(t,h):feedback(t,h))+(captions?caption(s.caption):''));}
