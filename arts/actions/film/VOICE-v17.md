# Todo list读音修订 v0.17

[完整视频](http://127.0.0.1:8765/actions/film/exports/index-v17.html) · [本句试听](../../audio/film/voice-v17/S17-01-05-corrected.wav) · [MP4](exports/film-complete-captioned-voiced-v17.mp4) · [SRT](exports/film-subtitles-v17.srt) · [动态预览](http://127.0.0.1:8765/actions/film/preview.html)

原32.23–38.15秒整句含Todo list，原发音短语的双语识别均接近Title list。将发音输入改为to do list，以同一微软云扬、rate=-5%、pitch=-2Hz重录完整句；1次新请求，字幕与人工稿不改。新句5.80秒，仍放在原6秒字幕显示窗口内，发音元数据为to／do／list；原始短语中英文识别、完整句中文识别以及最终AAC英文识别均通过。辅助识别不冒充人工听审。

只匹配该句音量并限制峰值，延迟补偿开启，无变速；32.23–38.15秒之外的48kHz／24bit母带采样逐个相同。视频直接复制v16 H.264码流，8400帧的画面码流SHA完全相同；65条字幕文件字节相同，仍280秒／1080p30，片尾14秒静音。完整解码和AAC与母带比对通过，旧v16媒体及六章人工稿均有SHA保护。

默认播放器为v17；动态预览沿用scenes-v16.mjs和captions-v16的原排时，只更换旁白母带。字幕SRT／VTT的v17下载副本与v16字节一致。v16的78张编码画面检查适用于本版逐字节相同的H.264码流，无需重新生成人物或渲染画面。

复现：pronunciation-v17.py只合成这一个整句，已有请求则校验缓存；patch-pronunciation-v17.py匹配响度、置换母带句子并复制视频码流；verify-pronunciation-v17.py本地核查实际AAC中的短语。Python运行环境沿用/private/tmp/myvideo-voice-venv。修订输出拒绝覆盖既有MP4，不重跑整片生图或TTS。未来版本应保留发音词典映射Todo list→to do list，文案仍按人工原稿。

证据在provenance/pronunciation-v17：initial-check.json、corrected-check.json、alignment.json、verification.json、protected-inputs.json；原始请求在arts/audio/film/voice-v17/raw/。完整MP4与WAV哈希见verification.json及exports/film-complete-captioned-voiced-v17-manifest.json。
