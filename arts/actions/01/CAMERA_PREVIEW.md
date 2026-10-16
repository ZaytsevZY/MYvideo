# 01 · 动作与视觉叙事预览

**版本：** S01_CAMERA_PREVIEW v0.4 · 2026-10-16。绑定S01_CAMERA v0.3，12镜／45秒预算，口播155字符不变。

[打开当前预览](http://127.0.0.1:8765/actions/01/preview.html)。默认是字幕版；进度条可跳转，镜头按钮收在“镜头跳转”内。菜单保留旧背面工位及13单动作。

## 当前字幕与无声视频

已将01口播稿添加为14段字幕，原文字／标点／Agent拼写保持，时间按镜头与语义暂排。44px白字及局部半透明深色底框固定在屏幕底部，不随相机运动。当前预览与视频烘焙共用同一字幕绘制函数；[JSON／SRT／VTT及说明](captions/README.md)。

本次直接沿用原生SVG／JavaScript场景经sharp／librsvg逐帧栅格化，再用FFmpeg编码H.264，未新建Remotion工程。目标视频为1920×1080、30fps、1350帧、45秒，字幕烧录，无音频轨；实际产物及验证见[导出入口](exports/README.md)。字幕排时未经过配音对齐。

以下为此前素材与演出阶段记录；其中“尚无视频”不覆盖本节导出记录。

## 当前素材细化

已用内置imagegen重绘10项采用PNG：程序员／Agent各两种表情头像，横竖文件，计划托盘，统一透视工位，椅背和近前景显示器背壳。共11次生成，工位首稿经一次接触点修正后采用v02。台灯、键鼠、显示器、主机、桌面及椅座由同一幅工位绘稿保证透视／材质一致；原SVG仍作旧模式及来源保留。画面文字、状态与动效标点继续使用可编辑矢量。源PNG全部原样复制，渲染按原生比例，屏幕和手部重新对位。详见[素材与完整prompt记录](../../static/01/RASTER_REFINEMENT.md)及[资产manifest](../../static/01/raster-assets-manifest-v01.json)。

13项检查通过，含PNG签名／尺寸、原生比例、当前画面不再引用旧几何工位道具；浏览器检查工位、审核界面和绘制头像。原有25张完整人物姿态保持，四张头像单独计数。本轮没有调用Claude，代码只做素材接入与对位；上一轮动效模块来源记录如下。

## 本轮改动

- 正面打字短线、绘制的疲惫闭眼帧、决定派发的收势；起身等姿态切换加入两帧短时模糊。
- Agent执行中显示转动星芒与思考点；11.2秒结果生成后停止loading，切到短暂结果反馈。交接文件有速度线和接收反馈，人工验收分别使用通过／返工反馈。
- 16–23秒由卡通头像交接同一文件，门与月亮表达暂时离线；去掉人工／机器文字轨标、比例式时间条及解释性说明。
- 23秒后由程序员头像逐项选择，Agent头像在选择后搬运折角文件。T01-R仍需人工复核、通过和并回；新排期不自动验收。
- 逻辑段下方用工位小窗替代长时间站立：完整人物姿态切换，程序员反复查看电脑，文件到来时纸堆增加。35.5–37秒同一文件重排为竖向清单图标；结尾保留旧完成项及原终点参照。
- 暖白局部底框、统一蓝橙绿状态色，Agent头像和操作小窗位于底框上层。画面不铺解释段落，必要限定保留在脚本文档。

本轮一次本机Claude Opus 5.5英文prompt生成performance模块，276.539秒返回，无重试。Codex接入、调整字号／文件形态／托盘间距／头像避让并修正边界渲染，详见[完整留档](provenance/performance-v02/direction.md)。另一次内置imagegen生成疲惫表情，原始PNG直接复制至01姿态目录；共25张可用人物姿态。

## 文件

| 文件 | 职责 |
|---|---|
| [camera-motion.mjs](camera-motion.mjs) | 12镜、语义任务状态、相机与情境合成 |
| [performance.mjs](performance.mjs) | 动作反馈、卡通头像、文件搬运、收势及操作小窗 |
| [bake-camera.mjs](bake-camera.mjs) | 25姿态素材包、1351条状态采样与12镜代表SVG |
| [preview.html](preview.html) | 播放、跳转与旧动作入口 |
| [manifest-camera-v01.json](manifest-camera-v01.json) | 当前输入／代码／代表图哈希与限制；保留既有路径 |
| [camera-contact-v01.png](camera-contact-v01.png) | 当前12镜代表图总览；保留既有路径 |
| [camera-motion.test.mjs](camera-motion.test.mjs) | 13项检查：连续采样、资源、单人物、人工归因、终点、loading结束、闭眼与小窗变化 |
| [manifest-performance-v01.json](../../characters/poses/01/manifest-performance-v01.json) | 新表情的尺寸、来源、prompt及哈希 |

## 验证与复现

```sh
node arts/actions/01/bake-camera.mjs
node --test arts/actions/01/camera-motion.test.mjs
NODE_PATH=<已安装sharp的node_modules路径> node arts/actions/01/render-camera-stills.cjs
python3 -m http.server 8765 --bind 127.0.0.1 --directory arts
```

13项检查通过，遍历全部1351采样；离线代表图及实际浏览器关键片段已检查，已实际从0秒播放到45秒末端。自动检查不替代用户的艺术审阅。尚无配音、音效、Remotion工程或视频导出；仍是有限完整绘稿与代码动效，短时模糊不是新绘制的解剖中间帧。45秒预算待配音校准，02接续尚未实现。

原whole-motion、keyframes和whole素材包保持旧对照；上一版camera代码／播放器快照在provenance/performance-v02。本轮未将候选画面记为用户冻结。

当前绘制素材版已在浏览器实际从开头播放到45秒末端，控制台无错误；截图与校验见raster-v03制作记录。
