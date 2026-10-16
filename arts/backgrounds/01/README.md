# 01 · 背景

## 2026-10-16：反打夜景

新增[workroom-reverse-night-v01.png](workroom-reverse-night-v01.png)，1672×941不透明PNG：同房间对侧墙，用于正面近景，背景中未烘焙人物、椅子或电脑。现有01背景共3张；原昼夜两图继续用于背后工位。完整请求见[prompts/reverse-night-v01.json](prompts/reverse-night-v01.json)，来源、哈希与静态合成见[CAMERA_ASSETS](../../static/01/CAMERA_ASSETS.md)。

**版本：** S01_ASSETS v0.5 · 2026-10-15 · 静态分层资源，尚未bake。

| 文件 | 用途 | 完整生图提示词 |
|---|---|---|
| [workroom-night-v01.png](workroom-night-v01.png) | 夜间工作空间背景，供V01.1派发与后台执行 | [night-v01.txt](prompts/night-v01.txt) |
| [workroom-day-v01.png](workroom-day-v01.png) | 同一空间的白天光照版本，供次日审核 | [day-v01.txt](prompts/day-v01.txt) |

两图均为1672×941不透明PNG。先以程序员设定图及anime-contact2为风格参考生成夜景，再以夜景为编辑目标调整白天光照；窗框、书架、柜体和中央空区在目视检查中基本对齐，不保证像素级几何一致。后续夜转晨需要检查边缘是否出现重影，不能将两个独立输出直接当作已经验证的连续帧。

背景只保留墙面、窗、远景、周边收纳与地面，不包含人物、桌椅、电脑、台灯或图解。中央下部供工位与程序员叠加，右侧留给Agent或图解；这两张背景是分层素材，不能单独作为视频空镜充时。

构图基准为1920×1080，原图比例与16:9相差不足0.1%；两张背景使用同一个中心和缩放规则。图中光照属于背景美术，台灯实体和可选光晕是独立SVG；家具与角色不会随昼夜自动重绘或自动受光，需要在后续合成中另行控制。

实际工具为内置image_gen，底层准确模型标识未暴露。两次调用参数和原始输出路径见 [generation-v01.json](generation-v01.json)；所有输入、输出与提示词的哈希汇总见 [素材清单](../../static/01/manifest-v01.json)。原始输出直接复制，未进行后期像素编辑。

使用 [静态叠层预览](../../static/01/preview.html)查看背景与独立工位道具的组合；布局及未来人物位置见 [layout-v01.json](../../static/01/layout-v01.json)。
