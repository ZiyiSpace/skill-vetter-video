// IconMatrix 布局 - 图标矩阵 + 旋转入场（百分比时间轴）
import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  staticFile,
} from "remotion";
import { Audio } from "@remotion/media";
import {
  useProgress,
  atProgress,
  staggerInEnhanced,
  ANIMATION_TIMING,
  springProgress,
} from "../utils/animation";
import { QuickEnhance } from "../components/EnhancedBackground";

interface Scenario {
  icon: string;
  title: string;
  desc: string;
}

interface IconMatrixProps {
  audioFile: string;
  narration: string;
  title: string;
  subtitle?: string;
  scenarios: Scenario[];
  brand: {
    primary: string;
    primaryDim: string;
    secondary: string;
    gradientStart: string;
    gradientEnd: string;
  };
}

export const IconMatrix: React.FC<IconMatrixProps> = ({
  audioFile,
  narration,
  title,
  subtitle,
  scenarios,
  brand,
}) => {
  const frame = useCurrentFrame();
  const progress = useProgress();

  // 标题（spring 动画）
  const titleSpring = springProgress(atProgress(progress, 0.05, 0.18), "snappy");
  const titleScale = 0.9 + titleSpring * 0.1;
  const titleOpacity = atProgress(progress, 0.05, 0.15);

  // 图标旋转入场（增强版）
  const iconAnimations = scenarios.map((_, i) => {
    const anim = staggerInEnhanced(progress, i, scenarios.length, {
      start: 0.12,
      end: 0.65,
      stagger: 0.07,
      useSpring: true,
      springType: "bouncy",
    });
    return {
      ...anim,
      rotate: (1 - anim.opacity) * 180,
    };
  });

  // 字幕
  const captionOpacity = atProgress(progress, ANIMATION_TIMING.caption.start, ANIMATION_TIMING.caption.end);

  // 计算列数
  const columns = scenarios.length <= 3 ? 3 : scenarios.length <= 6 ? 3 : 4;

  return (
    <AbsoluteFill
      style={{
        fontFamily: "'Noto Sans SC', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* 增强背景 */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${brand.gradientStart} 0%, ${brand.gradientEnd} 100%)`,
        }}
      />
      <QuickEnhance brand={brand} />
      {/* 标题 */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: `translateX(-50%) scale(${titleScale})`,
          textAlign: "center",
          opacity: titleOpacity,
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 900,
            background: `linear-gradient(135deg, ${brand.primary} 0%, ${brand.secondary} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: `drop-shadow(0 0 20px ${brand.primary}40)`,
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 22, color: "rgba(255,255,255,0.6)", marginTop: 8 }}>
            {subtitle}
          </div>
        )}
      </div>

      {/* 图标矩阵 */}
      <div
        style={{
          position: "absolute",
          top: "28%",
          left: "50%",
          transform: "translateX(-50%)",
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: 24,
          width: "85%",
          maxWidth: 550,
        }}
      >
        {scenarios.map((scenario, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              opacity: iconAnimations[i].opacity,
              transform: `rotate(${iconAnimations[i].rotate}deg) scale(${iconAnimations[i].scale})`,
            }}
          >
            <div
              style={{
                width: 85,
                height: 85,
                borderRadius: 22,
                background: `linear-gradient(135deg, ${brand.primaryDim}, ${brand.primary}40)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 42,
                marginBottom: 14,
                boxShadow: `0 8px 30px ${brand.primary}30, 0 0 20px ${brand.primary}20`,
                border: `1px solid ${brand.primary}30`,
              }}
            >
              {scenario.icon}
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>
              {scenario.title}
            </div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>
              {scenario.desc}
            </div>
          </div>
        ))}
      </div>

      {/* 字幕 */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: "50%",
          transform: "translateX(-50%)",
          background: "linear-gradient(135deg, #FFD700 0%, #FFC107 100%)",
          color: "#000",
          padding: "16px 30px",
          borderRadius: 12,
          fontSize: 27,
          fontWeight: 600,
          textAlign: "center",
          opacity: captionOpacity,
          maxWidth: "85%",
          lineHeight: 1.5,
          boxShadow: "0 4px 25px rgba(255,215,0,0.4)",
        }}
      >
        {narration}
      </div>

      <Audio src={staticFile(`audio/${audioFile}`)} />
    </AbsoluteFill>
  );
};
