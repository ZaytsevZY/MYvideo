# 第05章 · 执行能力与劳动自主性

**全片统一入口：** [01–06动态框架](../film/README.md) · [连续播放](http://127.0.0.1:8765/actions/film/preview.html)。原章入口与历史制作记录继续保留。

**S05 v0.1**：完整45秒／1920×1080／30fps／1350帧，13镜，无声字幕候选。原156字符口播保留，12条字幕暂排。已完成检查，用户授权本轮完成后推送。

- [完整MP4](exports/05-complete-silent-v01.mp4) · [本机播放页](http://127.0.0.1:8766/arts/actions/05/exports/index.html)
- [05→06接缝MP4](exports/05-to-06-seam-v01.mp4) · [衔接契约](provenance/v01/boundary-to-06-v01.json)
- [交互时间轴](preview.html) · [编码后分镜联系表](exports/05-encoded-contact-v01.png) · [制作单／13镜表](provenance/v01/chapter-plan.md)
- [SRT](captions/05-v01.srt) · [JSON](captions/05-v01.json) · [VTT](captions/05-v01.vtt)
- [验证记录](provenance/v01/verification.json) · [输入与精确源码快照](provenance/v01/input-manifest.json) · [素材验证](provenance/v01/asset-validation.json) · [媒体清单](exports/05-v01-manifest.json)
- [04→05提案](provenance/v01/boundary-from-04-v01.json)

人的操作先后调用代码／测试／文档三个Agent实例，组织层的产品目标、交付周期与成果分配节点保持独立；知识、协作和工具汇入生产系统，组织制定的交付标准再反馈给劳动者。结尾区分工具调用与决定权，明确需要相应规则安排，而非把决定权画成永久禁止。

复用01采用PNG和06同一工位图层，不新增美术或声音；源图不改，不拼接肢体。资源卡、交付标准和反馈文字已避让；转场先收起其他工具实例，再保留单个角色移动，避免头像交叠。42秒起直接使用06的起点图形，不叠化两套文字，45秒切换本章与下一章字幕。

1351状态、156字符原文、组织决定节点所有者、独立示意任务未自动验收、单层完整人物、素材尺寸／透明通道／哈希、34个代表时点及编码后抽帧、完整解码、30fps时间戳、黑帧检查通过。实际05／06编码视频组成4秒120帧接缝；切点除字幕外源SVG逐字一致。同环境独立目录重渲染，45秒MP4字节一致。

## 复现

Node≥22、sharp0.35.5、FFmpeg／ffprobe，以及中文字体；实测依赖版本见媒体清单。图解优先PingFang SC，字幕优先Hiragino Sans GB。字体或编码器不同，像素和文件哈希不承诺跨平台一致。

```sh
npm install --prefix arts/actions/05
node arts/actions/05/build.mjs --video
```

本机可使用已安装依赖：

```sh
NODE_PATH=/Users/bytedance/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules node arts/actions/05/build.mjs --video --output-dir /tmp/chapter05-rerender
```

已有MP4时拒绝覆盖，使用新的`--output-dir`。不加`--video`只更新静帧、字幕、预览与状态等派生产物。完整正片只依赖源码和PNG库存，不读取旧MP4；本章引用06场景模块以保持共用工位与精确接缝，版本及哈希随源码快照保存。

若06 MP4存在，额外导出真实编码接缝；不存在时正常完成05正片并跳过接缝。可先运行06导出器取得该MP4。MP4沿用项目gitignore，不随Git推送；源代码、字幕与验证记录入库。

## 限制

无配音，字幕为语义暂排。04暂无动画交接，04→05只记录提案；03与04由其他人负责，未改其文件。全片起点02:57沿用当前预算，03／04定稿后需重算偏移。第06章的配音与课程成员信息仍待补，不由本章擅自填写。
