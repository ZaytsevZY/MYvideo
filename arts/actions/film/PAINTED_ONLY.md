# 纯补绘恢复 v0.10

用户撤回光流方案。当前入口`preview.html`和`motion-review.html`只采用原始绘稿／独立补绘，素材表153项（原142＋11张独立补绘PNG）；没有DIS、RIFE、图像扭曲或身体混合帧。四组动作各5张：02用餐、选择、抬纸及04负责人抬臂。其他动作恢复光流前演出，尤其06整章全部1740帧与v0.8渲染器逐帧SVG完全相等。

原先06的整幅补绘亦因站位／背景变化退出当前采用；完整恢复更短工时、三人讨论、验收、离开、购书、观演及翻页原画。其余全片7548帧与光流前输出相等。取消“每个动作补足五帧”的旧要求，不用重复帧或合成帧凑数。

口播994字符、54条字幕、字体与排时、280秒／8400帧及最后14秒文献保持不变。16项检查通过：扫描全8400帧无合成素材引用、06原演出完全相等、补绘SHA、脚本／字幕／历史成片保护。采用与恢复证据见provenance/painted-v10；v09光流素材与MP4仅为已撤回历史，不参与当前导出。

新版完整视频已使用`bake-v10.mjs`生成，并通过`review-bake-v10.mjs`检查。[播放](http://127.0.0.1:8765/actions/film/exports/index-v10.html)／[验证](provenance/bake-v10/verification.json)。不要运行旧bake或旧motion测试／QA覆盖历史证据。当前纯补绘测试：

```sh
node arts/actions/film/build.mjs
node --test arts/actions/film/captions.test.mjs arts/actions/film/framework.test.mjs arts/actions/film/narration-v08.test.mjs arts/actions/film/motion-v10.test.mjs arts/actions/film/render-assets.test.mjs
```

本轮无图像生成或外部模型调用，复用已绘制PNG；没有新增声音。旧19张补绘里仅11张透明完整姿态继续采用，八张06整幅补绘撤回，361张v09运行中间帧全部退出素材表。
