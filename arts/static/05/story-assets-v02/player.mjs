import {ASSETS,SCENES,LAYOUT,scene,root} from './assets.mjs';
const $=s=>document.getElementById(s),h=Object.fromEntries(Object.entries(ASSETS).map(([k,p])=>[k,new URL('../../../'+p.replace(/^arts\//,''),import.meta.url).href]));
let name='delivery',state=0,cycling=false,last=0;
function show(){let b=scene(name,h,state,{signs:$('signs').checked,feedback:$('feedback').checked});if($('safe').checked)b+=`<rect x="40" y="994" width="1840" height="70" fill="#b1ddcb" fill-opacity=".5"/><text x="960" y="1040" text-anchor="middle" font-family="sans-serif" font-size="28" fill="#2b6552">字幕安全区（检查层）</text>`;$('stage').innerHTML=root(b);$('stage').dataset.scene=name;$('stage').dataset.state=state;$('status').value=SCENES[name].label+' · '+(state+1)+' / '+SCENES[name].states;for(const button of document.querySelectorAll('[data-scene]'))button.setAttribute('aria-pressed',String(button.dataset.scene===name));}
for(const button of document.querySelectorAll('[data-scene]'))button.onclick=()=>{name=button.dataset.scene;state=0;show();};
$('prev').onclick=()=>{state=(state+SCENES[name].states-1)%SCENES[name].states;show();};$('next').onclick=()=>{state=(state+1)%SCENES[name].states;show();};
$('cycle').onclick=()=>{cycling=!cycling;$('cycle').setAttribute('aria-pressed',String(cycling));$('cycle').textContent=cycling?'暂停关键态':'循环查看关键态';last=performance.now();};
for(const id of ['signs','feedback','safe'])$(id).onchange=show;
try{await Promise.all(Object.values(h).map(url=>new Promise((ok,no)=>{const im=new Image();im.onload=ok;im.onerror=()=>no(Error(url));im.src=url;})));show();}catch(e){$('error').hidden=false;$('error').textContent='素材加载失败：'+e.message;throw e;}
function tick(now){if(cycling&&now-last>=1500){last=now;state=(state+1)%SCENES[name].states;show();}requestAnimationFrame(tick);}requestAnimationFrame(tick);
