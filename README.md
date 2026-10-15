# 《当效率成为义务》——Agent 时代的劳动悖论

马克思主义科技社会观课程的解释型 Video Essay，讨论 Agent 提高执行能力后，效率收益如何可能转化为新的劳动要求，以及劳动者能否相应获得自由时间与决定权。

**当前状态：** 按本轮授权完成六章音画分配：口播精简并修正事实，情境与图示写入 video content，待试听和内容审核。所有有效版本以 [PROJECT_STATE](scripts/PROJECT_STATE.md) 为准。

- **课程要求：** 成片 3～5 分钟；提交截止为 2026-10-21 24:00，原文见 [COURSE.md](COURSE.md)。
- **字符与时间：** 口播840个非空白字符（含标点、英文），低于1,100上限；暂定全片4:40，含14秒文献卡，待实际配音校准。
- **制作路线：** Claude 编写 Remotion / React 动画代码，再渲染成片；具体模型与依赖版本在执行时记录。
- **视觉状态：** 已形成21个文字画面段落；STYLE_BIBLE v0.3明确故事＋逻辑双轴与角色识别优先，ART_DIRECTION提供角色、场景、动态图解和代表镜头提案。具体造型待验证，尚未生成素材、代码或视频。

## 工作文件

| 入口 | 用途 |
|---|---|
| [PROJECT_STATE](scripts/PROJECT_STATE.md) | 主题、版本矩阵、时长与审批状态的唯一索引 |
| [六章工作文本](scripts/final/shot/README.md) | SHOT_TEXT v0.4；每章含 audio content、video content 与音画尾注 |
| [OUTLINE](scripts/final/OUTLINE.md) | 与六章正文对应的内容结构 |
| [CREATIVE_BRIEF](scripts/style/CREATIVE_BRIEF.md) | 核心问题、概念与表达边界 |
| [STYLE_BIBLE](scripts/style/STYLE_BIBLE.md) | 全片唯一候选风格规范 |
| [ART_DIRECTION](scripts/style/ART_DIRECTION.md) | 双轴艺术方向审议：角色、情节分层、逻辑对象与代表镜头 |
| [STYLE_REFERENCES](scripts/style/STYLE_REFERENCES.md) | 历史参考视频、仓库、技术线索与本地图片索引 |
| [PRODUCTION_BLUEPRINT](scripts/style/PRODUCTION_BLUEPRINT.md) | Claude / Remotion 制作流程与交付物 |
| [PRODUCTION_PROTOCOL](scripts/style/PRODUCTION_PROTOCOL.md) | 版本绑定、渲染与留档规则 |
| [RESEARCH](scripts/doc/RESEARCH.md) | 当前核查入口 |
| [SOURCES](scripts/doc/SOURCES.md) / [FACT_CHECK](scripts/doc/FACT_CHECK.md) | 统一来源、概念表与逐章核查报告 |
| [GENERATION_LOG](scripts/doc/GENERATION_LOG.md) | 当前制作路线的正式记录入口 |
| [HANDOFF](scripts/HANDOFF.md) / [TODO](TODO.md) | 协作交接与下一步 |
| [本轮归档](.tmp/archive-2026-10-15-project-sync/README.md) | 旧文件、整理前快照及校验清单 |

`assets/references/` 中图片仍是未选用参考。旧第一段 demo、对应临时配音和旧旁白已放入 `.tmp`，不可当作当前制作输入。

项目安装了 `storyboard-prompt-assistant` 与 7 个 Remotion 官方 skills：Claude 使用 `.claude/skills/`，Codex 通过 `.agents/skills/` 的链接读取同一份文件。

## 工作顺序

审核六章音画分配 → 临时配音校时、角色与故事及逻辑设计 → 分层子镜头 → Remotion代表镜头预览与风格验证 → 分章实现 → 正式声音、字幕与成片导出。

文件名中的 `final`、旧稿中的“定稿”或历史“已批准”字样，不单独代表当前工作版本已经审核冻结。每次实际冻结需留下确认依据与文件哈希。
