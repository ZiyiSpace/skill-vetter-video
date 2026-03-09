# Remotion 竖版视频项目模板 v2.0

> **基于 whisper 项目的精美设计系统，支持品牌色配置**

## 快速开始

### 1. 初始化项目

```bash
# 复制模板到目标位置
cp -r .claude/skills/vertical-video-producer/remotion-template {Skill名称}/04-composition/remotion
cd {Skill名称}/04-composition/remotion
npm install
```

### 2. 复制音频文件

```bash
mkdir -p public/audio
cp ../../03-production/taska-audio/*.wav public/audio/
```

### 3. 配置品牌色

编辑 `src/config.ts`（创建此文件）：

```typescript
import { getBrandConfig } from './design';

export const BRAND = getBrandConfig('{Skill名称}');  // 自动选择品牌色
// 或手动指定：
// import { BRAND_THEMES } from './design';
// export const BRAND = BRAND_THEMES.n8n;  // 使用 n8n 主题
```

### 4. 创建场景组件

**方法 A：使用模板手动创建**（推荐用于开场场景）

```bash
cp src/scenes/Scene001.template.tsx src/scenes/Scene001.tsx
# 编辑 Scene001.tsx，填入实际内容
```

**方法 B：使用自动生成脚本**（适用于标准场景）

```bash
python3 .claude/skills/vertical-video-producer/scripts/generate-scenes.py \
  {Skill名称}/02-timeline-script/timeline.md \
  --skill-name {Skill名称} \
  --template rich  # 使用丰富视觉效果的模板
```

### 5. 创建完整视频组合

```typescript
// {SkillName}Full.tsx
import { Composition, Sequence } from 'remotion';
import { CANVAS_SIZE, FPS } from './design';
import { getBrandConfig } from './design';
import { Scene001 } from './scenes/Scene001';
// ... 导入其他场景

const BRAND = getBrandConfig('{Skill名称}');

export const {SkillName}Full: React.FC = () => {
  return (
    <>
      <Sequence from={0} durationInFrames={180}>
        <Scene001 brand={BRAND} audioFile="scene_001.wav" content={{
          title: "每天一个 OpenClaw Skill",
          subtitle: "{工具名}",
          description: "{核心价值一句话}",
          narration: "{完整口播文本}"
        }} />
      </Sequence>
      // ... 其他场景
    </>
  );
};
```

### 6. 更新 Root.tsx

```typescript
import { Composition } from 'remotion';
import { CANVAS_SIZE } from './design';
import { {SkillName}Full } from './{SkillName}Full';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="{SkillName}Full"
        component={ {SkillName}Full }
        durationInFrames={1800}  // 总帧数
        fps={CANVAS_SIZE.fps}
        width={CANVAS_SIZE.width}
        height={CANVAS_SIZE.height}
      />
    </>
  );
};
```

### 7. 预览调试

```bash
npm start
```

### 8. 渲染最终视频

```bash
mkdir -p ../output
npx remotion render {SkillName}Full ../output/{Skill名称}-final.mp4 \
  --codec=h264 \
  --pixel-format=yuv420p \
  --audio-codec=aac \
  --audio-bitrate=192k
```

---

## 设计系统特性

### 包含的视觉效果

✅ **30个动态粒子** - 随机位置、淡入淡出、向下移动
✅ **背景光晕脉冲** - 模糊的圆形光晕，呼吸效果
✅ **渐变文字** - 品牌色渐变 + 发光效果
✅ **分隔线动画** - 渐变线条淡入
✅ **进度条** - 底部进度条
✅ **字幕组件** - 黄底黑字，淡入效果

### 品牌色主题

| 主题 | 主色 | 次色 | 适用场景 |
|------|------|------|----------|
| whisper | 绿色 #00ff88 | 青色 #00d4ff | 语音/音频工具 |
| n8n | 橙红 #ff6d5a | 橙色 #ff9f1c | 工作流自动化 |
| openclaw | 龙虾橙 #ff6b35 | 金色 #ffd700 | OpenClaw 相关 |
| tech | 科技蓝 #3b82f6 | 紫色 #8b5cf6 | 通用科技类 |

---

## 目录结构

```
remotion-template/
├── src/
│   ├── design.ts              # 设计系统 + 品牌色配置
│   ├── config.ts              # 项目配置（需创建）
│   ├── Root.tsx               # 入口文件
│   ├── components/
│   │   ├── SceneBase.tsx      # 场景基类
│   │   └── Subtitle.tsx       # 字幕组件
│   └── scenes/
│       ├── Scene001.template.tsx  # 开场钩子模板（粒子+光晕）
│       └── ...                 # 其他场景
├── public/
│   └── audio/                 # 音频文件
├── package.json
└── README.md
```

---

## 常见问题

**Q: 如何修改粒子数量？**
A: 编辑 Scene001.template.tsx，修改 `Array.from({ length: 30 }` 中的数字。

**Q: 如何更换背景渐变色？**
A: 修改 `design.ts` 中对应主题的 `gradientStart` 和 `gradientEnd`。

**Q: 字幕位置不合适怎么办？**
A: 编辑 `components/Subtitle.tsx`，修改 `bottom: 120` 的值。

**Q: 音频不同步怎么办？**
A: 检查 `audioFile` 路径是否正确，确保音频时长与场景时长匹配。
