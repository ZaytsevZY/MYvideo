# 01 · 图像模型重绘素材

**版本：** S01_RASTER_ASSETS v0.1 · 2026-10-16；用于S01_CAMERA_PREVIEW v0.3，S01_CAMERA v0.3的口播和时间轴不变。

用户指出原生SVG道具与头像过于简略，线条和透视不统一。本轮采用内置image_gen.imagegen重绘，按当前1920×1080构图接入透明PNG，细节与原完整人物绘稿匹配。没有将原SVG简单转成PNG充当重绘。

## 当前资源

| 类型 | 路径／用途 |
|---|---|
| 程序员头像 | [中性](../../characters/portraits/01/programmer-neutral-v01.png)、[专注](../../characters/portraits/01/programmer-focus-v01.png)；保留黑发、灰眼、蓝衣及细线赛璐珞画风 |
| Agent头像 | [中性](../../characters/portraits/01/agent-neutral-v01.png)、[思考](../../characters/portraits/01/agent-focus-v01.png)；保留橙发、琥珀眼、白色星形发饰与白橙外套 |
| 工位整体 | 台灯、键盘、鼠标、显示器、桌面／桌腿、主机与椅座作为一套透视重绘，避免逐件摆放产生不同消失方向；采用[workstation-painted-v02.png](../../items/01/workstation-painted-v02.png)，首稿仅作过程保留 |
| 椅背 | [后向椅背](../../items/01/chair-back-rear-painted-v01.png)，独立置于人物之前，保留完整人物原图 |
| 近前景显示器 | [背壳](../../items/01/monitor-back-painted-v01.png)，用于正面开场的下沿遮挡 |
| 文件 | [横版](../../items/01/task-document-landscape-v01.png)、[竖版](../../items/01/task-document-portrait-v01.png)，动态标签独立叠加，物理纸张不生成假文字 |
| 计划托盘 | [托盘](../../items/01/plan-tray-painted-v01.png)，手绘边缘、厚度、材质及同向透视 |

本轮共11次生成，采用10项PNG；工位首稿经一次桌面／键盘对位编辑后采用v02。

完整prompt逐字保存于characters/portraits/01/prompts与items/01/prompts；工具、引用、原始输出、实际尺寸、alpha、哈希与最终采用关系见[raster-assets-manifest-v01.json](raster-assets-manifest-v01.json)。模型底层标识未暴露，未虚报型号。所有生成PNG原像素直接复制；显示器背壳与托盘只通过SVG viewBox裁去透明布局留白，不修改源像素。

## 接入原则

- 主体素材以PNG绘制，保留细线、色阶和材质，按原生宽高比摆放；头像表情切换使用独立完整画像，不再程序化拼接五官。
- 工位小窗复用同一套工位和椅背，人物与桌面接触点按同一缩放关系校准；主镜头的屏幕内容重新对位。
- 文字、状态勾、思考旋转标志、动作线、轨迹、遮罩和图解底框保留可编辑矢量，因为它们承担动画与信息布局。
- 原SVG与上轮代码保留作来源和旧模式对照；当前默认预览使用重绘版。源人物、口播与责任状态不改变。

当前仍为无配音预览，非最终视频或用户冻结。实际视觉检查、采用调整与校验记录见[本轮留档](../../actions/01/provenance/raster-v03)。

13项节点检查通过；12镜代表图及实际浏览器的6.5秒工位、14秒审核、26.5秒头像搬运等关键画面已检查。详见留档中的校验记录；用户艺术审阅仍待进行。

当前绘制素材版已在浏览器实际从开头播放到45秒末端，控制台无错误；截图与校验见raster-v03制作记录。
