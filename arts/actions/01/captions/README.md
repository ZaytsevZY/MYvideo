# 01 · 口播稿字幕

**版本：** S01_CAPTIONS v0.1 · 2026-10-16。

字幕来自scripts/final/shot/01.md的`<start>`／`<end>`之间，保留原文字、标点和Agent拼写，共14段。仅将原段落空白合并，不改口播正文。

JSON遵循Remotion captions的Caption结构：text、startMs、endMs、timestampMs、confidence。未录音，后两项为null；时间按语义和现有镜头暂排，不能称为语音强制对齐。

- [JSON](01-narration-v01.json)：字幕时间轴。
- [SRT](01-narration-v01.srt)／[VTT](01-narration-v01.vtt)：可编辑的外置字幕。
- [bake-captions.mjs](bake-captions.mjs)：从口播核对文本并导出全部字幕数据，发现漏字／重字／时间断层会失败。
- [captions.mjs](captions.mjs)：预览与视频共享的字幕绘制，固定屏幕位置，不随镜头缩放。

字幕为44px白字、深色半透明局部底框，底部约18px边距；位于操作小窗下方。运行：

```sh
node arts/actions/01/captions/bake-captions.mjs
node --test arts/actions/01/captions/captions.test.mjs
```

无配音、无音效；最终音轨录制后需再校时。
