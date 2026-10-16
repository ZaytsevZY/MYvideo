// Offline QA only: renders representative stills, not an animation/video export.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),sharp=require('sharp');
const ROOT=path.resolve(__dirname,'../../..');
const manifestPath=path.join(__dirname,'manifest-camera-v01.json');
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
(async()=>{
 const m=JSON.parse(fs.readFileSync(manifestPath,'utf8')),rendered=[];
 let sheet='<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="936" viewBox="0 0 1920 936"><rect width="1920" height="936" fill="#172431"/>';
 for(const [i,still] of m.stills.entries()){
  const source=path.join(ROOT,still.path),target=source.replace(/\.svg$/,'.png');
  await sharp(fs.readFileSync(source),{density:72,limitInputPixels:100000000}).png().toFile(target);
  const x=i%4*480,y=Math.floor(i/4)*312;
  sheet+='<text x="'+(x+12)+'" y="'+(y+27)+'" font-family="sans-serif" font-size="19" fill="#F6F1E7">'+still.id+' / '+still.t.toFixed(1)+'s</text><image href="data:image/png;base64,'+fs.readFileSync(target).toString('base64')+'" x="'+x+'" y="'+(y+36)+'" width="480" height="270"/>';
  rendered.push({id:still.id,t:still.t,path:path.relative(ROOT,target),sha256:sha(target),size:[1920,1080]});
 }
 sheet+='</svg>';
 const contactPath=path.join(__dirname,'camera-contact-v01.png');
 await sharp(Buffer.from(sheet),{density:72}).png().toFile(contactPath);
 m.staticQA={renderer:'sharp '+sharp.versions.sharp,svgRenderer:'librsvg '+sharp.versions.rsvg,stills:rendered,contact:{path:path.relative(ROOT,contactPath),sha256:sha(contactPath)},note:'Representative stills only; actual browser playback must also be checked.'};
 fs.writeFileSync(manifestPath,JSON.stringify(m,null,2)+'\n');
 console.log(JSON.stringify({representativePNGs:rendered.length,contact:path.relative(ROOT,contactPath),videoExport:false}));
})().catch(error=>{console.error(error.stack);process.exitCode=1});
