import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {ACTIONS,BEATS,LAYOUT,sampleScene,definitions,drawPose,renderScene} from './whole-motion.mjs';
import {rootSvg,label} from '../../characters/rigs/runtime/rig.mjs';
import {TRACKS,CALIBRATION} from './keyframes.mjs';
const DIR=path.dirname(fileURLToPath(import.meta.url)),ROOT=path.resolve(DIR,'../../..');
const read=p=>fs.readFileSync(path.join(ROOT,p));
const json=p=>JSON.parse(read(p));
const uri=(p,mime)=>'data:'+mime+';base64,'+read(p).toString('base64');
const bundle={version:'S01_WHOLE_PREVIEW v0.3',poses:{},assets:{},layout:LAYOUT,diagramPanels:json('arts/static/01/diagram-panels-v01.json')};
const sources=json('arts/characters/poses/01/manifest-v02.json');
for(const a of sources.assets)bundle.poses[a.id]={dataUri:uri(a.path,'image/png')};
for(const tone of ['night','day'])bundle.assets['room-'+tone]={dataUri:uri('arts/backgrounds/01/workroom-'+tone+'-v01.png','image/png'),width:1672,height:941};
for(const a of json('arts/static/01/native-assets-v01.json')){
 if(a.id==='logic-panel')continue;
 bundle.assets[a.id]={dataUri:uri(a.path,'image/svg+xml'),width:a.size[0],height:a.size[1]};
}
bundle.assets['chair-back-rear']={dataUri:uri('arts/items/01/chair-back-rear-v02.svg','image/svg+xml'),width:340,height:480};
fs.writeFileSync(path.join(DIR,'bundle-whole-v01.json'),JSON.stringify(bundle));
fs.writeFileSync(path.join(DIR,'layout-whole-v01.json'),JSON.stringify(LAYOUT,null,2)+'\n');
let contact='';
for(const [i,a] of sources.assets.entries()){
 const q={id:a.id,x:220,baseline:690};
 contact+='<g transform="translate('+i%3*440+' '+Math.floor(i/3)*750+')">'+label(20,35,a.id,22)+drawPose(q)+'</g>';
}
const sheetHeight=Math.ceil(sources.assets.length/3)*750;
fs.writeFileSync(path.join(DIR,'contact-sheet-whole-v02.svg'),rootSvg('<rect width="1320" height="'+sheetHeight+'" fill="#F6F1E7"/>'+contact,definitions({...bundle,assets:{}}),1320,sheetHeight));
const frames=[];for(let frame=0;frame<=45*30;frame++)frames.push({frame,...sampleScene(frame/30)});
fs.writeFileSync(path.join(DIR,'scene-whole-30fps-v02.json'),JSON.stringify({version:bundle.version,fps:30,kind:'pose selection and interpolated whole-figure transforms; not raster frames',frames}));
fs.writeFileSync(path.join(DIR,'keyframe-tracks-v01.json'),JSON.stringify({version:bundle.version,tracks:TRACKS,calibration:CALIBRATION},null,2)+'\n');
const stills=[['assembly-night-whole-v01',0],['assembly-day-whole-v01',12],['rise-whole-v01',3.8],['logic-whole-v01',20],['workflow-whole-v01',30],['queue-whole-v01',41],['receive-file-whole-v01',2.3],['inspect-file-whole-v01',3],['return-file-whole-v01',10.3]];
for(const [name,t] of stills){
 const state=sampleScene(t),ids=[state.programmer?.id,state.agent.id].filter(Boolean);
 const active={...bundle,poses:Object.fromEntries(ids.map(id=>[id,bundle.poses[id]]))};
 fs.writeFileSync(path.join(DIR,name+'.svg'),renderScene(state,active));
}
const files=[];
for(const folder of ['arts/characters/poses/01','arts/actions/01'])for(const name of fs.readdirSync(path.join(ROOT,folder))){
 const p=path.join(folder,name);if(!fs.statSync(path.join(ROOT,p)).isFile()||name.startsWith('manifest')||name.includes('bundle-v01')||name.includes('contact-sheet-v01')||name==='scene-poses-12fps-v01.json')continue;
 files.push({path:p,sha256:crypto.createHash('sha256').update(read(p)).digest('hex')});
}
const manifest={version:bundle.version,codeAuthor:'Codex; human explicitly authorized this preview',imageTool:'image_gen.imagegen',poseAssets:sources.assets.length,keyframeTracks:TRACKS,actions:ACTIONS,beats:BEATS,sceneSamples:frames.length,sampleFps:30,rasterFrames:0,mp4:false,claudeCode:false,priorRigStatus:'rejected visually by human; not active',limitations:['finite complete cel poses; pose changes remain discrete','three walking drawings plus turn; not full anatomical gait interpolation','30fps is root/prop state sampling, not 30 newly drawn cels per second','no voice timing or Remotion composition','keyboard alignment checked visually, no measured finger contact'],stills,files};
fs.writeFileSync(path.join(DIR,'manifest-whole-v01.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({completePoses:sources.assets.length,actions:ACTIONS.length,sceneSamples:frames.length,stills:stills.length,mp4:false}));
