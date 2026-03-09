import React from "react";
import { FeatureGrid } from "../scene-layouts";
import { staticFile } from "remotion";

const BRAND = {
  primary: "#6366F1",
  primaryDim: "#4F46E5",
  secondary: "#10B981",
  gradientStart: "#312E81",
  gradientEnd: "#1E1B4E",
};

export const Scene003: React.FC = () => {
  return (
    <FeatureGrid
      audioFile="scene_003.wav"
      narration="场景二，从 GitHub 安装开源技能。看到作者写的很好，想用？等等，先检查代码。Skill Vetter 会帮你找出红旗"
      title="GitHub 场景"
      features={[
        { icon: "🐙", title: "开源技能", desc: "代码质量未知" },
        { icon: "🔍", title: "自动审查", desc: "识别潜在风险" },
        { icon: "✅", title: "安全安装", desc: "审查后再安装" },
      ]}
      brand={BRAND}
    />
  );
};
