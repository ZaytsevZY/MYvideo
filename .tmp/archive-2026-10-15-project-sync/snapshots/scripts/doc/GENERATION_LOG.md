# 生成记录

> 在 `scripts/PRODUCTION_PROTOCOL.md` 要求的前置门禁完成之前，不得填写正式生成记录。

## S01-D01

- 状态：候选 demo，未冻结
- 责任人：Codex
- 日期与时区：2026-10-15，Asia/Shanghai
- 大纲版本 / 脚本版本 / 分镜版本 / 风格圣经版本：OUTLINE v0.9 / NARRATION FINAL v1.4 / STORYBOARD DEMO v0.1 / STYLE BIBLE DEMO v0.1
- 生成目标：验证第一段中文旁白、句子级对轴和“任务线 → 后台执行 → 待办增长”的解释型动态图形路线。
- 工具与准确模型标识：ElevenLabs Eleven v4，Adrian - Chinese Mandarin Narration；Pillow 12.3.0；ffmpeg 9.0.2，libx264。
- 输入素材：`assets/audio/segment-01-adrian-v4.mp3`，SHA-256 `bbf88353e267e4bed47b4665f5dc157559ba04c8077568d11dab5564da61076a`；`scripts/NARRATION_FINAL_v1.4.md` 第一章。
- 完整提示词：无图像生成提示词；画面由 `demos/first-segment/render_demo.py` 确定性渲染。
- 完整参数：1920×1080，30 fps，39.16 秒，H.264 CRF 18，AAC 192 kbps，yuv420p。
- 平台默认或不可见设置：ElevenLabs 页面生成的不可见推理参数未知；页面可见设置为稳定性 50%、相似度 75%、MP3 44.1 kHz 128 kbps。
- 输出文件：`demos/first-segment/output/segment-01-demo-v0.1.mp4`；39.157551 秒；1920×1080；30 fps；H.264 + AAC；3,170,590 bytes；SHA-256 `c8fdd93b822e19789f7ad6152eafb39fb4398f44ca01a8ba88400a9228899877`。
- 审核结论：已抽查 0、4、9、16、23、28、34、38 秒；任务线、状态色、待办增长和结尾问句均可读。音视频流完整，未检测到持续黑帧。通过为候选 demo，但 39.16 秒显著超过原大纲 22 秒预算，不得直接进入正式剪辑。
- 下一步：人工试听确认 Adrian 音色与信息密度；若路线通过，先压缩并冻结全片脚本，再逐句精校字幕时间。
