import React from "react";
import { CTA } from "../scene-layouts";
import { staticFile } from "remotion";

const BRAND = {
  primary: "#6366F1",
  primaryDim: "#4F46E5",
  secondary: "#10B981",
  gradientStart: "#312E81",
  gradientEnd: "#1E1B4E",
};

export const Scene010: React.FC = () => {
  return (
    <CTA
      audioFile="scene_010.wav"
      narration="点赞收藏，关注我，每天一个 OpenClaw Skill，明天见"
      mainText="每天一个 OpenClaw Skill"
      subText="明天见"
      icons={["👍", "⭐", "➕"]}
      brand={BRAND}
    />
  );
};
