import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url);
let sharp;
try { sharp=require('sharp'); } catch { sharp=require('/Users/alan671/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp'); }
const HERE=path.dirname(fileURLToPath(import.meta.url)), ROOT=path.resolve(HERE,'../../..');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=p=>fs.readFile(path.join(ROOT,p));
const data=async p=>'data:image/png;base64,'+(await read(p)).toString('base64');
const svg=(w,h,body)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><style>text{font-family:'PingFang SC','Noto Sans CJK SC',sans-serif;fill:#263542} .small{fill:#687783}</style>${body}</svg>`;
const text=(x,y,size,s,more='')=>`<text x="${x}" y="${y}" font-size="${size}" ${more}>${s}</text>`;
const image=(href,x,y,w,h,fit='xMidYMid meet')=>`<image href="${href}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="${fit}"/>`;
const rect=(x,y,w,h,c,r=0,stroke='none')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c}" stroke="${stroke}"/>`;
async function output(rel,body){
 const p=path.join(ROOT,rel); await fs.mkdir(path.dirname(p),{recursive:true});await fs.writeFile(p,body);
 await sharp(Buffer.from(body)).png().toFile(p.replace(/\.svg$/,'.png'));
}
const P='arts/static/story-assets-v01/', U='arts/items/shared/';
const assets={
 office:'arts/backgrounds/shared/office-workstations-day-v01.png',meeting:'arts/backgrounds/shared/meeting-room-day-v01.png',
 manager:'arts/characters/poses/shared/manager-assign-left-v01.png',managerPoint:'arts/characters/poses/shared/manager-point-left-v01.png',coworker:'arts/characters/poses/shared/coworker-discuss-right-v01.png',
 asleep:'arts/static/03/programmer-asleep-main-v01.png',awake:'arts/static/03/programmer-awake-main-v01.png',
 lunch:'arts/static/04/lunch-panel-v02.png',premeeting:'arts/static/04/premeeting-panel-v02.png',evening:'arts/static/04/evening-panel-v02.png',
 agent:'arts/characters/portraits/01/agent-focus-v01.png',programmer:'arts/characters/poses/01/programmer-stand-v01.png'
};
const a=Object.fromEntries(await Promise.all(Object.entries(assets).map(async([k,p])=>[k,await data(p)])));
const shell=title=>rect(0,0,1440,900,'#182631',24)+rect(0,0,1440,70,'#243746',24)+rect(0,42,1440,28,'#243746')+text(35,45,26,title,'fill="#f6f1e7" style="fill:#f6f1e7"')+rect(0,70,246,830,'#20313d')+text(30,125,22,'项目工作区','style="fill:#d2dce2"')+text(30,186,21,'当前排期','style="fill:#96a9b7"')+rect(18,215,210,54,'#395362',10)+text(30,250,22,'搁置需求','style="fill:#fff4dc"')+text(30,315,21,'已验收','style="fill:#96a9b7"');
const list=shell('需求库')+text(292,145,34,'搁置需求','style="fill:#f6f1e7"')+text(294,191,22,'尚未进入排期','style="fill:#a4b5c0"')+rect(284,235,1100,190,'#2b414f',18,'#607786')+text(320,285,24,'feedback','style="fill:#e8c58c"')+text(320,333,31,'补充反馈入口','style="fill:#f6f1e7"')+text(320,384,22,'候选 · 待评估','style="fill:#bbcad2"')+rect(1120,294,224,72,'#e8c58c',12)+text(1154,340,27,'打开需求');
const detail=shell('需求库 / feedback')+text(292,145,34,'补充反馈入口','style="fill:#f6f1e7"')+rect(1140,108,220,54,'#3b505d',12)+text(1170,144,23,'候选 · 待评估','style="fill:#e8c58c"')+text(294,238,25,'入口位置','style="fill:#e8c58c"')+text(294,292,28,'功能页侧栏','style="fill:#e0e9ee"')+text(294,385,25,'反馈内容','style="fill:#e8c58c"')+text(294,439,28,'问题描述与运行日志','style="fill:#e0e9ee"')+text(294,532,25,'验收要点','style="fill:#e8c58c"')+text(294,586,28,'可提交 · 可追踪','style="fill:#e0e9ee"')+rect(1090,751,262,80,'#e8c58c',14)+text(1130,802,27,'试做此需求');
await output(U+'backlog-list-v01.svg',svg(1440,900,list));
await output(U+'backlog-open-v01.svg',svg(1440,900,detail));
// Character avatar is cropped from the adopted raster pose; it is not a code-drawn face.
const managerHead=`<svg x="26" y="28" width="98" height="98" viewBox="360 15 330 330">${image(a.manager,0,0,1024,1536)}</svg>`;
const notification=(kind)=>rect(4,4,712,232,'#fbf7ef',24,'#d9c8ac')+rect(4,4,10,232,'#d9a451',5)+rect(24,26,102,102,'#e6e9e5',20)+(kind==='task'?managerHead:image(a.agent,24,26,102,102))+text(148,64,25,kind==='task'?'负责人':'Agent')+text(148,112,31,kind==='task'?'追加任务 · S03-C':'结果待验收 · S03-C')+text(148,159,25,kind==='task'?'请确认本轮安排':'请查看返回结果','class="small"')+rect(510,174,176,44,'#e8c58c',11)+text(546,205,23,kind==='task'?'查看安排':'打开结果');
await output(U+'notification-task-v01.svg',svg(720,240,notification('task')));
await output(U+'notification-result-v01.svg',svg(720,240,notification('result')));
const note=await data(U+'notification-result-v01.png');
for(const state of ['asleep','awake']) await output(P+`compositions/03-${state}-notification.svg`,svg(1920,1080,image(a[state],0,0,1920,1080)+image(note,1184,84,672,224)));
// Parallel scene group: all three actual story images stay visible together.
let three=rect(0,0,1920,1080,'#f6f1e7');
const labels=['午餐','会前','晚间'],tasks=['补充测试','整理会前材料','继续验证'];
['lunch','premeeting','evening'].forEach((key,i)=>{
 const x=28+i*630;
 three+=image(a[key],x,28,604,906)+rect(x+18,46,112,48,'#f6f1e7',12)+text(x+43,79,27,labels[i]);
 three+=rect(x+18,786,568,122,'#f8f3e9',18,'#c6bba9')+image(a.agent,x+28,797,92,100)+text(x+136,828,21,'Agent','class="small"')+text(x+136,866,27,tasks[i])+text(x+136,895,20,'执行中','class="small"');
 });
await output(P+'compositions/04-three-parallel.svg',svg(1920,1080,three));
// Distinct miniature story window for task assignment while the reaction stays in the main image.
let mini=svg(960,540,image(a.office,0,0,960,540)+image(a.manager,565,30,310,465)+rect(54,150,415,170,'#f8f3e9',14)+text(80,195,24,'下一轮安排')+text(80,246,28,'H02-new1  /  H02-new2')+text(80,290,23,'待确认排期','class="small"'));
await output(P+'compositions/manager-task-window.svg',mini);
const miniData=await data(P+'compositions/manager-task-window.png');
await output(P+'compositions/02-manager-parallel.svg',svg(1920,1080,image(a.awake,0,0,1920,1080)+rect(1110,450,760,438,'#f6f1e7',16)+image(miniData,1120,460,740,416)));
// Characters share a floor line, rather than using conflicting perspective silhouettes.
await output(P+'compositions/meeting-characters.svg',svg(1920,1080,image(a.meeting,0,0,1920,1080)+image(a.coworker,1190,300,420,630)+image(a.managerPoint,1500,300,420,630)));
let contact=rect(0,0,1920,1080,'#f6f1e7');
const thumbs=[['04-three-parallel','三画幅同时呈现'],['03-awake-notification','主画面醒来 + 通知窗'],['02-manager-parallel','主画面反应 + 负责人追加任务窗'],['meeting-characters','会议室与角色资源摆位']];
for(let i=0;i<thumbs.length;i++){
 const [name,label]=thumbs[i],x=(i%2)*960,y=Math.floor(i/2)*540;
 contact+=image(await data(P+'compositions/'+name+'.png'),x+12,y+42,936,486)+text(x+25,y+31,24,label);
}
await output(P+'contact-v01.svg',svg(1920,1080,contact));
// Machine-readable generation and reference provenance, without pretending an undisclosed model id.
const promptFiles=(await fs.readdir(path.join(HERE,'prompts'))).filter(f=>f.endsWith('.json')).sort();
let calls=[];
for(const f of promptFiles){const js=JSON.parse(await fs.readFile(path.join(HERE,'prompts',f),'utf8'));for(const j of js) calls.push({...j,promptFile:P+'prompts/'+f});}
const copies=[];
for(const f of (await fs.readdir(path.join(HERE,'provenance'))).filter(f=>/^copies-/.test(f))) copies.push(...JSON.parse(await fs.readFile(path.join(HERE,'provenance',f),'utf8')));
const chapters={office:['02','03','04','05'],meeting:['04','05','06'],'manager-assign':['02','03','04','05'],'manager-point':['03','04','05','06'],'coworker-discuss':['04','05','06'],asleep:['03'],awake:['03'],lunch:['04'],premeeting:['04'],evening:['04']};
let records=[];
for(const j of calls){
 const b=await read(j.dest),m=await sharp(b).metadata(),source=copies.find(c=>c.dest===j.dest)?.source;
 const base=j.id.replace('-corrected',''),isOld=['lunch','premeeting','evening'].includes(j.id);
 const refs=[];for(const p of j.referenced_image_paths||[]) refs.push({path:path.relative(ROOT,p),sha256:hash(await fs.readFile(p)),role:j.id.endsWith('-corrected')?'edit target':j.id==='awake'&&refs.length===0?'edit target':'identity / environment / style reference; see full prompt'});
 records.push({id:j.id,path:j.dest,status:isOld?'superseded-perspective-error':'prepared-art',usedInCurrentFilm:false,chapters:chapters[base],sha256:hash(b),bytes:b.length,width:m.width,height:m.height,hasAlpha:m.hasAlpha,source,tool:'image_gen.imagegen',model:'not exposed by built-in tool',transparent_background:j.transparent_background,promptFile:j.promptFile,references:refs,supersededBy:isOld?j.dest.replace('v01','v02'):undefined});
}
let ui=[];for(const f of ['backlog-list-v01','backlog-open-v01','notification-task-v01','notification-result-v01']) for(const ext of ['svg','png']) {const p=U+f+'.'+ext,b=await read(p);ui.push({path:p,sha256:hash(b),method:'editable UI composition; raster character inserts',usedInCurrentFilm:false});}
const reuse=Object.entries({agent:assets.agent,programmer:assets.programmer,coworkerModel:'arts/characters/coworker-model-sheet-v01.png',managerModel:'arts/characters/manager-model-sheet-v01.png'});
let reused=[];for(const[id,p]of reuse)reused.push({id,path:p,sha256:hash(await read(p)),chapters:id==='agent'?['02','03','04','05','06']:id==='coworkerModel'?['04','05','06']:['02','03','04','05','06']});
const manifest={version:'STORY_ASSETS v0.1',date:'2026-10-18',stage:'prepared-art-and-composition',implementedInChapterAnimation:false,generationCalls:records.length,adoptedRasterCount:records.filter(r=>r.status==='prepared-art').length,outputs:records,editableUi:ui,reused,layout:'layout-v01.json'};
await fs.writeFile(path.join(HERE,'manifest-v01.json'),JSON.stringify(manifest,null,2)+'\n');
const html=`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>后续故事场景 · 素材与构图</title><style>*{box-sizing:border-box}body{margin:0;background:#e7e3d9;color:#263542;font:17px/1.7 system-ui,sans-serif}main{max-width:1400px;margin:auto;padding:28px}h1{font-size:29px;margin:0}h2{font-size:23px;margin-top:36px}p{max-width:1000px}.stage{width:100%;display:block;background:#f6f1e7;box-shadow:0 7px 26px #26354220;border-radius:12px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}.grid img{width:100%}button,a{font:inherit;color:#344d5c}button{padding:8px 22px;border:1px solid #bba98e;border-radius:10px;background:#fbf7ef;cursor:pointer;margin:0 8px 12px 0}.characters{display:flex;background:#f6f1e7;justify-content:center}.characters img{width:30%;height:500px;object-fit:contain}.quiet{color:#657581}a{margin-right:18px}@media(max-width:760px){.grid{grid-template-columns:1fr}.characters img{height:260px}}</style><main><h1>02–06 · 故事场景素材</h1><p class="quiet">新美术与代表构图检查。当前全片播放器仍为基础演出；本页用于接入前检查，不是全段动画。</p><a href="../../actions/film/preview.html">全片基础预览</a><a href="manifest-v01.json">素材与来源清单</a><a href="README.md">制作说明</a><h2>午餐 / 会前 / 晚间：三画幅并行</h2><p>三个实际场景始终同屏，人物行动与任务状态各自关联。底部留给统一字幕。</p><img class="stage" src="compositions/04-three-parallel.png"><h2>休息被打断：主画面反应 + 通知窗</h2><button onclick="document.querySelector('#rest').src='compositions/03-asleep-notification.png'">伏桌休息</button><button onclick="document.querySelector('#rest').src='compositions/03-awake-notification.png'">醒来查看</button><img id="rest" class="stage" src="compositions/03-awake-notification.png"><h2>负责人追加任务：独立行动小窗</h2><p>示范主画面与小窗的并行关系；正式02动作需补程序员接收姿态，不直接复用03困倦表情。</p><img class="stage" src="compositions/02-manager-parallel.png"><h2>新空间与角色摆位</h2><div class="grid"><img class="stage" src="../../backgrounds/shared/office-workstations-day-v01.png"><img class="stage" src="compositions/meeting-characters.png"></div><h2>搁置需求：列表 / 打开</h2><p>feedback保持候选、待评估；查看不会自动改变01的已排期或已验收状态。界面有可编辑SVG与PNG版。</p><div class="grid"><img class="stage" src="../../items/shared/backlog-list-v01.png"><img class="stage" src="../../items/shared/backlog-open-v01.png"></div><h2>新增完整角色姿态</h2><div class="characters"><img src="../../characters/poses/shared/manager-assign-left-v01.png"><img src="../../characters/poses/shared/manager-point-left-v01.png"><img src="../../characters/poses/shared/coworker-discuss-right-v01.png"></div><p class="quiet">沿用负责人和同事原设定；原图保留原路径，以共享引用供后续章使用。人物不拆肢体、不拉伸、不叠化两个身体。画面内任务名称是道具内容，研究范围限定仍在正式分镜保留。</p></main></html>`;
await fs.writeFile(path.join(HERE,'preview.html'),html);
console.log(JSON.stringify({calls:records.length,adopted:manifest.adoptedRasterCount,ui:ui.length,preview:P+'preview.html'}));
