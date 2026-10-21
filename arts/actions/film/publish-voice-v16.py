"""Publish verified local v16 deliverables without touching human manuscripts."""
from pathlib import Path
import json,re,hashlib
ROOT=Path(__file__).resolve().parents[3];F=ROOT/'arts/actions/film';P=F/'provenance/voice-v16'
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def main():
 m=json.loads((F/'exports/film-complete-captioned-voiced-v16-manifest.json').read_text());q=json.loads((P/'verification.json').read_text());v=json.loads((P/'visual-verification.json').read_text());assert q['fullDecodePassed']and not q['asrFlagged']and v['continuousPTS']and v['encodedBlackFrameCheckPassed']and v['manualReview']=='passed';assert sha(ROOT/m['output']['path'])==m['output']['sha256']
 for g in json.loads((P/'protected-inputs.json').read_text()):assert sha(ROOT/g['path'])==g['sha256'],g['path']
 (F/'VOICE-v16.md').write_text(f"""# 新稿配音与音画校准 v0.16

[成片播放器](http://127.0.0.1:8765/actions/film/exports/index.html) · [完整MP4](exports/film-complete-captioned-voiced-v16.mp4) · [带声音动态预览](http://127.0.0.1:8765/actions/film/preview.html) · [字幕SRT](captions-v16.srt) · [字幕VTT](captions-v16.vtt) · [旁白WAV](../../audio/film/voice-v16/narration-v16.wav)

用户修复的1247非空白字符／1073汉字，全部原文、标点、行内空格及六章文件SHA保持。沿用明确同意的微软云扬zh-CN-YunyangNeural，33个整句请求，rate=-5%、pitch=-2Hz；只去掉首尾空白并作响度和峰值控制，不拉伸音频。同句跨字幕原生停顿中位0.197秒、最大0.276秒；语句录音231.78秒，计入正常换气约294.4字符／分钟。

原280秒、8400帧、1080p30及六章45／38／39／55／45／58秒保持。WordBoundary元数据校准65条字幕（由69条暂排字幕合并而来），每条不少于10非空白字符、至少2秒，字体统一44px冬青黑体；字幕固定屏幕位置。源稿和逐词时刻分别记录在narration-v16.json及provenance/voice-v16/alignment.json；字幕独立存储全片及captions/NN/各章局部时刻版本。

章内时钟经scenes-v16.mjs映射至v15语义排时，再至原v10纯补绘演出，不修改历史renderer或旧录音。72个节点、153项素材、四组各五态独立完整绘稿均保持；06全部采用光流前原绘稿。没有新图像、光流、配乐或声效。06第31秒开始生活段、第38.34秒结束旁白，第44秒起14秒文献保持静音；生活画面余下5.66秒自然留白。

动态播放器player-v16.mjs以音频currentTime驱动画面，播放／拖动／速度／章节循环共用同一时钟；完整视频播放器提供本地Blob寻址，适配不支持HTTP Range的现有静态服务。preview-v15.html保留无声暂排对照，exports/index-v11.html等旧成片不覆盖，当前默认入口使用v16。

## 复现

在仓库根目录运行，原始合成已缓存，不为重新bake重复请求服务：

```sh
/private/tmp/myvideo-voice-venv/bin/python arts/actions/film/voice-v16.py assemble
node arts/actions/film/build-preview-v16.mjs
node --test arts/actions/film/captions-v16.test.mjs
node arts/actions/film/bake-v16.mjs
node arts/actions/film/review-voice-v16.mjs
node arts/actions/film/review-encoded-v16.mjs
/private/tmp/myvideo-voice-venv/bin/python arts/actions/film/verify-voice-v16.py
/private/tmp/myvideo-voice-venv/bin/python arts/actions/film/audit-voice-v16.py
```

bake拒绝覆盖既有MP4；要新烘焙应采用下一版本文件名或先保留既有输出，不能删除历史来绕过保护。voice-v16.py的synthesize阶段会发送原稿至已获准的微软服务；本次33个请求与请求哈希见generation-record.json，其余验证均本地执行。

## 本轮检查

5项测试覆盖8400帧、六章原文、65字幕、72节点、四组五态和153素材SHA；33句本地Whisper-small辅助识别没有超过20%字符差异的标记，未进行人工听审。78张源画面及对应编码抽帧已目视检查，编码／源图缩略像素误差最大{v['maximumEncodedSourcePixelError']:.3f}/255，连续PTS与无黑帧检测通过。音轨为48kHz单声道AAC，母带13,440,000采样点，AAC与母带相关系数{q['audio']['masterCorrelation']:.6f}，信噪比{q['audio']['masterToAacSnrDb']:.2f}dB，无削波，最后14秒静音。详见provenance/voice-v16/verification.json、visual-verification.json及browser-preview.png。

MP4：{m['output']['bytes']:,}字节，SHA256 `{m['output']['sha256']}`。旁白SHA256 `{m['narration']['sha256']}`。旧1100字符条款未改写，本轮按用户新稿和继续配音要求执行。
""")
 (F/'exports/index.html').write_bytes((F/'exports/index-v16.html').read_bytes())
 note='''## 2026-10-21：1247字符新稿整句配音与280秒音画校准完成

沿用用户已明确同意的微软云扬普通话男声，33个完整句子重新合成，rate=-5%、pitch=-2Hz；无音频拉伸、配乐或声效。1247非空白字符／1073汉字及六章人工稿完整保留。录音231.78秒，计入正常句间停顿约294.4字符／分钟；六章仍45／38／39／55／45／58秒，全片280秒／8400帧。06第31秒起生活段、44秒起14秒文献静音；口播在本章38.34秒结束，生活画面留白保留。

按Microsoft逐词时刻将69条暂排字幕合并校准为65条，统一44px冬青黑体，均至少10字符、至少2秒；同句36个跨字幕处的原生停顿中位0.197秒、最长0.276秒，不另插空白。章内演出跟随语义时钟，72节点、153项素材、四组各五态完整绘稿保留，06仍采用光流前原绘稿，无新图像生成或光流。

新成片FILM_VOICE v0.16已接arts/actions/film/exports/index.html／index-v16.html；完整MP4、SRT／VTT、48kHz／24bit单声道WAV均按v16命名。默认动态preview.html及preview-v16.html使用旁白音频驱动时钟，同步播放、拖动、章节循环与静音文献页已验证。历史v10／v11／v12／v13视频保留，v15字幕暂排预览也保留，不再作为当前音画入口。

5项测试覆盖全部8400帧、原文／65字幕、72节点、四组五态和153素材哈希；33句本地Whisper-small辅助检查无超过20%字符差异标记。全程解码、连续PTS、黑帧、78张源画面与同帧编码抽帧、音频采样／削波／AAC与母带一致性通过。ASR与响度检测不冒充人工听审。复现与证据见arts/actions/film/VOICE-v16.md、provenance/voice-v16和arts/audio/film/voice-v16/README.md。六章正文及原1100字符条款没有改写，本轮按用户新稿与继续配音的明确要求执行。

下方保留历史阶段。

'''
 for rel,old,new in [('scripts/PROJECT_STATE.md','PROJECT_STATE v0.59','PROJECT_STATE v0.60'),('scripts/HANDOFF.md','HANDOFF v0.60','HANDOFF v0.61'),('scripts/doc/GENERATION_LOG.md','GENERATION_LOG v0.52','GENERATION_LOG v0.53')]:
  p=ROOT/rel;s=p.read_text();assert note.splitlines()[0]not in s;s=s.replace(old,new,1);at=s.index('\n\n',s.index('**版本：**'))+2;s=s[:at]+note+s[at:];p.write_text(s)
 p=F/'README.md';s=p.read_text();at=s.index('\n')+1;lead='''

**当前音画：FILM_VOICE／FILM_PREVIEW／FILM_NARRATION v0.16 · 2026-10-21。** [播放新版](http://127.0.0.1:8765/actions/film/exports/index.html)／[动态预览](http://127.0.0.1:8765/actions/film/preview.html)／[MP4](exports/film-complete-captioned-voiced-v16.mp4)／[SRT](captions-v16.srt)／[旁白WAV](../../audio/film/voice-v16/narration-v16.wav)／[制作与验证](VOICE-v16.md)。

1247字符新人工稿、云扬33完整句、65条实录字幕，原280秒／8400帧和全部纯补绘素材保留。同句跨字幕原生停顿中位0.197秒、最大0.276秒，字幕最短2秒、统一44px。章内演出已按发音校准，默认动态预览使用音频时钟；06文献页14秒静音。已完成完整bake、解码／音轨／PTS／黑帧／原文和素材保护／源图与编码抽帧检查。没有音频变速、配乐或声效。新输出与哈希见exports/film-complete-captioned-voiced-v16-manifest.json和provenance/voice-v16/verification.json。

下方为历史制作阶段，当前采用以v16为准。
''';p.write_text(s[:at]+lead+s[at:])
 p=ROOT/'scripts/final/shot/README.md';s=p.read_text().replace('SHOT_TEXT_INDEX v0.14','SHOT_TEXT_INDEX v0.15',1);at=s.index('\n\n',s.index('**版本：**'))+2;s=s[:at]+'''**当前采用音画：** 1247字符人工稿已完成云扬33整句配音、65条逐词校准字幕及280秒／8400帧完整视频。[播放](http://127.0.0.1:8765/actions/film/exports/index.html)／[配音同步动态框架](http://127.0.0.1:8765/actions/film/preview.html)／[字幕](../../../arts/actions/film/captions-v16.srt)／[续作与验证](../../../arts/actions/film/VOICE-v16.md)。六章正文不改、72节点和153项纯补绘素材保持，06最后14秒参考文献静音。下方v15暂排与旧994字符稿为历史记录。

'''+s[at:];p.write_text(s)
 (P/'STATUS.md').write_text('''# 配音校准v0.16已完成

33句云扬新录音、280秒母带、65条实录字幕、章内画面校时和完整1080p30 MP4已完成。默认动态preview.html与视频exports/index.html均为v16。完整人工原稿与153绘稿字节保持；无光流、音频变速、配乐或声效。

复现见../../VOICE-v16.md；生成请求与授权见consent.json／generation-record.json；对齐见alignment.json；声音辅助检查见speech-verification.json／clause-continuity.json；成片媒体与音频检查见verification.json，编码画面与PTS见visual-verification.json。原始33请求已缓存，不为重新bake重复调用服务。人工听审由用户进行，不将ASR当作人工听审。
''')
 print(json.dumps(dict(published=True,output=m['output'],captions=65,duration=280),ensure_ascii=False))
if __name__=='__main__':main()
