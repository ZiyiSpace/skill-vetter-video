// CTA 结尾场景（固定格式 - 所有视频通用）
// Scene006 (COMPACT) / Scene010 (STANDARD) / Scene012 (EXTENDED)

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

interface SceneCTAProps {
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
    narration: string;
  };
}

// 图标组件
const Icon: React.FC<{
  symbol: string;
  label: string;
  delay: number;
  brand: SceneCTAProps['brand'];
}> = ({ symbol, label, delay, brand }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 8 },
  });

  const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          fontSize: 80,
          lineHeight: 1,
        }}
      >
        {symbol}
      </div>
      <div
        style={{
          fontSize: 36,
          fontWeight: 600,
          color: brand.primary,
        }}
      >
        {label}
      </div>
    </div>
  );
};

// 关注按钮（带脉冲效果）
const FollowButton: React.FC<{ brand: SceneCTAProps['brand'] }> = ({ brand }) => {
  const frame = useCurrentFrame();

  const pulseScale = 1 + Math.sin(frame * 0.1) * 0.05;
  const pulseOpacity = 0.8 + Math.sin(frame * 0.08) * 0.2;

  return (
    <div
      style={{
        padding: "24px 48px",
        background: `linear-gradient(135deg, ${brand.primary} 0%, ${brand.secondary} 100%)`,
        borderRadius: 50,
        boxShadow: `0 0 30px ${brand.primary}80`,
        transform: `scale(${pulseScale})`,
        opacity: pulseOpacity,
      }}
    >
      <div
        style={{
          fontSize: 48,
          fontWeight: 900,
          color: "#ffffff",
          letterSpacing: 2,
        }}
      >
        ➕ 关注我
      </div>
    </div>
  );
};

export const SceneCTA: React.FC<SceneCTAProps> = ({ brand, audioFile, content }) => {
  const frame = useCurrentFrame();
  const startFrame = 0;

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

  // 底部文字淡入
  const bottomTextOpacity = interpolate(frame - startFrame, [90, 120], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${design.colors.dark} 0%, ${design.colors.surface} 100%)`,
        fontFamily: design.fonts.notoSans,
        overflow: "hidden",
      }}
    >
      {/* 背景光晕 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: design.colors.primaryDim,
          filter: "blur(150px)",
          opacity: 0.5,
        }}
      />

      {/* 主内容 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "40%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          gap: 80,
        }}
      >
        <Icon symbol="👍" label="点赞" delay={0} brand={brand} />
        <Icon symbol="⭐" label="收藏" delay={30} brand={brand} />
        <Icon symbol="➕" label="关注" delay={60} brand={brand} />
      </div>

      {/* 关注按钮 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "60%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <FollowButton brand={brand} />
      </div>

      {/* 底部文字 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "75%",
          transform: "translateX(-50%)",
          textAlign: "center",
          opacity: bottomTextOpacity,
        }}
      >
        <div
          style={{
            fontSize: 42,
            fontWeight: 700,
            background: design.gradients.text,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: `0 0 30px ${brand.primary}60`,
            marginBottom: 16,
          }}
        >
          每天一个 OpenClaw Skill
        </div>
        <div
          style={{
            fontSize: 36,
            color: design.colors.textSecondary,
          }}
        >
          明天见
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
