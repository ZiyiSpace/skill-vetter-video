import React from "react";
import { Terminal } from "../scene-layouts";
import { staticFile } from "remotion";

const BRAND = {
  primary: "#6366F1",
  primaryDim: "#4F46E5",
  secondary: "#10B981",
  gradientStart: "#312E81",
  gradientEnd: "#1E1B4E",
};

export const Scene009: React.FC = () => {
  return (
    <Terminal
      audioFile="scene_009.wav"
      narration="使用超简单，clawhub install skill-vetter。一秒安装，立即使用，安全审查，从现在开始"
      command="clawhub install skill-vetter"
      outputLines={[
        "✓ 安装成功",
        "✓ 零配置",
        "✓ 立即可用",
      ]}
      brand={BRAND}
    />
  );
};
