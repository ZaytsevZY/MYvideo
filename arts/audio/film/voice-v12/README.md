# 连贯旁白 v0.12

本版使用已在本机保存的云扬男声音频，按28个完整语句精剪54段录音。26处跨字幕的句中空档由中位数1.34秒缩至0.216秒，最大0.285秒；完整句末另保留约0.5秒自然停顿。保留原录音音色和发音，不将本地拼接表述为整句重新合成。

微软在线整句重合成调用被自动审批拦截，理由为尚未明确授权向微软发送这份旁白稿；本轮无新TTS请求，没有上传文稿／音频。用户确认仍待回复，本地候选不依赖该确认。`voice-v12.py synthesize`只是备用入口，未执行成功，不代表产生新录音。

本轮不对语音变速，不截字，不用长静音填原镜头预算。原录音沿用v11已有的源语速和微调历史，见v11的请求与对齐记录。采用的新母带为`narration-v12.wav`，48kHz／单声道／24bit PCM，215.1秒；28段本地剪辑保存在`local-candidate/`和`sentences/`。

六章旁白994字符及标点不变，54条字幕只改时刻，最短1.9秒、每条至少10字符，字体与底框继承原版。镜头按实际口播段落重新排时，所有72个演出节点保留，使用v10的153项原绘稿／独立补绘；没有光流、形变或新合成过渡图。旧280秒作品与手稿保持，当前成片缩为3分35.1秒。结尾生活段仍完整13秒，文献页14秒无配音。

复现：

```sh
/private/tmp/myvideo-voice-venv/bin/python arts/actions/film/voice-v12.py local-candidate
/private/tmp/myvideo-voice-venv/bin/python arts/actions/film/voice-v12.py assemble --local
/private/tmp/myvideo-voice-venv/bin/python arts/actions/film/verify-voice-v12.py
node arts/actions/film/bake-v12.mjs
node arts/actions/film/review-v12.mjs --source
```

导出拒绝覆盖既有视频；下一版修改应另存版本，不覆盖已核验成片。在线重合成若获授权，应另记生成方式与真实参数，不能沿用本版“本地剪辑／零新请求”的清单。

入口：[配音成片](http://127.0.0.1:8765/actions/film/exports/index-v12.html)／[配音同步动态框架](http://127.0.0.1:8765/actions/film/preview-v12.html)。对齐、录音来源、自动转录、画面与媒体验证在`arts/actions/film/provenance/voice-v12/`；自动ASR报告不等于人工听审。
