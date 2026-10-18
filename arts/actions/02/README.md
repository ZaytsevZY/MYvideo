# 02 · 当前38秒动态框架

**当前：S02_STORY v0.4 · 2026-10-18**，按未修改的S02_STORY_LOGIC v0.4重建。原口播121字符、11段字幕、全片45–83秒／1140帧不变。

[章节预览](http://127.0.0.1:8765/actions/02/full-preview.html) · [全片中的02](http://127.0.0.1:8765/actions/film/preview.html?frame=1350) · [代表图](provenance/story-v04/contact.png) · [唯一实现镜头表](provenance/story-v04/chapter-plan.md) · [来源与SHA](provenance/story-v04/manifest.json) · [检查记录](provenance/story-v04/verification.json)。

七段沿当前脚本依次呈现：0–5秒工位打开搁置需求；5–13秒候选与可行边界；13–17秒“休息／继续工作”并行；17–23秒同一节约的互斥配置；23–27秒前景遮挡、KPI、柔和边框选定及右窗全屏；27–32秒人的操作／审核投入与任务规模；32–38秒当前文件／下一份连续审核。文字“休息”保留，用餐仅作为动作；KPI保持独立文字层。

采用现有完整PNG、背景、工位、纸张与需求UI，窗内继续原生多图层合成；没有重画素材、拆肢体或播放压平的整窗PNG。共享构图模块新增可选状态／屏幕接口，原12秒构图的代表像素保持相同。审核人物持纸时Agent改为空手，避免同一文件同时出现在两人手中。H02-new1保持reviewing、H02-new2保持queued，feedback始终candidate。

可播放／暂停、逐帧拖动、七段跳转、字幕开关及循环本章；同一实现已接入film v0.2，新增美术沿原路径注册，其他五章源码不改。当前为38秒动态框架，未导出全章MP4或新增声音。原full-scene、v03成片及[旧完整预览](full-preview-v03.html)保留；下方历史记录不覆盖当前入口。

```sh
NODE_PATH=/Users/alan671/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules node arts/actions/film/build.mjs
node arts/actions/02/build-story-v04.mjs
node --test arts/actions/02/story-v04.test.mjs arts/actions/film/framework.test.mjs
node arts/actions/02/qa-story-v04.mjs
```

全片8400帧引用／有限状态／字幕offset、1141章状态、文字与任务语义、两张独立构图像素回归已检查。脚本六章正文及原02字幕文件字节不变。01→02复用原入镜图形；02→03切入独立S03示例，03仍基础版，尚未制作新故事机位的动作匹配。两段2秒／60帧／960×540接点由新源码绘制并编码、全程解码，见[01→02](../film/provenance/integration-v02/01-to-02-source-v02.mp4)／[02→03](../film/provenance/integration-v02/02-to-03-source-v02.mp4)。

旧静态v03验证器冻结了当时film文件SHA，本轮film已按授权改变，因此该冻结输入检查不再适用于整章接入；不重写历史基准。当前使用新的全片检查与独立构图像素回归。

## 基础版与历史制作记录

# 第02章 · 完整38秒无声字幕候选

**2026-10-18新增素材：** 用户手改02所需的5张完整透明人物PNG及KPI独立内容层已备，见[02美术入口](../../static/02/story-assets-v01/README.md)／[构图检查页](http://127.0.0.1:8765/static/02/story-assets-v01/preview.html)。原手动正文保留；本页以下仍为基础演出历史产物，尚未接入新素材。

**当前构图v02：** 同一检查页已改为可播放的多图层样例，大窗浮在背景上、人物遮住左窗、右上抽象KPI、右窗边框柔和闪动并展开。02画面说明按本轮要求修订为v0.3，口播／引用／38秒不变；本页原完整视频尚未替换。

**全片统一入口：** [01–06动态框架](../film/README.md) · [连续播放](http://127.0.0.1:8765/actions/film/preview.html)。原章入口与历史制作记录继续保留。

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
