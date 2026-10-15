# 第一段视频 demo

本目录是《当效率成为义务》第一段的候选技术样片，不是正式镜头冻结版本。

## 输入

- 旁白：`scripts/NARRATION_FINAL_v1.4.md` 第一章
- 临时配音：`assets/audio/segment-01-adrian-v4.mp3`
- 风格：`STYLE_BIBLE_DEMO_v0.1.md`
- 对轴：`subtitles.srt`

## 复现

```bash
zsh demos/first-segment/render.sh
```

输出：`output/segment-01-demo-v0.1.mp4`

## 已知限制

- 真实配音为 39.16 秒，超过原大纲为第一段预留的 22 秒。
- 字幕为基于静音边界的句子级粗对轴，正式制作前需逐句听校。
- Adrian + Eleven v4 当前只作为临时基准音色。

