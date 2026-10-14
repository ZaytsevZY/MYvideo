# TODO

## 待决策

### 画风
选一条制作路线（详见 [scripts/RESEARCH.md](scripts/RESEARCH.md)）：

- [ ] **路线A：纯代码渲染**（three.js / p5.js）— 精确 beat-sync，几何/铜版画风格，门槛高但可控
- [ ] **路线B：水彩/手绘风格**（p5.js + p5.brush）— 两条 prompt 即可驱动 Claude 并行制作，门槛低
- [ ] **路线C：AI视频 + WebGL后处理**（Seedance + riso-cel shader）— 真实影像感，需要Seedance素材+着色器管线

参考图在 `assets/references/`。

### 视频主题
选具体切入角度：

- [ ] 以普通人（家人/朋友）实际用 AI 的场景为主线，偏纪实/采访风格
- [ ] 以"驯化"这个词做隐喻，探讨人和 AI 的权力关系，偏思辨/艺术风格
- [ ] 其他角度（待补充）

### 技术栈
根据画风决定后填写，初步候选：

- [ ] 纯代码路线：TypeScript + three.js + bun + Whisper + Demucs + ffmpeg
- [ ] 水彩路线：p5.js + p5.brush + mlx-whisper + librosa + ffmpeg
- [ ] Seedance 路线：Seedance 2.5 生成素材 + WebGL riso-cel shader + ffmpeg

---

## 制作步骤（待画风确定后细化）

- [ ] 确定画风 + 技术栈
- [ ] 确定视频主题与叙事结构
- [ ] 写脚本/分镜（存入 `scripts/`）
- [ ] 音频分析（逐词时间戳 + 节拍数据）
- [ ] 搭建渲染/生成环境
- [ ] 逐场景制作
- [ ] 合成输出，存入 `output/`（不入库）
- [ ] 提交网络学堂

---

截止：**2026-10-21 24:00**
