import React from "react";
import { Comparison } from "../scene-layouts";
import { staticFile } from "remotion";

const BRAND = {
  primary: "#6366F1",
  primaryDim: "#4F46E5",
  secondary: "#10B981",
  gradientStart: "#312E81",
  gradientEnd: "#1E1B4E",
};

export const Scene002: React.FC = () => {
  return (
    <Comparison
      audioFile="scene_002.wav"
      narration="场景一，从 ClawHub 安装技能。看到一个新技能，想试试？先别急着安装，用 Skill Vetter 审查一遍"
      title="ClawHub 场景"
      beforeValue="直接安装"
      afterValue="先审查"
      beforeLabel="❌ 传统方式"
      afterLabel="✅ 安全方式"
      brand={BRAND}
    />
  );
};
