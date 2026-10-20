# 人物动作补帧 v0.9

**已撤回：用户不接受光流效果。** 当前采用v0.10纯补绘／原绘稿，见[PAINTED_ONLY.md](PAINTED_ONLY.md)。下方v09插帧和成片只作历史，禁止重新接入当前预览或导出。


**2026-10-20补充：完整补帧版已bake。** [播放](http://127.0.0.1:8765/actions/film/exports/index-v09.html)／[验证](provenance/bake-v09/verification.json)。使用bake-v09.mjs与review-bake-v09.mjs，保留994字符／54条当前字幕及280秒时长。下方“尚未bake”是补帧素材阶段历史状态。


采用“完整姿态补绘＋光流插帧”：43组动作库、361张采用帧，全片实际使用41组，逐帧遍历确认各组至少显示5个不同帧；另两组Agent通用动作留库备用。原01起身序列已有5个完整姿态，继续复用。动作帧不以肢体拼接或身体透明度叠化代替。

[全片预览](http://127.0.0.1:8765/actions/film/preview.html)／[动作逐帧检查](http://127.0.0.1:8765/actions/film/motion-review.html)／[采用清单](provenance/motion-v09/adopted-manifest.json)／[编码后检查](provenance/motion-v09/encoded-contact.png)／[验证记录](provenance/motion-v09/verification.json)。

大幅抬臂、选择、用餐、抬纸、起身使用至少五张干净完整绘稿；小幅透明动作使用双向DIS光流，整幅同机位场景用RIFE v4.6。淘汰双身体残影与漂移帧，保留过程联系表；书架取书和柜台装袋是两个镜头，不跨机位插帧。原7Hz两帧打字切换改用连续序列，讨论机位不再每轮重启缩放，01角色基线和Agent缩放保持连续。用餐中段按实际勺子高度重排。

口播v0.8／994字符、54条字幕、72镜、280秒／8400帧、各章offset及最后14秒文献页保持；未新增声音。库存为原142项＋361张采用帧＝503项。原六章文字、章内源码及旧v0.7完整MP4受SHA保护。本轮只有8段重点动作短片（960×540、30fps、共573帧、无音轨），尚未bake新版完整视频。

## 复现与导出

```sh
node arts/actions/film/build.mjs
node --test arts/actions/film/captions.test.mjs arts/actions/film/framework.test.mjs arts/actions/film/narration-v08.test.mjs arts/actions/film/motion-v09.test.mjs arts/actions/film/render-assets.test.mjs
node arts/actions/film/qa-motion-v09.mjs
```

浏览器使用原WebP；离线librsvg无法直接解码嵌入的WebP，必须调用`render-assets.mjs`先无损转PNG再嵌入，避免人物漏画。已加入实际光栅可见性回归检查。旧bake.mjs写死v07目标和SHA，不可直接用于新版全片；下一轮需新建v09导出入口，采用此位图加载器。

`motion-v09.json`及`adopted-manifest.json`是最终采用指针；`prepare.mjs`、`prepare-rife.py`、`compile.py`、`finalize-anchors.py`及其他动作JSON是分阶段实验脚本／记录，不能重新串跑覆盖最终采用。重建预览只运行build.mjs，不重新生图。`*-adopted.jpg`为采用联系表，`*-keys.jpg`与RIFE批次含淘汰帧，不可整目录盲目接入。

## 动作采用

| 章 | 动作 | 库帧数 | 全片显示帧数 |
|---|---|---:|---:|
| 01 | 正面输入到发送 | 9 | 9 |
| 01 | 疲惫表情过渡 | 9 | 9 |
| 01/02 | 离开键盘 | 9 | 9 |
| 01 | 查看屏幕 | 9 | 9 |
| 01/02 | Agent接稳文件 | 8 | 8 |
| 01/02 | Agent交回文件 | 9 | 备用 |
| 01/02 | Agent抬手报告 | 5 | 备用 |
| 01/02 | Agent低头核对 | 9 | 9 |
| 02 | 舀取食物抬到嘴边 | 5 | 5 |
| 02 | 思考后抬手选择 | 5 | 5 |
| 02 | 从当前文件转向下一份 | 9 | 9 |
| 03 | 正面敲键盘 | 9 | 9 |
| 03 | 停手阅读消息 | 9 | 9 |
| 03 | 抬眼侧看同事 | 9 | 9 |
| 03 | 邻桌手部工作 | 9 | 9 |
| 04 | 午餐中停勺再打开任务 | 9 | 9 |
| 04 | 会前查看再继续输入 | 9 | 9 |
| 04 | 收拾后重新打开电脑 | 9 | 9 |
| 04 | 交付后放松表情 | 9 | 9 |
| 04 | 同事停手失落 | 9 | 9 |
| 04 | 负责人抬臂划线 | 5 | 5 |
| 04 | 负责人落笔改写 | 9 | 9 |
| 04 | HR从编辑转向审阅 | 9 | 9 |
| 05 | 交接纸页并收回手 | 9 | 9 |
| 05 | Agent收手等待指令 | 9 | 9 |
| 05 | 停顿后继续输入 | 9 | 9 |
| 06 | 停手后接受追加任务 | 9 | 9 |
| 06 | 支撑起身并提包 | 5 | 5 |
| 06 | 转身并持包走向门口 | 9 | 9 |
| 06 | 开发提出范围到同事补充 | 9 | 9 |
| 06 | 负责人提笔记录 | 9 | 9 |
| 06 | 放笔共同核对 | 9 | 9 |
| 06 | 查看并接受交付 | 9 | 9 |
| 06 | 从书架抽出同一本书 | 9 | 9 |
| 06 | 落座后转头观看 | 9 | 9 |
| 06 | 阅读后翻页 | 9 | 9 |
| 02 | 背面输入手腕动作 | 9 | 9 |
| 02 | 抬手查看文件 | 5 | 5 |
| 02 | Agent接收核对并交回文件 | 8 | 8 |
| 01 | Agent从待命到核对 | 9 | 9 |
| 01 | Agent抬头报告 | 9 | 9 |
| 01 | Agent放下报告手势 | 9 | 9 |
| 06 | 把同一本书放入纸袋 | 9 | 9 |

生成22次，采用19张独立补绘原图；3张原稿因画板漂移／离场位置过早淘汰。内置image_gen未公开底层模型名；英文prompt、参考路径、原输出与SHA、RIFE模型／二进制SHA见[生成记录](provenance/motion-v09/generation-record.json)及[原始工具输入](provenance/motion-v09/imagegen-prompts.json)。没有Claude调用。光流及Metal运行使用本机临时依赖，运行预览无需这些工具。
