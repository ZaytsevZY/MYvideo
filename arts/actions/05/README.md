# 第05章 · 执行能力与劳动支配

**当前动态：S05_STORY v0.3 · 2026-10-19。** [05独立预览](http://127.0.0.1:8765/actions/05/preview.html)／[全片从05开始](http://127.0.0.1:8765/actions/film/preview.html?frame=5310)／[代表帧](provenance/story-v03/contact-v03.png)。按S05_STORYBOARD v0.2接入13镜、45秒／1350帧（E12秒／L33秒）；155字符口播已逐字同步13条[运行字幕](captions/05-narration-v03.json)／[SRT](captions/05-narration-v03.srt)。排时尚待配音校准，无配音或音效。

双侧关系从入画同时可见：员工依次调用代码／测试／文档，企业侧依次出现目标、周期、分配；调整排期从员工进入组织通道，停在待讨论。故事使用6张采用绘稿：递交→接稳查看→24.8秒人工验收→25.6秒请求指令／25.9秒人物反应→白板广告阅读2.2秒→停顿后重新输入。33.8秒从同一成果页抽出组织反馈，分别强调人的具体指令和组织的目的尺度；43.8秒后同一排期页稳定。人物、桌面、纸张保持整幅透视，不拆肢体或叠化身体；有限关键态之间为明确剪切，尚非连续逐帧人体动画。

**素材来源：** [S05_ART v0.2](../../static/05/story-assets-v02/README.md)的6张新PNG及10项库存原字节复用。本轮无imagegen、Claude或其他外部模型调用。白板“深度和Agent合作”、广告“把重复劳动交给AI干”、等待提示保持原定文案。Agent执行组织安排，不取得雇主身份或自动验收权。

**全片：FILM_PREVIEW v0.5。** 280秒／8400帧、69条字幕、69段跳转、126项去重资源；章节offset不变。04已发布岗位要求精确接05首0.4秒；05的待讨论排期页精确接06首0.4秒，均占下章原预算。06仅新增入点适配器，主体仍S06 v0.1，真实共同讨论等新版06故事尚未制作。CV、旧报告与05新任务身份分离。

**验证：** 24项测试通过，05的1351个状态及全片8400帧接口检查；38张1920×1080代表帧；两侧各4秒／120帧／960×540／30fps无声H.264接缝实际编码、完整解码与抽帧目视；浏览器确认126素材就绪、播放、13镜跳转、字幕开关与06入点。[验证记录](provenance/story-v03/verification.json)／[浏览器画面](provenance/story-v03/browser-film-05.png)／[编码接缝对照](../film/provenance/integration-v05/seams-encoded-v05.png)。六章脚本字节、旧scene及采用素材保持。当前为新动态框架，尚未导出新版45秒全章或全片MP4；旧MP4不代表当前05。

**制作入口：** [动态制作单](provenance/story-v03/chapter-plan.md)／[新运行源码](story-scene-v03.mjs)／[04→05实际边界](provenance/story-v03/boundary-from-04-v03.json)／[05→06实际边界](provenance/story-v03/boundary-to-06-v03.json)。原05.md中“尚未接入”的阶段说明保留为历史原稿，当前采用状态以本页为准；脚本、素材阶段快照不改写。

当前复现（仓库根目录，需sharp和FFmpeg）：

```sh
node arts/actions/film/build.mjs
node --test arts/actions/03/story-v05.test.mjs arts/actions/04/story-v05.test.mjs arts/actions/05/story-v03.test.mjs arts/actions/film/framework.test.mjs
node arts/actions/05/qa-story-v03.mjs
node arts/actions/05/review-seams-v03.mjs
```

仅刷新代表帧：`node arts/actions/05/qa-story-v03.mjs --frames-only`。本机服务根目录为arts，端口8765。旧build.mjs为历史S05 v0.1导出器，不用于当前制作；新版package脚本已指向当前框架与QA。

## 旧运行版与接点记录（历史实现）


**2026-10-18入点适配：** FILM_PREVIEW v0.4采用entry-from-04-v05.mjs，在05原预算首0.4秒保留新04实际已发布JD，随后进入本章原工具调用。只承接“熟练调度多个Agent”的组织要求，HR非直接主管，CV不继承成工具任务；05主体、原MP4与本章独立旧播放器不改，新故事提纲仍待制作。[当前接缝](../04/provenance/story-v05/boundary-to-05-v05.json)。

**全片统一入口：** [01–06动态框架](../film/README.md) · [连续播放](http://127.0.0.1:8765/actions/film/preview.html)。原章入口与历史制作记录继续保留。

**S05 v0.1**：完整45秒／1920×1080／30fps／1350帧，13镜，无声字幕候选。原156字符口播保留，12条字幕暂排。已完成检查，用户授权本轮完成后推送。

- [完整MP4](exports/05-complete-silent-v01.mp4) · [本机播放页](http://127.0.0.1:8766/arts/actions/05/exports/index.html)
- [05→06接缝MP4](exports/05-to-06-seam-v01.mp4) · [衔接契约](provenance/v01/boundary-to-06-v01.json)
- [历史交互时间轴](preview-basic-v01.html) · [编码后分镜联系表](exports/05-encoded-contact-v01.png) · [制作单／13镜表](provenance/v01/chapter-plan.md)
- [SRT](captions/05-v01.srt) · [JSON](captions/05-v01.json) · [VTT](captions/05-v01.vtt)
- [验证记录](provenance/v01/verification.json) · [输入与精确源码快照](provenance/v01/input-manifest.json) · [素材验证](provenance/v01/asset-validation.json) · [媒体清单](exports/05-v01-manifest.json)
- [04→05提案](provenance/v01/boundary-from-04-v01.json)

人的操作先后调用代码／测试／文档三个Agent实例，组织层的产品目标、交付周期与成果分配节点保持独立；知识、协作和工具汇入生产系统，组织制定的交付标准再反馈给劳动者。结尾区分工具调用与决定权，明确需要相应规则安排，而非把决定权画成永久禁止。

复用01采用PNG和06同一工位图层，不新增美术或声音；源图不改，不拼接肢体。资源卡、交付标准和反馈文字已避让；转场先收起其他工具实例，再保留单个角色移动，避免头像交叠。42秒起直接使用06的起点图形，不叠化两套文字，45秒切换本章与下一章字幕。

1351状态、156字符原文、组织决定节点所有者、独立示意任务未自动验收、单层完整人物、素材尺寸／透明通道／哈希、34个代表时点及编码后抽帧、完整解码、30fps时间戳、黑帧检查通过。实际05／06编码视频组成4秒120帧接缝；切点除字幕外源SVG逐字一致。同环境独立目录重渲染，45秒MP4字节一致。

## 复现

Node≥22、sharp0.35.5、FFmpeg／ffprobe，以及中文字体；实测依赖版本见媒体清单。图解优先PingFang SC，字幕优先Hiragino Sans GB。字体或编码器不同，像素和文件哈希不承诺跨平台一致。

```sh
npm install --prefix arts/actions/05
node arts/actions/05/build.mjs --video
```

本机可使用已安装依赖：

```sh
NODE_PATH=/Users/bytedance/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules node arts/actions/05/build.mjs --video --output-dir /tmp/chapter05-rerender
```

已有MP4时拒绝覆盖，使用新的`--output-dir`。不加`--video`只更新静帧、字幕、预览与状态等派生产物。完整正片只依赖源码和PNG库存，不读取旧MP4；本章引用06场景模块以保持共用工位与精确接缝，版本及哈希随源码快照保存。

若06 MP4存在，额外导出真实编码接缝；不存在时正常完成05正片并跳过接缝。可先运行06导出器取得该MP4。MP4沿用项目gitignore，不随Git推送；源代码、字幕与验证记录入库。

## 限制

无配音，字幕为语义暂排。04暂无动画交接，04→05只记录提案；03与04由其他人负责，未改其文件。全片起点02:57沿用当前预算，03／04定稿后需重算偏移。第06章的配音与课程成员信息仍待补，不由本章擅自填写。
