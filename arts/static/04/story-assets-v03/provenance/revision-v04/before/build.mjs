import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {ASSETS,LAYOUT,SCENES,COMPETITION_STATES,root,scene} from './assets.mjs';
const sharp=createRequire(import.meta.url)('/Users/alan671/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const HERE=path.dirname(fileURLToPath(import.meta.url)),ROOT=path.resolve(HERE,'../../../..');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=p=>fs.readFile(path.join(ROOT,p));
const generated=JSON.parse(await fs.readFile(path.join(HERE,'provenance/generation-register.json'),'utf8'));
const protectedInputs=JSON.parse(await fs.readFile(path.join(HERE,'provenance/protected-inputs.json'),'utf8'));
for(const p of protectedInputs)if(sha(await read(p.path))!==p.sha256)throw Error('Protected file changed: '+p.path);
for(const e of generated){
 const b=await read(e.target),original=await fs.readFile(e.source),m=await sharp(b).metadata();
 if(sha(b)!==sha(original))throw Error('Generated pixels changed: '+e.id);
 if(m.format!=='png')throw Error('Expected PNG: '+e.id);
 if(e.transparent&&!m.hasAlpha)throw Error('Missing genuine alpha: '+e.id);
 e.sha256=sha(b);e.originalSha256=sha(original);e.dimensions=[m.width,m.height];e.hasAlpha=m.hasAlpha;
 e.tool='built-in image_gen';e.model='not exposed';e.status='adopted';
 e.references=[];
 for(const p of e.refs)e.references.push({path:p,sha256:sha(await read(p))});
}
// A derivative crop is an indexed face reference, not a new model-generated image.
await sharp(await read(ASSETS.hrEdit)).extract({left:230,top:115,width:540,height:540}).resize(512,512).png().toFile(path.join(ROOT,ASSETS.hrPortrait));
const hrefs={},registry=[];
for(const[id,p]of Object.entries(ASSETS)){
 const b=await read(p),m=await sharp(b).metadata(),entry=generated.find(x=>x.target===p);
 hrefs[id]='data:image/png;base64,'+b.toString('base64');
 registry.push({id,path:p,sha256:sha(b),width:m.width,height:m.height,hasAlpha:m.hasAlpha,
  kind:entry?'imagegen':id==='hrPortrait'?'derived-portrait':'reused',
  ...(id==='hrPortrait'?{source:ASSETS.hrEdit,crop:{left:230,top:115,width:540,height:540},output:[512,512]}:{}),
  shots:id.startsWith('lunch')||id.startsWith('meeting')&&!id.startsWith('manager')||id.startsWith('evening')?['S04-02']:id.startsWith('collab')||id.startsWith('traditional')?['S04-03','S04-04']:id.startsWith('manager')||id==='room'?['S04-09','S04-10']:id.startsWith('hr')?['S04-11','S04-12','S04-13']:id.startsWith('company')||id==='agent'?['S04-05','S04-06','S04-07','S04-08']:['shared-support']});
}
await fs.mkdir(path.join(HERE,'compositions'),{recursive:true});
const frames=[];
for(const[name,info]of Object.entries(SCENES))for(let state=0;state<info.states;state++){
 const svg=root(scene(name,hrefs,state)),b=await sharp(Buffer.from(svg)).png().toBuffer();
 const filename=name+'-'+state;
 await fs.writeFile(path.join(HERE,'compositions',filename+'.png'),b);
 frames.push({name,state,label:info.label,path:path.relative(ROOT,path.join(HERE,'compositions',filename+'.png')),sha256:sha(b),dimensions:[1920,1080]});
}
const selected=[['parallel',0],['parallel',2],['performance',0],['performance',1],['competition',3],['board',3],['hr',1],['hr',3]];
const cells=[];
for(let i=0;i<selected.length;i++){const[n,s]=selected[i],b=await fs.readFile(path.join(HERE,'compositions',n+'-'+s+'.png'));cells.push({input:await sharp(b).resize(768,432).png().toBuffer(),left:i%2*768,top:Math.floor(i/2)*432});}
await sharp({create:{width:1536,height:1728,channels:3,background:'#e9e2d5'}}).composite(cells).png().toFile(path.join(HERE,'compositions/contact.png'));
// Alpha verification against both art backgrounds; never alters the adopted sources.
for(const shade of ['light','dark']){
 const cells=[];let i=0;
 for(const id of ['managerReady','managerStrike','managerWrite','companyA','companyB','companyC']){
  const b=await sharp(await read(ASSETS[id])).resize(320,480,{fit:'contain',background:shade==='light'?'#f6f1e7':'#253443'}).flatten({background:shade==='light'?'#f6f1e7':'#253443'}).png().toBuffer();
  cells.push({input:b,left:i%3*320,top:Math.floor(i/3)*480});i++;
 }
 await sharp({create:{width:960,height:960,channels:3,background:shade==='light'?'#f6f1e7':'#253443'}}).composite(cells).png().toFile(path.join(HERE,'provenance','alpha-'+shade+'.png'));
}
for(const d of COMPETITION_STATES){if(Math.abs(d.weights.reduce((a,b)=>a+b,0)-1)>1e-9)throw Error('Market total must remain 1');}
const layout={version:'S04_ART v0.3',stage:'art-and-representative-compositions',...LAYOUT,registry,frames,
 generated:20,derived:1,reused:4,newAnimation:false,newRuntimeCaptions:false,newFilmBuild:false};
await fs.writeFile(path.join(HERE,'layout.json'),JSON.stringify(layout,null,2)+'\n');
await fs.writeFile(path.join(HERE,'provenance/generation-register.json'),JSON.stringify(generated,null,2)+'\n');
const html=`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>04 · 新故事美术与构图</title><style>*{box-sizing:border-box}body{margin:0;background:#e8e3d9;color:#293c49;font:16px/1.6 system-ui}main{max-width:1600px;margin:auto;padding:16px}h1{font-size:24px;margin:0 0 12px}p{color:#6b7a80;margin:10px 0}#stage{overflow:hidden;border-radius:12px;box-shadow:0 8px 26px #27384924;background:#f6f1e7;line-height:0}#stage svg{display:block;width:100%;height:auto}nav,.controls{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}button{font:inherit;padding:7px 13px;border:1px solid #beb4a1;border-radius:8px;background:#faf7f0;color:#293c49;cursor:pointer}button[aria-pressed=true]{background:#d4e3de;border-color:#87a69e}.controls{align-items:center}#status{min-width:240px}a{color:#675940;margin-right:20px}.gallery{display:grid;grid-template-columns:repeat(2,minmax(200px,1fr));gap:14px}figure{margin:0;background:#faf7f0;border-radius:8px;overflow:hidden}.gallery img{width:100%;display:block}figcaption{padding:6px 12px}.scope{font-size:14px}h2{font-size:20px}</style><main><h1>04 · 新故事美术与分层构图</h1><div id="stage" aria-label="04美术代表构图"></div><nav>${Object.entries(SCENES).map(([k,v])=>`<button data-scene="${k}" aria-pressed="${k==='parallel'}">${v.label}</button>`).join('')}</nav><div class="controls"><button id="previous">上一态</button><button id="next">下一态</button><button id="motion" aria-pressed="false">循环查看关键态</button><label><input id="safe" type="checkbox">显示字幕安全区</label><output id="status"></output></div><p class="scope">20张新增绘稿、可编辑图层与动作前后态。当前为美术检查，正式55秒动态、字幕及全片尚未更新。</p><a href="README.md">素材说明</a><a href="screen-copy.json">画面文字</a><a href="layout.json">图层与素材清单</a><a href="../../../actions/04/provenance/storyboard-v03/chapter-plan.md">14镜分镜</a><h2>代表构图</h2><div class="gallery">${selected.map(([n,s])=>`<figure><img loading="lazy" src="compositions/${n}-${s}.png" alt="${SCENES[n].label}第${s+1}态"><figcaption>${SCENES[n].label} · ${s+1}</figcaption></figure>`).join('')}</div></main><script type="module" src="player.mjs"></script></html>`;
await fs.writeFile(path.join(HERE,'preview.html'),html);
await fs.writeFile(path.join(HERE,'provenance/verification.json'),JSON.stringify({
 phase:'art',modelCalls:20,adoptedGeneratedPngs:generated.length,derivedPortraits:1,reusedAssets:4,registeredAssets:registry.length,compositions:frames.length,
 protectedFilesBytePreserved:protectedInputs.length,sourceCopiesByteIdentical:true,genuineAlphaOnSixIsolatedAssets:true,
 marketStatesNormalized:true,canvas:[1920,1080],nominalChapterFrames:1650,
 browserChecked:false,visualReview:'pending-compositions',newVideo:false,newAudio:false,newRuntime:false,
 command:'node arts/static/04/story-assets-v03/build.mjs'},null,2)+'\n');
console.log(JSON.stringify({generated:generated.length,assets:registry.length,compositions:frames.length,protectedFiles:protectedInputs.length}));
