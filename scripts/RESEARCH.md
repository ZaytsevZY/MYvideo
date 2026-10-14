# 参考研究

## 视频一：pdoom MV

**B站：** [吓哭了Opus5.5 AGI概念MV](https://www.bilibili.com/video/BV18ta86EEHb)
**原始仓库：** https://github.com/mexicat/pdoom-video
**YouTube 4K：** https://www.youtube.com/watch?v=5EoO5413dBY

完全由 Claude Opus 5.5 在 Claude Code 里对话生成代码，再渲染出的 MV。

### 技术栈

| 层 | 工具 |
|---|---|
| 渲染器 | TypeScript + three.js |
| 构建 | bun + Vite |
| 音频分析 | Python/uv + Demucs（分轨）+ Whisper + CTC（逐词对齐）|
| 视频编码 | ffmpeg / libx264 |
| 离线导出 | headless Chrome（playwright-core）|

### 核心创新

**确定性渲染**
每一帧都是时间 `t` 的纯函数，不依赖任何随机状态或帧计数。浏览器实时预览与离线导出逐帧完全一致。这是整套工程的基础假设，决定了运动模糊采样和多进程导出都能成立。

**逐词歌词同步**
用 Demucs `htdemucs_ft` 分离人声，再用 CTC 强制对齐 + Whisper 交叉验证，获得逐词（部分逐音节）时间戳。动画锚定到 `word.start` / `word.end`，不是逐行字幕。

**自适应运动模糊采样**
每帧按 32×32px tile 独立决定采样数（12 / 36 / 108 / 324）。静止区域 12 个子帧即停，高速甩镜自动升到 108~324。平均代价远低于全帧固定高采样。

**分镜模块化（17 个 Scene）**
每个 scene 有完全不同的视觉语言（铜版画刻线、示波器、官僚表格、光线步进 3D、纺织纹样……），但共享同一套：
- 调色盘：ink / bone / signal(#FF4D12 橙) / ember / blood，极少量 acid(#D8FF3C) 作为唯一点缀色
- 字体系统：Archivo（歌词主声）/ IBM Plex Mono（机器/标注）/ Cormorant Garamond（预言/神圣语气）/ 单线刻字体（由 spark 写出）
- 全局 grain / halation / bloom 后处理

**Beat-sync 动画**
所有切镜、动作落在 downbeat；hits 对齐 kick/snare。时间数据来自 `audio.json`（BPM 132.007，beats、downbeats、sections、onset 事件、响度包络）。

### 仓库结构要点

```
analysis/       音频分析脚本（align.py / analyze.py）
data/           lyrics.json（逐词时间戳）/ audio.json（节拍/响度）
app/src/
  engine/       渲染核心：timeline、post、typography、LineBatch、HUD
  scenes/       每个 scene 一个模块
  timeline.ts   编辑：scene 窗口锚定到歌词行 + snap 到节拍网格
scripts/render.ts  离线导出（headless Chrome → raw frames → ffmpeg）
```

---

## 视频二：《我从未见过太阳》

**B站：** [震惊瘫坐！Opus 5.5生成短片《我从未见过太阳》](https://www.bilibili.com/video/BV1b9ad6xEnD)
**UP主：** 霍华德vlog

简介无技术说明，无仓库链接。已知由 Claude Opus 5.5 生成，时长约 3~5 分钟。
给观看者强烈的情感冲击——孤独感、灵魂感，甚至有些惊悚。
具体制作流程（图像串联 / 视频模型 / 其他）暂不明确。

**对我们的参考价值：** 作为创作目标的情感基准——不追求炫技，追求让人"感觉有灵魂"。

---

## 我们的方向

选题：第四讲 马克思主义科技社会观——「如何驯化 LLM，亲朋好友如何使用 AI？」

制作思路：AI 生成视频，探索 LLM 在普通人生活中的真实处境。可能引入 SeedDance 模型。

截止：2026-10-21 24:00
