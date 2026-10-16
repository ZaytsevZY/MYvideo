# 第02章 · 完整38秒无声字幕候选

当前交付为 **S02_FULL v0.3**，覆盖V02.1–V02.3：第02章0–38秒／全片45–83秒。12个镜头，1920×1080、30fps、1140帧，H.264／yuv420p，无音轨。

- [完整视频](exports/02-complete-silent-v03.mp4) · [本机播放页](http://127.0.0.1:8766/arts/actions/02/exports/index.html)
- [镜头表与制作单](provenance/full-v03/chapter-plan.md) · [全章联系表](exports/02-complete-v03-contact.png)
- [交互时间轴](http://127.0.0.1:8766/arts/actions/02/full-preview.html)
- [SRT](captions/02-complete-v03.srt) · [字幕JSON](captions/02-complete-v03.json) · [VTT](captions/02-complete-v03.vtt)
- [验证记录](provenance/full-v03/verification.json) · [输入哈希与素材表](provenance/full-v03/input-manifest.json) · [渲染清单](exports/02-complete-silent-v03-manifest.json)
- [02→03边界提案](provenance/full-v03/boundary-to-03-v01.json)，第03章尚未制作，未实测接缝。

本版完整重绘38秒：第一帧沿用01终态的卡片、字体与头像，随后连续移动到新布局；13秒与27秒处已取消整层文字叠化，Agent只有一层；两张新增任务自入场后保留到片尾，不再消失、重复加入。原13秒样片与v0.2完整章保留为历史，当前不再声称前390帧逐帧一致。

[修订后01→02四秒接缝](exports/01-to-02-seam-v03.mp4)：前2秒来自既有01代码重绘，后2秒为本版02；原01完整MP4仍缺失。入点源SVG几何逐字匹配，切点画面另做编码后比对。

全部121字符口播保留，11条字幕为语义暂定排时，尚无配音校准。坐标、条带与任务数仅用于说明，不是实测收益或节时比例。人的操作与审核分开标识，机器等待不合计成人的劳动。

沿用原生SVG／JavaScript→sharp/librsvg→FFmpeg，无Remotion工程；复用原PNG角色／文件／工位，无新增生图或声音服务调用。后台使用内存纹理缩放和静态场景合成优化渲染，源图不改；代码与素材哈希、精确源码快照和工具版本均留档。

## 本机复现

需要Node、sharp、FFmpeg／ffprobe与中文字体。根目录执行：

```sh
NODE_PATH=/Users/bytedance/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules node arts/actions/02/build-revision.mjs
```

默认生成静帧、字幕、状态数据与播放器；加`--video`渲染完整38秒及新的接缝预览。已有最终文件时拒绝覆盖，须先选择新版本。该脚本复用已有图像库存，并依赖旧接缝的01代码重绘片段以制备新版接缝；MP4被gitignore排除，换机器时需交接对应文件。

历史13秒样片及v0.2视频保留。此前入点跳变、整层叠化、任务卡消失问题在v0.3中修订；本轮技术检查与编码后抽帧通过，仍为待用户审阅候选，03–06未展开。
