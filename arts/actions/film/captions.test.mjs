import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {createRequire} from 'node:module';
import {CAPTION_STYLE,characterCount,captionSvg} from './captions.mjs';import {RAW_CUES,CUES,GLOBAL_CUES,createRenderer} from './scenes.mjs';
const sharp=createRequire(import.meta.url)('/Users/alan671/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
test('all55 cues meet10 Unicode characters and preserve all853 manuscript characters, punctuation and source spans',()=>{
 assert.equal(GLOBAL_CUES.length,55);assert.equal(Object.values(RAW_CUES).flat().length,69);let chars=0,merges=0;
 for(const [id,cues]of Object.entries(CUES)){
  assert.equal(cues.map(c=>c.text).join(''),RAW_CUES[id].map(c=>c.text).join(''));let sources=[];
  for(const c of cues){assert(characterCount(c.text)>=10,c.text);assert(c.endMs>c.startMs);assert.equal(c.startMs,c.mergedFrom[0].startMs);assert.equal(c.endMs,c.mergedFrom.at(-1).endMs);sources.push(...c.mergedFrom);merges+=c.mergedFrom.length-1;chars+=characterCount(c.text);}
  assert.deepEqual(sources.map(({startMs,endMs,text})=>({startMs,endMs,text})),RAW_CUES[id].map(({startMs,endMs,text})=>({startMs,endMs,text})));
 }assert.equal(chars,853);assert.equal(merges,14);assert.equal(GLOBAL_CUES.at(-1).endMs,266000);
});
test('inline caption style rasterizes identically under conflicting chapter text selectors',async()=>{
 const cue={startMs:0,text:'字幕统一字体与字号，保持整片一致。'},out=[];
 for(const style of ['',"text{font-family:'PingFang SC';font-size:90px;font-weight:900;fill:red;letter-spacing:8px}","text{font-family:serif;font-size:22px;font-weight:200;font-style:italic;fill:blue}"]){
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><style>${style}</style><rect width="1920" height="1080" fill="black"/>${captionSvg(cue)}</svg>`;
  out.push(await sharp(Buffer.from(svg)).extract({left:40,top:994,width:1840,height:70}).raw().toBuffer());
 }assert(out[0].equals(out[1]));assert(out[0].equals(out[2]));assert.equal(CAPTION_STYLE.family,'Hiragino Sans GB');
});
test('actual six chapter output keeps exactly the same inline caption style and leaves ending references clear',()=>{
 const render=createRenderer(JSON.parse(fs.readFileSync(new URL('./bundle-v01.json',import.meta.url))),p=>'/'+p),styles=[];
 for(const f of [45,1390,2520,3700,5340,6690]){const s=render(f).svg,caption=s.slice(s.indexOf('<g data-film-caption='));assert(caption.includes('font-size:44px'));styles.push(caption.match(/style="([^"]+)"/)[1]);}
 assert.equal(new Set(styles).size,1);for(const f of [7980,8190,8399])assert(!render(f).svg.includes('data-film-caption='));
});
