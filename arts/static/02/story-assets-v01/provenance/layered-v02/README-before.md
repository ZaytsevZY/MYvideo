# 02 · 休息、选择与连续审核美术

**版本：** S02_STORY_ASSETS v0.1 · 2026-10-18 · 素材与静态构图已备，章节演出尚未接入。

[本机检查页](http://127.0.0.1:8765/static/02/story-assets-v01/preview.html) · [本地入口](preview.html) · [四状态联系表](contact-v01.png) · [清单与哈希](manifest-v01.json) · [构图／接触规则](layout-v01.json) · [英文prompt集](prompts/)。

按用户确认的[02资源检查单](../../story-assets-v01/02-resource-audit-v01.md)新增5张完整透明PNG。使用内置`image_gen.imagegen`，5次调用、5张采用；底层模型标识未暴露。所有生成源图原样复制入项目，未改像素，旧01及shared资源不改。用户手改的02分镜全文、口播和既有动画源码保留。本轮不调用Claude、不配音或制作音效。

| 绘稿 | 文件 | 用途 |
|---|---|---|
| 完成后舒展休息 | [programmer-relax-rear-v01.png](../../../characters/poses/02/programmer-relax-rear-v01.png) | V02.2-E1左侧方案；同背后工位机位，双手离开输入区、放在脑后，姿态明确放松，未睡眠 |
| 思考KPI | [programmer-think-up-right-v01.png](../../../characters/poses/02/programmer-think-up-right-v01.png) | V02.2-E2左下人物；托下巴、视线向右上，保持完整上半身和手肘 |
| 选定继续工作 | [programmer-choose-right-v01.png](../../../characters/poses/02/programmer-choose-right-v01.png) | 同镜后态；视线与手指朝右上，和思考图保持同画布、标尺及腰线 |
| 查看当前文件 | [programmer-review-current-v01.png](../../../characters/poses/02/programmer-review-current-v01.png) | V02.3-E1；坐姿略向右转，双手持纸，纸张露出身体轮廓 |
| 接下一份文件 | [programmer-review-next-v01.png](../../../characters/poses/02/programmer-review-next-v01.png) | 同镜后态；左手放低上一份，右手接下一份，视线转向新文件 |

5张均1024×1536、真实alpha。人物、头、手、衣服和持有纸张是完整绘稿，不拆肢体或拉伸身体。生成时查看了原角色设定、背面操作／收手和正面中性参考；第二态以上一态为编辑目标，实际参考SHA与原始生成路径见manifest。

## KPI内容层

[kpi-requirements-v01.json](../../../items/02/kpi-requirements-v01.json)提供标题与短字段；[卡片SVG](../../../items/02/kpi-requirements-v01.svg)／[思考气泡SVG](../../../items/02/kpi-thought-bubble-v01.svg)保留可编辑文字，同名PNG可直接合成。标题“KPI · 本轮要求”，字段“交付范围／验收标准／周期安排”。负责人头像由已有透明绘稿裁切显示，未用代码画脸；没有数字配额、完成率、奖惩或真实公司制度断言。

两个UI外观是同一内容组件的变体，不计作两套内容或图像模型调用。选择框、箭头、气泡和文字用代码；人物和纸张用位图。正式演出时可以收起KPI层再展开右窗，当前构图只检查状态与避让。

## 构图与接续

- [并列思考](compositions/parallel-think-v01.png)／[选中右侧](compositions/parallel-choose-v01.png)：休息与继续工作两窗并列，上部各650×366；人物左下，KPI独立于人物。下方y980之后为字幕安全区。两窗是互斥方案，不把休息和扩大工作合计为同一份收益。
- [当前审核](compositions/review-current-v01.png)／[接下一份](compositions/review-next-v01.png)：同一工位／机位，椅背遮挡保持，纸张和手可以辨认。待审纸堆按桌面平面透视摆放，不悬在桌前。
- [右窗原生场景](compositions/work-window-native-v01.svg)：窗口和全屏都引用同一1920×1080分层场景；正式展开用viewBox／图层变换，不能放大小缩略PNG。仅为资源可用性检查，不是已经实现的展开动画。
- 休息／审核角色采用统一scale=0.43及脚底锚点，背景→整体工位→屏幕内容→完整人物→椅背→任务／Agent。不得为适配某张图单独挪头、胳膊或腿。
- 纸张接触：review-current两手持有“当前文件”；review-next左手仍有上一份，右手持下一份。接触时独立移动纸张必须退出；纸面三条灰线仅表示纸张，不等于验收勾。审核完一份之后才能更新对应任务状态。

原01日间房间、整体工位v02、椅背、背面输入、Agent接收与纸张均沿原路径复用。H02-new1／new2仍为新增工作身份，feedback仍候选；02→03另起S03任务集，不因切镜自动完成H02。

## 检查范围与下一步

已查看5张原图、浅／深底边缘、并列方案、KPI、椅背遮挡与全屏审核构图；检查实际尺寸、alpha、参考／原始输出哈希、129项既有输入及检查页资源引用。记录见[verification.json](provenance/verification.json)。

本轮只完成授权美术及代表构图，不改用户手动正文、字幕或演出源码。17–23秒旧L1顺序演示与新并列方案的衔接仍按检查单处理，尚未擅自修改；人物两态属于有限动作关键帧，正式演出仍需安排预备、接触、缓冲和收势，不用身体叠化制造中间动作。

重建：`node arts/static/02/story-assets-v01/build.mjs`；检查：`node arts/static/02/story-assets-v01/verify.mjs`。需要Node与sharp；优先环境中的sharp，代码保留当前本机bundled-runtime后备路径。原素材包`arts/static/story-assets-v01`及其历史验证不重建、不覆盖。
