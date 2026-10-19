import {createRequire} from 'node:module';import {fileURLToPath} from 'node:url';
const sharp=createRequire(import.meta.url)('/Users/alan671/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const base=new URL('../film/provenance/integration-v05/',import.meta.url),cells=[];
for(const [r,name] of ['04-to-05','05-to-06'].entries())for(const [c,t] of ['1.97','2.00','2.40','3.60'].entries()){
 const p=new URL(`${name}-encoded-${t}.png`,base);cells.push({input:await sharp(fileURLToPath(p)).resize(480,270).png().toBuffer(),left:c*480,top:r*300+30});
 cells.push({input:Buffer.from(`<svg width="480" height="30"><text x="10" y="22" fill="#f8f4ec" font-family="sans-serif" font-size="17">${name} / clip ${t}s</text></svg>`),left:c*480,top:r*300});
}
await sharp({create:{width:1920,height:600,channels:3,background:'#14222b'}}).composite(cells).png().toFile(fileURLToPath(new URL('seams-encoded-v05.png',base)));
