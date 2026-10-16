// Deterministic two-dimensional cutout rig. Authored by Codex for this trial.
export const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
export const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
export const lerp=(a,b,t)=>a+(b-a)*t;
export const mix=(a,b,t)=>[lerp(a[0],b[0],t),lerp(a[1],b[1],t)];
export const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
export function ik(a,target,l1,l2,bend=1){
 const dx=target[0]-a[0],dy=target[1]-a[1],raw=Math.hypot(dx,dy),d=clamp(raw,.01,l1+l2-.01);
 const ux=dx/(raw||1),uy=dy/(raw||1),along=(l1*l1-l2*l2+d*d)/(2*d),height=Math.sqrt(Math.max(0,l1*l1-along*along));
 const elbow=[a[0]+ux*along-uy*height*bend,a[1]+uy*along+ux*height*bend];
 return {elbow,wrist:[a[0]+ux*d,a[1]+uy*d],unreachable:raw>l1+l2};
}
export function localToWorld(pose,p){
 return [pose.root[0]+p[0]*pose.scale*pose.facing,pose.root[1]+p[1]*pose.scale];
}
export function worldToLocal(pose,p){
 return [(p[0]-pose.root[0])/pose.scale/pose.facing,(p[1]-pose.root[1])/pose.scale];
}
export function poseBase(id,config,options={}){
 const p={id,root:options.root||[600,790],scale:options.scale??1,facing:options.facing??1,seated:options.seated??1,headTilt:options.headTilt||0,arms:{},legs:{},frontArms:{far:false,near:false},contacts:[],action:options.action||'idle'};
 const c=config[id],s=p.seated,phase=options.walkPhase||0,walk=options.walk||0;
 for(const [side,sign] of [['far',-1],['near',1]]){
  const hip=[sign*30,-3];
  let knee=mix([sign*32,155],[side==='far'?85:155,side==='far'?90:82],s);
  let ankle=mix([sign*30,320],[side==='far'?90:165,250],s);
  const swing=Math.sin(phase+(side==='near'?Math.PI:0))*walk;
  knee=[knee[0]+35*swing,knee[1]-8*Math.max(0,swing)];
  ankle=[ankle[0]+76*swing,ankle[1]-32*Math.max(0,swing)];
  p.legs[side]={hip,knee,ankle};
  const shoulder=c.shoulders[side];
  const rest=[shoulder[0]+sign*14+35*Math.sin(phase+(side==='near'?0:Math.PI))*walk,shoulder[1]+c.upperArmLength+c.forearmLength-24];
  setArm(p,side,rest,config,{bend:sign<0?1:-1});
 }
 return p;
}
export function setArm(pose,side,target,config,{bend=1,hand='handRelax',handAngle=null}={}){
 const c=config[pose.id],shoulder=c.shoulders[side],sol=ik(shoulder,target,c.upperArmLength,c.forearmLength,bend);
 const angle=handAngle??(Math.atan2(sol.wrist[1]-sol.elbow[1],sol.wrist[0]-sol.elbow[0])*180/Math.PI-90);
 pose.arms[side]={shoulder:[...shoulder],elbow:sol.elbow,wrist:sol.wrist,hand,handAngle:angle,unreachable:sol.unreachable};
}
export function keyboard(pose,config,weight=1,{point=false,wobble=0}={}){
 const targets={far:[759.75,765.11],near:[868.83,765.11]};
 for(const side of ['far','near']){
  const palm=worldToLocal(pose,[targets[side][0],targets[side][1]+wobble]);
  const wrist=[palm[0]-22,palm[1]]; // wrist + rotated(0,22) is the measured hand-center anchor
  const current=pose.arms[side].wrist;
  setArm(pose,side,mix(current,wrist,weight),config,{hand:point&&side==='near'?'handPoint':'handRelax',handAngle:-90});
  pose.frontArms[side]=weight>.2;
  if(weight>.999)pose.contacts.push({name:'keyboard-'+side,target:[targets[side][0],targets[side][1]+wobble],palmLocal:[pose.arms[side].wrist[0]+22,pose.arms[side].wrist[1]],required:true});
 }
}
const n=x=>Number(x.toFixed(3));
const point=p=>p.map(n).join(' ');
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
export function createDefinitions(bundle){
 let s='';
 for(const id of ['programmer','agent']){
  const a=bundle.characters[id];if(!a)continue;s+='<image id="atlas-'+id+'" href="'+a.dataUri+'" width="'+a.meta.imageSize[0]+'" height="'+a.meta.imageSize[1]+'"/>';
  for(const [part,info] of Object.entries(a.meta.parts)){
   const b=info.visibleBounds;
   s+='<symbol id="'+id+'-'+part+'" viewBox="'+b.join(' ')+'" preserveAspectRatio="none"><use href="#atlas-'+id+'"/></symbol>';
  }
 }
 for(const [name,asset] of Object.entries(bundle.assets))s+='<symbol id="asset-'+name+'" viewBox="0 0 '+asset.width+' '+asset.height+'" preserveAspectRatio="none"><image href="'+asset.dataUri+'" width="'+asset.width+'" height="'+asset.height+'"/></symbol>';
 return '<defs>'+s+'</defs>';
}
const part=(id,name,x,y,w,h)=>'<use href="#'+id+'-'+name+'" x="'+n(x)+'" y="'+n(y)+'" width="'+n(w)+'" height="'+n(h)+'"/>';
export function drawCharacter(p,config,pass='all',debug=false){
 const c=config[p.id];
 function bone(name,a,b,w,overlap=12){
  const length=dist(a,b),angle=Math.atan2(b[1]-a[1],b[0]-a[0])*180/Math.PI-90;
  return '<g transform="translate('+point(a)+') rotate('+n(angle)+')">'+part(p.id,name,-w/2,-overlap,w,length+overlap*2)+'</g>';
 }
 function hand(a){
  return '<g transform="translate('+point(a.wrist)+') rotate('+n(a.handAngle)+')">'+part(p.id,a.hand,-16,-10,32,64)+'</g>';
 }
 let body='',front='';
 for(const side of ['far','near']){
  const leg=p.legs[side],dim=side==='far'?.92:1;
  body+='<g opacity="'+(side==='far'?.96:1)+'">'+bone('upperLeg',leg.hip,leg.knee,c.legWidth*dim,14)+bone('lowerLeg',leg.knee,leg.ankle,c.footWidth*dim,12)+'</g>';
 }
 const r=c.torsoRect;body+=part(p.id,'torso',...r);
 for(const side of ['far','near']){
  const a=p.arms[side],w=c.armWidth*(side==='far'?.92:1);
  body+=bone('upperArm',a.shoulder,a.elbow,w,16);
  const forearm=bone('forearm',a.elbow,a.wrist,w*.90,13)+hand(a);
  if(p.frontArms[side])front+=forearm;else body+=forearm;
 }
 const h=c.headRect,neck=c.neckPivot;
 body+='<g transform="rotate('+p.headTilt+' '+neck.join(' ')+')">'+part(p.id,'head',...h)+'</g>';
 if(debug){
  let markers='';
  for(const a of Object.values(p.arms))for(const v of [a.shoulder,a.elbow,a.wrist])markers+='<circle cx="'+n(v[0])+'" cy="'+n(v[1])+'" r="5" fill="#E9B468" stroke="#263342" stroke-width="2"/>';
  for(const con of p.contacts)markers+='<circle cx="'+n(con.palmLocal[0])+'" cy="'+n(con.palmLocal[1])+'" r="7" fill="none" stroke="#C74F48" stroke-width="3"/>';
  front+=markers;
 }
 return '<g data-character="'+p.id+'" data-pass="'+pass+'" transform="translate('+point(p.root)+') scale('+p.scale*p.facing+' '+p.scale+')">'+(pass==='body'?body:pass==='front'?front:body+front)+'</g>';
}
export function asset(name,x,y,w,h,extra=''){
 return '<use href="#asset-'+esc(name)+'" x="'+n(x)+'" y="'+n(y)+'" width="'+n(w)+'" height="'+n(h)+'" '+extra+'/>';
}
export const label=(x,y,s,size=28,fill='#263342')=>'<text x="'+n(x)+'" y="'+n(y)+'" font-size="'+size+'" fill="'+fill+'" stroke="#F6F1E7" stroke-width="4" paint-order="stroke fill">'+esc(s)+'</text>';
export function rootSvg(content,defs='',w=1920,h=1080,title='01角色动作试验'){
 return '<svg xmlns="http://www.w3.org/2000/svg" width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'" role="img" aria-label="'+title+'"><title>'+title+'</title>'+defs+'<g font-family="Hiragino Sans GB,PingFang SC,Noto Sans CJK SC,sans-serif" stroke-linejoin="round" stroke-linecap="round">'+content+'</g></svg>';
}

