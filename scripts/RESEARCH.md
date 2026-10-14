# 参考研究

## 视频一：pdoom MV

**B站：** [吓哭了Opus5.5 AGI概念MV](https://www.bilibili.com/video/BV18ta86EEHb)
**原始仓库：** https://github.com/mexicat/pdoom-video （主流fork：JohnHeibel/PDoomVideo，2086 stars）
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

简介无技术说明，无仓库链接。已知由 Claude Opus 5.5 生成，时长约 3~5 分钟。给观看者强烈的情感冲击——孤独感、灵魂感，甚至有些惊悚。具体制作流程暂不明确。

**对我们的参考价值：** 作为创作目标的情感基准——不追求炫技，追求让人"感觉有灵魂"。

---

## 视频三：《从现在看过去——AI简史》

**B站：** [震惊瘫坐！Opus 5.5生成-从现在看过去-AI简史](https://www.bilibili.com/video/BV1H8av6HEYs)
**UP主：** 铼夏LAYccc

Opus 5.5 纯代码生成，6分多钟，修改了8次、人工把控了部分节奏。无仓库链接。

**对我们的参考价值：** 证明 Opus 5.5 代码生成视频可以做到6分钟以上；"修改8次"说明迭代是正常流程，不是一次性生成。

---

## GitHub 参考仓库

### 制作方法路线

**路线A：纯代码渲染（pdoom 路线）**
用 Claude 生成 TypeScript + three.js / p5.js 代码，每帧是时间的纯函数，headless Chrome 导出。适合精确 beat-sync 和复杂几何视觉。

代表仓库：
- [mexicat/pdoom-video](https://github.com/mexicat/pdoom-video) — 原始架构，MIT，可直接 fork
- [JohnHeibel/PDoomVideo](https://github.com/JohnHeibel/PDoomVideo) — 2086 stars，最活跃的 fork
- [okazaky/claude-skill-lyric-mv-3d](https://github.com/okazaky/claude-skill-lyric-mv-3d) — 基于 pdoom-video 的 Claude Code Skill，已支持中文字体（Noto CJK）和竖屏，**直接可用**

**路线B：水彩 / 手绘风格（p5.js 路线）**
[zeigarnick/upping-my-pdoom](https://github.com/zeigarnick/upping-my-pdoom)

仅用**两条提示词**完成，Claude Code 自动拆分成15个并行子 agent 各做一个 scene。关键信息：
- 第一条 prompt：给音频 + 歌词 + 一张角色图，说风格（水彩、p5.brush）和原则（不指定分镜）
- 第二条 prompt：要求用并行子 agent 分场景制作
- 用 Whisper + librosa 做音频分析，Demucs 修正人声起始时间
- 渲染器同样是确定性的（帧 = f(t)），600+ 个水彩 sprite 预渲染进 WebGL framebuffer，每帧合成

**路线C：AI视频生成 + WebGL 着色器后处理（riso-cel 路线）**
[2606156052/Pdoom-video-anime-version](https://github.com/2606156052/Pdoom-video-anime-version)

用 Seedance / Seedream 生成原始素材，再通过自定义 WebGL 着色器管线转成手绘风格。管线：
```
AI生成素材 → Kuwahara滤镜（边缘保持/色块化）→ XDoG（手绘墨线）
→ 限色量化（纸白/墨黑/橙/琥珀等）→ 45°网点叠印 → 12fps 手绘抖动
```
结果是"90年代动画赛璐珞 + Risograph 孔版印刷"风格。**这条路线与我们计划用 SeedDance 的方向直接相关。**

---

### 提示词与平台参考

**[Hao0321/ai-media-generator](https://github.com/Hao0321/ai-media-generator)** — 262 stars

跨14+平台的 Claude Code Skill，核心价值是平台专属提示词公式。

Seedance 专用8维提示词公式：
```
Subject（主体+外观）+ Action（单个动词）+ Scene（环境）+ Light（光线）
+ Camera（运镜：低角度手持tracking / 缓慢推进等）+ Style（美学）
+ Quality（清晰度）+ Constraints（不抖动、不变形、不多肢、稳定地平线、稳定时间一致性）
```

关键规则：
- Seedance 用中文训练，英文导演名（如 Deakins）在 Seedance 上是**弱信号**，要换成具体的光线/运镜描述
- `cinematic, 8k, beautiful, masterpiece` 这类词在任何平台都是无效 token
- Constraints tail（约束尾缀）必须写：`不抖动、不变形、不多肢、稳定地平线、稳定时间一致性`

示例（古代将军，Seedance 中文）：
```
古代中国将军主角，身披金色鳞甲、红披风在风中翻飞，手持青铜宝剑前举，
骑黑色战马在黎明战场上缓慢冲锋。战场远处千军列阵、红色战旗猎猎、尘雾漂浮。
金色逆光晨雾、荧光轮廓。低角度手持 tracking 镜头沿马侧跟拍，轻微晃动、稳定地平线。
墨色留白东方美学、史诗写实电影感。慢动作、流畅、连贯、不僵硬、720p 高清。
不抖动、不变形、不多肢、稳定地平线、稳定时间一致性。
```

---

## 我们的方向

选题：第四讲 马克思主义科技社会观——「如何驯化 LLM，亲朋好友如何使用 AI？」

制作思路：AI 生成视频，探索 LLM 在普通人生活中的真实处境。可能引入 SeedDance 模型。

截止：2026-10-21 24:00
