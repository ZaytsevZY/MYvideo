"""Promote a verified full-file delivery; human-authored script stays unchanged."""
from pathlib import Path
import hashlib,json
R=Path(__file__).resolve().parents[3];F=R/'arts/actions/film';E=F/'exports';P=F/'provenance/final-v18'
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def main():
 q=json.loads((P/'verification.json').read_text());assert q['fullDecodePassed']and q['videoPayloadBitExact']and q['audioPayloadBitExact'];assert sha(R/q['output']['path'])==q['output']['sha256']
 for g in json.loads((P/'protected-inputs.json').read_text()):assert sha(R/g['path'])==g['sha256'],g['path']
 page=(E/'index-v18.html').read_text().replace('· 云扬 · 完整成片 · 云扬配音','· 云扬 · 完整成片');(E/'index-v18.html').write_text(page);(E/'index.html').write_text(page)
 q.update(representativeFrameVisualReview='passed',knownOpenItems=[dict(location='06末张参考文献卡',text='课程成员：待填写',disposition='Existing placeholder preserved; member names have not been provided.')]);(P/'verification.json').write_text(json.dumps(q,ensure_ascii=False,indent=2)+'\n');(E/'film-complete-final-v18-manifest.json').write_text(json.dumps(q,ensure_ascii=False,indent=2)+'\n')
 note='''## 2026-10-21：新版完整视频正式交付 v0.18

用户要求将新版完整视频bake为成片。当前FILM_FINAL v0.18包含全部01–06、修正to do list读音的云扬旁白和65条烧录字幕；280秒／8400帧／1920×1080／30fps、H.264＋48kHz单声道AAC，44,042,495字节。复用v16已逐帧烘焙并检查的纯补绘画面，以及v17已校验的修正版AAC，正式无损封装交付，不重复有损编码、不重录声音或重新生成美术。音视频payload SHA分别与v17完全相同，视频画面、字幕及全部人工稿保持。

完整文件arts/actions/film/exports/film-complete-final-v18.mp4；字幕副本film-subtitles-final-v18.srt／vtt；默认exports/index.html和版本index-v18.html提供播放／章节跳转／下载，动态preview.html继续使用v17同版音频与v16同版画面时钟。完整解码、280秒／8400帧／1080p30／音轨、连续PTS、全片黑帧、16项输入哈希及17张最终文件抽帧检查通过；英语修订与尾14秒静音沿用字节一致的v17音轨验证。没有新模型或TTS调用，没有光流。

实际保留项：06末张参考文献卡仍有“课程成员：待填写”，姓名尚未提供，已告知用户，未擅改片尾文字。文件导出已完成，这一内容占位项不能冒充已填写。复现与输出哈希见arts/actions/film/FINAL-v18.md、finalize-v18.py、provenance/final-v18和exports/film-complete-final-v18-manifest.json。旧v17及所有历史导出保持。

下方保留历史阶段。

'''
 for rel,old,new in [('scripts/PROJECT_STATE.md','PROJECT_STATE v0.61','PROJECT_STATE v0.62'),('scripts/HANDOFF.md','HANDOFF v0.62','HANDOFF v0.63'),('scripts/doc/GENERATION_LOG.md','GENERATION_LOG v0.54','GENERATION_LOG v0.55')]:
  p=R/rel;s=p.read_text();assert note.splitlines()[0]not in s;s=s.replace(old,new,1);at=s.index('\n\n',s.index('**版本：**'))+2;p.write_text(s[:at]+note+s[at:])
 p=F/'README.md';s=p.read_text();at=s.index('\n')+1;p.write_text(s[:at]+'''

**当前完整成片：FILM_FINAL v0.18。** [播放](http://127.0.0.1:8765/actions/film/exports/index-v18.html)／[下载MP4](exports/film-complete-final-v18.mp4)／[字幕SRT](exports/film-subtitles-final-v18.srt)／[交付说明](FINAL-v18.md)。4分40秒／1080p30／8400帧，包含修正后的云扬配音和65条烧录字幕；44,042,495字节。正式封装复用已核验的烘焙画面和v17音轨，两条码流均逐字节相同。完整解码、连续PTS、黑帧与17张最终文件抽帧通过。默认视频入口已更新，动态预览继续同版v17。片尾课程成员仍为待填写，姓名未提供，当前导出保留原文；旧版本保留。

下方为基础版本和历史制作记录。
'''+s[at:])
 p=E/'README.md';s=p.read_text();p.write_text('''# 当前完整成片 v0.18

[播放器](http://127.0.0.1:8765/actions/film/exports/index-v18.html) · [MP4](film-complete-final-v18.mp4) · [SRT](film-subtitles-final-v18.srt) · [验证清单](film-complete-final-v18-manifest.json)

280秒／1080p30／8400帧，含修正英语读音的云扬配音及65条已烧录字幕。全片解码、PTS、黑帧和两条音视频码流一致性检查通过。片尾“课程成员：待填写”占位保持，尚未收到成员姓名。详细复现见../FINAL-v18.md。

下方为历史导出说明。

'''+s)
 p=R/'scripts/final/shot/README.md';s=p.read_text().replace('SHOT_TEXT_INDEX v0.16','SHOT_TEXT_INDEX v0.17',1);at=s.index('\n\n',s.index('**版本：**'))+2;p.write_text(s[:at]+'''**完整成片交付：** [FILM_FINAL v0.18播放器](http://127.0.0.1:8765/actions/film/exports/index-v18.html)／[MP4](../../../arts/actions/film/exports/film-complete-final-v18.mp4)／[交付说明](../../../arts/actions/film/FINAL-v18.md)。全部六章280秒、65条烧录字幕和英语读音修正后的云扬配音已导出，原稿及演出保持。片尾课程成员尚待填写，未代填姓名。

'''+s[at:])
 (F/'FINAL-v18.md').write_text(f'''# 完整成片 v0.18

[播放](http://127.0.0.1:8765/actions/film/exports/index-v18.html) · [完整MP4](exports/film-complete-final-v18.mp4) · [字幕SRT](exports/film-subtitles-final-v18.srt) · [字幕VTT](exports/film-subtitles-final-v18.vtt) · [验证记录](provenance/final-v18/verification.json)

新版01–06全流程，280秒／8400帧／1920×1080／30fps，H.264画面与48kHz单声道AAC配音。65条统一44px字幕已烧录在视频里，SRT／VTT为独立下载副本。云扬采用v17完整配音，to do list英语读音已修订；最后14秒参考文献静音。

画面直接采用v16原生SVG／PNG逐帧烘焙结果，与v17视频码流逐字节相同；声音直接采用v17已校准AAC，与v17音轨码流逐字节相同。执行正式无损封装与faststart交付，没有再次栅格化或有损编码，没有新图像／TTS调用。纯补绘人物、06原绘稿、当前字幕与人工口播稿均保持。不能将这次正式封装记为新增人物动作或新一轮画面渲染。

完整解码、连续8400视频PTS、全片无黑帧、媒体规格、音视频payload SHA、16项源文件保护及17张最终文件抽帧已检查。继承v16对全部8400帧／72节点／153素材／四组五态与78编码抽帧的检查，继承v17英语短语识别、音频样本／峰值／末14秒静音检查；通过逐字节一致性确认这些结果仍适用。本轮未声称人工听审。

保留内容项：06末张参考文献卡仍显示“课程成员：待填写”。尚未提供姓名，导出保留原文并已向用户说明；交付文件生成不等同成员信息完成。

运行`python3 arts/actions/film/finalize-v18.py`复现正式封装与验证。脚本拒绝覆盖已存在的v18视频，历史媒体不得删除来绕过保护；后续有内容修改应采用下一版本。播放器为exports/index-v18.html及默认exports/index.html，动态框架继续preview.html／preview-v17.html。

MP4大小：{q['output']['bytes']:,}字节。SHA256：`{q['output']['sha256']}`。命令、输入哈希、抽帧、FFprobe和解码日志见provenance/final-v18/；成片清单位于exports/film-complete-final-v18-manifest.json。
''')
 print(json.dumps(dict(published=True,version=q['version'],output=q['output'],knownOpenItems=q['knownOpenItems']),ensure_ascii=False))
if __name__=='__main__':main()
