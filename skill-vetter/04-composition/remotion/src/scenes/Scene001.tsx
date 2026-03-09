// Scene 001: Opening
import React from "react";
import { Opening } from "../scene-layouts";
import { staticFile } from "remotion";

const BRAND = {
  primary: "#6366F1",
  primaryDim: "#4F46E5",
  secondary: "#10B981",
  gradientStart: "#1E1B4B",
  gradientEnd: "#0F172A",
};

export const Scene001: React.FC = () => {
  return (
    <Opening
      audioFile="scene_001.wav"
      narration="每天一个 Skill，今天给你介绍一个能保护你的工具，Skill Vetter"
      title="Skill Vetter 🔒"
      subtitle="AI Agent 技能安全卫士"
      brand={BRAND}
    />
  );
};
