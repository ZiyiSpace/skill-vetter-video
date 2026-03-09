// VSTable 布局 - VS 表格 + 高亮闪烁（百分比时间轴）
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

interface ComparisonItem {
  feature: string;
  traditional: string;
  ai: string;
}

interface VSTableProps {
  audioFile: string;
  narration: string;
  title: string;
  subtitle?: string;
  comparisons: ComparisonItem[];
  brand: {
    primary: string;
    primaryDim: string;
    secondary: string;
    gradientStart: string;
    gradientEnd: string;
  };
}

export const VSTable: React.FC<VSTableProps> = ({
  audioFile,
  narration,
  title,
  subtitle,
  comparisons,
  brand,
}) => {
  const frame = useCurrentFrame();
  const progress = useProgress();

  // 标题（spring 动画）
  const titleSpring = springProgress(atProgress(progress, 0.05, 0.18), "snappy");
  const titleScale = 0.9 + titleSpring * 0.1;
  const titleOpacity = atProgress(progress, 0.05, 0.15);

  // VS 标识
  const vsOpacity = atProgress(progress, 0.1, 0.2);

  // 表格行动画（增强版）
  const rowAnimations = comparisons.map((_, i) =>
    staggerInEnhanced(progress, i, comparisons.length, {
      start: 0.18,
      end: 0.7,
      stagger: 0.06,
      useSpring: true,
      springType: "snappy",
    })
  );

  // 高亮闪烁效果（最后一行）
  const highlightPulse = 0.6 + Math.sin(frame * 0.15) * 0.4 * atProgress(progress, 0.6, 0.8);

  // 字幕
  const captionOpacity = atProgress(progress, ANIMATION_TIMING.caption.start, ANIMATION_TIMING.caption.end);

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
          top: "8%",
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
            filter: `drop-shadow(0 0 25px ${brand.primary}40)`,
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

      {/* VS 标识 */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: 40,
          width: "85%",
          maxWidth: 600,
          opacity: vsOpacity,
        }}
      >
        <div style={{ flex: 1, textAlign: "center", fontSize: 20, color: "#888" }}>
          传统方案
        </div>
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${brand.primary}, ${brand.secondary})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: 900,
            color: "#fff",
          }}
        >
          VS
        </div>
        <div style={{ flex: 1, textAlign: "center", fontSize: 20, color: brand.primary }}>
          AI 方案
        </div>
      </div>

      {/* 对比表格 */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "85%",
          maxWidth: 600,
        }}
      >
        {comparisons.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "14px 0",
              borderBottom: "1px solid rgba(255,255,255,0.12)",
              opacity: rowAnimations[i].opacity,
              transform: `translateX(${rowAnimations[i].y}px) translateY(${rowAnimations[i].y}px) scale(${rowAnimations[i].scale})`,
              background: i === comparisons.length - 1 ? `linear-gradient(90deg, transparent, ${brand.primary}10, transparent)` : "transparent",
            }}
          >
            <div style={{ flex: 1, fontSize: 18, color: "rgba(255,255,255,0.8)" }}>
              {item.feature}
            </div>
            <div style={{ flex: 1, textAlign: "center", fontSize: 16, color: "#666" }}>
              {item.traditional}
            </div>
            <div
              style={{
                flex: 1,
                textAlign: "center",
                fontSize: 16,
                color: "#4ade80",
                fontWeight: 600,
                opacity: i === comparisons.length - 1 ? highlightPulse : 1,
              }}
            >
              {item.ai}
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
