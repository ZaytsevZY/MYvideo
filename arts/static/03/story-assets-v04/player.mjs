import {ASSETS,root,scene} from './assets.mjs';
const stage=document.querySelector('#stage'),seek=document.querySelector('#seek'),status=document.querySelector('#status'),play=document.querySelector('#play'),motion=document.querySelector('#motion');
const hrefs=Object.fromEntries(Object.entries(ASSETS).map(([id,p])=>[id,'../../../'+p.replace(/^arts\//,'')]));
await Promise.all(Object.values(hrefs).map(src=>new Promise(resolve=>{const i=new Image();i.onload=resolve;i.onerror=resolve;i.src=src;})));
let name='reply',t=14,playing=false,local=false,previous=0,lastKey='';
function shot(t){if(t<9.1)return'exchange';if(t<13)return'completed';if(t<19.5)return'reply';if(t<19.67)return'turn';if(t<20)return'look';if(t<23)return'neighbors';if(t<23.17)return'look';if(t<23.33)return'turn';if(t<30.5)return'typing';return'tree';}
function draw(state=0){const key=name+':'+state;if(key!==lastKey){stage.innerHTML=root(scene(name,hrefs,{state}));lastKey=key;}document.querySelectorAll('[data-scene]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.scene===name));}
document.querySelectorAll('[data-scene]').forEach(b=>b.onclick=()=>{playing=false;play.textContent='播放39秒构图预演';name=b.dataset.scene;t=({exchange:2,completed:11,reply:14,turn:19.5,look:19.8,neighbors:21,typing:27,tree:34})[name];seek.value=t;status.value=t.toFixed(2)+' / 39.00';lastKey='';draw();});
play.onclick=()=>{playing=!playing;local=false;motion.setAttribute('aria-pressed','false');if(playing)t=0;play.textContent=playing?'暂停':'播放39秒构图预演';};
motion.onclick=()=>{local=!local;playing=false;play.textContent='播放39秒构图预演';motion.setAttribute('aria-pressed',String(local));};
seek.oninput=()=>{t=+seek.value;playing=false;name=shot(t);draw();status.value=t.toFixed(2)+' / 39.00';};
function loop(ms){const dt=previous?Math.min((ms-previous)/1000,.1):0;previous=ms;
 if(playing){t=Math.min(39,t+dt);name=shot(t);seek.value=t;status.value=t.toFixed(2)+' / 39.00';if(t>=39){playing=false;play.textContent='播放39秒构图预演';}}
 const active=playing||local,phase=Math.floor((playing?t:ms/1000)*4)%4;
 draw(active&&['typing','completed','neighbors'].includes(name)&&[1,2].includes(phase)?1:0);requestAnimationFrame(loop);}
draw();requestAnimationFrame(loop);
