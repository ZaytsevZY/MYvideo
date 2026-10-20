import test from 'node:test';import assert from 'node:assert/strict';import {createRequire} from 'node:module';import path from 'node:path';import {fileURLToPath} from 'node:url';import {loadRenderAssets} from './render-assets.mjs';import {MOTION} from './motion-v09.mjs';
const sharp=createRequire(import.meta.url)('/Users/alan671/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
test('offline SVG exports decode WebP cels through lossless PNG and keep the visible character',async()=>{
 const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..'),f=MOTION.groups.find(g=>g.id==='meal').frames[2],uris=await loadRenderAssets([{path:f.path,format:'webp'}],root,sharp),uri=uris.get(f.path);assert(uri.startsWith('data:image/png;base64,'));
 const png=Buffer.from(uri.split(',')[1],'base64'),original=await sharp(path.join(root,f.path)).ensureAlpha().raw().toBuffer(),converted=await sharp(png).ensureAlpha().raw().toBuffer();assert(original.equals(converted));
 const pixel=await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="128" height="192"><image href="${uri}" width="128" height="192"/></svg>`)).ensureAlpha().raw().toBuffer();let opaque=0;for(let i=3;i<pixel.length;i+=4)if(pixel[i]>200)opaque++;assert(opaque>2000,'export silently omitted the character');
});
