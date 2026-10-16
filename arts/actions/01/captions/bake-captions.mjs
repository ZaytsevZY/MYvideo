// Provisional semantic timing, not speech alignment. One source for preview, render and sidecars.
import fs from 'node:fs';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const scriptURL=new URL('../../../../scripts/final/shot/01.md',import.meta.url);
const narration=fs.readFileSync(scriptURL,'utf8').split('<start>')[1].split('<end>')[0].trim();
const timing=[
 [0,2.2,'深夜，一位程序员'],
 [2.2,5.2,'把尚未完成的功能交给 Agent：'],
 [5.2,8.4,'编写代码、运行测试、整理结果。'],
 [8.4,10.2,'随后，他关掉屏幕，'],
 [10.2,16,'等到第二天验收。'],
 [16,20,'他从亲手执行转向派发与审核，'],
 [20,23,'有机会更早离开电脑。'],
 [23,25.8,'项目计划也开始改变：补齐测试、'],
 [25.8,27.4,'优化界面、'],
 [27.4,30,'重启上周搁置的需求。'],
 [30,33.6,'旧任务逐项完成，'],
 [33.6,37,'待办清单却继续延长。'],
 [37,41,'工具替人完成了更多任务，'],
 [41,45,'为什么工作的终点反而越来越远？'],
];
const compact=s=>s.replace(/\s/g,'');
if(compact(timing.map(c=>c[2]).join(''))!==compact(narration))throw Error('Caption text differs from narration');
for(let i=0;i<timing.length;i++)if(timing[i][0]>timing[i][1]||(i&&timing[i-1][1]!==timing[i][0]))throw Error('Caption timing gap/overlap');
const captions=timing.map(([start,end,text])=>({text,startMs:Math.round(start*1000),endMs:Math.round(end*1000),timestampMs:null,confidence:null}));
const write=(name,text)=>fs.writeFileSync(new URL(name,import.meta.url),text);
write('01-narration-v01.json',JSON.stringify(captions,null,2)+'\n');
write('caption-data.mjs','// Generated from 01-narration-v01.json by bake-captions.mjs.\nexport const CAPTIONS='+JSON.stringify(captions)+';\n');
const clock=(ms,sep)=>new Date(ms).toISOString().slice(11,23).replace('.',sep);
write('01-narration-v01.srt',captions.map((c,i)=>`${i+1}\n${clock(c.startMs,',')} --> ${clock(c.endMs,',')}\n${c.text}\n`).join('\n'));
write('01-narration-v01.vtt','WEBVTT\n\n'+captions.map(c=>`${clock(c.startMs,'.')} --> ${clock(c.endMs,'.')}\n${c.text}\n`).join('\n'));
write('manifest-v01.json',JSON.stringify({version:'S01_CAPTIONS v0.1',source:fileURLToPath(scriptURL),narrationSHA256:crypto.createHash('sha256').update(narration).digest('hex'),cues:captions.length,startMs:0,endMs:45000,timing:'provisional semantic and shot alignment; no recorded voice',text:'exact narration, preserving punctuation and Agent spelling; original whitespace breaks collapsed',font:'Hiragino Sans GB',fontSize:44,position:'screen space, center x960 y1028; above bottom18px safe margin',voice:false,sfx:false},null,2)+'\n');
console.log(JSON.stringify({cues:captions.length,durationSeconds:45,textMatchesNarration:true}));
