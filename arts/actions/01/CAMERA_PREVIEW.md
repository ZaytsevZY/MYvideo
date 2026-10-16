# 01 · 新增美术接入动态框架

**版本：** S01_CAMERA_PREVIEW v0.1 · 2026-10-16。脚本为S01_CAMERA v0.2，12镜／45秒预算。

[打开动态预览](http://127.0.0.1:8765/actions/01/preview.html)。默认播放新版12镜；顶部按钮按镜头跳转，进度条可任意拖动。模式菜单保留旧背面工位45秒对照及原13个独立动作。

## 本轮接入

- N1／N2正面完整上半身按真实1153×1364尺寸绘制，配N4反打夜景和N5显示器背壳；前3秒缓慢推近，随后整张姿态切换。
- 派发、收手与起身复用旧完整姿态；Agent近景使用已有查看／持有图，单独取景并弱化背景。次日验收展示部分通过、T01-R退回和人工复核。
- N3朝右站姿进入16–37秒稳定构图，Agent在暖白底框及图解内容之前。人的派发／审核与机器执行分轨，人的光标触发任务选择；新任务仍待验收。
- 35.5–37秒任务对象连续重排为横向清单；结尾拉远、跟移终点，保留旧完成项与可见终点，辅助文字避开人物头部。

当前为原生SVG／JavaScript有限姿态预览，尚无配音或Remotion工程。45秒是脚本预算；1351条30fps采样是姿态／图解／镜头状态，不是1351张新绘制人物图或已导出的动画帧。

## 文件与分工

| 文件 | 职责 |
|---|---|
| [camera-motion.mjs](camera-motion.mjs) | 单次Opus5.5英文prompt生成基础模块，Codex审校；12镜采样、素材尺寸、状态、构图与SVG渲染 |
| [bake-camera.mjs](bake-camera.mjs) | 汇总24姿态及场景资源，输出轻量URL素材包、状态采样和代表性自包含SVG |
| [preview.html](preview.html) | 当前播放器，新版／旧版／单动作切换，播放与跳转 |
| [bundle-camera-v01.json](bundle-camera-v01.json) | 24姿态、N1–N5与原生素材的路径和真实宽高；原图由浏览器缓存 |
| [layout-camera-v01.json](layout-camera-v01.json) | 动态使用的构图和人机操作时点；静态素材布局保留为准备阶段参考 |
| [scene-camera-30fps-v01.json](scene-camera-30fps-v01.json) | 1351条确定性状态采样 |
| [manifest-camera-v01.json](manifest-camera-v01.json) | 输入哈希、代码、代表图、采样与已知限制 |
| [camera-contact-v01.png](camera-contact-v01.png) | 12镜代表性检查图总览 |
| [camera-motion.test.mjs](camera-motion.test.mjs) | 镜头边界、素材引用、单人物／飞行纸张、人工状态先后、终点可见及推近精度检查 |
| [生成与采用修订](provenance/camera-v01/review.md) | 完整英文prompt、Claude原始模块、结果元数据、Codex采用差异；本轮仅一次模型请求 |

旧whole-motion.mjs、keyframes.mjs、bake-whole.mjs与bundle-whole-v01.json保留；新播放器可以调用旧动作，未重绘、替换或修改源PNG。

## 检查与复现

8项节点测试通过，覆盖1351采样状态。浏览器已加载全部素材并播放到45秒结尾；检查正面、Agent近景、验收、站立任务流、结尾及旧A01动作播放，控制台无错误。实际浏览器截图位于[站立画面](provenance/camera-v01/browser-standing-v01.png)和[结尾](provenance/camera-v01/browser-ending-v01.png)。静态截图与自动检查不代表姿态衔接已逐帧艺术验收，也不表示已配音校时。

```sh
node arts/actions/01/bake-camera.mjs
node --test arts/actions/01/camera-motion.test.mjs
NODE_PATH=<已安装sharp的node_modules路径> node arts/actions/01/render-camera-stills.cjs
python3 -m http.server 8765 --bind 127.0.0.1 --directory arts
```

前两步不调用模型；第三步只离线生成12张代表性PNG和总览图，不导出视频。若服务已运行，直接打开预览链接。

下一步为临时配音后的逐句校时、姿态衔接审阅及第02章真实接续；正式Remotion工程和最终视频仍按单独制作阶段推进。
