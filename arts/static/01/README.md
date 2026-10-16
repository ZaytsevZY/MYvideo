# 01 · 静态图解组件与素材总览

**版本：** S01_ASSETS v0.5 · 2026-10-15。
**对应：** SHOT_TEXT v0.4，第01章45秒。当前静态入口默认显示完整背面坐姿；动作预览另见arts/actions/01。尚无配音、Remotion工程或MP4。

## 文件入口

- [背景](../../backgrounds/01/README.md)：夜晚与白天两个背景PNG，1672×941。
- [变化道具](../../items/01/README.md)：15个可独立控制的原生SVG，包含家具、电脑和四种屏幕状态。
- 本目录16个图解SVG组件：可选背景框、透明双轨、三条独立时间区段、三个流程位置、三组任务图标与标签、箭头、终点、光标、通过与退回标记。
- [preview.html](preview.html)：切换夜间工位、白天工位、双轨组件与任务流组件的静态检查页。
- [layout-v01.json](layout-v01.json)：1920×1080构图、图层顺序、道具位置、屏幕开口及未来人物区域。
- [native-assets-v01.json](native-assets-v01.json)：31个SVG的逐项尺寸、用途与局部锚点。
- [manifest-v01.json](manifest-v01.json)：输入、输出、提示词、代码与文件SHA-256。

## 图解组件

| 用途 | 可组合素材 | 使用方式 |
|---|---|---|
| 可选承载 | [logic-panel](logic-panel-v01.svg) | 早期带标题栏的可选模板；当前底框由diagram-panels-v01.json直接绘制 |
| 人／机器时间 | [time-tracks-base](time-tracks-base-v01.svg) | 两条细线与可编辑标签，无底色轨槽、无实测刻度 |
| 独立区段 | [human-dispatch](human-dispatch-v01.svg)、[human-review](human-review-v01.svg)、[machine-execution](machine-execution-v01.svg) | 分别控制派发、审核及后台执行；长度为定性布局，不代表节时数据 |
| 需求进入计划 | [evaluation](lane-evaluation-v01.svg)、[scheduled](lane-scheduled-v01.svg)、[acceptance](lane-acceptance-v01.svg) | 三个透明流程位置，仅标签、短对齐线与锚点，无色块及外框 |
| 任务身份 | [test](task-test-v01.svg)、[interface](task-interface-v01.svg)、[feature](task-feature-v01.svg) | 以独立图标和文字保留同一对象ID，无强制卡片外框；测试图标为清单 |
| 关系与终点 | [connector-arrow](connector-arrow-v01.svg)、[endpoint-marker](endpoint-marker-v01.svg) | 箭头连接关系；终点独立移动，不随任务卡烘焙 |
| 操作与状态 | [cursor](cursor-v01.svg)、[status-check](status-check-v01.svg)、[status-rework](status-rework-v01.svg) | 确有人工通过才使用check；返工与完成分开 |

## 对应镜头与组合规则

| 画面 | 本轮可用素材 | 后续动作职责 |
|---|---|---|
| V01.1，0–16秒 | 昼夜背景、桌椅、主机、显示器、键鼠、台灯、四种屏幕状态、光标和退回标记 | 人物派发、离席、回到工位验收；同一任务回到Agent。已有完整姿态关键帧试验，连续动作待补间 |
| V01.2，16–37秒 | 浮动双轨、三个区段、三组任务和三个透明流程位置 | 保留工位背景，在可用空区展开所需内容，随解释增减对象；人的操作暂停时机器轨继续 |
| V01.3，37–45秒 | 同一任务图标与标签、终点与箭头 | 任务列表在浮层中延伸，原终点后移；接下一章项目筛选，不强制展开为全屏图板 |

未来人物层位于椅背前、桌面前缘后；人物手臂另置桌面之上。屏幕界面放在显示器外框的开口之上。字幕安全区暂留在底部120–1680横向范围、y=930–1050；最终随人物和配音检查。所有文字保留为SVG文字，不烘焙进背景。

图解使用局部暖白背景色框，按当前内容、可读字号和人物避让区域确定实际尺寸。layout中的上部区域是本轮预览摆位示例，不是统一必占的画布；内容较少时收缩或拆成局部对象。背景持续可见，底框只覆盖图解区域；Agent位于底框上方。时间区段的填色只表示操作或执行，不是装饰底板。

四个assembly／logic preview SVG是静态布局检查图，已内嵌所需资源，便于直接打开。它们不是四张可以直接轮播的正式视频画面；bake时必须保留对象身份、动作触发与状态变化。当前任务流预览展示不同卡片的组件摆位，不是同一张任务变成另一张的叙事。

## 重建与检查

```sh
python3 arts/static/01/build_assets.py
```

该脚本重建原生SVG、布局JSON、内嵌资源的静态预览与哈希清单，不调用生图模型，不编辑两个背景PNG，也不生成动态帧。背景实际调用参数见 [generation-v01.json](../../backgrounds/01/generation-v01.json)，完整提示词保存在同目录prompts中。

已在本地浏览器检查四种静态视图：背景与家具可组合，屏幕状态能放入开口，中文标签可显示。这些旧空工位图未加入角色，不能用作人物验证；当前人物检查另见完整姿态预览；昼夜图的细小几何差异仍需后续转场检查。

## 当前人物组合

已新增 [椅背背面外壳](../../items/01/chair-back-rear-v02.svg)，放在背向镜头的完整程序员前面；旧椅背正面保留作其他视向素材。当前构图与遮挡以 [layout-whole-v01.json](../../actions/01/layout-whole-v01.json)为准，[动作预览](../../actions/01/README.md)记录九张姿态及有限动作。上文四个旧assembly／logic SVG为空工位检查记录，不能作为当前人物布局或动作验证；静态preview现在优先展示完整姿态组合。

当前底框样式与尺寸见 [diagram-panels-v01.json](diagram-panels-v01.json)，由build_assets.py和bake-whole.mjs共同读取；所有图解SVG原语仍保持透明，底框独立，便于将Agent放在前景。
