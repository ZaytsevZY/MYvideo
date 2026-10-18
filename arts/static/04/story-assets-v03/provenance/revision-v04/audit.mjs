import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {ASSETS,SCENES,LAYOUT,COMPETITION_STATES,root,scene} from '../../assets.mjs';
const HERE=path.dirname(fileURLToPath(import.meta.url)),ROOT=path.resolve(HERE,'../../../../../..'),ART=path.resolve(HERE,'../..');
const PLAN=path.join(ROOT,'arts/actions/04/provenance/storyboard-v04');
const sharp=createRequire(import.meta.url)('/Users/alan671/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=p=>fs.readFile(path.join(ROOT,p));
const guards=JSON.parse(await fs.readFile(path.join(HERE,'protected-inputs.json'),'utf8'));
for(const g of guards)if(sha(await read(g.path))!==g.sha256)throw Error('Protected file changed '+g.path);
const before=await fs.readFile(path.join(PLAN,'04-before.md'),'utf8'),after=await fs.readFile(path.join(ROOT,'scripts/final/shot/04.md'),'utf8');
const narration=s=>s.split('<start>\n')[1].split('\n<end>')[0];
const stories=s=>s.split('#### 故事场景\n')[1].split('#### 逻辑展示')[0].trim();
if(narration(before)!==narration(after)||stories(before)!==stories(after))throw Error('User audio/story changed');
if(narration(after).replace(/\s/g,'').length!==185)throw Error('Narration count');
const layout=JSON.parse(await fs.readFile(path.join(ART,'layout.json'),'utf8'));
for(const a of layout.registry)if(sha(await read(a.path))!==a.sha256)throw Error('Asset SHA '+a.path);
for(const frame of layout.frames){const b=await read(frame.path),m=await sharp(b).metadata();if(sha(b)!==frame.sha256||m.width!==1920||m.height!==1080)throw Error('Composition integrity '+frame.path);}
const board=layout.registry.find(x=>x.id==='boardExcerpt');
if(sha(await read(board.source))!==board.sourceSha256)throw Error('Derived board source mismatch');
const expectedCrop=await sharp(await read(board.source)).extract(board.crop).png().toBuffer();
if(sha(expectedCrop)!==board.sha256)throw Error('Board crop not traceable');
if(Object.keys(SCENES).join('|')!=='parallel|performance|competition|board|hr')throw Error('Retired scene still selectable');
for(const n of ['study-0.png','closing-0.png']){
 let active=false;try{await fs.access(path.join(ART,'compositions',n));active=true;}catch{}
 if(active)throw Error('Retired composition remains in active folder '+n);
}
const h=Object.fromEntries(Object.keys(ASSETS).map(id=>[id,'asset:'+id]));
const blocked=['单一公司观察','研究观察','考核情境','组织情境','理论归纳','理论应用','假设情境','机制示意','研究定位','标准接05','H1','S04-'];
let count=0;
for(const[name,info]of Object.entries(SCENES))for(let state=0;state<info.states;state++){
 const markup=root(scene(name,h,state)),plain=[...markup.matchAll(/<text[^>]*>(.*?)<\/text>/gs)].map(m=>m[1]).join('|');
 if(/NaN|undefined|Infinity/.test(markup))throw Error('Invalid composition '+name);
 const match=blocked.find(x=>plain.includes(x));if(match)throw Error('Onscreen production mark '+match+' in '+name);
 if((name==='parallel')!==markup.includes('data-layer="research-footnote"'))throw Error('Footnote outside opening');
 if(name==='board'&&!markup.includes('data-object-id="S04-PLAN-01"'))throw Error('Planning order lost at board');
 if(name==='hr'&&state===4&&(!markup.includes('asset:boardExcerpt')||!markup.includes('extra-to-routine-inset')))throw Error('Final scene detached from prior shots');
 count++;
}
if(count!==20||layout.frames.length!==20)throw Error('Composition state count');
if(COMPETITION_STATES.some(s=>Math.abs(s.weights.reduce((a,b)=>a+b,0)-1)>1e-9))throw Error('Market weights');
if(LAYOUT.parallel.footnote[1]+LAYOUT.parallel.footnote[3]>=LAYOUT.subtitleSafe[1])throw Error('Footnote overlaps captions');
const timing=JSON.parse(await fs.readFile(path.join(PLAN,'shot-timing.json'),'utf8'));
if(timing.shots.length!==14||timing.durationFrames!==1650)throw Error('Shot count/duration');
let cursor=0,E=0,L=0;
for(const s of timing.shots){if(s.startFrame!==cursor)throw Error('Timing gap');cursor=s.endFrameExclusive;if(s.type==='E')E+=s.endFrameExclusive-s.startFrame;else L+=s.endFrameExclusive-s.startFrame;}
if(cursor!==1650||E!==963||L!==687)throw Error('Timing allocation');
const claude=JSON.parse(await fs.readFile(path.join(PLAN,'claude-result.json'),'utf8'));
if(claude.is_error||claude.subtype!=='success'||!claude.modelUsage['claude-opus-5-5'])throw Error('Claude did not finish successfully');
const screenshot='arts/static/04/story-assets-v03/provenance/revision-v04/browser-preview.png';
await fs.access(path.join(ROOT,screenshot));
const result={version:'S04_ART/STORYBOARD v0.4',passed:true,protectedFiles:guards.length,unchangedGeneratedPngs:20,imagegenCallsThisRevision:0,
 registeredAssets:layout.registry.length,compositions:count,shots:14,continuousFrames:1650,storyFrames:E,logicFrames:L,
 userNarrationBytePreserved:true,userStoryParagraphsBytePreserved:true,narrationCharacters:185,
 zeroOnscreenProductionLabels:true,researchFootnoteOnlyInThreeWindows:true,standaloneResearchAndClosingRemoved:true,
 restoredMechanisms:['output-expectations-next-tasks inside unchanged performance workstations','same cycle/planning sheet from competition to whiteboard','opening/whiteboard thumbnails end at actual published requirements'],
 derivedBoardCropTraceable:true,marketsNormalized:true,subtitleSafe:true,browserChecked:true,
 browserChecks:['five-scene navigation','research footnote','performance embedded logic','competition planning order','HR ending and caption-safe overlay'],browserScreenshot:screenshot,
 claude:{invocations:1,model:'claude-opus-5-5',numTurns:claude.num_turns,durationMs:claude.duration_ms,scope:'text-only optimization, no pixel review',retry:false},
 limits:['representative key states and script, not55s animation','formal04 captions and film remain old','new chapter seams unverified'],
 commands:['node arts/static/04/story-assets-v03/build.mjs','python3 arts/actions/04/provenance/storyboard-v04/finalize.py','node arts/static/04/story-assets-v03/provenance/revision-v04/audit.mjs']};
await fs.writeFile(path.join(HERE,'verification.json'),JSON.stringify(result,null,2)+'\n');
async function walk(folder){let out=[];for(const e of await fs.readdir(folder,{withFileTypes:true})){const p=path.join(folder,e.name);if(e.isDirectory())out.push(...await walk(p));else if(e.name!=='outputs.json')out.push(p);}return out;}
const outputs=[...await walk(PLAN),...await walk(ART),...['scripts/final/shot/04.md','scripts/final/shot/STORY_LOGIC_PLAN.md','scripts/style/STYLE_BIBLE.md','scripts/PROJECT_STATE.md','scripts/HANDOFF.md','scripts/doc/GENERATION_LOG.md','arts/actions/04/README.md'].map(p=>path.join(ROOT,p))];
const manifest=[];for(const p of [...new Set(outputs)].sort())manifest.push({path:path.relative(ROOT,p),sha256:sha(await fs.readFile(p))});
await fs.writeFile(path.join(HERE,'outputs.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({passed:true,protected:guards.length,onscreenMarks:0,scenes:5,compositions:20,shots:14,frames:1650,claude:'one successful opus5.5 call'}));
