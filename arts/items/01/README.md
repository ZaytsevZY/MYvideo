# 01 · 独立道具与屏幕状态

## 2026-10-16 · 主体素材重绘

当前动态预览的主要工位与纸张／托盘已改用图像模型绘制PNG，统一透视和材质；workstation-painted-v02.png为采用稿，v01只作过程保留。椅背与显示器背壳独立PNG保留遮挡职责。 完整prompt、来源、尺寸、alpha与哈希见[重绘记录](../../static/01/RASTER_REFINEMENT.md)。保留矢量文字、状态与动效标点；新主体PNG按原生比例渲染，不用拉伸补构图。


## 2026-10-16：显示器背壳前景

新增[monitor-back-v01.svg](monitor-back-v01.svg)，1280×360，N5：与现有显示器共用深蓝灰色板，作为正面反打的独立近前景，不含屏幕文字。当前目录共16个道具SVG；原build_assets.py仍维护旧15项，新背壳由独立[镜头资源清单](../../static/01/camera-assets-manifest-v01.json)记录。合成检查见[CAMERA_ASSETS](../../static/01/CAMERA_ASSETS.md)。

**版本：** S01_ASSETS v0.5 · 2026-10-15。

本目录15个原生SVG（包含新增椅背背面外壳），基础道具由 [build_assets.py](../../static/01/build_assets.py)确定性绘制；透明区域保持透明，屏幕界面自身为不透明内容。它们采用与角色相近的深色轮廓、有限阴影及克制配色，便于按图层控制。它们是实际可用的矢量道具，不是截取背景里的物件。

| 分组 | 文件 | 分层职责 |
|---|---|---|
| 桌子 | [desk-legs](desk-legs-v01.svg)、[desk-surface](desk-surface-v01.svg) | 桌腿位于人物后方；桌面前缘遮挡下半身；手臂和输入设备位于桌面之上 |
| 椅子 | [chair-back](chair-back-v01.svg)、[chair-seat](chair-seat-v01.svg) | 椅背和座垫分开，之后与坐姿的躯干、腿部组合 |
| 电脑 | [monitor-frame](monitor-frame-v01.svg)、[computer-tower](computer-tower-v01.svg) | 显示器外框与主机独立；屏幕内容可以整体替换 |
| 输入设备 | [keyboard](keyboard-v01.svg)、[mouse](mouse-v01.svg) | 预留手部接触点；键盘无随机字母 |
| 灯光道具 | [desk-lamp](desk-lamp-v01.svg)、[lamp-glow](lamp-glow-v01.svg) | 灯具与暖光分别控制；光晕不改变背景的已绘制光影 |
| 屏幕状态 | [off](screen-off-v01.svg)、[idle](screen-idle-v01.svg)、[running](screen-running-v01.svg)、[review](screen-review-v01.svg) | 关闭／待派发／编写测试整理／人工验收；没有费用、效率倍数或伪造代码 |

显示器局部画布640×440，屏幕开口为`x=32,y=28,w=576,h=324`。四个screen素材均576×324，必须放入同一开口；不要把界面连同外框一起重新缩放。验收界面区分“已生成”“待审核”“待修改”，不把Agent产出自动视为人工通过。

每个SVG的尺寸、用途、局部锚点见 [native-assets-v01.json](../../static/01/native-assets-v01.json)。场景中默认摆位、屏幕变换和手部接触参考见 [layout-v01.json](../../static/01/layout-v01.json)。键盘在桌面预览中使用独立横纵缩放表现投影，接触点按相同变换计算；实际人物绑定后仍须验证。

原空工位检查覆盖静态轮廓和屏幕开口；当前已追加完整背面坐姿和有限动作预览，未制作手指逐帧动画或成片。

## 当前人物组合

已新增 [椅背背面外壳](../../items/01/chair-back-rear-v02.svg)，放在背向镜头的完整程序员前面；旧椅背正面保留作其他视向素材。当前构图与遮挡以 [layout-whole-v01.json](../../actions/01/layout-whole-v01.json)为准，[动作预览](../../actions/01/README.md)记录九张姿态及有限动作。上文四个旧assembly／logic SVG为空工位检查记录，不能作为当前人物布局或动作验证；静态preview现在优先展示完整姿态组合。
