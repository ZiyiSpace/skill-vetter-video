// 字幕组件 - 黄底黑字（whisper 风格）
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface SubtitleProps {
  text: string;
  startFrame: number;
  endFrame?: number;
  style?: React.CSSProperties;
}

export const Subtitle: React.FC<SubtitleProps> = ({
  text,
  startFrame,
  endFrame,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 计算字幕帧范围
  const subtitleFrame = frame - startFrame;

  // 淡入动画
  const opacity = subtitleFrame >= 0 ? Math.min(1, subtitleFrame / 10) : 0;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 120,
        left: "50%",
        transform: "translateX(-50%)",
        background: "#FFD700", // 金黄色底
        color: "#000000", // 黑色字
        padding: "16px 32px",
        borderRadius: 12,
        fontSize: 42,
        fontWeight: 600,
        textAlign: "center",
        opacity,
        maxWidth: "90%",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        ...style,
      }}
    >
      {text}
    </div>
  );
};
