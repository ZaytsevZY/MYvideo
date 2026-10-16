# 角色设定 · v01

## 2026-10-16：01镜头新增角色资源

正面近景两姿态与朝右3/4站姿已放入[poses/01](poses/01/README.md)，新增3张透明PNG，库存共24张人物姿态；旧动作预览仍使用先前21张。[新增镜头资源](../static/01/CAMERA_ASSETS.md)记录实际尺寸、完整prompt、来源哈希与静态合成。

2026-10-15 · 内置 `image_gen.imagegen` 生成 · 候选设计，尚未冻结。

以 [anime-contact1.jpg](../../assets/references/anime-contact1.jpg)、[anime-contact2.jpg](../../assets/references/anime-contact2.jpg)为风格参考。先生成Agent，再以其设定表作为其余三次调用的共同风格参考，保持线条、平涂、有限阴影和服装轮廓一致。准确底层模型标识未由工具暴露，不补写模型版本。

| ID | 角色设定表 | 内容与识别特征 | 完整调用提示词 |
|---|---|---|---|
| C-A | [agent-model-sheet-v01.png](agent-model-sheet-v01.png) | 正面、3/4侧面、侧面及两个头部研究；橙色短发、星芒、浅色外套、深色内搭与裙装 | [agent-v01.txt](prompts/agent-v01.txt) |
| C-P | [programmer-model-sheet-v01.png](programmer-model-sheet-v01.png) | 三个全身视图及中性、疑问头部；深色短发、蓝灰卫衣、工牌 | [programmer-v01.txt](prompts/programmer-v01.txt) |
| C-C | [coworker-model-sheet-v01.png](coworker-model-sheet-v01.png) | 三个全身视图；灰绿上衣、深色长裤，无面部五官与表情；作为重复使用的同事通模 | [coworker-v01.txt](prompts/coworker-v01.txt) |
| C-M | [manager-model-sheet-v01.png](manager-model-sheet-v01.png) | 三个全身视图；深蓝外套、灰裤，无五官与表情；独立绘制一个琥珀色文件夹供后续道具参考 | [manager-v01.txt](prompts/manager-v01.txt) |

四张原始输出均为1536×1024 PNG、浅暖白不透明背景。本轮共四次调用，各生成一张设定表；未覆写原参考图。原始生成文件复制到本目录，未做后期图像编辑。完整来源、输出路径、尺寸、提示词与参考文件SHA-256见 [manifest-v01.json](manifest-v01.json)，项目记录见 [GENERATION_LOG](../../scripts/doc/GENERATION_LOG.md)。

## 使用边界与简化原则

- 这些是用于确认外观的设定图，尚非透明单体素材、分层PSD/SVG或绑定好的动画部件；模型生成的多个视图也不保证严格几何一致。
- Agent以橙发和星芒为识别锚点，保留用户参考的拟人形象，不称其为经过核验的官方角色。
- 主角只保留叙事需要的少量表情；同事和负责人通过服装、道具与动作区分职责，不追加表情设计。通模重复使用时，可在后续组件中调整服装色和基础发型，保持同一绘画规范。
- 当前服装仍有少量褶皱和细节；转为代码部件时进一步合并发束、鞋带、衣褶与阴影，优先保持轮廓和识别标记。
- 站姿轮廓已检查为完整可辨，三视图间隔清楚，次要角色无五官。坐姿、手与键盘接触、人物遮挡和旋转中心仍需按实际镜头另做部件与姿态验证。

后续镜头以此轮角色图为外观候选，按 [ART_DIRECTION](../../scripts/style/ART_DIRECTION.md)进一步设计动作与场景；本轮不改变口播与故事论证。

## 01镜头当前素材

已追加 [S01_WHOLE_POSES v0.2](poses/01/README.md)：21张完整透明PNG和 [动作预览](../actions/01/README.md)。程序员初始背对观众，角色以完整姿态覆盖到场景；rigs目录的分件绑定试验已因视觉质量不足停用。上文“尚未”描述初次CHAR-V01设定表本身，不代表当前01姿态状态。
