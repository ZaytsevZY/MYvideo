import {ART,DURATION,definitions,render} from './scene-layered-v03.mjs';
const svg=document.querySelector('#layered-stage'),body=svg.querySelector('#scene-content'),slider=document.querySelector('#time'),clock=document.querySelector('#clock'),play=document.querySelector('#play');
let seconds=0,playing=false,last=null,raf=null,hidden=[];
const hrefs=Object.fromEntries(Object.entries(ART).map(([k,p])=>[k,new URL(p,import.meta.url).href]));
await Promise.all(Object.values(hrefs).map(src=>new Promise((resolve,reject)=>{const image=new Image();image.onload=resolve;image.onerror=()=>reject(Error('Cannot load '+src));image.src=src;})));
svg.querySelector('defs').innerHTML=definitions(hrefs);
function paint(){body.innerHTML=render(seconds,{hidden});slider.value=seconds;clock.textContent=seconds.toFixed(1)+' / '+DURATION.toFixed(1)+' 秒';}
function frame(now){if(!playing){raf=null;last=null;return;}if(last!==null)seconds=(seconds+(now-last)/1000)%DURATION;last=now;paint();raf=requestAnimationFrame(frame);}
function setPlaying(value){playing=value;play.textContent=playing?'暂停':'播放';if(playing&&raf===null)raf=requestAnimationFrame(frame);if(!playing){last=null;if(raf!==null)cancelAnimationFrame(raf);raf=null;}}
play.addEventListener('click',()=>setPlaying(!playing));
slider.addEventListener('input',()=>{setPlaying(false);seconds=+slider.value;paint();});
document.querySelectorAll('[data-time]').forEach(button=>button.addEventListener('click',()=>{setPlaying(false);seconds=+button.dataset.time;paint();}));
document.querySelectorAll('[data-layer-toggle]').forEach(input=>input.addEventListener('change',()=>{hidden=[...document.querySelectorAll('[data-layer-toggle]:not(:checked)')].map(e=>e.dataset.layerToggle);paint();}));
document.addEventListener('visibilitychange',()=>{if(document.hidden)setPlaying(false);});
document.querySelector('#loading').hidden=true;paint();setPlaying(!matchMedia('(prefers-reduced-motion: reduce)').matches);
