# 01–06统一动态展示框架

**当前更新：FILM_PREVIEW v0.2 · 02采用S02_STORY v0.4。** 02按当前脚本重建为七段故事／逻辑交织的38秒原生分层演出，含休息用餐、KPI选择和连续审核；其他五章仍原版。全片仍280秒／8400帧、68段字幕，导航改为62段，85项去重资源。入口保持preview.html；bundle/assets/captions-v01是稳定文件名，内部版本v0.2。当前证据见provenance/integration-v02及[02制作入口](../02/README.md)，下文v0.1的74项／67镜为历史基数。

02注册改由story-scene-v04补充原资源表，scenes适配器改引用新章；字幕正文和offset不变。01→02／02→03的当前源码接点已编码核对，后者仍是新说明情境切换，未重写03。旧integration-v01、contact-v01和seams-v01保留历史，不将它们冒充新02画面。


**版本：** FILM_PREVIEW v0.1 · 2026-10-18。

[打开全片动态预览](http://127.0.0.1:8765/actions/film/preview.html) · [全片SRT](captions-v01.srt) · [全片字幕JSON](captions-v01.json) · [素材索引](assets-v01.json) · [六章联系表](contact-v01.png) · [五处接缝对照](seams-v01.png)。

**剧本与实现状态：** 02–06已在[STORY_LOGIC_PLAN v0.2](../../../scripts/final/shot/STORY_LOGIC_PLAN.md)重划职责。新[故事美术／并行构图](../../static/story-assets-v01/README.md)及[构图检查页](http://127.0.0.1:8765/static/story-assets-v01/preview.html)已备，尚未接入章节演出。本页播放器继续展示此前基础实现。

六章现有动态源码接入一个播放器，不依赖分章MP4是否已下载。1920×1080、30fps、8400帧、280秒／4:40，无配音和音效。播放器支持连续播放、逐帧拖动、章节／镜头跳转、速度、循环本章、字幕开关、全屏、接点短预览和素材按章筛选；字幕仍待配音校时。

## 时间轴与采用版

| 章 | 采用实现 | 全片秒 | 帧数 |
|---|---|---|---:|
| 01 | camera-motion／performance，镜头v0.3 | 0–45 | 1350 |
| 02 | full-scene／opening-revised，S02_FULL v0.3 | 45–83 | 1140 |
| 03 | scene.mjs，S03 v0.1 | 83–122 | 1170 |
| 04 | scene.mjs，S04 v0.2修订 | 122–177 | 1650 |
| 05 | scene.mjs，S05 v0.1 | 177–222 | 1350 |
| 06 | scene.mjs，S06 v0.1 | 222–280 | 1740 |

章节与动画源码继续由各自目录维护。本框架不移动／修改源PNG，也不复制旧字幕到另一套手写时轴。68段原字幕只增加一次全片offset，统一绘制在屏幕底部；06的266–280秒文献卡无口播字幕。03、04镜头导航读取其制作README的8镜／10镜细化表，不把原7个／5个代码phase冒充完整镜头表。

## 文件职责与复用

- `timeline.mjs`：唯一全片章表、帧边界与全片／局部时间换算，区间左闭右开，不重复编码诊断终点。
- `scenes.mjs`：六章绘制接口适配，逐章保留已有演出；按当前画面选择素材defs，避免每帧解码无关姿态；统一字幕层。
- `build.mjs`：从已有素材bundle／registry建立统一引用包，核验原文，生成74项素材索引、68段全片字幕和输入哈希。
- `player.mjs`／`player.css`／`preview.html`：单一播放时钟与界面，所有图像就绪后再启播，任意位置可倒拖。
- `qa.mjs`：同一适配器的代表帧、联系表与五段各2秒／60帧的960×540无声接缝预览。它们由源码重绘，不冒充既有MP4拼接。
- `framework.test.mjs`：全片帧覆盖、字幕正文／offset、8400帧资源与有限输出、67个镜头跳点、任务语义及05→06画面延续。

素材索引按源路径去重，记录尺寸、alpha、SHA-256、注册ID与使用章节。共用头像、工位、道具与完整姿态沿用01采用版；02的idle／lean／rest底图、05／06的房间底图分别保留来源。索引是注册库存，包含01原bundle保留的组件，不能将全部74项都称作新增绘稿或每帧可见对象。

## 章节衔接

全片以各章实际入点连续切换，不新增黑场、不增加或重叠预算帧、不用整层淡化叠出两个身体。01→02、03→04、05→06沿用原有匹配／过渡；02→03和04→05保留原章构图的情境切换，当前未重写其入镜动画。后续若要加强图形匹配，可在相邻章已有预算内细化。

02→03是新的工作日说明情境：S03-A/B不冒充01／02任务，不把已排期项无操作改成通过。04→05从标准重设转向决定权分层，组织控制语义接续；S04-X不被无说明地改写成05的任务。05末段与06入镜使用同一图形，底图虽路径不同但保留原内容。相关源状态和实测范围见 [integration-v01/verification.json](provenance/integration-v01/verification.json)。

当前为基础分镜统一预览，不是280秒完整MP4导出，也没有完成配音对轴或用户艺术冻结。06课程成员仍待填写。原章节视频、历史入口与验证材料保留。

## 重建与检查

在仓库根目录，Node和sharp可用时：

```sh
node arts/actions/film/build.mjs
node --test arts/actions/film/framework.test.mjs
node arts/actions/film/qa.mjs
python3 -m http.server 8765 --bind 127.0.0.1 --directory arts
```

若sharp不在本地node_modules，可设置当前环境实际提供的NODE_PATH。此框架不依赖制作机用户名路径。通过仓库根目录提供HTTP服务时，入口路径改为 `/arts/actions/film/preview.html`；素材URL适配这两种服务根目录。`file://`不支持模块／fetch，不绕过浏览器限制。

构图、代码或字幕更新后，先更新原章单源实现，再build，运行测试并检查相邻切点；原章时长变更时同步全片章表和字幕offset。新的导出器可直接复用 `createRenderer` 的帧→SVG接口，另选输出版本与编码配置。
