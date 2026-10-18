// v01 art inventory builder; current layered preview uses build-layered-v02.mjs.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url);
let sharp;try{sharp=require('sharp');}catch{sharp=require('/Users/alan671/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');}
const HERE=path.dirname(fileURLToPath(import.meta.url)),ROOT=path.resolve(HERE,'../../../..');
const P='arts/static/02/story-assets-v01/',C='arts/characters/poses/02/',I='arts/items/02/';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=p=>fs.readFile(path.join(ROOT,p));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const txt=(x,y,size,s,color='#263542')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${color}">${esc(s)}</text>`;
const rect=(x,y,w,h,fill,rx=0,stroke='none',sw=1)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const image=(uri,x,y,w,h,fit='xMidYMid meet')=>`<image href="${uri}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="${fit}"/>`;
const svg=(w,h,b)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><style>text{font-family:'PingFang SC','Noto Sans CJK SC',sans-serif}</style>${b}</svg>`;
const data=async p=>'data:image/png;base64,'+(await read(p)).toString('base64');
async function output(p,s){const file=path.join(ROOT,p);await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,s);await sharp(Buffer.from(s)).png().toFile(file.replace(/\.svg$/,'.png'));}
const files={relax:C+'programmer-relax-rear-v01.png',think:C+'programmer-think-up-right-v01.png',choose:C+'programmer-choose-right-v01.png',review:C+'programmer-review-current-v01.png',next:C+'programmer-review-next-v01.png',room:'arts/backgrounds/01/workroom-day-v01.png',desk:'arts/items/01/workstation-painted-v02.png',chair:'arts/items/01/chair-back-rear-painted-v01.png',input:'arts/characters/poses/01/programmer-input-v01.png',agent:'arts/characters/poses/01/agent-receive-v01.png',manager:'arts/characters/poses/shared/manager-assign-left-v01.png',paper:'arts/items/01/task-document-portrait-v01.png'};
const a=Object.fromEntries(await Promise.all(Object.entries(files).map(async([k,p])=>[k,await data(p)])));
// Entire figures retain native aspect. Only roots and complete image states change.
const drawRear=(key)=>image(a[key],389.84,key==='input'?379.34:371.6,440.32,660.48);
function world(key,{agent=false,stack=false}={}){
 let b=image(a.room,0,0,1920,1080)+image(a.desk,0,0,1920,1080);
 b+=rect(596,343,540,268,'#20313f',3)+txt(770,395,28,'任务工作区','#e4e7e7')+txt(770,443,24,key==='relax'?'本轮已完成':key==='review'||key==='next'?'人工验收':'新增任务','#d6bb8d');
 b+=drawRear(key)+image(a.chair,483,663,265,296);
 if(agent)b+=image(a.agent,1300,270,470,705)+txt(1430,1006,24,'接收任务');
 if(stack)for(let i=0;i<3;i++)b+=`<g transform="translate(${1120+i*3} ${668-i*4}) matrix(1 0 .5 .2 0 0)">${image(a.paper,0,0,120,160)}</g>`;
 return b;
}
const content={version:'S02_KPI_CONTENT v0.1',title:'KPI · 本轮要求',rows:['交付范围','验收标准','周期安排'],scope:'fictional prop labels; no numerical quota, penalty or measured data',managerSource:files.manager};
await fs.mkdir(path.join(ROOT,I),{recursive:true});await fs.writeFile(path.join(ROOT,I+'kpi-requirements-v01.json'),JSON.stringify(content,null,2)+'\n');
let card=rect(4,4,752,352,'#fbf7ef',24,'#c9baa2',2)+rect(30,30,132,132,'#e8e5db',24);
card+=`<svg x="30" y="30" width="132" height="132" viewBox="360 0 350 350">${image(a.manager,0,0,1024,1536)}</svg>`;
card+=txt(196,87,34,content.title)+txt(196,145,24,'负责人','#6c7a82');
content.rows.forEach((s,i)=>{card+=rect(196,177+i*53,500,42,'#f0e9dc',10)+txt(220,207+i*53,25,s);});
await output(I+'kpi-requirements-v01.svg',svg(760,360,card));
const cardPng=await data(I+'kpi-requirements-v01.png');
const bubble=`<path d="M74 8H766Q804 8 804 48V342Q804 378 766 378H148L76 426L91 378H74Q24 378 24 334V50Q24 8 74 8Z" fill="#fbf7ef" stroke="#b8a78d" stroke-width="3"/><g transform="translate(32 18)">${card.replace(rect(4,4,752,352,'#fbf7ef',24,'#c9baa2',2),'')}</g>`;
await output(I+'kpi-thought-bubble-v01.svg',svg(820,440,bubble));
const bdata=await data(I+'kpi-thought-bubble-v01.png');
const panels=[{id:'A',rect:[480,70,650,366],label:'休息',key:'relax'},{id:'B',rect:[1176,70,650,366],label:'继续工作',key:'input'}];
function parallel(state){
 let b=image(a.room,0,0,1920,1080)+rect(0,0,1920,1080,'#f6f1e7');
 for(const p of panels){const[x,y,w,h]=p.rect,selected=state==='choose'&&p.id==='B';
  b+=rect(x-8,y-8,w+16,h+16,'#fbf7ef',16,selected?'#c58d3c':'#b7afa0',selected?7:2)+`<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 1920 1080">${world(p.key,{agent:p.id==='B'})}</svg>`+rect(x+18,y+16,p.id==='A'?106:160,45,'#fbf7ef',10)+txt(x+38,y+48,25,p.label);
 }
 b+=image(a[state],44,420,360,540)+image(bdata,432,493,738,396);
 if(state==='choose')b+=`<path d="M420 533Q800 484 1162 380" fill="none" stroke="#c58d3c" stroke-width="5" stroke-linecap="round"/><path d="M1146 369L1170 377L1152 396" fill="none" stroke="#c58d3c" stroke-width="5" stroke-linejoin="round"/>`;
 return b;
}
await output(P+'compositions/parallel-think-v01.svg',svg(1920,1080,parallel('think')));
await output(P+'compositions/parallel-choose-v01.svg',svg(1920,1080,parallel('choose')));
await output(P+'compositions/review-current-v01.svg',svg(1920,1080,world('review',{stack:true})));
await output(P+'compositions/review-next-v01.svg',svg(1920,1080,world('next',{stack:true})));
// Archive the exact full scene that can later expand from the right window without bitmap scaling.
await output(P+'compositions/work-window-native-v01.svg',svg(1920,1080,world('input',{agent:true})));
let alpha=rect(0,0,1800,1080,'#f6f1e7')+rect(900,0,900,1080,'#1b2b36');
['relax','think','choose','review','next'].forEach((k,i)=>{const x=i*180;alpha+=image(a[k],x,90,180,900)+image(a[k],x+900,90,180,900);});
await output(P+'provenance/poses-light-dark.svg',svg(1800,1080,alpha));
let contact=rect(0,0,1920,1080,'#f6f1e7');
for(const[i,[name,label]]of [['parallel-think','思考要求与并列方案'],['parallel-choose','选择右侧方案'],['review-current','查看当前文件'],['review-next','接下一份文件']].entries()){
 const x=(i%2)*960,y=Math.floor(i/2)*540;contact+=txt(x+25,y+30,23,label)+image(await data(P+'compositions/'+name+'-v01.png'),x+10,y+44,940,486);
}
await output(P+'contact-v01.svg',svg(1920,1080,contact));
const calls=[];for(const f of (await fs.readdir(path.join(HERE,'prompts'))).filter(f=>f.endsWith('.json')).sort())for(const j of JSON.parse(await fs.readFile(path.join(HERE,'prompts',f),'utf8')))calls.push({...j,promptFile:P+'prompts/'+f});
const copies=[];for(const f of (await fs.readdir(path.join(HERE,'provenance'))).filter(f=>/^copies-/.test(f)))copies.push(...JSON.parse(await fs.readFile(path.join(HERE,'provenance',f),'utf8')));
const shot={relax:'V02.2-E1',think:'V02.2-E2',choose:'V02.2-E2',review:'V02.3-E1','review-next':'V02.3-E1'};
let outputs=[];for(const j of calls){const b=await read(j.dest),m=await sharp(b).metadata(),refs=[];for(const p of j.referenced_image_paths)refs.push({path:path.relative(ROOT,p),sha256:hash(await fs.readFile(p))});outputs.push({id:j.id,path:j.dest,shot:shot[j.id],status:'prepared',usedInChapterAnimation:false,sha256:hash(b),width:m.width,height:m.height,hasAlpha:m.hasAlpha,source:copies.find(c=>c.dest===j.dest).source,tool:'image_gen.imagegen',model:'not exposed',transparent_background:j.transparent_background,promptFile:j.promptFile,references:refs});}
const ui=[];for(const stem of ['kpi-requirements-v01','kpi-thought-bubble-v01'])for(const ext of ['svg','png']){const p=I+stem+'.'+ext;ui.push({path:p,sha256:hash(await read(p)),method:'editable vector UI with adopted raster manager portrait; not image generation'});}
const reused=[];for(const[k,p]of Object.entries(files).filter(([k])=>!['relax','think','choose','review','next'].includes(k)))reused.push({id:k,path:p,sha256:hash(await read(p))});
const layout={version:'S02_STORY_ASSETS v0.1',canvas:[1920,1080],stage:'static art and layout only',subtitleSafe:[32,980,1856,100],parallel:{panels,foreground:[44,420,360,540],kpi:[432,493,738,396],mutuallyExclusive:true},rear:{workstation:[0,0,1920,1080],actor:{centerX:610,scale:.43,sourceCenterX:512,footBaseline:1008,sourceBottom:1480},chair:[483,663,265,296],layerOrder:['room','workstation','screen UI','whole programmer with held pages','chair back','Agent or task queue']},handoff:{bodyStates:'discrete whole illustrations; no limb assembly, body stretch or body crossfade',rightWindow:'same native vector/layer scene at small viewBox and full canvas; do not enlarge a flattened thumbnail',paperIdentity:'review-current holds current sheet; review-next lowers that sheet on left and grasps a different next sheet on right. Held pages are already in character PNG; independent moving page exits at contact.',notes:'Two-panel framing is a static composition candidate, not final timing. Existing L1 sequencing and user script remain untouched.'}};
await fs.writeFile(path.join(HERE,'layout-v01.json'),JSON.stringify(layout,null,2)+'\n');
await fs.writeFile(path.join(HERE,'manifest-v01.json'),JSON.stringify({version:'S02_STORY_ASSETS v0.1',date:'2026-10-18',stage:'prepared-art',generationCalls:outputs.length,adoptedRaster:outputs.length,chapterAnimationUpdated:false,outputs,ui,reused,layout:'layout-v01.json'},null,2)+'\n');
const html=`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>02 · 休息、选择与连续审核素材</title><style>*{box-sizing:border-box}body{margin:0;background:#e8e3d9;color:#263542;font:17px/1.7 system-ui,sans-serif}main{max-width:1420px;margin:auto;padding:28px}h1{font-size:28px;margin:0}h2{font-size:23px;margin-top:32px}a{color:#456276;margin-right:22px}.muted{color:#687a84}.stage{width:100%;display:block;background:#f6f1e7;border-radius:12px;box-shadow:0 5px 22px #26354220}.poses{display:flex;background:#f6f1e7}.poses img{width:20%;height:460px;object-fit:contain}button{font:inherit;background:#fbf7ef;color:#263542;border:1px solid #baaa8f;border-radius:10px;padding:8px 18px;margin:0 8px 12px 0;cursor:pointer}.grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}.grid img{width:100%}@media(max-width:760px){.grid{grid-template-columns:1fr}.poses img{height:250px}}</style><main><h1>02 · 新增动作素材</h1><p class="muted">5张完整透明PNG与可编辑KPI层。这里检查静态状态和构图，尚未替换全片演出。</p><a href="README.md">制作说明</a><a href="manifest-v01.json">来源与哈希</a><a href="../../../actions/film/preview.html">全片基础预览</a><h2>休息 / 继续工作，两种方案</h2><button onclick="document.querySelector('#parallel').src='compositions/parallel-think-v01.png'">思考KPI</button><button onclick="document.querySelector('#parallel').src='compositions/parallel-choose-v01.png'">选中右侧</button><img id="parallel" class="stage" src="compositions/parallel-think-v01.png"><p>两窗是互斥的可能安排。右窗使用同一套原生分层场景，后续可直接展开到全屏。</p><h2>连续审核</h2><button onclick="document.querySelector('#review').src='compositions/review-current-v01.png'">查看当前文件</button><button onclick="document.querySelector('#review').src='compositions/review-next-v01.png'">接下一份</button><img id="review" class="stage" src="compositions/review-current-v01.png"><h2>完整人物绘稿</h2><div class="poses">${['relax','think','choose','review','next'].map(k=>'<img src="../../../'+files[k].replace(/^arts\//,'')+'">').join('')}</div><h2>KPI内容 / 透明边缘检查</h2><div class="grid"><img class="stage" src="../../../items/02/kpi-thought-bubble-v01.png"><img class="stage" src="provenance/poses-light-dark.png"></div><p class="muted">KPI短字段独立可编辑，无数字配额与奖惩断言；手持纸张已绘入完整人物，接触时不再叠加第二张独立纸。用户手动分镜、口播与原动画源码保持原样。</p></main></html>`;
await fs.writeFile(path.join(HERE,'preview-v01.html'),html);
console.log(JSON.stringify({poses:outputs.length,uiFiles:ui.length,reused:reused.length,preview:P+'preview-v01.html'}));
