import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url);
let sharp;try{sharp=require('sharp');}catch{sharp=require('/Users/alan671/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');}
const HERE=path.dirname(fileURLToPath(import.meta.url)),ROOT=path.resolve(HERE,'../../../..');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=p=>fs.readFile(path.join(ROOT,p));
const inputs=JSON.parse(await fs.readFile(path.join(HERE,'provenance/inputs-v01.json'),'utf8'));
const manifest=JSON.parse(await fs.readFile(path.join(HERE,'manifest-v01.json'),'utf8'));
assert.equal(manifest.generationCalls,5);assert.equal(manifest.adoptedRaster,5);assert.equal(manifest.chapterAnimationUpdated,false);
for(const p of inputs.inputs)assert.equal(sha(await read(p.path)),p.sha256,p.path+' changed');
let alpha=[];
for(const p of manifest.outputs){
 const b=await read(p.path),m=await sharp(b).metadata(),s=await sharp(b).stats();
 assert.equal(sha(b),p.sha256);assert.equal(sha(await fs.readFile(p.source)),p.sha256,'copy differs from model output');
 assert.equal(m.width,1024);assert.equal(m.height,1536);assert(m.hasAlpha);assert.equal(s.channels[3].min,0);assert(s.channels[3].max>=250);
 assert.equal(p.usedInChapterAnimation,false);
 for(const ref of p.references)assert.equal(sha(await read(ref.path)),ref.sha256);
 alpha.push({path:p.path,width:m.width,height:m.height,min:s.channels[3].min,max:s.channels[3].max});
}
for(const p of [...manifest.ui,...manifest.reused])assert.equal(sha(await read(p.path)),p.sha256,p.path);
const html=(await fs.readFile(path.join(HERE,'preview.html'))).toString();let pageImages=0;
for(const m of html.matchAll(/src="([^"]+)"/g)){await fs.access(path.resolve(HERE,m[1]));pageImages++;}
for(const m of html.matchAll(/\.src='([^']+)'/g))await fs.access(path.resolve(HERE,m[1]));
const layout=JSON.parse(await fs.readFile(path.join(HERE,'layout-v01.json'),'utf8'));
for(const p of layout.parallel.panels){const[x,y,w,h]=p.rect;assert(x>=0&&x+w<=1920&&y>=0&&y+h<980);}
for(const r of [layout.parallel.foreground,layout.parallel.kpi])assert(r[1]+r[3]<=layout.subtitleSafe[1]);
let composites=[];
for(const f of (await fs.readdir(path.join(HERE,'compositions'))).filter(f=>f.endsWith('.png'))){const p=path.join(HERE,'compositions',f),b=await fs.readFile(p),m=await sharp(b).metadata();assert.equal(m.width,1920);assert.equal(m.height,1080);composites.push({path:path.relative(ROOT,p),sha256:sha(b)});}
const ui=JSON.parse(await read('arts/items/02/kpi-requirements-v01.json'));
assert.deepEqual(ui.rows,['交付范围','验收标准','周期安排']);
const result={version:'S02_STORY_ASSETS v0.1',date:'2026-10-18',passed:true,scope:{generationCalls:5,adoptedPng:5,unchangedInputs:inputs.inputs.length,userEdited02ScriptUnchanged:true,allSixScriptsUnchanged:true,existingAnimationUnchanged:true,pageImageReferences:pageImages,compositionPng:composites.length,editableKpiContentSets:1,uiVariants:2},alpha,composites,visualReview:['Five native model outputs inspected.','All five complete poses inspected on warm ivory and dark blue backgrounds.','Parallel thought/selection states inspected at 1920x1080; face and hands clear, caption safe area respected.','Review page contacts and chair occlusion inspected; paper queue corrected to desk-plane perspective.','KPI uses raster manager portrait and editable short labels; no invented quota or penalty.'],limitations:['Static key poses and composition candidates only; not chapter animation or a new video.','Limited complete-body states require timed cuts/anticipation/settle during later animation; no body crossfades.','Existing L1 sequencing conflict remains documented in audit; user-edited script preserved.'],manifestSha256:sha(await fs.readFile(path.join(HERE,'manifest-v01.json')))};
await fs.writeFile(path.join(HERE,'provenance/verification.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result.scope));
