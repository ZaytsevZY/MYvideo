# 03 · 新脚本美术与分层构图

**本阶段已由S03_ART v0.4替代。** 当前请使用[新版素材与审核返工说明](../story-assets-v04/README.md)及[新版检查页](http://127.0.0.1:8765/static/03/story-assets-v04/preview.html)；本目录保留历史构图、源输入与生成记录，不继承为当前透视／动作验收。

**S03_ART v0.3 · 2026-10-18 · 美术准备阶段。** 对应S03_STORYBOARD v0.3的11镜，原脚本、口播、字幕和当前03／film动画源码均未修改。

[本机检查页](http://127.0.0.1:8765/static/03/story-assets-v03/preview.html) · [代表联系表](compositions/contact.png) · [图层／资源与SHA](layout.json) · [完整英文prompt与原始输出](provenance/generation.json) · [核对记录](provenance/verification.json) · [11镜制作表](../../../actions/03/provenance/storyboard-v03/chapter-plan.md)。

## 新增采用资源

内置imagegen共11次调用，采用10张PNG：公司机位2张、程序员完整动作4张、两位同事各2张。额外1次用于修正程序员输入时手与键盘的接触点；首稿归入provenance/replaced，仍可追溯。底层模型标识未暴露，所有采用PNG由原输出直接复制，未用代码编辑人物像素。

| 资源 | 当前文件 | 用途 |
|---|---|---|
| 主工位后侧机位 | [office-main-over-shoulder-v01.png](../../../backgrounds/03/office-main-over-shoulder-v01.png) | 1672×941公司背景／桌面／显示器底板，近侧无椅子，供独立人物叠入 |
| 邻桌主观机位 | [office-neighbor-desks-v01.png](../../../backgrounds/03/office-neighbor-desks-v01.png) | 1672×941两处相邻工作位，供两位完整坐姿人物分层 |
| 输入 | [programmer-office-type-v02.png](../../../characters/poses/03/programmer-office-type-v02.png) | 手指落至键盘平面，继续处理会议报告 |
| 确认／发送 | [programmer-office-click-v01.png](../../../characters/poses/03/programmer-office-click-v01.png) | 右手落在鼠标位置，确认清单／发送消息 |
| 停手读消息 | [programmer-office-read-v01.png](../../../characters/poses/03/programmer-office-read-v01.png) | 手停下、抬眼看消息，侧脸可见 |
| 看向同事 | [programmer-office-look-right-v01.png](../../../characters/poses/03/programmer-office-look-right-v01.png) | 固定坐姿向右回头，不旋转整张椅子 |
| 同事A输入两态 | [前态](../../../characters/poses/03/coworker-type-a-v01.png)／[后态](../../../characters/poses/03/coworker-type-b-v01.png) | 灰绿衣、棕发，键盘输入动作关键态 |
| 同事B核对两态 | [读纸页](../../../characters/poses/03/coworker-paper-a-v01.png)／[看回屏幕](../../../characters/poses/03/coworker-paper-b-v01.png) | 米灰衣，双手持同一张纸；纸张已包含在人物PNG中，不另叠移动纸 |

8张人物均1024×1536、真实透明alpha，包含完整人物与其椅背／椅架，避免椅背和身体互相穿插。人物与椅子作为一个绑定绘稿层，背景、屏幕内容、聊天／关系层继续独立。脚、腰和椅子沿同组关键态保持同一摆位；不拆肢体、不拉伸或叠化身体。有限关键态不等于完整逐帧动画。

## 可编辑组件与复用

`arts/items/03/`新增9套SVG／PNG：chatEmpty、chatSent、chatReply，complete、report、working，clock、exchange、tree。文字、状态、线条和头像框是矢量，头像本身沿原PNG裁切显示；未用SVG重画五官。头像复用01程序员与shared负责人，同事头像来自本轮完整工作绘稿；纸张图标复用01采用PNG。

消息严格采用“工作已完成”及“17:00前准备一个会议报告”，不增加其他台词。清单两项的完成勾与新报告的未完成标记分开；树图保留S03-A/B completed和S03-C in-progress。钟面用约16:10的示例指针，未新增数字下班时刻；17:00仅在报告消息中出现，表示截止时间。

## 分层构图与检查

7个1920×1080代表构图及邻桌第二态已备。检查页直接用同一assets.mjs组合原始图层，可以切换场景／同事前后态，开关背景、人物与椅背、屏幕、消息／关系层；合成PNG仅是离线代表图，不用于实时页面替代原生图层。

布局使用1672×941原生空间，再统一映射1920×1080。主角位置固定，输入修正版改善键盘接触、鼠标确认对应实际鼠标；邻桌两人各用一套固定标尺。屏幕UI以仿射变换贴入已有显示器，未平铺第二张工位。聊天移到右上y70，避开脸、手和字幕；逻辑组件缩至右侧，使人物侧脸继续可见。邻桌加独立无文字执行界面，避免“敲黑屏”。实际坐标、层序及显示器四角见layout。

```sh
node arts/static/03/story-assets-v03/build.mjs
node arts/static/03/story-assets-v03/verify.mjs
```

已核对源PNG复制SHA、尺寸／alpha、脚本及字幕／运行代码原字节、消息文字、完成／待处理身份、组件引用、代表图尺寸与同事两态差异。浏览器检查消息、邻桌工作、前后态和图层开关；结果截图见provenance/browser-final.png。整章39秒新时间轴、动作节奏、声音及视频尚未制作，当前film仍显示旧03基础演出。

## 旧资源整理

旧睡眠／醒来图从03当前采用清单退出，未删除：原STORY_ASSETS构图生成器、manifest和历史检查仍引用它们，保留原路径可重建旧版本。shared负责人／同事也供其他章使用，继续共享。

本轮已被替代的输入首稿移到`provenance/replaced/programmer-office-type-v01.png`，不占当前characters/poses/03采用目录。实际生成时的原引用路径仍保存在prompt，generation.json的retainedPath提供归档后位置与SHA；原始工具输出也未删除。整理依据见[retirement-audit.json](provenance/retirement-audit.json)。
