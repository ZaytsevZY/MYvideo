# 01 · 完整姿态与遮挡预览

**全片统一入口：** [01–06动态框架](../film/README.md) · [连续播放](http://127.0.0.1:8765/actions/film/preview.html)。原章入口与历史制作记录继续保留。

**当前动态入口：** [S01_CAMERA_PREVIEW v0.4](CAMERA_PREVIEW.md)，12镜／45秒，25张人物姿态，已加入打字／思考反馈、表情帧、头像搬运文件、程序员反复查看电脑小窗与结尾清单。直接打开[本机预览](http://127.0.0.1:8765/actions/01/preview.html)；菜单仍保留以下旧工艺和原13条独立动作。

以下内容记录旧背面工位与动作工艺，旧模块和素材包保持不变。

**当前无声视频：** [45秒MP4及字幕](exports/README.md)已导出，1920×1080／30fps／1350帧；原155字符口播分14段烧录，无音频轨。字幕时点暂排，待配音校时。原生SVG经sharp／FFmpeg逐帧编码；新增3项字幕检查和原13项动作检查通过，全视频解码无错误。

**旧工艺对照：** S01_WHOLE_PREVIEW v0.3 · 2026-10-15。代码由Codex编写，用户在Claude未登录后明确授权本轮预览例外；正式Claude / Remotion路线保持后续计划。

- [preview.html](preview.html)：45秒无配音试验、13个动作条目和关键时间按钮；本地地址为 http://127.0.0.1:8765/actions/01/preview.html 。
- [21张完整姿态](../../characters/poses/01/README.md)、[姿态总览](contact-sheet-whole-v02.svg)。
- [夜间工位](assembly-night-whole-v01.svg)、[白天验收](assembly-day-whole-v01.svg)、[半起身](rise-whole-v01.svg)、[人物与图解](logic-whole-v01.svg)。
- [layout-whole-v01.json](layout-whole-v01.json)：当前构图、镜头方向及图层顺序；优先于旧空工位layout-v01.json的未来人物占位。
- [whole-motion.mjs](whole-motion.mjs)：纯时间采样、整身姿态选择、均匀缩放和叠层；[bake-whole.mjs](bake-whole.mjs)生成包、预览及1,351条30fps状态采样。
- [manifest-whole-v01.json](manifest-whole-v01.json)：当前产物和限制；[scene-whole-30fps-v02.json](scene-whole-30fps-v02.json)是姿态与位置数据，不是1,351张光栅动画帧。

从远到近为房间、桌腿与主机、桌面、显示器和屏幕、键鼠与台灯、座垫、完整人物、椅背外壳、图解底框、图解内容、Agent、任务浮层。程序员背向观众，观众从其背后看向屏幕；椅背外壳遮住人物腰臀。行走进入更近的过道层，整身覆盖椅子；不重复绘制前臂或用透明叠化混合两个身体。所有人物PNG只做整身均匀缩放，不修改源图像素。

13条动作复用21张完整姿态，关键帧在 [keyframes.mjs](keyframes.mjs)统一维护，并输出 [keyframe-tracks-v01.json](keyframe-tracks-v01.json)。程序员收手经过中间位，起身依次前倾、半起身、接近站直、转身；入座逆向衔接，脚底基线固定，整身高度和位移使用缓动。行走补后腿回收，与跨步、经过位构成有限步态。没有拆开肢体插值或叠化两个身体。

Agent接收为待命→抬手→伸手→抓握前→握住文件→收到身前→查看；返还按持有、递出、释放衔接，文件沿连续曲线回到屏幕。持有帧的纸张直接绘在完整角色上，空中纸张由代码绘制，接触前后不会同时显示两张文件。同一T01逻辑身份保持连续。处理阶段低头读文件并回到持有姿态；图解出现后先返还结果，再用手势指向图解。Agent保持在图解底框及内容上方。

浏览器已检查接文件动作播放、握持、查看、起身、递出和图解前景。1351条30fps数据只记录整身变换和姿态选择；有限姿态之间仍有切换，步态不是完整解剖学插帧。没有配音、Remotion工程、MP4或光栅逐帧序列。旧12fps数据及九姿态总览保留作历史试验，不作为当前动作采样。

重建顺序：`python3 arts/static/01/build_assets.py`，然后 `node arts/actions/01/bake-whole.mjs`。原生道具与姿态PNG各自保留；新生图须更新姿态清单与提示词，再重建动作包。

此前 `rigs/`、`motion.mjs`、`bake.mjs`、`bundle-v01.json`、`clips/`、`keyposes/` 和 `manifest-v01.json` 属于用户指出视觉质量较差的分件试验，已停用，保留为试验记录。数值接触误差为零不能证明视觉遮挡或人体连接正确。当前入口仅使用带whole的组合文件。Claude调用失败记录见 [provenance](provenance)。本轮未在.tmp新建副本。

图解现使用按内容定高的暖白色框，填色、边线、圆角和三种高度统一在 [diagram-panels-v01.json](../../static/01/diagram-panels-v01.json)维护。Agent在底框与图解内容上方；时间轨说明移至左下，避开Agent头部。已检查三种图解及层序，静态入口同步新增任务流和任务终点组合图。

当前默认素材已重绘为PNG，包括四张角色头像和统一工位／纸张／托盘等；见[重绘素材记录](../../static/01/RASTER_REFINEMENT.md)。旧工艺条目继续保留作对照。
