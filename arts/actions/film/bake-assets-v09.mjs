import {loadRenderAssets} from './render-assets.mjs';
// Keep path tokens during scene assembly and motion replacement; expand raster
// bytes only once in the completed SVG. This preserves drawing while avoiding
// repeated parsing/escaping of multi-megabyte image data during scene assembly.
export async function createBakeAssets(assets,root,sharp){
 const uris=await loadRenderAssets(assets,root,sharp);
 return svg=>svg.replace(/(<image\b[^>]*\bhref=")(\/arts\/[^"<>]+)(")/g,(_,head,url,tail)=>{const uri=uris.get(url.slice(1));if(!uri)throw Error('Unregistered baked image '+url);return head+uri+tail;});
}
