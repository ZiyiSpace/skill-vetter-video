# 渲染视频 - 3步搞定

## 方法 1：GitHub Actions 自动渲染（推荐）

### 步骤 1：创建 GitHub 仓库

1. 访问 https://github.com/new
2. 仓库名：`skill-vetter-video`
3. 设为 Private 或 Public
4. **不要**勾选 "Add a README file"
5. 点击 "Create repository"

### 步骤 2：推送代码

```bash
cd ~/.openclaw/workspace-skill-video
git remote add origin https://github.com/YOUR_USERNAME/skill-vetter-video.git
git push -u origin main
```

### 步骤 3：等待渲染

1. 访问你的仓库页面
2. 点击 "Actions" 标签
3. 等待 workflow 完成（约5-10分钟）
4. 下载生成的视频（Artifacts → skill-vetter-video）

---

## 方法 2：本地渲染（PC/Mac）

### 步骤 1：传输文件

将 `skill-vetter/` 文件夹传到 PC/Mac

### 步骤 2：安装依赖并渲染

```bash
cd skill-vetter/04-composition/remotion
npm install
npm run render
```

### 步骤 3：查看输出

视频位置：`skill-vetter/04-composition/output/skill-vetter-final.mp4`

---

## 当前状态

✅ **Phase 1-3 已完成**
- 剧本：Version B（场景派）
- 音频：10个场景，79.49秒
- Remotion 项目：完整

⏳ **Phase 4 待渲染**
- 需要 Ubuntu/Node.js 环境
- GitHub Actions 可自动渲染

---

## 文件清单

```
skill-vetter/
├── 01-research/
│   └── phase1-evaluation.md
├── 02-timeline-script/
│   ├── timeline.md (锁定剧本)
│   ├── decision.md
│   └── versions/
│       ├── version-a.md
│       ├── version-b.md ✓
│       ├── version-c.md
│       └── comparison.md
├── 03-production/
│   ├── generate-audio.py
│   ├── audio-durations.json
│   └── task-audio/
│       ├── scene_001.wav ✓
│       ├── scene_002.wav ✓
│       ├── scene_003.wav ✓
│       ├── scene_004.wav ✓
│       ├── scene_005.wav ✓
│       ├── scene_006.wav ✓
│       ├── scene_007.wav ✓
│       ├── scene_008.wav ✓
│       ├── scene_009.wav ✓
│       └── scene_010.wav ✓
└── 04-composition/
    ├── remotion/ (完整项目)
    └── output/ (渲染输出)
```

---

## 需要帮助？

如果渲染遇到问题，告诉我：
1. 报错信息
2. 你的操作系统（Windows/Mac/Linux）
3. Node.js 版本（`node -v`）
