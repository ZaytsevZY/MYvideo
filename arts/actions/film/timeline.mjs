export const FPS=30,WIDTH=1920,HEIGHT=1080;
const items=[
 ['01','效率与任务边界',45,'S01_CAMERA v0.3'],
 ['02','成本下降与任务扩张',38,'S02_STORY v0.4'],
 ['03','雇佣关系与工作时间',39,'S03_STORY v0.5'],
 ['04','竞争与标准重设',55,'S04_STORY v0.5'],
 ['05','执行能力与决定权',45,'S05_STORY v0.3'],
 ['06','效率收益与人的自由',58,'S06_STORY v0.3']
];
let offset=0;
export const CHAPTERS=items.map(([id,title,duration,version])=>{
 const startFrame=offset,frames=duration*FPS;offset+=frames;
 return {id,title,duration,version,frames,startFrame,endFrame:offset,start:startFrame/FPS,end:offset/FPS};
});
export const TOTAL_FRAMES=offset,DURATION=offset/FPS;
export function locateFrame(value){
 if(!Number.isFinite(value))throw Error('Frame must be finite');
 const frame=Math.min(TOTAL_FRAMES-1,Math.max(0,Math.floor(value)));
 const chapter=CHAPTERS.find(c=>frame>=c.startFrame&&frame<c.endFrame);
 return {frame,chapter,localFrame:frame-chapter.startFrame,localTime:(frame-chapter.startFrame)/FPS,time:frame/FPS};
}
export const frameAtTime=t=>locateFrame(Math.floor(t*FPS+1e-6));
export function formatTime(t){const n=Math.max(0,Math.floor(t));return `${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;}
