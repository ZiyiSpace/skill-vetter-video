import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { Opening } from "./scene-layouts/Opening";
import { Comparison } from "./scene-layouts/Comparison";
import { FeatureGrid } from "./scene-layouts/FeatureGrid";
import { IconMatrix } from "./scene-layouts/IconMatrix";
import { Pipeline } from "./scene-layouts/Pipeline";
import { VSTable } from "./scene-layouts/VSTable";
import { Terminal } from "./scene-layouts/Terminal";
import { CTA } from "./scene-layouts/CTA";
import { AUDIO_DURATIONS } from "./AudioDurations";

const BRAND = {
  primary: "#6366F1",
  primaryDim: "#4F46E5",
  secondary: "#10B981",
  gradientStart: "#312E81",
  gradientEnd: "#1E1B4E",
};

const getFramesFromDuration = (duration: number) => Math.ceil(duration * 30);

const scenes = [
  {
    id: "scene_001",
    Layout: Opening,
    audioFile: "scene_001.wav",
    narration: "每天一个 Skill，今天给你介绍一个能保护你的工具，Skill Vetter",
    title: "Skill Vetter 🔒",
    subtitle: "安装前的安全卫士",
  },
  {
    id: "scene_002",
    Layout: Comparison,
    audioFile: "scene_002.wav",
    narration: "场景一，从 ClawHub 安装技能。看到一个新技能，想试试？先别急着安装，用 Skill Vetter 审查一遍",
    title: "ClawHub 场景",
    beforeValue: "直接安装",
    afterValue: "先审查",
    beforeLabel: "❌ 传统方式",
    afterLabel: "✅ 安全方式",
  },
  {
    id: "scene_003",
    Layout: FeatureGrid,
    audioFile: "scene_003.wav",
    narration: "场景二，从 GitHub 安装开源技能。看到作者写的很好，想用？等等，先检查代码。Skill Vetter 会帮你找出红旗",
    title: "GitHub 场景",
    features: [
      { icon: "🐙", title: "开源技能", desc: "代码质量未知" },
      { icon: "🔍", title: "自动审查", desc: "识别潜在风险" },
      { icon: "✅", title: "安全安装", desc: "审查后再安装" },
    ],
  },
  {
    id: "scene_004",
    Layout: FeatureGrid,
    audioFile: "scene_004.wav",
    narration: "场景三，朋友分享了一个技能。说很好用，推荐给你？别盲目信任，用 Skill Vetter 自己审查一遍",
    title: "分享场景",
    features: [
      { icon: "👥", title: "朋友推荐", desc: "信任但验证" },
      { icon: "🔍", title: "自己审查", desc: "安全第一" },
      { icon: "✅", title: "安心使用", desc: "确认安全后再装" },
    ],
  },
  {
    id: "scene_005",
    Layout: FeatureGrid,
    audioFile: "scene_005.wav",
    narration: "场景四，企业内部技能管理。需要确保技能安全合规？Skill Vetter 可以帮你，生成标准化的审查报告",
    title: "企业合规",
    features: [
      { icon: "🏢", title: "企业技能", desc: "安全合规管理" },
      { icon: "📋", title: "标准化报告", desc: "统一审查标准" },
      { icon: "✅", title: "合规验证", desc: "满足企业要求" },
    ],
  },
  {
    id: "scene_006",
    Layout: IconMatrix,
    audioFile: "scene_006.wav",
    narration: "总结一下，四大使用场景：ClawHub 安装、GitHub 开源、他人分享、企业合规。一个工具，全搞定",
    title: "四大场景",
    scenarios: [
      { icon: "🔍", title: "ClawHub 安装", desc: "官方技能市场" },
      { icon: "🐙", title: "GitHub 开源", desc: "开源代码仓库" },
      { icon: "👥", title: "他人分享", desc: "朋友推荐" },
      { icon: "🏢", title: "企业合规", desc: "企业内部管理" },
    ],
  },
  {
    id: "scene_007",
    Layout: Pipeline,
    audioFile: "scene_007.wav",
    narration: "审查流程很简单：来源检查、代码审查、权限评估、风险分类，最后生成报告",
    title: "审查流程",
    steps: ["来源检查", "代码审查", "权限评估", "风险分类", "生成报告"],
  },
  {
    id: "scene_008",
    Layout: VSTable,
    audioFile: "scene_008.wav",
    narration: "风险等级一目了然：绿色直接装，黄色需要看，红色要人工，极红不要装",
    title: "风险等级",
    comparisons: [
      { feature: "笔记、天气", traditional: "❌", ai: "✅ 直接安装" },
      { feature: "文件、浏览器", traditional: "⚠️", ai: "🔍 完整审查" },
      { feature: "凭证、交易", traditional: "⛔", ai: "⚠️ 人工确认" },
      { feature: "系统、Root", traditional: "❌", ai: "⛔ 不要安装" },
    ],
  },
  {
    id: "scene_009",
    Layout: Terminal,
    audioFile: "scene_009.wav",
    narration: "使用超简单，clawhub install skill-vetter。一秒安装，立即使用，安全审查，从现在开始",
    command: "clawhub install skill-vetter",
    outputLines: [
      "✓ 安装成功",
      "✓ 零配置",
      "✓ 立即可用",
    ],
  },
  {
    id: "scene_010",
    Layout: CTA,
    audioFile: "scene_010.wav",
    narration: "点赞收藏，关注我，每天一个 OpenClaw Skill，明天见",
    mainText: "每天一个 OpenClaw Skill",
    subText: "明天见",
    icons: ["👍", "⭐", "➕"],
  },
];

export const SkillVetterFull: React.FC = () => {
  let offset = 0;
  
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {scenes.map((scene, index) => {
        const duration = getFramesFromDuration(AUDIO_DURATIONS[scene.id]);
        const sceneOffset = offset;
        offset += duration;
        
        return (
          <Sequence
            key={scene.id}
            from={sceneOffset}
            durationInFrames={duration}
          >
            <scene.Layout {...scene} brand={BRAND} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
