# 新稿配音与音画校准 v0.16

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

5项测试覆盖8400帧、六章原文、65字幕、72节点、四组五态和153素材SHA；33句本地Whisper-small辅助识别没有超过20%字符差异的标记，未进行人工听审。78张源画面及对应编码抽帧已目视检查，编码／源图缩略像素误差最大1.677/255，连续PTS与无黑帧检测通过。音轨为48kHz单声道AAC，母带13,440,000采样点，AAC与母带相关系数0.999975，信噪比42.95dB，无削波，最后14秒静音。详见provenance/voice-v16/verification.json、visual-verification.json及browser-preview.png。

MP4：44,046,851字节，SHA256 `8ca76ce292e547124deb157cb9bd3daf1dedb693de6817175a13447b424d8020`。旁白SHA256 `b9d66143080da4b0dbc1462d9c70cdad3914292c0c4e495ebb41125f2c908298`。旧1100字符条款未改写，本轮按用户新稿和继续配音要求执行。
