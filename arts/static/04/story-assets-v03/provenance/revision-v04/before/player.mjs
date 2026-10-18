import {ASSETS,SCENES,root,scene} from './assets.mjs';
const stage=document.querySelector('#stage'),status=document.querySelector('#status');
const hrefs=Object.fromEntries(Object.entries(ASSETS).map(([id,p])=>[id,'../../../'+p.replace(/^arts\//,'')]));
await Promise.all(Object.values(hrefs).map(src=>new Promise((resolve,reject)=>{const im=new Image();im.onload=resolve;im.onerror=()=>reject(Error('Missing asset '+src));im.src=src;})));
let name='parallel',state=0,moving=false,last=0;
const names={study:['研究范围'],parallel:['用餐／会前输入／离席准备','餐具放下／输入／重新开电脑','操作电脑／抬眼／继续输入'],performance:['协作与传统编程','绩效A／M反馈与表情'],competition:['同为1年','甲先采用，3个月','乙丙普及，3个月','乙增加Agent，1个月'],board:['原白板／预备','划除接触','下行改写接触','新要求／收势'],hr:['选中旧要求','更严格的新要求','发布／初始简历','简历增加／新要求保留'],closing:['周期／标准接05']};
function draw(){let b=scene(name,hrefs,state);if(document.querySelector('#safe').checked)b+='<g data-layer="subtitle-safe"><rect x="40" y="997" width="1840" height="65" rx="10" fill="#263542" opacity=".45"/><text x="960" y="1040" text-anchor="middle" fill="#fff" font-size="32">字幕安全区</text></g>';stage.innerHTML=root(b);status.value=names[name][state]+' · '+(state+1)+'/'+SCENES[name].states;document.querySelectorAll('[data-scene]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.scene===name)));}
for(const el of document.querySelectorAll('[data-scene]'))el.onclick=()=>{name=el.dataset.scene;state=0;moving=false;document.querySelector('#motion').setAttribute('aria-pressed','false');draw();};
function step(d){state=(state+d+SCENES[name].states)%SCENES[name].states;draw();}
function stop(){moving=false;document.querySelector('#motion').setAttribute('aria-pressed','false');}
document.querySelector('#previous').onclick=()=>{stop();step(-1);};
document.querySelector('#next').onclick=()=>{stop();step(1);};
document.querySelector('#safe').onchange=draw;
document.querySelector('#motion').onclick=()=>{moving=!moving;document.querySelector('#motion').setAttribute('aria-pressed',String(moving));last=0;};
function loop(ms){if(moving&&ms-last>1100){step(1);last=ms;}requestAnimationFrame(loop);}draw();requestAnimationFrame(loop);
