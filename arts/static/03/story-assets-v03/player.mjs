import {ASSETS,scene,root} from './assets.mjs';
const hrefs=Object.fromEntries(Object.entries(ASSETS).map(([id,p])=>[id,new URL('../../../'+p.replace(/^arts\//,''),import.meta.url).href]));
await Promise.all(Object.values(hrefs).map(p=>new Promise((ok,no)=>{const im=new Image();im.onload=ok;im.onerror=()=>no(Error(p));im.src=p;})));
let name='reply',state=0,hidden=[];
function paint(){document.querySelector('#stage').innerHTML=root(scene(name,hrefs,{state,hidden}));document.querySelectorAll('[data-scene]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.scene===name)));}
document.querySelectorAll('[data-scene]').forEach(b=>b.onclick=()=>{name=b.dataset.scene;paint();});
document.querySelector('#alternate').onclick=()=>{state=1-state;if(name!=='neighbors')name='neighbors';paint();};
document.querySelectorAll('[data-hide]').forEach(input=>input.onchange=()=>{hidden=[...document.querySelectorAll('[data-hide]:not(:checked)')].map(e=>e.dataset.hide);paint();});
paint();
