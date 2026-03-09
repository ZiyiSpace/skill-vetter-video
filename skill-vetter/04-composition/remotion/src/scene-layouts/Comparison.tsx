// Comparison 布局 - 增强版：丰富背景 + spring 动画 + 微动效
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

interface ComparisonProps {
  audioFile: string;
  narration: string;
  title: string;
  beforeValue: string;
  afterValue: string;
  beforeLabel: string;
  afterLabel: string;
  boostValue?: string;
  extraStats?: { label: string; value: string }[];
  brand: {
    primary: string;
    primaryDim: string;
    secondary: string;
    gradientStart: string;
    gradientEnd: string;
  };
}

// 环形进度组件（增强版）
const ProgressRing: React.FC<{
  progress: number;
  color: string;
  size?: number;
  label?: string;
  frame: number;
}> = ({ progress, color, size = 100, label, frame }) => {
  const radius = (size / 2) - 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // 脉冲效果
  const pulse = 1 + Math.sin(frame * 0.08) * 0.05;

  return (
    <svg width={size} height={size} style={{ transform: `scale(${pulse})` }}>
      {/* 背景光晕 */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius + 5}
        fill="none"
        stroke={color}
        strokeWidth={3}
        opacity={0.1}
        filter="blur(8px)"
      />
      {/* 背景圆环 */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={8}
        opacity={0.2}
      />
      {/* 进度圆环 */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={8}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        style={{
          filter: `drop-shadow(0 0 12px ${color})`,
        }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      {/* 中心文字 */}
      {label && (
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={color}
          fontSize={20}
          fontWeight={700}
          style={{ filter: `drop-shadow(0 0 5px ${color})` }}
        >
          {Math.round(progress)}%
        </text>
      )}
    </svg>
  );
};

// 数字滚动动画
const useRollingNumber = (target: number, progress: number, duration: number = 0.2) => {
  const start = duration * 0.6;
  const end = start + 0.15;

  if (progress < start) return 0;
  if (progress > end) return target;

  const t = (progress - start) / (end - start);
  return Math.floor(t * target);
};

export const Comparison: React.FC<ComparisonProps> = ({
  audioFile,
  narration,
  title,
  beforeValue,
  afterValue,
  beforeLabel,
  afterLabel,
  boostValue,
  extraStats,
  brand,
}) => {
  const frame = useCurrentFrame();
  const progress = useProgress();

  // 标题（spring 动画）
  const titleSpring = springProgress(atProgress(progress, 0.05, 0.18), "snappy");
  const titleOpacity = atProgress(progress, 0.05, 0.15);
  const titleScale = 0.9 + titleSpring * 0.1;

  // 卡片入场（spring）
  const leftCardSpring = springProgress(atProgress(progress, 0.15, 0.32), "smooth");
  const rightCardSpring = springProgress(atProgress(progress, 0.28, 0.45), "smooth");

  // 环形进度动画
  const ringProgress = atProgress(progress, 0.35, 0.58);
  const beforeRingValue = useRollingNumber(30, ringProgress);
  const afterRingValue = useRollingNumber(95, ringProgress);

  // 效率数字滚动
  const boostNumberProgress = atProgress(progress, 0.52, 0.72);
  const boostNumber = useRollingNumber(
    parseInt(boostValue?.replace(/[^0-9]/g, "") || 0),
    boostNumberProgress
  );

  // 大数字浮动效果
  const boostFloat = floating(frame, 0.02, 8);

  // 进度条
  const barProgress = atProgress(progress, 0.58, 0.78);

  // 额外数据（增强动画）
  const extraAnimations = (extraStats || []).map((_, i) =>
    staggerInEnhanced(progress, i, extraStats?.length || 1, {
      start: 0.68,
      end: 0.88,
      stagger: 0.05,
      useSpring: true,
      springType: "snappy",
    })
  );

  // 字幕
  const captionOpacity = atProgress(progress, ANIMATION_TIMING.caption.start, ANIMATION_TIMING.caption.end);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* 增强背景 */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(135deg, ${brand.gradientStart} 0%, ${brand.gradientEnd} 100%)`,
        }}
      />
      <QuickEnhance brand={brand} />

      {/* 标题 */}
      <div
        style={{
          position: "absolute",
          top: "6%",
          left: "50%",
          transform: `translateX(-50%) scale(${titleScale})`,
          textAlign: "center",
          opacity: titleOpacity,
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontSize: 50,
            fontWeight: 900,
            color: "#fff",
            filter: `drop-shadow(0 0 25px ${brand.primary}40)`,
          }}
        >
          {title}
        </div>
      </div>

      {/* 环形进度对比区 */}
      <div
        style={{
          position: "absolute",
          top: "22%",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 70,
          opacity: atProgress(progress, 0.32, 0.52),
        }}
      >
        {/* 左侧环形（传统） */}
        <div style={{ textAlign: "center" }}>
          <ProgressRing
            progress={beforeRingValue}
            color="#ff6b6b"
            size={130}
            label={beforeLabel}
            frame={frame}
          />
          <div style={{ color: "#ff6b6b", fontSize: 20, marginTop: 12, fontWeight: 600 }}>
            {beforeLabel}
          </div>
        </div>

        {/* 箭头（增强版） */}
        <div
          style={{
            fontSize: 52,
            color: brand.primary,
            opacity: atProgress(progress, 0.42, 0.5),
            filter: `drop-shadow(0 0 15px ${brand.primary})`,
          }}
        >
          →
        </div>

        {/* 右侧环形（AI） */}
        <div style={{ textAlign: "center" }}>
          <ProgressRing
            progress={afterRingValue}
            color="#4ade80"
            size={130}
            label={afterLabel}
            frame={frame}
          />
          <div style={{ color: "#4ade80", fontSize: 20, marginTop: 12, fontWeight: 600 }}>
            {afterLabel}
          </div>
        </div>
      </div>

      {/* 效率提升大数字 */}
      {boostValue && (
        <div
          style={{
            position: "absolute",
            top: "52%",
            left: "50%",
            transform: `translateX(-50%) translate(${boostFloat.x}px, ${boostFloat.y}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 90,
              fontWeight: 900,
              background: `linear-gradient(135deg, ${brand.primary}, ${brand.secondary})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: `drop-shadow(0 0 40px ${brand.primary}60)`,
            }}
          >
            {boostNumber}x
          </div>
          <div style={{ fontSize: 30, color: "rgba(255,255,255,0.85)", marginTop: 10, fontWeight: 500 }}>
            效率提升
          </div>
        </div>
      )}

      {/* 对比进度条（增强版） */}
      <div
        style={{
          position: "absolute",
          bottom: "28%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "72%",
          maxWidth: 420,
        }}
      >
        <div
          style={{
            height: 10,
            background: "rgba(255,255,255,0.1)",
            borderRadius: 5,
            position: "relative",
            boxShadow: "inset 0 0 10px rgba(0,0,0,0.3)",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: `${barProgress}%`,
              background: `linear-gradient(90deg, #ff6b6b, ${brand.primary}, #4ade80)`,
              borderRadius: 5,
              boxShadow: `0 0 20px ${brand.primary}60`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              padding: "0 10px",
            }}
          >
            <span style={{ color: "#ff6b6b", fontSize: 15, fontWeight: 600 }}>
              {beforeValue}
            </span>
            <span style={{ color: "#4ade80", fontSize: 15, fontWeight: 600 }}>
              {afterValue}
            </span>
          </div>
        </div>
      </div>

      {/* 额外数据 */}
      {extraStats && extraStats.length > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: "17%",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 45,
          }}
        >
          {extraStats.map((stat, i) => (
            <div
              key={i}
              style={{
                textAlign: "center",
                opacity: extraAnimations[i].opacity,
                transform: `translateY(${extraAnimations[i].y}px) scale(${extraAnimations[i].scale})`,
              }}
            >
              <div style={{ fontSize: 30, fontWeight: 700, color: brand.primary, filter: `drop-shadow(0 0 10px ${brand.primary}40)` }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", marginTop: 5 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      )}

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
