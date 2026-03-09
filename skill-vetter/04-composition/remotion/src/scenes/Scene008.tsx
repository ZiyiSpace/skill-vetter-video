import React from "react";
import { VSTable } from "../scene-layouts";
import { staticFile } from "remotion";

const BRAND = {
  primary: "#6366F1",
  primaryDim: "#4F46E5",
  secondary: "#10B981",
  gradientStart: "#312E81",
  gradientEnd: "#1E1B4E",
};

export const Scene008: React.FC = () => {
  return (
    <VSTable
      audioFile="scene_008.wav"
      narration="风险等级一目了然：绿色直接装，黄色需要看，红色要人工，极红不要装"
      title="风险等级"
      comparisons={[
        { feature: "笔记、天气", traditional: "❌", ai: "✅ 直接安装" },
        { feature: "文件、浏览器", traditional: "⚠️", ai: "🔍 完整审查" },
        { feature: "凭证、交易", traditional: "⛔", ai: "⚠️ 人工确认" },
        { feature: "系统、Root", traditional: "❌", ai: "⛔ 不要安装" },
      ]}
      brand={BRAND}
    />
  );
};
