# 01 · 多机位镜头新增美术资源

**版本：** S01_CAMERA_ASSETS v0.1 · 2026-10-16。对应[S01_CAMERA v0.2](../../../scripts/final/shot/01.md#video-content)，12镜／45秒预算。

本轮新增5项资源：4张内置image_gen生成PNG、1个原生SVG。全部已放入现有01目录，保留旧素材；源PNG直接复制，未缩放、抠图或修改像素。当前已接入[S01_CAMERA_PREVIEW v0.1](../../actions/01/CAMERA_PREVIEW.md)，可按12镜动态播放；原始美术仍为候选资源，没有生成配音或视频。

| 镜头ID | 文件 | 原始尺寸 | 使用镜头／职责 |
|---|---|---|---|
| N1 | [正面中性姿态](../../characters/poses/01/programmer-front-neutral-v01.png) | 1153×1364，RGBA | S01-01，完整上半身、低头看屏幕，前景显示器遮住下沿 |
| N2 | [正面决定派发](../../characters/poses/01/programmer-front-dispatch-v01.png) | 1153×1364，RGBA | S01-02，以上一张为编辑目标，微调视线、下颌和专注表情 |
| N3 | [朝右3/4站姿](../../characters/poses/01/programmer-logic-stand-right-v01.png) | 1024×1536，RGBA | S01-07至11，程序员站在画面左侧、朝向右侧图解；同一姿态可用于结尾构图 |
| N4 | [同房间反打夜景](../../backgrounds/01/workroom-reverse-night-v01.png) | 1672×941，RGB | S01-01／02，人物后方为暗墙与门框，不复用原窗景充当反打 |
| N5 | [显示器背壳](../../items/01/monitor-back-v01.svg) | 1280×360，透明SVG | S01-01／02，独立近前景遮挡；不用显示器正面外框冒充背壳 |

## 静态检查入口

- [中性姿态合成PNG](camera-front-neutral-v01.png)、[决定派发合成PNG](camera-front-dispatch-v01.png)：背景轻虚化→完整人物→显示器背壳轻虚化。均1920×1080，仅预览派生图。
- [站立构图PNG](camera-standing-layout-v01.png)：程序员在左、Agent在右，图解清晰，Agent在底框和图解前景。
- [HTML素材检查页](camera-assets-preview-v01.html)：素材透明棋盘、正面两姿态切换及站立布局。该页已生成，但因浏览器禁止file协议，本轮没有通过浏览器验证交互；实际目视检查使用离线渲染PNG。
- [镜头布局](camera-assets-layout-v01.json)、[生成与校验清单](camera-assets-manifest-v01.json)、[源图与实际请求](camera-assets-sources-v01.json)、[原始输入哈希](camera-assets-input-v01.json)。

检查已覆盖：5项文件可读取、3张角色PNG角点透明、两张正面画布尺寸相同、项目PNG与生成源哈希一致；反打背景未烘焙人物或电脑；近景遮挡未挡脸；站姿方向与图解避让可用。未验证配音时序、关键帧切换的运动连续性或完整45秒播放。

## 消费素材时的约束

1. N1、N2使用同一画布尺寸和整身均匀缩放，但局部轮廓仍有小幅绘制差异；按完整姿态切换，不叠化两个身体。正面画布不是旧素材的1024×1536，消费者必须读取实际宽高，不能套用旧baker的统一尺寸。
2. N3朝右，现有Agent的指向朝左；二者脚底在示例中共用y=1008基线。N3源图在轮廓外仍有极低alpha边缘，和旧姿态类似；已在日间底图检查，最终合成仍需看实际背景。
3. N4仅夜间反打；窗景仍用于原背后机位。背景、人物、前景道具独立，背景虚化只在示例合成中施加，没有写回源PNG。
4. 原build_assets.py仍维护旧的31个SVG；N5为新增第32个原生SVG（道具16＋图解16），单独清单记录，原生成器和动作bundle未改。三张合成SVG是检查产物，不计入原生道具数。

## 提示词与重建

实际工具为内置image_gen.imagegen，共4次成功调用，无额外重试；准确底层模型标识未暴露。完整英文提示词、引用路径、透明参数和源图路径位于[人物prompts](../../characters/poses/01/prompts)中的programmer-front-neutral／front-dispatch／logic-stand-right-v01.json，以及[背景prompt](../../backgrounds/01/prompts/reverse-night-v01.json)。N5由Codex按现有深蓝灰色板直接编写SVG，未调用生图。

重新生成检查布局（不调用生图、不改源PNG）：

```sh
python3 arts/static/01/build_camera_assets_preview.py
NODE_PATH=<已安装sharp的node_modules路径> node arts/static/01/render_camera_assets_preview.cjs
```

本次离线渲染使用Codex bundled runtime的sharp／librsvg；准确版本和PNG哈希见清单。静态布局与旧工艺分别保留；当前动态入口见S01_CAMERA_PREVIEW，不用这些合成图轮播代替角色与图解动作。
