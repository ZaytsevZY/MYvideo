// Optional offline SVG-to-PNG QA rendering. Uses installed sharp via NODE_PATH.
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const sharp=require('sharp');
const root=path.resolve(__dirname,'../../..');
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
(async()=>{
 const rendered=[];
 for(const name of ['camera-front-neutral-v01','camera-front-dispatch-v01','camera-standing-layout-v01']){
  const source=path.join(__dirname,name+'.svg'),output=path.join(__dirname,name+'.png');
  const info=await sharp(fs.readFileSync(source),{density:72,limitInputPixels:100000000}).png().toFile(output);
  rendered.push({source:path.relative(root,source),path:path.relative(root,output),size:[info.width,info.height],sha256:sha(output)});
 }
 const manifestPath=path.join(__dirname,'camera-assets-manifest-v01.json');
 const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
 manifest.offline_static_render={renderer:'sharp '+sharp.versions.sharp,svg_renderer:'librsvg '+sharp.versions.rsvg,command:'NODE_PATH=<installed-node-packages> node arts/static/01/render_camera_assets_preview.cjs',images:rendered};
 for(const entry of manifest.assets) entry.reference_sha256=Object.fromEntries(entry.references.map(p=>[p,sha(p)]));
 fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');
 console.log(JSON.stringify({rendered:rendered.map(a=>({path:a.path,size:a.size})),source_pixels_edited:false},null,2));
})().catch(error=>{console.error(error.message);process.exitCode=1;});
