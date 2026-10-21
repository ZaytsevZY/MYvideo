# 完整成片 v0.18

[播放](http://127.0.0.1:8765/actions/film/exports/index-v18.html) · [完整MP4](exports/film-complete-final-v18.mp4) · [字幕SRT](exports/film-subtitles-final-v18.srt) · [字幕VTT](exports/film-subtitles-final-v18.vtt) · [验证记录](provenance/final-v18/verification.json)

新版01–06全流程，280秒／8400帧／1920×1080／30fps，H.264画面与48kHz单声道AAC配音。65条统一44px字幕已烧录在视频里，SRT／VTT为独立下载副本。云扬采用v17完整配音，to do list英语读音已修订；最后14秒参考文献静音。

画面直接采用v16原生SVG／PNG逐帧烘焙结果，与v17视频码流逐字节相同；声音直接采用v17已校准AAC，与v17音轨码流逐字节相同。执行正式无损封装与faststart交付，没有再次栅格化或有损编码，没有新图像／TTS调用。纯补绘人物、06原绘稿、当前字幕与人工口播稿均保持。不能将这次正式封装记为新增人物动作或新一轮画面渲染。

完整解码、连续8400视频PTS、全片无黑帧、媒体规格、音视频payload SHA、16项源文件保护及17张最终文件抽帧已检查。继承v16对全部8400帧／72节点／153素材／四组五态与78编码抽帧的检查，继承v17英语短语识别、音频样本／峰值／末14秒静音检查；通过逐字节一致性确认这些结果仍适用。本轮未声称人工听审。

保留内容项：06末张参考文献卡仍显示“课程成员：待填写”。尚未提供姓名，导出保留原文并已向用户说明；交付文件生成不等同成员信息完成。

运行`python3 arts/actions/film/finalize-v18.py`复现正式封装与验证。脚本拒绝覆盖已存在的v18视频，历史媒体不得删除来绕过保护；后续有内容修改应采用下一版本。播放器为exports/index-v18.html及默认exports/index.html，动态框架继续preview.html／preview-v17.html。

MP4大小：44,042,495字节。SHA256：`da7960765382d92655eda0e043825bd1c397eab60c0bf00dee886b8c5e2c7b04`。命令、输入哈希、抽帧、FFprobe和解码日志见provenance/final-v18/；成片清单位于exports/film-complete-final-v18-manifest.json。
