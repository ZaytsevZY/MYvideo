# 01 · 无声字幕视频

当前已导出：[01-captioned-silent-v01.mp4](01-captioned-silent-v01.mp4)。

规格：1920×1080、30fps、1350帧、45.00秒、H.264／yuv420p、CRF18；字幕烧录进画面，不含音频轨。原155字符口播未改，14段字幕是配音前的暂定语义时轴。

[本机视频播放页](http://127.0.0.1:8765/actions/01/exports/01-captioned-silent-v01.html) · [SRT](01-captioned-silent-v01.srt) · [JSON](01-captioned-silent-v01.json)

当前没有Remotion工程，本次以现有原生SVG确定性场景逐帧经sharp／librsvg栅格化，并通过FFmpeg编码；保留既有绘制资源与演出，不使用实时录屏。实际参数、依赖、哈希和ffprobe结果由bake-video.mjs在成功后写入同目录manifest／ffprobe JSON。MP4被项目现有.gitignore排除，但保存在本机本目录。

```sh
node arts/actions/01/captions/bake-captions.mjs
node arts/actions/01/bake-camera.mjs
NODE_PATH=<包含sharp的node_modules路径> node arts/actions/01/bake-video.mjs
```

导出脚本拒绝覆盖已有最终MP4；再次导出须选择新版本。流式输入避免保存1350张无压缩图，保留5张质检PNG。原SVG图解预览和13个旧动作仍在上级preview.html。
