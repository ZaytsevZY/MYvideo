# 后续故事场景：美术与并行构图

**版本：** STORY_ASSETS v0.1 · 2026-10-18 · 首批美术已备，章节动画尚未更新。

**02最新手改核对：** 用户已将02改为两方案并列、KPI思考后选中右侧继续工作。[检查单](02-resource-audit-v01.md)建议的5张人物PNG与KPI层现已在[02美术包](../02/story-assets-v01/README.md)补齐；下文02负责人追加任务小窗为上轮构图示范，不作为当前02终稿要求。旧manifest／verification保持原素材阶段证据，不覆盖新手改分镜。

[本机构图检查页](http://127.0.0.1:8765/static/story-assets-v01/preview.html) · [静态入口](preview.html) · [四类构图联系表](contact-v01.png) · [素材／来源／SHA-256](manifest-v01.json) · [画幅与并行规则](layout-v01.json) · [完整英文prompt集](prompts/)。

按用户本轮要求，先补空间、人物与屏幕内容。内置`image_gen.imagegen`共13次调用：10张采用PNG，3张首稿因笔记本背盖误画界面而由v02局部修正。底层模型标识未公开，不填写猜测型号。所有原始输出均已复制入项目，采用PNG保持原始像素与alpha；无Claude、配音或音效调用。

## 已备资源

| 类型 | 采用文件 | 用途 |
|---|---|---|
| 公司工位背景 | [office-workstations-day-v01.png](../../backgrounds/shared/office-workstations-day-v01.png) | 02打开需求、03追加任务／休息、04／05组织安排；1672×941 |
| 会议室背景 | [meeting-room-day-v01.png](../../backgrounds/shared/meeting-room-day-v01.png) | 04会前、05／06共同排期；1672×941 |
| 负责人完整姿态 | [递交任务](../../characters/poses/shared/manager-assign-left-v01.png)、[指向排期](../../characters/poses/shared/manager-point-left-v01.png) | 沿用原深蓝外套／灰裤／无五官设定；1024×1536，透明PNG |
| 同事完整姿态 | [持文件讨论](../../characters/poses/shared/coworker-discuss-right-v01.png) | 沿用原灰绿上衣／棕发／无五官设定，分配到04／05／06；1024×1536，透明PNG |
| 休息被打断主画面 | [伏桌睡眠](../03/programmer-asleep-main-v01.png)、[醒来查看](../03/programmer-awake-main-v01.png) | 03公司工作日内短休说明情境；1672×941，同机位关键状态 |
| 三联故事绘稿 | [午餐](../04/lunch-panel-v02.png)、[会前](../04/premeeting-panel-v02.png)、[晚间](../04/evening-panel-v02.png) | 04并行三画幅，各1024×1536；会前图已包含原设计同事进入场景 |
| 搁置需求UI | [列表SVG](../../items/shared/backlog-list-v01.svg)、[打开SVG](../../items/shared/backlog-open-v01.svg) | 各1440×900；同名PNG版可直接贴屏，feedback保持候选／待评估 |
| 通知UI | [追加安排](../../items/shared/notification-task-v01.svg)、[结果待验收](../../items/shared/notification-result-v01.svg) | 各720×240，透明底，同名PNG；负责人头像取新绘稿裁切，Agent头像复用01PNG |

前10项位图是图像模型绘稿；4种界面是可编辑的文字／形状与既有位图头像合成，并提供PNG，不能计作4次生图。素材总索引包含3张被替代的首稿，不能全部作为采用版。旧01人物、背景、道具和所有章节动态源码均保留原内容；“移到后续分镜”通过共享引用与用途登记完成，避免破坏旧入口。

## 构图与接续

- **04，4–15秒：** 一个V04.1-E1场景组，午餐／会前／晚间三窗始终同屏。按口播安排动作重音，其他窗保留；三种时段并置不等于现实同时发生，也不累加三次11秒。场景画幅604×906，任务状态层独立，字幕区在y950之后。见[三联构图](compositions/04-three-parallel.png)。
- **03，17–22秒：** 主画面伏桌休息→醒来，右上672×224结果通知小窗；先通知、后人物反应，不全屏切走人物。两幅是完整关键状态，正式演出使用动作切点／短遮挡处理，不叠化两个人体。见[通知构图](compositions/03-awake-notification.png)。
- **02／03负责人追加：** 负责人递交／排期的小窗与程序员反应主画面并行，先安排、后注意与接收。见[独立行动小窗](compositions/manager-task-window.png)和[摆位示范](compositions/02-manager-parallel.png)。摆位暂借03醒来主画面展示窗口尺寸，**02正式接收动作仍需另补**，不将困倦当作02固定表演。
- **01→02：** 同一feedback候选需求从卡片落到屏幕；打开不等于立项、排期或验收。01已通过T01／已合并T01-R／已排期项目保持原身份。
- **03→04：** 团队日程页接研究定位，再进入三窗组；研究主题情境不是受访者一天的复原。单一公司限定保留在正式分镜，不反复塞进道具UI。
- **04→05→06：** 复用同事／负责人识别，接排期与共同决定；任务身份按原章区分。06生活之后的收工镜头仍是回看，不用本轮通知素材把生活再次打断。

屏幕内容按实际显示器四角映射；三联图中的笔记本朝观众的是背盖，已修正为实体外壳，任务状态用独立小窗呈现。通知文字与人物绘稿分离；不在图像模型输出上烘焙难读小字。PNG人物按原生比例均匀缩放，禁止拆肢体或拉伸补姿态。

## 尚待下一阶段演出

三联每窗当前只有一张动作关键绘稿，尚需吃饭→发任务、等候→抬头、合盖→重开的前后状态与收势；02需越肩打开需求／接收追加任务／连续审核，03需起身／持续休息对照，04–06需交接／共同排期的动作变化。当前资源不是所有后续E场景的完整动作库。

本页和compositions为静态构图、透明姿态与UI检查；[全片播放器](../../actions/film/README.md)仍运行原280秒基础演出。本轮未修改章节动画或字幕，没有导出新版视频，不沿用基础版技术检查宣称新场景完成。

## 重建与记录

`node arts/static/story-assets-v01/build.mjs`重建UI、构图、清单与检查页；`node arts/static/story-assets-v01/verify.mjs`核验引用、尺寸、alpha、原图哈希、口播／来源、40段时轴及原动态源码未改。需要Node与sharp，优先使用环境中的sharp；代码有本机bundled-runtime后备路径。

`provenance/inputs.json`为本轮修改前快照；`copies-01…04.json`记录生成原路径与项目落点；每次调用的完整英文prompt、参考路径、透明参数位于prompts。manifest记录实际尺寸／alpha／SHA、采用和替代关系、按章复用及未接入状态。`update-script-rules.py`是本次一次性文本迁移记录，不作为日常重建命令重复运行；历史story-logic-v01检查保留，新的分类索引在本包provenance中。
