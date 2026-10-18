import {createRenderer} from '../film/scenes.mjs';
import {BEATS} from './story-scene-v04.mjs';
const $=id=>document.getElementById(id),url=p=>new URL('../../'+p.replace(/^arts\//,''),import.meta.url).href;
const data=await(await fetch('../film/bundle-v01.json')).json(),render=createRenderer(data,url);
let frame=0,playing=false,last=null,hiddenCaptions=false;
const initial=Number(new URL(location.href).searchParams.get('t'));if(Number.isFinite(initial))frame=Math.min(1139,Math.max(0,Math.round(initial*30)));
function show(){const r=render(1350+frame,{captions:!hiddenCaptions});$('screen').innerHTML=r.svg;$('time').value=frame;$('clock').textContent=(frame/30).toFixed(2)+' / 38.00 秒';$('beat').textContent=r.beat.name;$('screen').dataset.localFrame=frame;}
function pause(){playing=false;last=null;$('play').textContent='播放';}
for(const b of BEATS){const button=document.createElement('button');button.textContent=b.name;button.onclick=()=>{pause();frame=Math.round(b.start*30);show();};$('beats').append(button);}
$('play').onclick=()=>{playing=!playing;last=null;$('play').textContent=playing?'暂停':'播放';};
$('time').oninput=e=>{pause();frame=+e.target.value;show();};
$('captions').onchange=e=>{hiddenCaptions=!e.target.checked;show();};
$('restart').onclick=()=>{pause();frame=0;show();};
document.addEventListener('keydown',e=>{if(['INPUT','BUTTON'].includes(document.activeElement.tagName))return;if(e.code==='Space'){e.preventDefault();$('play').click();}if(e.code==='ArrowLeft'||e.code==='ArrowRight'){pause();frame=Math.max(0,Math.min(1139,frame+(e.code==='ArrowRight'?1:-1)));show();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
let paths=[...new Set(Object.values(data.registries['02']).map(a=>a.path))];
await Promise.all(paths.map(p=>new Promise((ok,no)=>{const im=new Image();im.onload=ok;im.onerror=()=>no(Error(p));im.src=url(p);})));
$('loading').hidden=true;$('play').disabled=false;show();
let remainder=0;
function tick(now){if(playing){if(last!==null){remainder+=(now-last)*30/1000;const step=Math.floor(remainder);remainder-=step;if(step){frame+=step;if(frame>1139){if($('loop').checked)frame%=1140;else{frame=1139;pause();}}show();}}last=now;}else remainder=0;requestAnimationFrame(tick);}
requestAnimationFrame(tick);
