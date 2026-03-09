# Version A：功能派剧本（聚焦核心功能）

**风格定位**：技术向、详细展示5大核心功能、适合技术爱好者、**目标受众**：开发者、AI 从业者

---

## Scene 001: 开场钩子

**Narration**：每天一个 Skill，今天给你介绍一个能救命的工具
Skill Vetter

**On-screen Text**：
- 标题：Skill Vetter 🔒
- 副标题：AI Agent 技能安全卫士
- 数据：40.5k 下载 | 178 ⭐

**Visual Design**：
- 背景：深蓝渐变 + 噪点
- Logo 组装动画（5个方块碎片飞入中心）
- 底部：黄色字幕条

**Animation Timing**：
- 0-2s：粒子爆炸
- 2-4s：Logo 组装
- 4-6s：标题 + 副标题淡入

---

## Scene 002: 痛点

**Narration**：你有没有想过
安装一个 Skill 可能会：
读取你的 SSH 密钥
访问你的 AWS 凭证
甚至外发你的 MEMORY.md

**On-screen Text**：
- 标题：🚨 安装技能的风险
- 痛点列表（左右分栏，左侧标题，右侧图标）：
  - 📁 读取敏感文件
  - 🌐 外发数据到未知服务器
  - 🔑 窃取凭证/Token
  - 📝 访问 MEMORY.md/USER.md

**Visual Design**：
- 背景：暗红色警告色
- 震动效果
- 裂痕叠加

**Animation Timing**：
- 0-2s：震动 + 警告条
- 2-5s：痛点列表依次弹出（带抖动）

---

## Scene 003: 解决方案

**Narration**：Skill Vetter
AI Agent 技能安全审查工具
安装任何技能前，先用它审查一遍

**On-screen Text**：
- 大标题：Skill Vetter
- 副标题：安全审查流程
- 图标：🔒（放大）

**Visual Design**：
- 背景：从暗红渐变到品牌色
- 中心：大锁图标（旋转入场）
- 周围：安全盾牌环绕

**Animation Timing**：
- 0-2s：锁图标旋转入场
- 2-4s：盾牌环绕
- 4-6s：文字淡入

---

## Scene 004: 核心功能1 - 来源检查

**Narration**：第一步：来源检查
它会验证技能来源
查看作者信誉、下载量、更新时间
还会检查社区评价

**On-screen Text**：
- 标题：🔍 来源检查
- 检查项列表：
  - ✅ 作者信誉
  - ✅ 下载量/Stars
  - ✅ 最后更新时间
  - ✅ 社区评价

**Visual Design**：
- 背景：品牌色渐变
- 中心：雷达扫描动画
- 周围：检查项卡片

**Animation Timing**：
- 0-2s：雷达扫描
- 2-5s：检查项依次弹出（带绿色勾号）

---

## Scene 005: 核心功能2 - 代码审查

**Narration**：第二步：代码审查
这是最关键的一步
它会自动检测 13 种红旗
包括 curl/wget、外发数据、读取敏感文件等

**On-screen Text**：
- 标题：🚩 红旗检测
- 红旗列表（网格布局）：
  - 🚫 curl/wget 到未知 URL
  - 🚫 发送数据到外部服务器
  - 🚫 请求凭证/Token
  - 🚫 读取 ~/.ssh, ~/.aws
  - 🚫 访问 MEMORY.md
  - 🚫 base64 解码
  - 🚫 eval() 外部输入

**Visual Design**：
- 背景：暗色
- 中心：代码扫描线（从上到下）
- 红旗项：红色背景 + 警告图标

**Animation Timing**：
- 0-2s：扫描线
- 2-5s：红旗项依次弹出（带闪烁）

---

## Scene 006: 核心功能3 - 权限评估

**Narration**：第三步：权限评估
它会分析技能需要哪些权限
文件访问、网络访问、命令执行
判断权限范围是否合理

**On-screen Text**：
- 标题：🔐 权限评估
- 权限列表：
  - 📁 文件访问：[列出文件]
  - 🌐 网络访问：[列出域名]
  - 💻 命令执行：[列出命令]

**Visual Design**：
- 背景：品牌色
- 中心：权限卡片（三个并排）
- 每个卡片：图标 + 标题 + 内容

**Animation Timing**：
- 0-2s：标题淡入
- 2-5s：三个权限卡片依次弹出

---

## Scene 007: 核心功能4 - 风险分类

**Narration**：第四步：风险分类
它会给出四级风险评估
低风险直接安装
中风险需要审查
高风险需要人工确认
极高风险不建议安装

**On-screen Text**：
- 标题：⚠️ 风险分类
- 风险等级表：
  - 🟢 LOW：笔记、天气 → 直接安装
  - 🟡 MEDIUM：文件操作、浏览器 → 完整审查
  - 🔴 HIGH：凭证、交易 → 人工确认
  - ⛔ EXTREME：系统配置、Root → 不要安装

**Visual Design**：
- 背景：从绿到红渐变
- 中心：风险等级表（从上到下）
- 每行：颜色编码 + 图标 + 描述

**Animation Timing**：
- 0-2s：标题淡入
- 2-5s：四行依次弹出（带颜色高亮）

---

## Scene 008: 核心功能5 - 审查报告

**Narration**：最后：生成审查报告
包含来源信息、红旗列表
权限需求、风险等级
还有明确的安装建议

**On-screen Text**：
- 标题：📋 审查报告
- 报告示例（终端窗口风格）：
```
SKILL VETTING REPORT
═══════════════════════════════════════
Skill: example-skill
Source: ClawHub
Author: @developer
───────────────────────────────────────
RED FLAGS: None
PERMISSIONS: File read (workspace)
───────────────────────────────────────
RISK LEVEL: 🟢 LOW
VERDICT: ✅ SAFE TO INSTALL
═══════════════════════════════════════
```

**Visual Design**：
- 背景：深色（终端风格）
- 中心：终端窗口（带打字机效果）
- 顶部：终端标题栏（红黄绿按钮）

**Animation Timing**：
- 0-2s：终端窗口弹出
- 2-5s：报告内容逐行显示（打字机效果）

---

## Scene 009: 使用方式

**Narration**：使用方式超简单
clawhub install skill-vetter
安装后直接调用
它会自动审查你指定的技能

**On-screen Text**：
- 标题：🚀 快速上手
- 安装命令（代码块）：
```bash
clawhub install skill-vetter
```
- 使用步骤：
  1. 安装 Skill Vetter
  2. 调用：vet <skill-name>
  3. 查看审查报告

**Visual Design**：
- 背景：品牌色
- 中心：步骤卡片（三个并排）
- 每个卡片：序号 + 标题 + 描述

**Animation Timing**：
- 0-2s：命令代码块弹出
- 2-5s：三个步骤卡片依次弹出

---

## Scene 010: CTA（固定结尾）

**Narration**：点赞收藏
关注我
每天一个 OpenClaw Skill
明天见

**On-screen Text**：
- 👍 点赞
- ⭐ 收藏
- ➕ 关注我
- 每天一个 OpenClaw Skill

**Visual Design**：
- 背景：品牌色渐变 + 光晕
- 中心：三个图标（点赞、收藏、关注）依次弹出
- 底部：黄底黑字字幕

**Animation Timing**：
- 0-2s：点赞图标弹出
- 2-4s：收藏图标弹出
- 4-6s：关注图标弹出
- 6-8s：文字淡入
