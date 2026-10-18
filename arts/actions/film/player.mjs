import {CHAPTERS,FPS,TOTAL_FRAMES,DURATION,locateFrame,formatTime} from './timeline.mjs';
import {createRenderer,GLOBAL_BEATS} from './scenes.mjs';
const $=id=>document.getElementById(id),artUrl=p=>new URL('../../'+p.replace(/^arts\//,''),import.meta.url).href;
let frame=0,playing=false,anchor=null,rate=1,ready=false,render,chapterId=null,assetDrawn=false;
const initial=Number(new URL(location.href).searchParams.get('frame'));if(Number.isFinite(initial))frame=locateFrame(initial).frame;
function pause(){playing=false;anchor=null;$('play').textContent='播放';}
function setFrame(value){frame=locateFrame(value).frame;show();}
function show(){
 if(!ready)return;
 const result=render(frame,{captions:$('captions').checked}),c=result.chapter;
 $('screen').innerHTML=result.svg;
 $('seek').value=frame;$('clock').textContent=`${formatTime(frame===TOTAL_FRAMES-1?DURATION:result.time)} / ${formatTime(DURATION)}`;
 $('chapter-title').textContent=`${c.id} · ${c.title}`;$('shot').textContent=result.beat?.name||result.beat?.id||'';
 $('position').textContent=`本章 ${result.localTime.toFixed(2)} / ${c.duration.toFixed(2)}s · ${frame+1} / ${TOTAL_FRAMES} 帧`;
 if(chapterId!==c.id){
  chapterId=c.id;for(const button of $('chapters').children)button.setAttribute('aria-current',String(button.dataset.id===c.id));
  $('shot-select').replaceChildren(...GLOBAL_BEATS.filter(x=>x.chapterId===c.id).map(b=>{const o=new Option(`${b.id} · ${b.start.toFixed(1)}s${b.name?' · '+b.name:''}`,b.globalFrame);return o;}));
 }
 if(result.beat)$('shot-select').value=c.startFrame+Math.round(result.beat.start*FPS);
 // Public state lives in DOM for inspection and frame-based review links.
 $('screen').dataset.frame=String(frame);$('screen').dataset.chapter=c.id;$('screen').dataset.localFrame=String(result.localFrame);
}
for(const c of CHAPTERS){const b=document.createElement('button');b.dataset.id=c.id;b.innerHTML=`<b>${c.id} · ${c.title}</b><small>${formatTime(c.start)}—${formatTime(c.end)}</small>`;b.onclick=()=>{pause();setFrame(c.startFrame)};$('chapters').append(b);}
for(const c of CHAPTERS){const mark=document.createElement('span');mark.style.left=`${c.startFrame/TOTAL_FRAMES*100}%`;mark.textContent=formatTime(c.start);$('marks').append(mark);}
for(const c of CHAPTERS.slice(1)){const b=document.createElement('button');b.textContent=`${String(Number(c.id)-1).padStart(2,'0')} → ${c.id}`;b.onclick=()=>{pause();$('loop').checked=false;setFrame(c.startFrame-30);playing=true;anchor=null;$('play').textContent='暂停';previewEnd=c.startFrame+60};$('seams').append(b);}
let previewEnd=null;
$('play').onclick=()=>{if(!ready)return;if(playing)pause();else{if(frame===TOTAL_FRAMES-1)frame=0;playing=true;anchor=null;previewEnd=null;$('play').textContent='暂停';}};
$('seek').oninput=e=>{pause();previewEnd=null;setFrame(Number(e.target.value));};
$('restart').onclick=()=>{pause();previewEnd=null;setFrame(0);};
$('previous').onclick=()=>{pause();setFrame([...GLOBAL_BEATS].reverse().find(b=>b.globalFrame<frame)?.globalFrame||0);};
$('next').onclick=()=>{pause();setFrame(GLOBAL_BEATS.find(b=>b.globalFrame>frame)?.globalFrame??TOTAL_FRAMES-1);};
$('shot-select').onchange=e=>{pause();setFrame(Number(e.target.value));};
$('speed').onchange=e=>{rate=Number(e.target.value);anchor=null;};
$('captions').onchange=show;$('loop').onchange=()=>{anchor=null;previewEnd=null;};
$('fullscreen').onclick=()=>{const p=document.querySelector('.screen-wrap');if(document.fullscreenElement)document.exitFullscreen();else p.requestFullscreen();};
document.addEventListener('keydown',e=>{if(['INPUT','SELECT','BUTTON'].includes(document.activeElement.tagName))return;if(e.code==='Space'){e.preventDefault();$('play').click();}else if(e.code==='ArrowLeft'||e.code==='ArrowRight'){e.preventDefault();pause();setFrame(frame+(e.code==='ArrowRight'?1:-1)*(e.shiftKey?30:1));}});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
function tick(now){
 if(playing&&ready){
  if(!anchor)anchor={time:now,frame};
  let next=anchor.frame+Math.floor((now-anchor.time)*rate*FPS/1000);
  if($('loop').checked){const c=locateFrame(anchor.frame).chapter;next=c.startFrame+(next-c.startFrame)%c.frames;}
  if(previewEnd!==null&&next>=previewEnd){next=previewEnd;previewEnd=null;pause();}
  if(next>=TOTAL_FRAMES){next=TOTAL_FRAMES-1;pause();}
  if(next!==frame)setFrame(next);
 }
 requestAnimationFrame(tick);
}
function fail(error){pause();$('loading').hidden=true;$('error').hidden=false;$('error').textContent=`素材加载失败：${error.message}`;$('ready').textContent='加载未完成';console.error(error);}
async function start(){
 const [data,assets]=await Promise.all(['bundle-v01.json','assets-v01.json'].map(async p=>{const r=await fetch(new URL(p,import.meta.url));if(!r.ok)throw Error(`${p}: HTTP ${r.status}`);return r.json();}));
 render=createRenderer(data,artUrl);let loaded=0;
 // Cache images before chapter changes, including the chapters whose MP4s are absent locally.
 const pending=[...assets.assets];await Promise.all(Array.from({length:6},async()=>{while(pending.length){const a=pending.shift();await new Promise((ok,no)=>{const im=new Image();im.onload=ok;im.onerror=()=>no(Error(a.path));im.src=artUrl(a.path);});loaded++;$('loading').textContent=`正在准备素材 ${loaded} / ${assets.assets.length}`;}}));
 ready=true;$('play').disabled=false;$('loading').hidden=true;$('ready').textContent=`六章已就绪 · ${assets.assets.length}项共用／专用素材`;$('asset-count').textContent=`· ${assets.assets.length}项`;
 function drawAssets(){
  const pick=$('asset-filter').value;$('asset-grid').replaceChildren();
  for(const a of assets.assets.filter(a=>pick==='all'||a.chapters.includes(pick))){const el=document.createElement('article');el.className='asset';const im=new Image();im.loading='lazy';im.src=artUrl(a.path);im.alt=a.ids.join(' / ');const title=document.createElement('strong');title.textContent=`${a.kind} · ${a.chapters.join(' / ')}`;const name=document.createElement('p');name.textContent=a.ids.join(' / ');const link=document.createElement('a');link.href=artUrl(a.path);link.target='_blank';link.rel='noopener';link.textContent=`${a.width} × ${a.height} · 原素材`;el.append(im,title,name,link);$('asset-grid').append(el);}
 }
 $('resources').ontoggle=()=>{if($('resources').open&&!assetDrawn){drawAssets();assetDrawn=true;}};$('asset-filter').onchange=drawAssets;
 show();requestAnimationFrame(tick);
}
start().catch(fail);
