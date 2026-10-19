# 第06章 · 效率收益与人的自由

**当前采用：S06_STORY v0.3 · FILM_PREVIEW v0.6（2026-10-19）。** [独立动态预览](http://127.0.0.1:8765/actions/06/preview.html)／[全片从06开始](http://127.0.0.1:8765/actions/film/preview.html?frame=6660)。

06已完成S06_STORY v0.3：15镜／58秒／1740帧，故事24.4秒、逻辑33.6秒（含14秒来源）；复用已采用16张完整绘稿与9项库存，保持六章脚本、采用美术及01–05运行实现原字节。0–16秒双窗配置与偏好，16–23.4秒开发／测试／记录／核对，23.4秒共同确认后引出C8短引文及工会／集体协商资料，27秒切后来履约，28.3秒人工验收，29–31秒持包离开，31–44秒购书→剧场→阅读翻页，44–58秒独立文献页。110字符口播同步9条运行字幕，44秒结束。

全片FILM_PREVIEW v0.6保持280秒／8400帧、69条字幕，现72段跳转、142项去重库存。05待讨论排期页在06预算内精确保留12帧，提议到23.4秒才在说明情境共同确认；T06-final另建，05两项历史状态保留。31秒后生活不被工作打断；阅读只以纸色接画外文献，不把小说改作《资本论》内容。

32项测试与全片8400帧接口检查通过，46张全尺寸代表帧、两处各4秒120帧960×540／30fps H.264无音轨接缝已编码、完整解码和抽帧目视，浏览器142项加载／15镜跳转／播放／字幕开关／末页字幕退出通过。44项输入SHA保护通过。无新增图像或外部生成模型、声音；本轮未导出新版06全章或全片MP4。人物仍为有限完整关键姿态剪辑，字幕为无配音语义排时，课程成员信息待填写，尚未用户冻结。

[46帧联系表](provenance/story-v03/contact-v03.png)／[验证](provenance/story-v03/verification.json)／[运行字幕JSON](captions/06-narration-v03.json)／[SRT](captions/06-narration-v03.srt)／[05→06契约](provenance/story-v03/boundary-from-05-v03.json)／[生活→片尾契约](provenance/story-v03/boundary-to-ending-v03.json)。

当前复现：`node arts/actions/film/build.mjs`重建统一包；`node --test arts/actions/06/story-v03.test.mjs arts/actions/film/framework.test.mjs`验证；`node arts/actions/06/qa-story-v03.mjs`重绘代表帧与两处编码接缝。入口preview.html／full-preview.html均使用story-player-v03.mjs，旧独立页面另存preview-basic-v01.html。当前25项资源引用已采用原路径；不重跑旧build.mjs或带旧运行SHA保护的素材builder。下方是素材、剧本及基础版历史记录。


**当前素材已备：S06_ART v0.2（2026-10-19）。** [素材检查页](http://127.0.0.1:8765/static/06/story-assets-v02/preview.html)／[24态联系表](../../static/06/story-assets-v02/compositions/contact.png)／[采用素材、英文prompt与验证](../../static/06/story-assets-v02/README.md)。内置image_gen18次调用，16张完整PNG采用、2张包型／重复包首稿修正后留过程；工位6张、讨论4张、购书／剧场／阅读翻页6张。复用9项库存，共25项注册资源、10组24构图；原计划两套起身／离开合并复用。完整人物、桌椅、纸张、书和袋物同透视，纸面／验收UI／来源文字独立。

35项脚本、计划、旧字幕与当前运行输入保持，25PNG／24SVG引用与SHA及浏览器素材检查通过。本轮仅美术与代表构图，不改110字符口播、正式字幕或film v0.5，不生成声音／视频；新58秒动态与05→06／06→片尾接缝仍待后续制作。下一步从assets.mjs／layout.json接15镜，勿重跑旧06/build覆盖采用入口。下方脚本阶段“待生图”说明为历史状态。

**当前分镜：S06_STORYBOARD v0.2 · 2026-10-19。** 按[06人工三条提示](../../../scripts/final/shot/06.md)细化15镜／58秒／1740帧，110字符口播原字节保留；故事24.4秒、逻辑33.6秒（含14秒来源）。[逐镜制作单](provenance/storyboard-v02/chapter-plan.md)／[排时JSON](provenance/storyboard-v02/shot-timing.json)／[素材缺口](provenance/storyboard-v02/asset-plan.md)／[文字与排时验证](provenance/storyboard-v02/verification.json)。

0–16秒由人＋Agent的同一效率变化指向两扇并行真实工位小窗：企业／负责人关注更多交付，员工关注更短工时，作为该说明情境中的选择倾向，不作统计断言。16–23.4秒真实桌边讨论开发范围、测试／验收与截止边界；23.4–27秒由同一确认页引出《资本论》第三卷短引文及工会参与／集体协商资料；27–31秒跳到后来履约时刻，人验收后按约定离开。31–44秒连续演购书、看演出、回家阅读，不再执行旧提纲的31秒回看工位；44–58秒以纸白匹配独立画外出处，两张各7秒。

新版需要两窗动作、三人真实协商、履约收工及生活场景完整绘稿，现仅列约18个关键态计划／22项库存参考，未生成或像素验收。ILO资料已按官方定义核对，C8短引文已核对上下文；普通项目会不冒充正式集体谈判。9条[字幕草稿](provenance/storyboard-v02/narration-cues-draft.json)保持原110字符／44秒结束；本轮没有改旧正式字幕、06／film运行文件或生图、声音、视频。

[新05→06候选](provenance/storyboard-v02/boundary-from-05-v02.json)／[新06→片尾候选](provenance/storyboard-v02/boundary-to-ending-v02.json)均未实测。当前film仍S06 v0.1＋entry-from-05-v03最小适配；上轮已验收接缝不代表新版06场景已完成。05终态S05-PROP-01先待讨论，本章共同核对后才在条件情境形成确认版；S05-T01、S05-T02及01历史不重置，新T06-final另建。无Claude、imagegen或其他外部生成模型调用。下方保留基础版与旧入点历史。

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
