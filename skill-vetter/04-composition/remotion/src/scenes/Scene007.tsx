import React from "react";
import { Pipeline } from "../scene-layouts";
import { staticFile } from "remotion";

const BRAND = {
  primary: "#6366F1",
  primaryDim: "#4F46E5",
  secondary: "#10B981",
  gradientStart: "#312E81",
  gradientEnd: "#1E1B4E",
};

export const Scene007: React.FC = () => {
  return (
    <Pipeline
      audioFile="scene_007.wav"
      narration="审查流程很简单：来源检查、代码审查、权限评估、风险分类，最后生成报告"
      title="审查流程"
      steps={["来源检查", "代码审查", "权限评估", "风险分类", "生成报告"]}
      brand={BRAND}
    />
  );
};
