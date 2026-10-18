import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url);
let sharp;try{sharp=require('sharp');}catch{sharp=require('/Users/alan671/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');}
const HERE=path.dirname(fileURLToPath(import.meta.url)),ROOT=path.resolve(HERE,'../../..');
const read=p=>fs.readFile(path.join(ROOT,p));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const inputs=JSON.parse(await fs.readFile(path.join(HERE,'provenance/inputs.json'),'utf8'));
const manifest=JSON.parse(await fs.readFile(path.join(HERE,'manifest-v01.json'),'utf8'));
const expected=[38,39,55,45,58],chapters=[];
let nonwhite=0,story=0,logic=0,blocks=0;
for(const c of inputs.chapters){
 const t=(await read(c.path)).toString();
 const audio=t.match(/### audio content\s*<start>\s*([\s\S]*?)\s*<end>/)[1];
 assert.equal(sha(audio),c.audioSha256,c.path+' audio');
 assert.equal(sha(t.split('## references')[1]),c.referencesSha256,c.path+' references');
 nonwhite+=audio.replace(/\s/g,'').length;
 const chapter=c.path.match(/(\d\d)\.md$/)[1];
 if(chapter==='01')continue;
 const orderedBlocks=[...t.matchAll(/^\| (V\d\d\.\d-[EL]\d) \| ([\d.]+)–([\d.]+) \|/gm)].map(m=>({id:m[1],type:m[1].includes('-E')?'story':'logic',start:+m[2],end:+m[3]})).sort((a,b)=>a.start-b.start);
 assert(orderedBlocks.length);let end=0,es=0,ls=0;
 for(const b of orderedBlocks){assert.equal(b.start,end,b.id+' gap/overlap');assert(b.end>b.start);end=b.end;if(b.type==='story')es+=b.end-b.start;else ls+=b.end-b.start;}
 assert.equal(end,expected[+chapter-2]);
 story+=es;logic+=ls;blocks+=orderedBlocks.length;
 if(chapter==='04'){
  const group=orderedBlocks.find(b=>b.id==='V04.1-E1');assert.equal(group.start,4);assert.equal(group.end,15);
  assert(!orderedBlocks.some(b=>['V04.1-E2','V04.1-E3'].includes(b.id)));
  group.panels=['A/lunch','B/premeeting','C/evening'];group.composition='concurrent';
 }
 chapters.push({chapter,version:t.match(/\*\*画面修订：\*\* ([^·\n]+)/)[1].trim(),sha256:sha(t),storySeconds:es,logicSeconds:ls,totalSeconds:end,orderedBlocks});
}
assert.equal(nonwhite,840);assert.equal(blocks,40);assert.equal(story,133);assert.equal(logic,102);
for(const [p,h]of Object.entries(inputs.existingPng))assert.equal(sha(await read(p)),h,p+' original PNG changed');
for(const [p,h]of Object.entries(inputs.existingRuntime))assert.equal(sha(await read(p)),h,p+' runtime changed');
let alpha=[];
for(const o of manifest.outputs){
 const b=await read(o.path),m=await sharp(b).metadata();assert.equal(sha(b),o.sha256);assert.equal(m.width,o.width);assert.equal(m.height,o.height);
 assert.equal(sha(await fs.readFile(o.source)),o.sha256,o.path+' original output differs');
 for(const ref of o.references)assert.equal(sha(await read(ref.path)),ref.sha256,ref.path);
 if(o.transparent_background){const s=await sharp(b).stats();assert(m.hasAlpha);assert.equal(s.channels[3].min,0);assert(s.channels[3].max>=250);alpha.push({path:o.path,min:s.channels[3].min,max:s.channels[3].max});}
}
for(const o of manifest.editableUi)assert.equal(sha(await read(o.path)),o.sha256);
for(const o of manifest.reused)assert.equal(sha(await read(o.path)),o.sha256);
assert.equal(manifest.generationCalls,13);assert.equal(manifest.adoptedRasterCount,10);
const page=(await fs.readFile(path.join(HERE,'preview.html'))).toString();
let pageImages=0;for(const m of page.matchAll(/src="([^"]+)"/g)){await fs.access(path.resolve(HERE,m[1]));pageImages++;}
for(const f of await fs.readdir(path.join(HERE,'compositions'))){if(!f.endsWith('.png'))continue;const m=await sharp(path.join(HERE,'compositions',f)).metadata();assert(m.width>0&&m.height>0);}
const layout=JSON.parse(await fs.readFile(path.join(HERE,'layout-v01.json'),'utf8'));
for(const panel of layout.threePanelGroup.panels){const[x,y,w,h]=panel.rect;assert(x>=0&&x+w<=1920&&y+h<950);}
await fs.writeFile(path.join(HERE,'provenance/partition-index-v02.json'),JSON.stringify({version:'STORY_LOGIC_PLAN v0.2',date:'2026-10-18',implementedInAnimation:false,chapters},null,2)+'\n');
const result={date:'2026-10-18',stage:'art-and-static-composition',passed:true,scope:{generationCalls:13,adoptedRasterPng:10,superseded:3,editableUiTypes:4,uiFiles:8,existingPngUnchanged:Object.keys(inputs.existingPng).length,existingRuntimeUnchanged:Object.keys(inputs.existingRuntime).length,audioChars:nonwhite,sourceReferencesUnchanged:6,partitionBlocks:blocks,storySeconds:story,logicSeconds:logic,fullFilmSeconds:280,pageImageReferences:pageImages},alpha,visualReview:['All generated outputs inspected; three laptop back covers corrected with imagegen v02.','Transparent manager inspected on warm white background.','Full-resolution three-panel, awake notification, manager inset, room characters, backlog UI inspected.','Three panels fit above subtitle safe area; actor remains clear of notification.'],limitations:['Static art preparation; existing chapter animation and captions unchanged.','Three story panels have one adopted key illustration each, not a full action cycle.','Manager parallel demo temporarily uses chapter03 awake plate; chapter02 reaction pose still needed.','Sleep/awake room geometry is visually consistent but image edits are not pixel-identical background layers.'],outputs:{manifestSha256:sha(await fs.readFile(path.join(HERE,'manifest-v01.json'))),layoutSha256:sha(await fs.readFile(path.join(HERE,'layout-v01.json')))}};
await fs.writeFile(path.join(HERE,'provenance/verification.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result.scope));
