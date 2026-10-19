# 06素材缺口与制备入口

S06_STORYBOARD v0.2 · 仅盘点与计划，未生图、未合成或像素验收。目标1920×1080，30fps；实际生成尺寸另记，不以扩图或SVG转PNG冒充新绘稿。人物、书袋、书、座椅、工作桌等尽量在同一透视内整体准备，中文与界面反馈分层。

## 可复用库存（路径与SHA见reuse-inventory.json）

- 05的office-agent-wait／programmer-resume-close-v02：同一程序员、Agent、两同事及办公室的身份／色彩／桌面透视参考。首0.4秒直接调用05实际末态；不生成截图替代这12帧。
- 03 programmer-front／coworker-a／coworker-b／manager-neutral头像；01 Agent头像；04 company-a及01两种文件PNG：用于首段来源／偏好节点、同一排期页与参与资料，原路径复用。
- shared meeting-room-day、manager-point-left、coworker-discuss-right以及04主管写字完整姿态：身份、房间与手势参考。已有站姿不具备三人桌边接触，不直接贴成讨论完成的画面。
- 01完整input／lean／rise／walk姿态、workstation-painted-v02：收手、起身及迈步节奏和开场动作回扣参考；不能跨透视强贴到05办公室或新生活场所。

## 必需新增完整绘稿关键态（规划约18态，可在实际构图验证后合并共用态）

| 资源组／镜头 | 关键态与职责 | 实际取景、图层与接触要求 | 英文制备brief |
|---|---|---|---|
| BRANCH-A／01–04 | 共用起点、追加后重新输入，2态 | 两窗目标各约615×655；同工位轴线、同人物起始位置。主角及键盘纸张不能裁成不完整手臂。共同起点给两侧共用，追加文件在下一态才出现。 | A coherent anime office vignette with the established dark-haired programmer in a blue-gray top and the orange-haired white-jacket Agent. Same camera, desk and accepted deliverable across states; first settled, then responding to a newly assigned task. No baked lettering. |
| BRANCH-B／03–04 | 同起点后持包起身、跨出门口，2态 | 与A具有同一桌面和光照，门与走动方向先在宽景中可见；新增完整姿态，不能只平移坐姿。方案是互斥图解，两窗不计两位主角或两份节约。 | Match the common office baseline exactly. In the shorter-hours alternative, the programmer puts the work down, picks up a prepared bag and leaves under an agreed arrangement. Whole, anatomically coherent poses and a visible doorway, no floating desk or text. |
| MEETING-GROUP／DEV／TEST／WRITE／AGREED，05–07 | 开发范围指认、测试补充、落笔记录、共同核对，4态 | 三人同桌，同页位于前中景；负责人对面、主角左、同事A右。保持手、笔尖与纸接触，Agent只在后景小屏执行；每态主要发言／动作源不同。不能用四张各自站立人像拼讨论。 | Three recurring coworkers negotiate around one planning sheet at a real office table. The developer identifies scope, the tester adds review needs, then the manager records and all inspect the same page. Consistent seating, eye lines, hands and paper; leave the sheet blank for editable content. |
| WORK-REVIEW／ACCEPT／LEAVE，09–10 | 查看、确认、持包起身、门口离开，4态 | 真实工位同轴中近景与门口中景；看屏→确认→收手的顺序不可倒置。工牌离开时收进包中；动作已备包，不在2秒内演收拾所有物件。关闭前景工作窗口时不遮住手和脸。 | Continue the office after the agreed work has been completed. Show the programmer inspecting then accepting a new deliverable, followed by hands leaving the keyboard, standing with a ready bag, and stepping through the doorway. Do not change clothing or desk perspective; no text baked into screens. |
| LIFE-BOOK-SELECT／BUY，11 | 选书、柜台购买，2态 | 书店真实货架／柜台、主角蓝灰衣但无工牌；同一本米色书、同书袋。手与书／袋／柜台正确遮挡；不生成可辨识品牌或乱码书名，交易不含金额与支付凭证。 | The same programmer, now off work without the ID badge, chooses one plain warm-beige book in a neighborhood bookshop and later purchases it at the counter. Keep the book and paper bag consistent. Natural hands and shelf perspective, no readable branding or prices. |
| LIFE-THEATRE-SETTLE／ENJOY，12 | 与朋友入座、专注观看／自然鼓掌，2态 | 社区小剧场；朋友沿同事B身份作下班打扮，无工牌。书袋落脚边，舞台虚焦、不拟造真实剧目。侧前机位，手掌、座椅和身体有遮挡，不能将人物放在椅背上。 | The recurring programmer and a friend attend a modest local theatre. Their bookshop bag stays beside the seat. Side-front seated view, engaged expressions and a natural applause pose, softly defocused stage, no work screens, no real production logos. |
| LIFE-READ／PAGE-TURN，13 | 取出同书阅读、完整翻页，2态 | 家中阅读角、连贯书／袋／服装，图内不再加Agent或工位。翻页用对应绘稿或真实纸片遮挡过渡，不用手部拉伸。纸白仅作44秒画外来源匹配，不把生活书改成经典文献。 | The same off-duty programmer reads the same beige book in a warm home reading corner. Prepare a settled reading state and a natural page turn with coherent fingers and book geometry. No computer or work notifications. Leave pages without legible text. |

BRANCH-A的共用起点也供BRANCH-B使用；以上18态是最低动作覆盖估算，不是每镜单独生成或不可合并的配额。先做两窗、三人讨论、文化生活与片尾匹配的高风险构图；若库存裁切已能完整支撑对应接触与机位，可登记采用后减少新增。

## 原生可编辑层

- PLAN-PAGE：直接延续S05-PLAN-01纸张。开发范围、测试与验收、截止位置由笔迹／UI层呈现；S05-PROP-01先待讨论，核对后在本章条件情境确认。不是机器发来的批准通知。
- 首段来源／企业和员工关注连线：用已有PNG头像、企业、纸张；只对有语义的流向用线。窗口边框柔性提示，不用额外小字号贴在人物上。
- SOURCE-PAPER：C8短引文、I1工会参与／集体协商资料；两张纸与确认页在一个关系内展开，出处固定；不做虚构的法律证书、工会会徽或法定效力表。
- 文献页1／2：沿用旧书目内容并补I1。44–58秒无口播；成员保持待填写。字段文字可以原生生成，卡片底图可复用纸张PNG，不新增一张整屏烘焙文字图片。

## 验收门槛与工作顺序

先核对角色／空间与同一对象，再检查动作关键态与前后切换；最后看1080p实际字体、遮挡和字幕安全区。图像生成需要调用当前imagegen技能并另存完整英文prompt、参考图SHA、实际原图路径、尺寸／alpha、采用／淘汰关系。新完整绘稿未准备前，不以SVG人脸、线条肢体或解释卡取代剧情。

本轮没有生成上述18态，也没有更改动态框架；美术就绪、动态接入和新05→06／06→片尾接缝检查分别登记，不继承旧视频验收。
