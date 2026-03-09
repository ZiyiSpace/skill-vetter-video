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

export const Scene005: React.FC = () => {
  return (
    <FeatureGrid
      audioFile="scene_005.wav"
      narration="场景四，企业内部技能管理。需要确保技能安全合规？Skill Vetter 可以帮你，生成标准化的审查报告"
      title="企业合规"
      features={[
        { icon: "🏢", title: "企业技能", desc: "安全合规管理" },
        { icon: "📋", title: "标准化报告", desc: "统一审查标准" },
        { icon: "✅", title: "合规验证", desc: "满足企业要求" },
      ]}
      brand={BRAND}
    />
  );
};
