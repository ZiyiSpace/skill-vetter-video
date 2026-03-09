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

export const Scene004: React.FC = () => {
  return (
    <FeatureGrid
      audioFile="scene_004.wav"
      narration="场景三，朋友分享了一个技能。说很好用，推荐给你？别盲目信任，用 Skill Vetter 自己审查一遍"
      title="分享场景"
      features={[
        { icon: "👥", title: "朋友推荐", desc: "信任但验证" },
        { icon: "🔍", title: "自己审查", desc: "安全第一" },
        { icon: "✅", title: "安心使用", desc: "确认安全后再装" },
      ]}
      brand={BRAND}
    />
  );
};
