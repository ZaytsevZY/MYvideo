"""Replace one full sentence and copy the adopted H.264 stream unchanged."""
from pathlib import Path
import copy,hashlib,json,re,subprocess
import numpy as np
R=Path(__file__).resolve().parents[3];F=R/'arts/actions/film';P=F/'provenance/pronunciation-v17';O=R/'arts/audio/film/voice-v17';FF='/opt/homebrew/bin/ffmpeg';SR=48000

def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def save(p,x):p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def run(args,data=None):return subprocess.run([FF,'-v','error','-y',*args],input=data,capture_output=True,check=True).stdout
def pcm(p):return np.frombuffer(run(['-i',str(p),'-ar','48000','-ac','1','-f','f32le','pipe:1']),dtype='<f4').copy()
def norm(t):return re.sub(r'[^a-z0-9\u4e00-\u9fff]','',t.lower())
def main():
 final=F/'exports/film-complete-captioned-voiced-v17.mp4';assert not final.exists(),'Keep existing exports.'
 align=json.loads((F/'provenance/voice-v16/alignment.json').read_text());old=next(s for s in align['sentences']if s['id']=='S16-01-05');oldmaster=R/'arts/audio/film/voice-v16/narration-v16.wav';oldmovie=F/'exports/film-complete-captioned-voiced-v16.mp4';raw=O/'raw/S17-01-05.mp3';request=json.loads(raw.with_suffix('.request.json').read_text());metadata=[json.loads(x)for x in raw.with_suffix('.jsonl').read_text().splitlines()];assert norm(old['text'])==norm(request['text'])==norm(''.join(w['text']for w in metadata))
 guardpaths=[oldmaster,oldmovie,F/'captions-v16.json',F/'captions-v16.srt',F/'scenes-v16.mjs',F/'bundle-v16.json']+[R/s['path']for s in json.loads((F/'narration-v16.json').read_text())['sources']];guards=[dict(path=str(p.relative_to(R)),sha256=sha(p))for p in guardpaths];save(P/'protected-inputs.json',guards)
 before=pcm(oldmaster);assert len(before)==280*SR;sample=pcm(raw);n=len(sample)//480;active=np.flatnonzero(np.max(np.abs(sample[:n*480].reshape(n,480)),axis=1)>.001);a=max(0,int(active[0]*480-.045*SR));b=min(len(sample),int((active[-1]+1)*480+.065*SR));sample=sample[a:b].copy();sample[:96]*=np.linspace(0,1,96);sample[-96:]*=np.linspace(1,0,96)
 at=round(old['start']*SR);end=round(old['speechEnd']*SR);oldsegment=before[at:end];gain=float(np.sqrt(np.mean(oldsegment**2))/np.sqrt(np.mean(sample**2)));sample*=gain;sample=np.frombuffer(run(['-f','f32le','-ar','48000','-ac','1','-i','pipe:0','-af','alimiter=limit=0.84:level=false:latency=true:attack=5:release=50','-f','f32le','pipe:1'],sample.tobytes()),dtype='<f4').copy();difference=20*np.log10(float(np.sqrt(np.mean(sample**2)))/float(np.sqrt(np.mean(oldsegment**2))));assert abs(difference)<2.5
 assert at+len(sample)<=end;after=before.copy();after[at:end]=0;after[at:at+len(sample)]=sample
 master=O/'narration-v17.wav';run(['-f','f32le','-ar','48000','-ac','1','-i','pipe:0','-c:a','pcm_s24le',str(master)],after.tobytes());run(['-f','f32le','-ar','48000','-ac','1','-i','pipe:0','-c:a','pcm_s24le',str(O/'S17-01-05-corrected.wav')],sample.tobytes());actual=pcm(master);assert len(actual)==len(before);assert np.array_equal(before[:at],actual[:at])and np.array_equal(before[end:],actual[end:]);assert np.max(np.abs(actual))<1 and np.max(np.abs(actual[-14*SR:]))==0
 words=[];position=0
 for w in metadata:
  k=len(norm(w['text']));words.append(dict(text=w['text'],first=position,last=position+k,start=old['start']+max(0,w['offset']/1e7-a/SR),end=old['start']+max(0,(w['offset']+w['duration'])/1e7-a/SR)));position+=k
 cue=next(c for c in align['captions']if 'Todo list'in c['text']);assert cue['startMs']/1000<=words[0]['start'] and words[-1]['end']<=cue['endMs']/1000
 new=copy.deepcopy(old);new.update(id='S17-01-05',rawPath=str(raw.relative_to(R)),rawSha256=sha(raw),fittedPath=str((O/'S17-01-05-corrected.wav').relative_to(R)),fittedSha256=sha(O/'S17-01-05-corrected.wav'),trimStartSeconds=a/SR,speechEnd=old['start']+len(sample)/SR,words=words,pronunciationInput=request['text'],gainToMatchExistingMaster=gain)
 align['sentences']=[new if s['id']==old['id']else s for s in align['sentences']];align['version']='FILM_VOICE v0.17';align['pronunciationCorrection']=dict(base='FILM_VOICE v0.16',sentence='S17-01-05',displayText=old['text'],spokenInput=request['text'],originalSentenceStart=old['start'],originalSpeechEnd=old['speechEnd'],newSpeechEnd=new['speechEnd'],allOtherAudioSamplesIdentical=True,captionTimingUnchanged=True)
 for key in ['captions','rawCaptionAlignment']:
  for c in align[key]:
   if c['sentenceId']==old['id']:c.update(sentenceId=new['id'],voiceStartMs=words[0]['start']*1000,voiceEndMs=words[-1]['end']*1000)
 save(P/'alignment.json',align)
 part=final.with_name(final.stem+'.part.mp4');run(['-i',str(oldmovie),'-i',str(master),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-ar','48000','-ac','1','-t','280','-map_metadata','-1','-metadata:s:a:0','language=zho','-movflags','+faststart',str(part)])
 probe=json.loads(subprocess.check_output(['/opt/homebrew/bin/ffprobe','-v','error','-show_streams','-show_format','-of','json',str(part)]));v=next(s for s in probe['streams']if s['codec_type']=='video');audio=next(s for s in probe['streams']if s['codec_type']=='audio');assert int(v['nb_frames'])==8400 and v['avg_frame_rate']=='30/1'and v['width']==1920 and v['height']==1080;assert abs(float(probe['format']['duration'])-280)<.001 and audio['sample_rate']=='48000'
 def video_hash(p):return run(['-i',str(p),'-map','0:v:0','-c:v','copy','-f','hash','-hash','sha256','pipe:1']).decode().strip()
 originalHash=video_hash(oldmovie);assert video_hash(part)==originalHash
 run(['-i',str(part),'-f','null','-']);part.rename(final);save(P/'ffprobe.json',probe)
 for g in guards:assert sha(R/g['path'])==g['sha256']
 for ext in ['srt','vtt']:(F/f'exports/film-subtitles-v17.{ext}').write_bytes((F/f'captions-v16.{ext}').read_bytes())
 report=dict(version='FILM_VOICE v0.17',duration=280,frames=8400,captionCount=65,originalWordingPreserved=True,displayText=old['text'],ttsInput=request['text'],voice=request['voice'],rate=request['rate'],pitch=request['pitch'],newTtsRequests=1,adoptedNewWholeSentences=1,englishWordBoundaries=['to','do','list'],oldEnglishAsr=['Title list','Title List'],newEnglishAsr=json.loads((P/'corrected-check.json').read_text())['rows'],manualListening=False,newSentenceSeconds=len(sample)/SR,originalSentenceSeconds=old['speechEnd']-old['start'],volumeDifferenceDb=float(difference),gain=gain,peakControl='Lookahead peak limiter0.84, compensated latency, no tempo change',patchSamples=[at,end],allMasterSamplesOutsidePatchIdentical=True,videoStreamBitExact=True,videoStreamSha256=originalHash,audioTempoApplied=False,captionBytesUnchanged=True,fullDecodePassed=True,protectedInputs=len(guards),output=dict(path=str(final.relative_to(R)),bytes=final.stat().st_size,sha256=sha(final)),narration=dict(path=str(master.relative_to(R)),sha256=sha(master)),newSentence=dict(path=str((O/'S17-01-05-corrected.wav').relative_to(R)),sha256=sha(O/'S17-01-05-corrected.wav')))
 save(P/'verification.json',report);save(F/'exports/film-complete-captioned-voiced-v17-manifest.json',report);print(json.dumps(report,ensure_ascii=False),flush=True)
if __name__=='__main__':main()
