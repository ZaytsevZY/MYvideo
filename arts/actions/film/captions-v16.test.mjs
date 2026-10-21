import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';import {createRequire} from 'node:module';
import {createRenderer,CUES,CLOCKS,NARRATION,GLOBAL_CUES,GLOBAL_BEATS,sourceTime,filmTime} from './scenes-v16.mjs';import {createRenderer as previousRenderer} from './scenes-v15.mjs';import {CHAPTERS} from './timeline.mjs';import {CAPTION_STYLE,characterCount} from './captions.mjs';
const bundle=JSON.parse(fs.readFileSync(new URL('./bundle-v16.json',import.meta.url))),render=createRenderer(bundle,p=>'/'+p),previous=previousRenderer(bundle,p=>'/'+p),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
test('new subtitles preserve every repaired manuscript character, punctuation and inline space',()=>{
 let total=0;for(const s of NARRATION.sources){const b=fs.readFileSync(new URL('../../../'+s.path,import.meta.url));assert.equal(sha(b),s.sha256);const text=b.toString().split('<start>')[1].split('<end>')[0].trim().split(/\r?\n/).map(x=>x.trim()).join('');assert.equal(CUES[s.chapter].map(c=>c.text).join(''),text);total+=characterCount(text);}
 assert.equal(total,1247);assert.equal(GLOBAL_CUES.length,65);for(const c of NARRATION.chapters){const cc=GLOBAL_CUES.filter(x=>x.chapterId===c.chapter);assert.equal(c.cues,cc.length);assert.equal(c.minDisplayMs,Math.min(...cc.map(x=>x.endMs-x.startMs)));}assert(CUES['05'].some(c=>c.text.includes('劳动者施加竞争压力')));assert(!GLOBAL_CUES.some(c=>c.text.includes('劳动着')));
});
test('65 captions are readable, within chapter boundaries, and exported identically to SRT/VTT',()=>{
 let end=0;for(const cue of GLOBAL_CUES){assert(cue.startMs>=end);assert(cue.endMs>cue.startMs);assert(cue.endMs-cue.startMs>=2000);assert(characterCount(cue.text)>=10);assert([...cue.text].reduce((n,c)=>n+(c.charCodeAt(0)<128?.56:1),0)*44+68<=CAPTION_STYLE.maxWidth);const chapter=CHAPTERS.find(c=>c.id===cue.chapterId);assert(cue.startMs>=chapter.start*1000&&cue.endMs<=chapter.end*1000);end=cue.endMs;assert.equal(cue.confidence,null);assert(Number.isFinite(cue.timestampMs));}
 assert(end<=266000);assert(GLOBAL_CUES.every(c=>c.endMs<=266000));
 const srt=fs.readFileSync(new URL('./captions-v16.srt',import.meta.url),'utf8'),vtt=fs.readFileSync(new URL('./captions-v16.vtt',import.meta.url),'utf8');assert(vtt.startsWith('WEBVTT\n\n'));assert.equal(srt.split(/\n\n/).filter(Boolean).length,65);
 assert.equal(srt.replace(/^\d+\n[^\n]+\n/gm,'').replace(/\n/g,''),GLOBAL_CUES.map(c=>c.text).join(''));
 assert.equal(srt,fs.readFileSync(new URL('./exports/film-subtitles-v16.srt',import.meta.url),'utf8'));
});
test('fixed280s budgets and monotone scene maps preserve72 beats and all five painted states',()=>{
 assert.equal(bundle.duration,280);assert.equal(bundle.frames,8400);assert.equal(GLOBAL_BEATS.length,72);
 for(const c of CHAPTERS){const clock=CLOCKS[c.id];assert.deepEqual(clock[0],[0,0]);assert.deepEqual(clock.at(-1),[c.duration,c.duration]);for(let i=1;i<clock.length;i++)assert(clock[i][0]>clock[i-1][0]&&clock[i][1]>clock[i-1][1]);for(let t=0;t<c.duration;t+=.13)assert(Math.abs(filmTime(c.id,sourceTime(c.id,t))-t)<1e-8);}
 const phases=new Map(),beats=new Set();let previousFrame=-1;
 for(let f=0;f<8400;f++){const r=render(f);assert(r.sourceFrame>=previousFrame);previousFrame=r.sourceFrame;assert(!/NaN|Infinity|undefined/.test(r.svg),String(f));assert.equal((r.svg.match(/data-film-caption=/g)||[]).length,r.cue?1:0);beats.add(r.beat.id);for(const m of r.motion){if(!phases.has(m.id))phases.set(m.id,new Set());phases.get(m.id).add(m.phase);}}
 assert.equal(beats.size,72);assert.equal(phases.size,4);for(const states of phases.values())assert.equal(states.size,5);
});
test('subtitle toggle preserves the complete painted scene, with one consistent font and clear reference pages',()=>{
 const styles=[];for(const chapter of CHAPTERS){const cue=CUES[chapter.id][1],frame=chapter.startFrame+Math.floor((cue.startMs+cue.endMs)/2000*30),r=render(frame),off=render(frame,{captions:false});assert.equal(off.svg,previous(off.sourceFrame,{captions:false}).svg);assert(!off.svg.includes('data-film-caption='));const caption=r.svg.slice(r.svg.indexOf('<g data-film-caption='));styles.push(caption.match(/style="([^"]+)"/)[1]);}
 assert.equal(new Set(styles).size,1);assert(styles[0].includes('font-size:44px'));for(const f of [7980,8190,8399])assert.equal(render(f).cue,null);
});
test('all153 assets retain their exact adopted bytes',()=>{const assets=JSON.parse(fs.readFileSync(new URL('./assets-v01.json',import.meta.url))).assets;assert.equal(assets.length,153);for(const a of assets)assert.equal(sha(fs.readFileSync(new URL('../../../'+a.path,import.meta.url))),a.sha256,a.path);});
