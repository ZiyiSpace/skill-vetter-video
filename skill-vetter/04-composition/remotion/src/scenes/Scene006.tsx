import React from "react";
import { IconMatrix } from "../scene-layouts";
import { staticFile } from "remotion";

const BRAND = {
  primary: "#6366F1",
  primaryDim: "#4F46E5",
  secondary: "#10B981",
  gradientStart: "#312E81",
  gradientEnd: "#1E1B4E",
};

export const Scene006: React.FC = () => {
  return (
    <IconMatrix
      audioFile="scene_006.wav"
      narration="总结一下，四大使用场景：ClawHub 安装、GitHub 开源、他人分享、企业合规。一个工具，全搞定"
      title="四大场景"
      scenarios={[
        { icon: "🔍", title: "ClawHub 安装", desc: "官方技能市场" },
        { icon: "🐙", title: "GitHub 开源", desc: "开源代码仓库" },
        { icon: "👥", title: "他人分享", desc: "朋友推荐" },
        { icon: "🏢", title: "企业合规", desc: "企业内部管理" },
      ]}
      brand={BRAND}
    />
  );
};
