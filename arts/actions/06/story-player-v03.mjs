import {createRenderer} from '../film/scenes.mjs';
import {CHAPTERS} from '../film/timeline.mjs';
import {BEATS,ASSETS,CONFIG} from './story-scene-v03.mjs';
const $=id=>document.getElementById(id),url=p=>new URL('../../'+p.replace(/^arts\//,''),import.meta.url).href;
const chapter=CHAPTERS.find(c=>c.id==='06'),data=await(await fetch('../film/bundle-v01.json')).json(),render=createRenderer(data,url),lastFrame=CONFIG.frames-1;
let frame=0,playing=false,last=null,remainder=0;
const initial=Number(new URL(location.href).searchParams.get('t'));if(Number.isFinite(initial))frame=Math.max(0,Math.min(lastFrame,Math.round(initial*30)));
function show(){const r=render(chapter.startFrame+frame,{captions:$('captions').checked});$('screen').innerHTML=r.svg;$('time').value=frame;$('clock').textContent=(frame/30).toFixed(2)+' / 58.00 秒';$('beat').textContent=r.beat.name;$('screen').dataset.localFrame=frame;$('screen').dataset.beat=r.beat.id;}
function pause(){playing=false;last=null;$('play').textContent='播放';}
for(const b of BEATS){const button=document.createElement('button');button.textContent=b.name;button.onclick=()=>{pause();frame=Math.round(b.start*30);show();};$('beats').append(button);}
$('play').onclick=()=>{playing=!playing;if(playing&&frame===lastFrame)frame=0;last=null;$('play').textContent=playing?'暂停':'播放';};
$('time').oninput=e=>{pause();frame=+e.target.value;show();};
$('captions').onchange=show;$('restart').onclick=()=>{pause();frame=0;show();};
document.addEventListener('keydown',e=>{if(['INPUT','BUTTON'].includes(document.activeElement.tagName))return;if(e.code==='Space'){e.preventDefault();$('play').click();}if(e.code==='ArrowLeft'||e.code==='ArrowRight'){e.preventDefault();pause();frame=Math.max(0,Math.min(lastFrame,frame+(e.code==='ArrowRight'?1:-1)));show();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
try{await Promise.all(Object.values(ASSETS).map(p=>new Promise((ok,no)=>{const im=new Image();im.onload=ok;im.onerror=()=>no(Error(p));im.src=url(p);})));
 $('loading').hidden=true;$('play').disabled=false;show();
}catch(e){$('loading').textContent='素材加载失败：'+e.message;throw e;}
function tick(now){if(playing){if(last!==null){remainder+=(now-last)*30/1000;const step=Math.floor(remainder);remainder-=step;if(step){frame+=step;if(frame>lastFrame){if($('loop').checked)frame%=CONFIG.frames;else{frame=lastFrame;pause();}}show();}}last=now;}else remainder=0;requestAnimationFrame(tick);}
requestAnimationFrame(tick);
