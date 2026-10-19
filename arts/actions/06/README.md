# 第06章 · 效率收益与人的自由

**2026-10-19入点适配：** 全片FILM_PREVIEW v0.5使用entry-from-05-v03.mjs，在06首0.4秒保留新05“排期与收益配置／调整提议待讨论”的实际末画面，然后进入本章原基础配置图。05成果已人工验收、下一项正在执行；不提前批准员工提议或自动分配收益。[实际05→06边界](../05/provenance/story-v03/boundary-to-06-v03.json)与4秒编码接缝已检查。06原scene／字幕／独立历史播放器不改，S06_STORY_LOGIC v0.1的真实共同讨论与生活演出仍待后续制作，不能把入点适配记作新版06完成。

**全片统一入口：** [01–06动态框架](../film/README.md) · [连续播放](http://127.0.0.1:8765/actions/film/preview.html)。原章入口与历史制作记录继续保留。

**S06 v0.1**：58秒／1920×1080／30fps／1740帧，12镜，无声字幕审核候选。沿用第一、二章角色、工位、文件及暖白图解。原110字符口播逐字保留，9条字幕在44秒结束；末14秒为两张各7秒文献卡。

- [完整MP4](exports/06-complete-silent-v01.mp4) · [本机播放页](http://127.0.0.1:8766/arts/actions/06/exports/index.html)
- [交互时间轴](preview.html) · [分镜联系表](exports/06-contact-v01.png) · [镜头制作单](provenance/v01/chapter-plan.md)
- [SRT](captions/06-v01.srt) · [字幕JSON](captions/06-v01.json) · [VTT](captions/06-v01.vtt)
- [输入／源码快照](provenance/v01/input-manifest.json) · [素材验证](provenance/v01/asset-validation.json) · [验证记录](provenance/v01/verification.json) · [渲染清单](exports/06-v01-manifest.json)
- [05→06衔接提案](provenance/v01/boundary-from-05-v01.json)

依次展示同一份节约的互斥配置、劳动者参与排期与收益配置、经人工验收后画出工作边界、完整人物起身离席。机器执行可继续，但无需即时响应的后台运行不计为人的劳动。所有条长是示意，无实测数据。示意任务使用独立ID，不重置01已验收或排期对象。

本轮无外部模型、imagegen或声音调用，采用原PNG完整姿态，不拼接肢体、不长叠化两个身体。阶段切换使用明确剪切及局部对象移动，未把缺失的05动画当已验证接缝。

## 复现

本章不读取任何旧MP4。需要Node≥22、FFmpeg／ffprobe、sharp0.35.5，以及中文字体。实际环境与工具版本见清单；图解优先PingFang SC，字幕优先Hiragino Sans GB，替换字体会影响字形与排版。不同平台、字体和编码器版本不承诺相同文件哈希。

在仓库根目录安装章内依赖：

```sh
npm install --prefix arts/actions/06
node arts/actions/06/build.mjs --video
```

本机已安装sharp，可直接：

```sh
NODE_PATH=/Users/bytedance/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules node arts/actions/06/build.mjs --video
```

已有MP4时脚本拒绝覆盖；用新的输出目录复渲染，或显式归档旧输出后再运行：

```sh
node arts/actions/06/build.mjs --video --output-dir /tmp/chapter06-rerender
```

不加`--video`只生成静帧、状态、字幕、预览和输入快照，会更新这些派生产物。逐帧构图仅依赖章内时间；无随机生图。本轮在同一环境分别导出到项目目录和独立临时目录，两份完整MP4的SHA-256相同，证据见verification.json。MP4沿用项目gitignore，不自动入库。

## 当前检查及待补

1741状态采样、110字符原文、单一节约资源、两方案重置、人工审核后通过、单层完整人物、素材尺寸／透明度／哈希、58秒媒体规格、连续30fps时间戳、全程解码和黑帧检查通过。33个代表时点含转场、起身、离席、文献切点，并提取编码后PNG复查。

无配音，字幕仍待语速校准；课程成员待填写；05已制作，真实编码接缝已检查，见[共用衔接契约](../05/provenance/v01/boundary-to-06-v01.json)与[接缝预览](../05/exports/05-to-06-seam-v01.mp4)。全片03:42起点仍为当前预算，若前章时长变动需调整全片偏移。第03、04由其他人负责，本轮未改动其文件；本章尚未用户冻结，未push。

2026-10-16接续更新：第05章制作完成，06视频与场景源码不变；原05文档作为06留档输入，其制作说明与入口链接随后更新，原音频未改，差异已登记在媒体清单中。
