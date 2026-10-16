import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import crypto from 'node:crypto';
import {createDefinitions,rootSvg,drawCharacter,localToWorld,dist} from '../../characters/rigs/runtime/rig.mjs';
import {ACTIONS,BEATS,STAGE_OVERRIDES,sampleAction,sampleScene,renderPose} from './motion.mjs';
const DIR=path.dirname(fileURLToPath(import.meta.url)),ROOT=path.resolve(DIR,'../../..');
const readJson=p=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const dataUri=(p,mime)=>'data:'+mime+';base64,'+fs.readFileSync(path.join(ROOT,p)).toString('base64');
const bundle={version:'S01_RIG_TRIAL v0.1',config:{},characters:{},assets:{}};
for(const id of ['programmer','agent']){
 const dir='arts/characters/rigs/'+id;
 bundle.config[id]=readJson(dir+'/rig-v01.json');
 bundle.characters[id]={meta:readJson(dir+'/atlas-v01.json'),dataUri:dataUri(dir+'/atlas-v01.png','image/png')};
 const meta=bundle.characters[id].meta;
 fs.mkdirSync(path.join(ROOT,dir,'parts'),{recursive:true});
 for(const [name,info] of Object.entries(meta.parts)){
  const b=info.visibleBounds;
  const out='<svg xmlns="http://www.w3.org/2000/svg" viewBox="'+b.join(' ')+'" width="'+b[2]+'" height="'+b[3]+'"><title>'+id+' '+name+'</title><image href="'+bundle.characters[id].dataUri+'" width="'+meta.imageSize[0]+'" height="'+meta.imageSize[1]+'"/></svg>';
  fs.writeFileSync(path.join(ROOT,dir,'parts',name+'-v01.svg'),out);
 }
}
for(const [name,filename] of [['room-night','workroom-night-v01.png'],['room-day','workroom-day-v01.png']])bundle.assets[name]={dataUri:dataUri('arts/backgrounds/01/'+filename,'image/png'),width:1672,height:941};
const native=readJson('arts/static/01/native-assets-v01.json');
for(const asset of native){
 if(asset.id==='logic-panel')continue; // panels are deliberately not imported into the action stage
 bundle.assets[asset.id]={dataUri:dataUri(asset.path,'image/svg+xml'),width:asset.size[0],height:asset.size[1]};
}
fs.writeFileSync(path.join(DIR,'bundle-v01.json'),JSON.stringify(bundle));
fs.writeFileSync(path.join(DIR,'stage-overrides-v01.json'),JSON.stringify(STAGE_OVERRIDES,null,2)+'\n');
fs.mkdirSync(path.join(DIR,'clips'),{recursive:true});fs.mkdirSync(path.join(DIR,'keyposes'),{recursive:true});
let sampled=0,contactMax=0,contactSamples=0,unreachable=0,contactSheet='';
const clipManifest=[];
function verifyPose(p){
 for(const a of Object.values(p.arms))if(a.unreachable)unreachable++;
 for(const c of p.contacts){
  const error=dist(localToWorld(p,c.palmLocal),c.target);
  contactMax=Math.max(error,contactMax);contactSamples++;
  if(error>.05)throw Error('Keyboard palm contact error: '+error);
 }
}
for(let i=0;i<ACTIONS.length;i++){
 const action=ACTIONS[i],frames=[],count=Math.ceil(action.duration*12);
 for(let frame=0;frame<=count;frame++){
  const t=Math.min(frame/12,action.duration),s=sampleAction(action.id,t,bundle.config);
  verifyPose(s.pose);frames.push({frame,time:t,pose:s.pose});sampled++;
 }
 const clip={version:'S01_RIG_TRIAL v0.1',fps:12,action,frames};
 fs.writeFileSync(path.join(DIR,'clips',action.id+'-v01.json'),JSON.stringify(clip));
 const at=action.kind==='rise'||action.kind==='sit'?.5:action.kind==='receive'||action.kind==='report'?.5:action.kind==='exit'||action.kind==='return'?.45:.55;
 const pose=sampleAction(action.id,action.duration*at,bundle.config).pose;
 const poseBundle={...bundle,characters:{[action.actor]:bundle.characters[action.actor]},assets:{}},defs=createDefinitions(poseBundle);
 fs.writeFileSync(path.join(DIR,'keyposes',action.id+'-v01.svg'),renderPose(pose,bundle,{defs}));
 const col=i%4,row=Math.floor(i/4),x=col*600,y=row*640;
 const copy={...pose,root:[300,355],scale:.72};
 contactSheet+='<g transform="translate('+x+' '+y+')"><text x="22" y="36" font-size="28" fill="#263342">'+action.id+' '+action.name+'</text>'+drawCharacter(copy,bundle.config,'all',false)+'</g>';
 clipManifest.push({...action,sampleCount:frames.length,keypose:'keyposes/'+action.id+'-v01.svg',clip:'clips/'+action.id+'-v01.json'});
}
const charDefs=createDefinitions({...bundle,assets:{}});
fs.writeFileSync(path.join(DIR,'contact-sheet-v01.svg'),rootSvg('<rect width="2400" height="2560" fill="#F6F1E7"/>'+contactSheet,charDefs,2400,2560,'01角色动作关键姿态'));
const sceneFrames=[];
for(let frame=0;frame<=45*12;frame++){
 const state=sampleScene(frame/12,bundle.config);verifyPose(state.programmer);verifyPose(state.agent);
 sceneFrames.push({frame,time:frame/12,beat:state.beat.id,programmer:state.programmer,agent:state.agent,day:state.day});
}
fs.writeFileSync(path.join(DIR,'scene-poses-12fps-v01.json'),JSON.stringify({version:'S01_RIG_TRIAL v0.1',fps:12,seconds:45,frames:sceneFrames}));
const files=[];
for(const folder of [path.join(ROOT,'arts/characters/rigs'),DIR]){
 function walk(dir){
  for(const ent of fs.readdirSync(dir,{withFileTypes:true})){
   const p=path.join(dir,ent.name);
   if(ent.isDirectory())walk(p);
   else if(!ent.name.startsWith('manifest-')&&!ent.name.startsWith('claude-result-')){
    files.push({path:path.relative(ROOT,p),bytes:fs.statSync(p).size,sha256:hash(p)});
   }
  }
 }
 walk(folder);
}
const manifest={version:'S01_RIG_TRIAL v0.1',date:'2026-10-15',codeAuthor:'Codex (user explicitly authorized this turn after Claude auth failure)',imageTool:'image_gen.imagegen',characters:2,sourceAtlasPartsPerCharacter:8,partWrapperSvgs:16,actions:clipManifest,isolatedPoseSamples:sampled,scenePoseSamples:sceneFrames.length,poseSampleFps:12,keyposeSvgs:13,contacts:{samples:contactSamples,maxErrorPixels:contactMax,unreachableArmSolutions:unreachable,scope:'calibrated palm anchors against keyboard; not finger motion or mouse reach'},mp4Rendered:false,rasterAnimationFramesExported:0,files};
fs.writeFileSync(path.join(DIR,'manifest-v01.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({characters:2,parts:16,actions:ACTIONS.length,isolatedPoseSamples:sampled,scenePoseSamples:sceneFrames.length,keyboardContactMaxErrorPixels:contactMax,unreachableArmSolutions:unreachable,mp4:false}));

