// librsvg cannot decode embedded WebP in this runtime. Browser previews may use
// original WebP URLs; offline exports must embed lossless PNG bytes instead.
import fs from 'node:fs';import path from 'node:path';
export async function loadRenderAssets(assets,root,sharp){
 const uris=new Map();
 for(const a of assets){let b=fs.readFileSync(path.join(root,a.path)),format=a.format;if(format==='webp'){b=await sharp(b).png().toBuffer();format='png';}uris.set(a.path,`data:image/${format==='svg'?'svg+xml':format};base64,${b.toString('base64')}`);}
 return uris;
}
