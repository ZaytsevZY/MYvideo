# 当前制作记录

**版本：** GENERATION_LOG v0.8 · 2026-10-15
**依赖：** [PROJECT_STATE](../PROJECT_STATE.md)、[PRODUCTION_PROTOCOL](../style/PRODUCTION_PROTOCOL.md)。

当前已生成四张候选角色设定图、第01章两个背景PNG及30个原生SVG道具／图解组件，并完成四种静态布局检查。01现有完整姿态及Codex有限动作预览；尚无Remotion工程、光栅动画序列或视频编码。静态素材与动作试验分别登记。

旧 `S01-D01` 记录、第一段 Python demo、临时音频和旧正文均在 [本轮归档](../../.tmp/archive-2026-10-15-project-sync/README.md) 中保留；其“候选 demo”结论不继承为当前场景的审核结果。

下一次实际生成、预览或渲染时，按制作协议填写记录。必须区分计划、实际调用和审核通过，记录完整输入、提示词、代码、依赖、命令与输出哈希。

## CHAR-V01 · 候选角色设定

- 日期与时区：2026-10-15，Asia/Shanghai；执行者Codex。用户明确要求调用生图模型，参考两张anime contact图，结果保存到`arts/characters`。
- 输入基准：SHOT_TEXT v0.4、ART_DIRECTION v0.1、STYLE_BIBLE v0.3；本次图片设计不修改六章口播。
- 实际工具：内置`image_gen.imagegen`，四次调用；准确底层模型标识和额外采样参数未由工具暴露。未使用CLI fallback、Claude绘图或外部生图平台。
- 实际参数：各次均提供完整`prompt`、`referenced_image_paths`，`transparent_background=false`。先生成Agent；其余三次共同引用两张原图与已生成的Agent图。
- 提示词：逐字保存于 [arts/characters/prompts](../../arts/characters/prompts)。输入引用、各次原始输出路径、尺寸和SHA-256见 [manifest-v01.json](../../arts/characters/manifest-v01.json)。
- 输出：[Agent](../../arts/characters/agent-model-sheet-v01.png)、[程序员](../../arts/characters/programmer-model-sheet-v01.png)、[同事通模](../../arts/characters/coworker-model-sheet-v01.png)、[负责人通模](../../arts/characters/manager-model-sheet-v01.png)，均为1536×1024 PNG；复制至工作区，未后期编辑。
- 视觉检查：四张图均完整显示三个全身视图；主角有两个头部研究，同事和负责人无五官。轮廓与服装可区分，未出现水印、图中文字或背景场景。
- 状态：候选设计，未记为用户已批准。角色仍有少量衣褶与鞋部细节，后续代码化需进一步简化；目前尚未拆透明素材、分件或验证实际动作。
- 声音、视频编码、实测片长、渲染命令与工程依赖：本次不适用，没有生成动画或音视频。

## S01-STILL-V01 · 第01章静态分层素材

- 日期与时区：2026-10-15，Asia/Shanghai；执行者Codex。用户指定背景、变化素材、其他组件分别放入arts/backgrounds/01、arts/items/01、arts/static/01，准备好后另行bake。
- 输入基准：SHOT_TEXT v0.4的V01.1–V01.3、ART_DIRECTION v0.2、STYLE_BIBLE v0.4及CHAR-V01。口播和镜头时间没有修改。
- 生图调用：内置image_gen.imagegen两次，transparent_background=false；夜景参考程序员设定图与anime-contact2，白天以夜景为编辑目标。准确底层模型标识未暴露。两次均输出1672×941 PNG，直接复制进项目。
- 完整提示词与参数：[背景prompts](../../arts/backgrounds/01/prompts)、[generation-v01.json](../../arts/backgrounds/01/generation-v01.json)。
- 原生矢量：通过 [build_assets.py](../../arts/static/01/build_assets.py)绘制14个道具SVG、16个图解SVG；界面、文本和状态分层，未调用模型生成图表文字或伪造统计数据。
- 重建命令：python3 arts/static/01/build_assets.py。产出静态SVG、布局JSON、四个内嵌资源的静态组合图及preview.html；不编辑背景像素，不生成任何动画帧。
- 输出入口：[S01_ASSETS v0.1](../../arts/static/01/README.md)。完整文件、代码、提示词和引用哈希见 [manifest-v01.json](../../arts/static/01/manifest-v01.json)。
- 检查：本地浏览器查看夜间、白天、双轨和任务流四种视图；屏幕开口、中文显示和图层组合可见。昼夜背景空间基本一致，不宣称像素级一致或已验证转场。人物尚未加入，坐姿、手部接触与动作遮挡未验证。
- 状态：静态素材候选已准备。用户尚未要求本轮执行01人物bake；动态帧、声音、Remotion工程与视频均未生成。

## S01-FLOAT-V02 · 图解浮层修订

- 日期与时区：2026-10-15，Asia/Shanghai；用户要求图解浮动叠在背景上，尺寸以实际内容为准，不必全屏或强加底色和边框。
- 当前版本：S01_ASSETS v0.2、STYLE_BIBLE v0.6、ART_DIRECTION v0.4；口播及镜头时段保持SHOT_TEXT v0.4。
- 实际修改：双轨改为透明细线；流程位置去掉大色块和外框；任务保留图标与文字。预览保持工位背景和道具，在上部空区按内容浮动排布；文字采用局部描边，不自动压暗整屏。
- 可选背景框仍保留，但默认预览和布局不挂载。时间区段等有语义的填色保留；预览摆位是示例，不要求全片固定占屏比例。
- 工具与产物：更新build_assets.py并重建原生SVG、预览、布局与哈希清单；没有新增生图调用，两个背景和14个道具保持原内容。现有v01文件名为未冻结首批素材路径，当前清单版本以v0.2为准。
- 检查：在本地浏览器分别查看双轨与任务流浮层，故事背景、电脑和桌椅仍可见；尚未生成任何人物动态帧或视频。

## S01-WHOLE-V01 · 完整姿态替代分件试验

- 用户授权一次性制备角色、拆解01动作。初次内置生图生成程序员和Agent分件图各一张，由Codex写绑定试验；本机Claude两次调用及auth status均未登录，失败输入输出在arts/actions/01/provenance，用户明确回复“本轮由 Codex 编写动作预览代码”。没有虚构Claude代码或模型版本。
- 分件试验数值接触检查通过，但肩肘膝连接及桌面遮挡视觉较差；用户指出结果不好，要求改用完整姿态，随后指定初始程序员背对观众。旧rig、clips及v01采样保留为淘汰试验，当前preview不再挂载。
- 完整姿态实际调用内置image_gen.imagegen共11次，全部transparent_background=true；九张选入arts/characters/poses/01，另两张分别因侧面视向被替换、相反步态未明显改变而未采用。完整提示词、引用及原始路径逐字留存，选中PNG直接复制，未编辑像素。工具未暴露准确底层模型。
- 九张素材：程序员背面操作、收手、半起身、站立、左向跨步、经过位；Agent站立、接收、报告。均1024×1536 RGBA。源图哈希和alpha范围见姿态manifest。另以原生SVG补椅背外壳，S01_ASSETS v0.3现含15个道具与16个图解，共31个SVG。
- 当前S01_WHOLE_PREVIEW v0.1由Codex编写whole-motion.mjs及bake-whole.mjs：13个动作条目、45秒试验、541条12fps姿态状态采样、九姿态总览和四张组合SVG；不是541张光栅帧。复用同一T01派发和退回，离席关屏，图解仍透明浮动叠在房间上。
- 重建：python3 arts/static/01/build_assets.py；node arts/actions/01/bake-whole.mjs。原生模块无额外npm依赖。静态入口已同步默认背面工位，当前图层以layout-whole-v01.json优先。产物哈希见manifest-whole-v01.json。
- 浏览器检查：夜间背面坐姿、派发与Agent接收、半起身、白天验收、人物＋图解。人物完整，椅背外壳在前景遮挡腰臀，屏幕在人物后面。起身、转身与两帧步态仍会跳变，尚需中间帧；手与键盘仅视觉摆位，未宣称指尖接触验证。
- 状态：候选动作工艺预览，未记为用户认可或冻结。无配音、Remotion工程、MP4或正式渲染；六章口播未修改，未新建.tmp副本。

## S01-PANEL-V01 · 图解背景与Agent前景

- 用户最新要求图解添加背景色框，并明确Agent在底框上方，修订此前无底框的默认规则。
- 当前：S01_ASSETS v0.4、S01_WHOLE_PREVIEW v0.2、STYLE_BIBLE v0.8、ART_DIRECTION v0.6。未新增生图或改变人物像素、口播。
- 新增diagram-panels-v01.json，集中维护暖白#F6F1E7、0.97填充不透明度、细灰蓝边、圆角及时间轨／任务流／任务终点的局部边界。静态builder与动作baker共用参数，重建六张当前组合图。
- 绘制顺序：故事场景→图解底框→图解内容→Agent→任务浮层；时间轨的说明移至左下以避开人物头部。浏览器检查三种图解底框及Agent前景关系。
- 重建仍为python3 arts/static/01/build_assets.py及node arts/actions/01/bake-whole.mjs，无新增依赖、声音或MP4。

## S01-KEYFRAMES-V02 · 关键姿态与文件交接

- 用户要求增加人物关键帧与流畅度，并以接过文件等动作重新设计Agent行为。沿用用户授权的Codex本轮动作预览路线；无新的Claude调用。
- 内置image_gen.imagegen新增12次，均transparent_background=true，完整姿态编辑；Agent七张（抬手、抓握前、握住、收回、持有、查看、递出），程序员五张（收手中间、前倾、接近站直、转身、后腿回收）。当前共21张1024×1536 RGBA，未编辑原始像素。实际提示词、输入路径、源输出路径及哈希见poses/01/prompts和manifest-v02.json；模型精确标识未暴露。
- S01_WHOLE_PREVIEW v0.3使用keyframes.mjs维护七组关键帧时间和整身基线/高度；保留13个动作条目，接文件、查看、递回分别可独立播放。程序员起身预备和重心提升通过完整姿态与连续均匀缩放衔接；步态现有三张侧面图加转身，仍是有限动画。
- 同一T01沿曲线路径进入接收手，握持后纸张与人物同图，返还时切回独立纸张曲线。独立纸张与持有纸张不同时显示；无事实文本烘焙入纸面。Agent仍位于图解底框及内容上方。
- 当前采样30fps、共1351条整身/道具状态，非1351张光栅帧；21姿态总览和九张组合SVG更新。旧12fps和九姿态文件保留为历史记录。重建命令仍为python3 arts/static/01/build_assets.py；node arts/actions/01/bake-whole.mjs。
- 检查1351场景状态、403独立动作样本：姿态引用存在、缩放有限、单个转移文件和Agent层序正确；核对21个源PNG哈希。浏览器播放接收动作，并查看握持、低头、起身、递回及图解遮挡。未宣称步态完全自然或已完成30fps人物逐帧插画；尚无配音、Remotion工程、MP4。六章口播未改，未新建.tmp副本。

## S01-CAMERA-V01 · 镜头脚本与增量估算

- 日期与时区：2026-10-16，Asia/Shanghai。用户要求01逻辑段保持站立演出、其他情境增加景深及角度变化，提出开头正面特写，并允许调用本机Claude辅助。
- 输入：SHOT_TEXT v0.4、S01_WHOLE_PREVIEW v0.3、STYLE_BIBLE v0.9、当前姿态及布局。实际查看程序员设定表、夜间背景、背面站姿及Agent指向姿态，核对构图代码。输入全文及SHA-256在[提示词](production/01-camera-v01/claude-prompt.txt)与[输入清单](production/01-camera-v01/input-manifest.json)。
- 本机Claude Code 2.1.168，使用本机默认配置、未指定模型、禁用工具和外部MCP。首次调用因空配置缺少mcpServers被CLI拒绝；修正后返回Not logged in，API运行时间0、modelUsage为空，没有生成内容。没有将失败记为模型成功；原始结果与完整命令见[原始JSON](production/01-camera-v01/claude-result.json)与[运行清单](production/01-camera-v01/run-manifest.json)。
- Codex整理[S01_CAMERA v0.1](../final/shot/01.md#video-content)及[增量评估](01_CAMERA_WORKLOAD.md)：11镜／45秒；情境正面、越肩、Agent近景与背面工位交替，逻辑固定机位站立，结尾拉远跟移。推荐最少新增5项素材、8–14制作工时；经济版3项、3–5小时，均为相对完成既有单机位方案的增量估算，不是机器实测或完整工程总工时。
- 检查：01口播哈希与输入一致、155非空白字符，六章仍合计840；11镜连续无重叠或空档，父段时长16／21／8秒，合计45秒。维护的本地链接可解析。输出哈希及检查范围在运行清单中。
- 状态：文字候选、未配音校时。未新增图片、修改动画代码、bake或建立Remotion工程，没有声音与MP4；旧动作预览仍是原背面构图。新用户要求修订旧初始背面约束，已同步索引与艺术方向说明。后续先验证正面近景和反打背景组合。
