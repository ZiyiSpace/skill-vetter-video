// PainPoint 布局 - 增强版：丰富背景 + spring 动画 + 微动效
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
  floating,
} from "../utils/animation";
import { QuickEnhance } from "../components/EnhancedBackground";

interface PainPointProps {
  audioFile: string;
  narration: string;
  title: string;
  points: string[];
  brand: {
    primary: string;
    primaryDim: string;
    secondary: string;
    gradientStart: string;
    gradientEnd: string;
  };
}

// 裂痕 SVG 组件（增强版）
const CrackOverlay: React.FC<{ opacity: number; frame: number }> = ({ opacity, frame }) => {
  const pulse = 0.8 + Math.sin(frame * 0.05) * 0.2;

  return (
    <svg
      width="100%"
      height="100%"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        opacity: opacity * pulse,
      }}
    >
      {/* 主裂痕 */}
      <path
        d="M0,400 L200,300 L350,350 L500,280 L700,380"
        fill="none"
        stroke="#ff4757"
        strokeWidth="4"
        opacity="0.5"
        filter="drop-shadow(0 0 10px #ff4757)"
      />
      <path
        d="M1080,200 L900,350 L750,300 L600,400 L400,350 L200,450 L0,500"
        fill="none"
        stroke="#ff4757"
        strokeWidth="3"
        opacity="0.4"
        filter="drop-shadow(0 0 8px #ff4757)"
      />
      {/* 分支裂痕 */}
      <path
        d="M200,300 L180,350 L220,380"
        fill="none"
        stroke="#ff6b6b"
        strokeWidth="3"
        opacity="0.6"
      />
      <path
        d="M600,400 L580,450 L620,480 L660,450"
        fill="none"
        stroke="#ff6b6b"
        strokeWidth="3"
        opacity="0.5"
      />
    </svg>
  );
};

// 警告条组件（增强版）
const WarningBar: React.FC<{ opacity: number; flash: boolean }> = ({ opacity, flash }) => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 55,
      background: flash
        ? "linear-gradient(90deg, #ff4757, #ff6b6b, #ff4757)"
        : "linear-gradient(90deg, #cc3333, #aa2222, #cc3333)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 15,
      opacity,
      boxShadow: flash ? "0 0 30px rgba(255,71,87,0.6)" : "none",
      transition: "all 0.1s",
    }}
  >
    <span style={{ fontSize: 22 }}>⚠️</span>
    <span style={{ fontSize: 19, fontWeight: 700, color: "#fff" }}>
      警告：以下问题可能导致效率下降
    </span>
    <span style={{ fontSize: 22 }}>⚠️</span>
  </div>
);

export const PainPoint: React.FC<PainPointProps> = ({
  audioFile,
  narration,
  title,
  points,
  brand,
}) => {
  const frame = useCurrentFrame();
  const progress = useProgress();

  // 警告条闪烁（周期 0.5 秒 = 15 帧）
  const warningFlash = Math.floor(frame / 15) % 2 === 0;
  const warningOpacity = atProgress(progress, 0.02, 0.08);

  // 震动效果（前 20%）
  const shakeProgress = atProgress(progress, 0, 0.2, 1, 0);
  const shake = Math.sin(frame * 0.8) * shakeProgress * 8;

  // 裂痕效果
  const crackOpacity = atProgress(progress, 0.1, 0.25) * 0.7;

  // 左侧滑入（spring）
  const leftSlide = springProgress(atProgress(progress, 0.08, 0.28), "snappy");
  // 右侧滑入（spring）
  const rightSlide = springProgress(atProgress(progress, 0.18, 0.38), "snappy");

  // 列表项依次入场 + 微动效
  const listAnimations = points.map((_, i) => {
    const anim = staggerInEnhanced(progress, i, points.length, {
      start: 0.28,
      end: 0.75,
      stagger: 0.07,
      useSpring: true,
      springType: "bouncy",
    });
    // 添加抖动效果
    const jitterX = Math.sin(frame * 0.3 + i * 2) * 2 * anim.opacity;
    const jitterY = Math.cos(frame * 0.4 + i * 3) * 1.5 * anim.opacity;
    return {
      ...anim,
      jitterX,
      jitterY,
    };
  });

  // 脉冲分隔线
  const pulseLineOpacity = 0.5 + Math.sin(frame * 0.15) * 0.3;

  // 字幕
  const captionOpacity = atProgress(progress, ANIMATION_TIMING.caption.start, ANIMATION_TIMING.caption.end);

  // 图标映射
  const icons = ["❌", "⚠️", "🚫", "💢", "⚡", "🔥"];

  // 大图标漂浮
  const iconFloat = floating(frame, 0.03, 5);

  return (
    <AbsoluteFill
      style={{
        fontFamily: "'Noto Sans SC', sans-serif",
        transform: `translateX(${shake}px)`,
        overflow: "hidden",
      }}
    >
      {/* 增强背景 */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, #1a0a2e 0%, #0f0f1a 50%, #1a1a2e 100%)`,
        }}
      />
      <QuickEnhance brand={{ ...brand, primary: "#ff4757", secondary: "#ff6b6b" }} />

      {/* 警告条 */}
      <WarningBar opacity={warningOpacity} flash={warningFlash} />

      {/* 裂痕叠加层 */}
      <CrackOverlay opacity={crackOpacity} frame={frame} />

      {/* 左侧：标题区 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 65,
          width: "45%",
          height: "calc(100% - 130px)",
          padding: 40,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          transform: `translateX(${(1 - leftSlide) * -250}px)`,
          opacity: leftSlide,
        }}
      >
        <div
          style={{
            fontSize: 58,
            fontWeight: 900,
            color: "#ff4757",
            marginBottom: 20,
            textShadow: "0 0 30px rgba(255,71,87,0.7)",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 25,
            color: "rgba(255,255,255,0.65)",
            lineHeight: 1.6,
          }}
        >
          传统方案的困境
        </div>

        {/* 大警告图标 */}
        <div
          style={{
            marginTop: 35,
            fontSize: 110,
            opacity: atProgress(progress, 0.25, 0.38),
            filter: "drop-shadow(0 0 40px rgba(255,71,87,0.9))",
            transform: `translate(${iconFloat.x}px, ${iconFloat.y}px)`,
          }}
        >
          ⚠️
        </div>
      </div>

      {/* 脉冲分隔线 */}
      <div
        style={{
          position: "absolute",
          left: "45%",
          top: 85,
          width: 5,
          height: "calc(100% - 150px)",
          background: `linear-gradient(180deg, transparent, #ff4757, #ff6b6b, #ff4757, transparent)`,
          opacity: pulseLineOpacity * atProgress(progress, 0.12, 0.25),
          boxShadow: "0 0 25px rgba(255,71,87,0.9)",
          borderRadius: 3,
        }}
      />

      {/* 右侧：痛点列表 */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 65,
          width: "50%",
          height: "calc(100% - 130px)",
          padding: 40,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          transform: `translateX(${(1 - rightSlide) * 250}px)`,
          opacity: rightSlide,
        }}
      >
        {points.map((point, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 26,
              opacity: listAnimations[i].opacity,
              transform: `translateX(${listAnimations[i].jitterX + listAnimations[i].y}px) translateY(${listAnimations[i].y}px) scale(${listAnimations[i].scale}) rotate(${listAnimations[i].rotate}deg)`,
              padding: "14px 18px",
              background: "linear-gradient(135deg, rgba(255,71,87,0.15), rgba(255,71,87,0.05))",
              borderRadius: 14,
              border: "1px solid rgba(255,71,87,0.4)",
              boxShadow: `0 0 ${15 + Math.sin(frame * 0.1 + i) * 5}px rgba(255,71,87,0.2)`,
              backdropFilter: "blur(10px)",
            }}
          >
            <span style={{ fontSize: 38 }}>{icons[i % icons.length]}</span>
            <span
              style={{
                fontSize: 27,
                color: "rgba(255,255,255,0.95)",
                fontWeight: 500,
              }}
            >
              {point}
            </span>
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
