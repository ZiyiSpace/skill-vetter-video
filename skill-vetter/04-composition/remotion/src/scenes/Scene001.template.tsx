// Scene001: 钩子（开场）模板
// 基于 whisper 项目，包含粒子、光晕、渐变文字等效果

import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
} from "remotion";
import { Audio } from "@remotion/media";
import { DESIGN, getBrandConfig } from "../design";
import { Subtitle } from "../components/Subtitle";

// ============================================
// 场景 001：开场钩子
// 配置说明：
// - title: "每天一个 OpenClaw Skill"
// - subtitle: 工具名称（如 "Whisper"）
// - description: "本地语音转文字的终极方案"
// ============================================

interface Scene001Props {
  brand: {
    name: string;
    primary: string;
    primaryDim: string;
    secondary: string;
    accent: string;
    gradientStart: string;
    gradientEnd: string;
  };
  audioFile: string;
  content: {
    title: string;
    subtitle: string;
    description: string;
    narration: string;
  };
}

// 粒子组件
const Particle: React.FC<{ style: React.CSSProperties; brand: Scene001Props['brand'] }> = ({ style, brand }) => (
  <div style={{
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: "50%",
    background: brand.primary,
    boxShadow: `0 0 10px ${brand.primary}, 0 0 20px ${brand.primary}`,
    ...style,
  }} />
);

export const Scene001: React.FC<Scene001Props> = ({ brand, audioFile, content }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const startFrame = 0;

  // Logo bounce spring animation
  const logoScale = spring({
    frame: frame - startFrame - 20,
    fps,
    config: { damping: 8 },
  });

  // Fade in animations
  const opacity = interpolate(frame - startFrame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const textOpacity = interpolate(frame - startFrame, [60, 90], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 粒子生成 - 30个粒子随机位置
  const particles = React.useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: 50 + (Math.sin(i * 0.5) * 40),
      y: 50 + (Math.cos(i * 0.7) * 40),
      delay: i * 3,
      size: 2 + Math.random() * 4,
    }));
  }, []);

  // Logo 发光脉冲
  const pulseScale = 1 + Math.sin((frame - startFrame) * 0.05) * 0.05;
  const pulseOpacity = 0.5 + Math.sin((frame - startFrame) * 0.03) * 0.3;

  // 创建动态设计（使用品牌色）
  const design = {
    ...DESIGN,
    colors: {
      ...DESIGN.colors,
      primary: brand.primary,
      primaryDim: brand.primaryDim,
      secondary: brand.secondary,
      accent: brand.accent,
    },
    gradients: {
      main: `linear-gradient(135deg, ${brand.gradientStart} 0%, ${brand.gradientEnd} 100%)`,
      text: `linear-gradient(135deg, ${brand.primary} 0%, ${brand.secondary} 100%)`,
      glow: `radial-gradient(circle, ${brand.primaryDim} 0%, transparent 60%)`,
    },
  };

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${design.colors.dark} 0%, ${design.colors.surface} 100%)`,
        fontFamily: design.fonts.notoSans,
        overflow: "hidden",
      }}
    >
      {/* 动画粒子 */}
      {particles.map((p) => {
        const particleFrame = frame - startFrame - p.delay;
        const particleOpacity = interpolate(
          particleFrame,
          [0, 30, 90],
          [0, 1, 0],
          { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
        );
        const particleY = interpolate(
          particleFrame,
          [0, 120],
          [p.y, p.y + 80],
          { extrapolateRight: "clamp" }
        );

        return (
          <Particle
            key={p.id}
            brand={brand}
            style={{
              left: `${p.x}%`,
              top: `${particleY}%`,
              width: p.size,
              height: p.size,
              opacity: particleOpacity * 0.6,
            }}
          />
        );
      })}

      {/* 背景光晕 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: design.colors.primaryDim,
          filter: "blur(100px)",
          opacity: pulseOpacity,
        }}
      />

      {/* 主内容 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
        }}
      >
        {/* 主标题 */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: design.colors.textSecondary,
            opacity: interpolate(frame - startFrame, [0, 30], [0, 1], { extrapolateRight: "clamp" }),
            textAlign: "center",
            letterSpacing: "1",
          }}
        >
          {content.title}
        </div>

        {/* 副标题 - 工具名 */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            background: design.gradients.text,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            opacity: interpolate(frame - startFrame, [20, 50], [0, 1], { extrapolateRight: "clamp" }),
            textShadow: `0 0 40px ${brand.primary}60`,
            letterSpacing: "2",
          }}
        >
          {content.subtitle}
        </div>

        {/* 分隔线 */}
        <div
          style={{
            width: 200,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${brand.primary}, transparent)`,
            opacity: interpolate(frame - startFrame, [50, 70], [0, 1], { extrapolateRight: "clamp" }),
          }}
        />

        {/* 描述 */}
        <div
          style={{
            fontSize: design.type.h3,
            fontWeight: 500,
            color: brand.primary,
            opacity: interpolate(frame - startFrame, [100, 130], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          {content.description}
        </div>
      </div>

      {/* 进度条 */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: "50%",
          transform: "translateX(-50%)",
          width: 200,
          height: 3,
          background: "rgba(255,255,255,0.1)",
          borderRadius: 2,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${interpolate(frame - startFrame, [0, 180], [0, 100], { extrapolateRight: "clamp" })}%`,
            background: brand.primary,
            borderRadius: 2,
            boxShadow: `0 0 10px ${brand.primary}`,
          }}
        />
      </div>

      {/* 音频 */}
      <Audio src={staticFile(`audio/${audioFile}`)} />

      {/* 字幕 */}
      <Subtitle
        text={content.narration}
        startFrame={0}
      />
    </AbsoluteFill>
  );
};
