# 视频、仓库与视觉参考

**版本：** STYLE_REFERENCES v0.2 · 2026-10-15
**用途：** 恢复历史制作调研，供当前六章分镜和风格设计使用；具体参数统一落在 [STYLE_BIBLE](STYLE_BIBLE.md)。

**当前取舍：** 用户已明确避免MV与slide叙事，采用故事＋逻辑双轴，角色识别优先。下面历史资料继续保留，但音乐卡点、空镜与纯文字分镜不作为当前方法；具体角色、情节、动态图解和代表镜头见 [ART_DIRECTION](ART_DIRECTION.md)。

## 恢复来源

用户指定提交 `80a999eee84c46f344331921f57a9b66aa149c79` 的 `scripts/RESEARCH.md` 已将制作参考替换为理论研究。此次从该提交父版本中恢复被删除的参考部分；该文件最近一次修改为 `0d15be5e668348fc50278e3b223df239f74bad99`，Git blob 为 `9623d5215fa793435b1f8908772b1d91675ad047`。

以下视频介绍、仓库能力与实现细节均为**历史调研记录**，本次恢复未重新在线观看或检出仓库验证。模型归属、制作次数、许可证与性能参数须在实际采用时核对；旧 star 数和“最活跃”“直接可用”等时效性判断不作为当前结论。参考作品中的音乐、字体与素材不因列在此处而成为本片可用资产。

## 参考视频

| 编号 | 视频与链接 | 历史记录 | 对本片的参考用途 |
|---|---|---|---|
| V1 | [吓哭了Opus5.5 AGI概念MV](https://www.bilibili.com/video/BV18ta86EEHb)；[YouTube 4K入口](https://www.youtube.com/watch?v=5EoO5413dBY) | pdoom MV；旧稿记为 Claude Code 对话生成代码后渲染，关联 R1、R2 | 参考代码方法、跨场景色板和字体一致性；不采用MV叙事、音乐卡点与纯文字填充 |
| V2 | [震惊瘫坐！Opus 5.5生成短片《我从未见过太阳》](https://www.bilibili.com/video/BV1b9ad6xEnD) | UP主“霍华德vlog”；旧稿记约3～5分钟，情感体验包括孤独、惊悚；无明确流程和仓库链接 | 参考情绪积累、留白与结尾余韵；片长、模型和生成方式仅保留为旧稿描述 |
| V3 | [震惊瘫坐！Opus 5.5生成-从现在看过去-AI简史](https://www.bilibili.com/video/BV1H8av6HEYs) | UP主“铼夏LAYccc”；旧稿记代码生成、6分多钟、修改8次并由人调整部分节奏；无仓库链接 | 参考长篇知识叙述的段落推进、章节衔接和人工节奏修订；不据此推算本片制作次数 |

## 参考仓库

| 编号 | 仓库 | 历史记录中的定位 | 当前使用方式 |
|---|---|---|---|
| R1 | [mexicat/pdoom-video](https://github.com/mexicat/pdoom-video) | pdoom 原始代码架构；旧稿记为 MIT | 参考时间驱动的渲染、场景模块化、音画数据与导出结构；若复用代码，先核对当前版本与许可证 |
| R2 | [JohnHeibel/PDoomVideo](https://github.com/JohnHeibel/PDoomVideo) | R1 的 fork | 与 R1 对照实现；不沿用旧 star 数或活跃度排名 |
| R3 | [okazaky/claude-skill-lyric-mv-3d](https://github.com/okazaky/claude-skill-lyric-mv-3d) | 基于 pdoom 的 Claude Code Skill；旧稿记支持 Noto CJK 中文字体与竖屏 | 参考中文字体加载、场景组织及技能封装；此处恢复链接，不表示本项目已安装或验证该 Skill |
| R4 | [zeigarnick/upping-my-pdoom](https://github.com/zeigarnick/upping-my-pdoom) | p5.js / p5.brush 水彩路线 | 参考手绘笔触、纸面质感、预渲染素材合成和场景风格一致性 |
| R5 | [2606156052/Pdoom-video-anime-version](https://github.com/2606156052/Pdoom-video-anime-version) | Seedance / Seedream 素材配合 WebGL 后处理，riso-cel 风格 | 参考限色、墨线、网点和低帧率质感；当前采用 Claude 编写动画代码的路线，保留其美术参考 |
| R6 | [Hao0321/ai-media-generator](https://github.com/Hao0321/ai-media-generator) | 多平台媒体生成 Skill 与提示词资料；旧稿记覆盖14+平台 | 参考将主体、动作、环境、光线、运镜与风格具体化的描述方式；平台专属能力待实际使用时核对 |

### R1 / R2：确定性代码动画与统一视觉系统

历史记录保留的实现线索：

- TypeScript + three.js，bun + Vite；headless Chrome / playwright-core 导出帧，ffmpeg / libx264 编码。
- 帧画面由时间 `t` 决定，避免依赖播放过程中积累的随机状态与帧计数。本片可将此原则映射到 Remotion 的帧号与固定随机种子。
- Python / uv、Demucs `htdemucs_ft` 分轨、Whisper 与 CTC 对齐；歌词数据以 `word.start` / `word.end` 驱动字词动画。本片采用中文旁白句子时间轴，需要强调时再细化到词。
- 旧稿记录17个 Scene，使用铜版画刻线、示波器、官僚表格、光线步进3D、纺织纹样等不同视觉语言，并共享色板、字形与后处理。
- 色板记录：ink / bone / signal（`#FF4D12`橙）/ ember / blood，少量 acid（`#D8FF3C`）；未提供色值的名称不补造色值。
- 字体记录：Archivo（歌词）、IBM Plex Mono（机器与标注）、Cormorant Garamond（预言或神圣语气）、由 spark 写出的单线刻字；全局 grain / halation / bloom。中文需要另设字库和回退，不直接套用拉丁字体。
- 节奏记录：切镜和动作对齐 downbeat，hits 对齐 kick / snare；`audio.json` 包含 beats、downbeats、sections、onset、响度包络，旧曲 BPM 为132.007。该数值属于参考音乐，不用于本片旁白。
- 自适应运动模糊记录：32×32px tile，12 / 36 / 108 / 324个子帧采样。它是历史实现参数，本片是否需要运动模糊由可读性和渲染成本决定。

历史工程结构：

```text
analysis/          align.py、analyze.py 等音频分析
data/              lyrics.json、audio.json
app/src/engine/    timeline、post、typography、LineBatch、HUD
app/src/scenes/    分场景模块
app/src/timeline.ts  场景窗口与节拍对齐
scripts/render.ts  headless Chrome → raw frames → ffmpeg
```

### R4：水彩 / 手绘

旧稿记录其用两条主要提示词组织制作：第一条提供音频、歌词、角色图和水彩 / p5.brush 方向，第二条要求按场景并行制作；记录中为15个子 agent。音频分析使用 Whisper + librosa，再由 Demucs 修正人声起点；600+水彩 sprite 预渲染到 WebGL framebuffer 后合成，帧由时间决定。

本片可借鉴水彩的边缘、笔触、纸面留白与有限色彩。上述提示词数量和并行安排属于参考项目的历史说明，不构成本项目的执行指令或质量保证。

### R5：赛璐珞与 Risograph 孔版印刷

历史记录的处理链为：

```text
Seedance / Seedream 素材
→ Kuwahara（边缘保持与色块化）
→ XDoG（墨线）
→ 限色量化（纸白 / 墨黑 / 橙 / 琥珀等）
→ 45°网点叠印
→ 12 fps 手绘抖动
```

旧稿将其概括为“90年代动画赛璐珞 + Risograph 孔版印刷”。当前代码动画也可参考其中的色块、墨线和印刷质感；字幕、研究卡和图表保持稳定清晰，低帧率质感仅作用于适合的画面层。

### R6：提示词描述资料

恢复旧稿的八维结构：`Subject 主体与外观 + Action 动作 + Scene 环境 + Light 光线 + Camera 运镜 + Style 美学 + Quality 质量目标 + Constraints 约束`。当前将其用于检查分镜描述是否具体，并转换成组件、运动和视觉参数。

旧稿还记有“英文导演名是弱信号”“cinematic / 8k / beautiful / masterpiece 在任何平台都是无效 token”及必须附固定约束尾缀等说法。本次未核验这些平台经验，不将其作为普遍规则。历史约束示例为“不抖动、不变形、不多肢、稳定地平线、稳定时间一致性”；代码动画应改写成可检查的几何、镜头与时间行为。

## 本地参考图片

以下为现有文件，按历史文件名关联，尚未逐帧核对出处或批准用于成片：

| 关联方向 | 本地文件 |
|---|---|
| V1 pdoom | [video1-pdoom-cover.jpg](../../assets/references/video1-pdoom-cover.jpg) |
| V3 AI简史 | [video3-AI史-cover.jpg](../../assets/references/video3-AI史-cover.jpg) |
| 水彩 | [watercolor-poster.jpg](../../assets/references/watercolor-poster.jpg)、[watercolor-stills.jpg](../../assets/references/watercolor-stills.jpg) |
| 动画 / 印刷质感 | [anime-contact1.jpg](../../assets/references/anime-contact1.jpg)、[anime-contact2.jpg](../../assets/references/anime-contact2.jpg) |

## 与当前六章的衔接

| 当前内容 | 可参考的处理 | 要在样片中落实的判断 |
|---|---|---|
| 01、03：夜间派发、工作日与响应边界 | V2的情绪留白；R4的纸面与手绘情境 | 人的直接操作、机器执行与休息在同一画面中可辨 |
| 02、04：需求扩大、竞争与任务基准 | V1 / R1的字形、几何变化与场景模块化；V3的章节推进 | 一次变化只表达一个机制；研究观察与分析示意具有不同标记 |
| 05：工具权限与生产决定权 | R1的表格 / HUD；R5的限色和墨线 | 工具节点与组织规则节点分明；装饰不遮挡因果关系 |
| 06：自由时间与结尾 | V2的停顿；R4 / R5的留白和有限色彩 | 画面终点与机器持续运行可同时呈现，文献卡有足够阅读时间 |

以上是历史参考如何服务内容的候选建议。当前以统一二维卡通、可识别角色与连续动态图解为首选提案，纸面、印刷和深色参数只保留为美术比较材料；样片确定后，将实际采用的色板、中文字体、纹理、动作与转场写入同一版 STYLE_BIBLE。历史“情绪留白”只用于有内容职责的停顿，不新增空镜。
