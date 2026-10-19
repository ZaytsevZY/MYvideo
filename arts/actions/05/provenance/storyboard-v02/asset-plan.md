# 05美术准备入口（尚未生成）

依据：S05_STORYBOARD v0.2／13镜／45秒。先做故事关键构图，再把必要缺口交给image模型；首尾关系图主要由原生文字／连线与现成PNG组成，不把整张带字图表交给模型。以下均为准备清单，目标名不是已存在文件，数量不代表已调用。

## 可以直接复用

|用途|实际库存|采用条件|
|---|---|---|
|主角／同事／负责人头像|arts/characters/portraits/03/programmer-front-v04.png、coworker-a-v04.png、coworker-b-v04.png、manager-neutral-v04.png|首尾关系图同一套身份，右图中央员工与左主角同源。|
|Agent头像|arts/characters/portraits/01/agent-neutral-v01.png、agent-focus-v01.png|多个实例采用同套造型，不用几何头像替代。|
|企业图标|arts/items/04/company-a-v03.png|中性企业图形，引用库存，不推定与04公司个案具有实名对应。|
|文件道具|arts/items/01/task-document-portrait-v01.png、task-document-landscape-v01.png|用于图表对象／待办／计划页；故事交接时纸与手在同一绘稿，禁止漂浮纸遮不住手。|
|办公室与人物风格参考|arts/backgrounds/shared/office-workstations-day-v01.png、arts/backgrounds/03/neighbor-work-a-v05.png、arts/backgrounds/04/collaboration-review-v03.png|只在视角相容时作实际底图；新多人机位不把原独立人物硬贴进桌面。|
|姿态／服饰参考|arts/characters/poses/01/agent-offer-file-v01.png、agent-receive-v01.png；poses/shared/manager-point-left-v01.png、coworker-discuss-right-v01.png|参考完整人物与动作方向，若机位不合需重绘，不能靠镜像带字物件或拆手适配。|
|广告参考|assets/references/ads.png|本轮已查看，仅取已见文案与宣传式版面；正式广告为中性虚构视觉，保留“把重复劳动交给AI干”。|

所有复用图像仍使用原路径与原始比例。实际登记后记录哈希，不移动／覆盖01–04库存。任何alpha分层需检查前景桌沿与手／纸接触；不能只检查透明通道存在就判断透视正确。

## 必补完整绘稿关键态

同一办公室轴线：主角左工位，邻桌同事右，Agent在可站立的桌间通道；另一位同事可在后景但不抢动作。白板和广告在背景墙，从建立镜头已可定位。先生成R01，并以它作为其余宽景状态的环境／身份参考；近景必须保留同一工位的相机轴线与家具关系。原生文字后期贴到留白平面，模型不画乱码小字。

|目标ID（待生成）|画面／动作职责|用于镜头|完整英文视觉意图（附实际参考图后再执行）|
|---|---|---|---|
|S05-R01|日间多人办公室中景，Agent递纸、主角伸手接触；背景白板／广告留白|07前半|Wide three-quarter view of the established warm cel-animated office. The blue-grey-shirt programmer sits at the left desk, two recognizable coworkers occupy adjacent workstations, and the orange-haired white-jacket Agent stands in the aisle, offering one paper with a clear hand-to-paper contact. Preserve coherent desks, chairs and keyboard perspective. Include a blank whiteboard and a blank wall advertisement in the background; no rendered lettering.|
|S05-R02|同一轴线，主角接稳查看／确认，Agent刚收回手|07后半|Keep the exact same camera, office geometry, clothing and identities as R01. The seated programmer now holds the same delivered sheet and checks it; the Agent withdraws empty hands after delivery. Coworkers remain at their own desks. Show a plausible seated posture, clear tabletop occlusion and continuous paper ownership. Leave interface and board lettering blank for composition.|
|S05-R03|同一办公室，Agent空手摊掌等指令，两个员工抬眼／停顿|08|Continue from R02 with the same people, desks and camera axis. The Agent has no document and makes a restrained open-palm waiting gesture toward the programmer, with the adjacent coworker also noticing the wait. The programmer has just paused with hands off the keyboard. Convey expectation through posture and eye contact, without villain expressions, boss insignia, floating limbs or duplicated bodies.|
|S05-R04|主角正面／3/4近景，收手后看向墙上宣传，面部停顿|08后半、09反应|A front three-quarter medium close-up from the same office axis. The programmer pauses after the completed task, hands resting near the keyboard, gaze turning toward the wall signage. Retain the established face, lanyard, chair and monitor geometry, with a hint of the orange-haired Agent waiting at the edge. Expression is restrained and thoughtful, not exaggerated despair.|
|S05-R05|同轴白板／广告物件插入，前景有工位边或人肩，能回到同一空间|09插入|A motivated signage insert from the programmer's eyeline in the same office. Frame the existing whiteboard and wall advertisement side by side, with a subtle desk edge or shoulder foreground linking to the workstation. Keep both printable surfaces clean, planar and empty for later Chinese typography, while preserving their actual position and perspective. No real brand logo, invented statistics or promotional interface overlays.|
|S05-R06|与R04同机位，主角再伸手输入，Agent等候／开始接收|09收势|Match R04 exactly in camera, face, clothing, furniture and lighting. The programmer returns both hands to a believable typing position and sends the next instruction; the waiting Agent attends to the screen. The action should read as a continuation of the pause, with clear hand-to-keyboard contact and no extra fingers, merged wrists, stretched arms or moving chair geometry.|

六项为初步必补关键态，不要求六次独立调用；可用有参考的编辑保持一致，需要动作缓冲再按接触检查追加完整姿态，不能把数量当成充分条件。中景适合16:9整幅或可拆出的完整透明层；人物和桌面共用透视时优先完整场景绘稿。不要同时裁切／拉伸不同透视再加线条解释错误。

共同负向约束：inconsistent character identity, extra fingers, hands merging with paper, people sitting on the tabletop, inconsistent desk vanishing points, transparent duplicate bodies, detached limbs, floating paper, tiny generated text, brand watermark, photorealistic cut-ins, exaggerated evil robot stereotypes. 本清单不触发生图；需要实际图片时再读imagegen技能并检查参考图。

## 原生图层与可编辑文字

- 关系图：员工→三Agent调用线；企业→员工组织关系；目标／周期／成果分配；独立调整提议通道。标签32–42px，颜色不代替关系名字。
- 工位反馈：完成结果→主角确认；之后“请给我下一项指令。”与邻桌“等待新指令”。均为界面提示，非新增口播，也不是Agent授予管理权。
- 白板：**深度和Agent合作**。排期／交付安排只用短字段，人物或负责人制定；不要贴一整段论证。
- 广告：**把重复劳动交给AI干**。版面使用已有Agent或中性产品绘稿，文字后置；参考中的WorkBuddy名字／机器人不必复制。
- 出点安排页：**排期与收益配置**，员工调整提议待讨论；不给永久禁止锁头、不假装已共同决策。

制作顺序：R01代表宽景→R03等待／员工反应→R05宣传插入并回R06→首尾关系图可读性→关键接触／遮挡／alpha核查→其余中间态。未补齐E场景不能用旧头像图解顶替21.8–33.8秒故事。
