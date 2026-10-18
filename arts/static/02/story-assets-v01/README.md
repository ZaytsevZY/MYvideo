# 02 · 用餐、工作与KPI选择演出

**版本：** S02_LAYERED v0.3 · 2026-10-18 · 12秒多图层构图样例，完整38秒章节待接入。

[当前预览](http://127.0.0.1:8765/static/02/story-assets-v01/preview.html) · [双窗动图](compositions-v03/comparison.gif) · [KPI代表图](compositions-v03/thought.png) · [构图／层序／SHA](layout-v03.json) · [本轮生成记录](provenance/layered-v03/generation-inputs.json) · [验证](provenance/layered-v03/verification.json)。

## 当前分层演出

左窗标签保留“休息”，以用餐动作呈现，没有电脑或工作物；饭碗、汤匙和表情与右侧打字工位形成明确动作对照。用餐用舀饭、抬勺、送入口中3张完整绘稿循环，4.8秒一轮，采用离散关键帧停留，尚非逐帧全动画。人物不拆肢体、不拉伸、不叠化两个身体。新背景、人物及桌沿遮挡独立；桌沿使用背景同坐标裁切，饭碗保持在桌沿上方。

右窗复用整身输入／收手／看文件，以及Agent待机／接件／检查／递交绘稿，4.2秒一轮；纸张在屏幕与接件位置之间移动，接触后退出独立纸层，由含纸完整绘稿接替。程序员所审为H02-current，Agent处理H02-new1；演出没有自动验收状态。旋转执行符号和代码线明暗变化持续表示运行。

两窗各888×862，浮在虚化背景上。前3.2秒先读两侧动作，随后左下人物进入遮挡用餐侧，人物右上出现带清晰“KPI”文字的向上折线；无坐标、数字配额或引导箭头。思考框收起后，右窗柔和边框提示两次，再向前覆盖前景并展开全屏。保持原生多图层SVG，未改为播放压平PNG或GIF。

预览默认自动播放（系统减少动态效果设置时暂停），支持拖动、状态按钮和独立图层开关。4.8秒／48帧／960×540的GIF只供对照动作，不用于实时窗口。02画面说明同步v0.4；口播、引用和38秒预算不变，完整02及film现已按当前脚本接入S02_STORY v0.4，正式入口见[38秒动态框架](../../../actions/02/full-preview.html)。没有配音或音效。

## 新增美术与复用

内置imagegen共4次调用、4张采用：1672×941用餐室背景，以及1024×1536真实透明PNG人物三态，位于backgrounds/02与characters/poses/02。先生成舀饭基础态，再以它编辑放下／入口两态，固定头、身体和饭碗锚点。原始输出原样复制，SHA及参考图、完整英文prompt、原始路径见生成记录；实际底层模型未暴露。既有休息姿态保留库存，其他01／02绘稿沿原路径复用。

## 重建与检查

```sh
node arts/static/02/story-assets-v01/build-layered-v03.mjs
node arts/static/02/story-assets-v01/export-motion-v03.mjs
node arts/static/02/story-assets-v01/verify-layered-v03.mjs
```

scene-layered-v03负责状态与合成；player-layered-v03负责播放；build-layered-v03生成入口、5张代表图和KPI独立SVG／PNG；export-motion-v03导出双窗GIF。361状态／单一前景人物／层序／两次柔和提示／运动区域像素差异／48帧GIF／128项原输入检查通过；口播与来源原字节一致。浏览器已确认播放、用餐／工作状态及KPI显示，[标签修正截图](provenance/layered-v03/browser-rest-label.png)。

旧v02分层入口保存在[preview-v02.html](preview-v02.html)，旧代码及provenance/layered-v02为历史。build.mjs只维护v01静态入口。下文记录早期美术，不能据其中“休息窗”“无文字KPI”覆盖当前v03要求。

## v01美术准备记录

以下保留5张采用绘稿的来源与上一轮静态构图记录。当前布局以v03为准；旧KPI短字段卡片与箭头不在当前演出使用，上一版入口见[preview-v01.html](preview-v01.html)。

按用户确认的[02资源检查单](../../story-assets-v01/02-resource-audit-v01.md)新增5张完整透明PNG。使用内置`image_gen.imagegen`，5次调用、5张采用；底层模型标识未暴露。所有生成源图原样复制入项目，未改像素，旧01及shared资源不改。用户手改的02分镜全文、口播和既有动画源码保留。本轮不调用Claude、不配音或制作音效。

| 绘稿 | 文件 | 用途 |
|---|---|---|
| 完成后舒展休息 | [programmer-relax-rear-v01.png](../../../characters/poses/02/programmer-relax-rear-v01.png) | V02.2-E1左侧方案；同背后工位机位，双手离开输入区、放在脑后，姿态明确放松，未睡眠 |
| 思考KPI | [programmer-think-up-right-v01.png](../../../characters/poses/02/programmer-think-up-right-v01.png) | V02.2-E2左下人物；托下巴、视线向右上，保持完整上半身和手肘 |
| 选定继续工作 | [programmer-choose-right-v01.png](../../../characters/poses/02/programmer-choose-right-v01.png) | 同镜后态；视线与手指朝右上，和思考图保持同画布、标尺及腰线 |
| 查看当前文件 | [programmer-review-current-v01.png](../../../characters/poses/02/programmer-review-current-v01.png) | V02.3-E1；坐姿略向右转，双手持纸，纸张露出身体轮廓 |
| 接下一份文件 | [programmer-review-next-v01.png](../../../characters/poses/02/programmer-review-next-v01.png) | 同镜后态；左手放低上一份，右手接下一份，视线转向新文件 |

5张均1024×1536、真实alpha。人物、头、手、衣服和持有纸张是完整绘稿，不拆肢体或拉伸身体。生成时查看了原角色设定、背面操作／收手和正面中性参考；第二态以上一态为编辑目标，实际参考SHA与原始生成路径见manifest。

## v01 KPI卡片库存

[kpi-requirements-v01.json](../../../items/02/kpi-requirements-v01.json)提供标题与短字段；[卡片SVG](../../../items/02/kpi-requirements-v01.svg)／[思考气泡SVG](../../../items/02/kpi-thought-bubble-v01.svg)保留可编辑文字，同名PNG可直接合成。标题“KPI · 本轮要求”，字段“交付范围／验收标准／周期安排”。负责人头像由已有透明绘稿裁切显示，未用代码画脸；没有数字配额、完成率、奖惩或真实公司制度断言。

两个UI外观是同一内容组件的变体，不计作两套内容或图像模型调用。选择框、箭头、气泡和文字用代码；人物和纸张用位图。正式演出时可以收起KPI层再展开右窗，当前构图只检查状态与避让。

## v01构图与接触依据

- [并列思考](compositions/parallel-think-v01.png)／[选中右侧](compositions/parallel-choose-v01.png)：休息与继续工作两窗并列，上部各650×366；人物左下，KPI独立于人物。下方y980之后为字幕安全区。两窗是互斥方案，不把休息和扩大工作合计为同一份收益。
- [当前审核](compositions/review-current-v01.png)／[接下一份](compositions/review-next-v01.png)：同一工位／机位，椅背遮挡保持，纸张和手可以辨认。待审纸堆按桌面平面透视摆放，不悬在桌前。
- [右窗原生场景](compositions/work-window-native-v01.svg)：窗口和全屏都引用同一1920×1080分层场景；正式展开用viewBox／图层变换，不能放大小缩略PNG。仅为资源可用性检查，不是已经实现的展开动画。
- 休息／审核角色采用统一scale=0.43及脚底锚点，背景→整体工位→屏幕内容→完整人物→椅背→任务／Agent。不得为适配某张图单独挪头、胳膊或腿。
- 纸张接触：review-current两手持有“当前文件”；review-next左手仍有上一份，右手持下一份。接触时独立移动纸张必须退出；纸面三条灰线仅表示纸张，不等于验收勾。审核完一份之后才能更新对应任务状态。

原01日间房间、整体工位v02、椅背、背面输入、Agent接收与纸张均沿原路径复用。H02-new1／new2仍为新增工作身份，feedback仍候选；02→03另起S03任务集，不因切镜自动完成H02。

## v01检查记录

已查看5张原图、浅／深底边缘、并列方案、KPI、椅背遮挡与全屏审核构图；检查实际尺寸、alpha、参考／原始输出哈希、129项既有输入及检查页资源引用。记录见[verification.json](provenance/verification.json)。

本轮只完成授权美术及代表构图，不改用户手动正文、字幕或演出源码。17–23秒旧L1顺序演示与新并列方案的衔接仍按检查单处理，尚未擅自修改；人物两态属于有限动作关键帧，正式演出仍需安排预备、接触、缓冲和收势，不用身体叠化制造中间动作。

当前重建：`node arts/static/02/story-assets-v01/build-layered-v02.mjs`。build.mjs／verify.mjs保留v01美术流程，前者仅更新preview-v01.html，后者按当时旧输入核对。需要Node与sharp，优先环境中的sharp；原shared素材包与生成源图不改。
