// CTA 布局 - 增强版：丰富背景 + spring 动画 + 微动效
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
  breathe,
} from "../utils/animation";
import { EnhancedBackground } from "../components/EnhancedBackground";

interface CTAProps {
  audioFile: string;
  narration: string;
  mainText: string;
  subText?: string;
  icons?: string[];
  brand: {
    primary: string;
    primaryDim: string;
    secondary: string;
    gradientStart: string;
    gradientEnd: string;
  };
}

// 光芒射线组件（增强版）
const LightRay: React.FC<{
  angle: number;
  length: number;
  opacity: number;
  color: string;
  centerX: number;
  centerY: number;
  frame: number;
}> = ({ angle, length, opacity, color, centerX, centerY, frame }) => {
  const pulse = 0.8 + Math.sin(frame * 0.05) * 0.2;
  const endX = centerX + Math.cos(angle) * length;
  const endY = centerY + Math.sin(angle) * length;

  return (
    <div
      style={{
        position: "absolute",
        left: centerX,
        top: centerY,
        width: length,
        height: 3,
        background: `linear-gradient(90deg, ${color}, ${color}60, transparent)`,
        transform: `rotate(${angle}rad)`,
        transformOrigin: "left center",
        opacity: opacity * pulse,
        filter: "blur(2px)",
        boxShadow: `0 0 10px ${color}`,
      }}
    />
  );
};

// 环绕粒子组件（增强版）
const OrbitParticle: React.FC<{
  index: number;
  total: number;
  progress: number;
  frame: number;
  color: string;
  centerX: number;
  centerY: number;
}> = ({ index, total, progress, frame, color, centerX, centerY }) => {
  const baseAngle = (index / total) * Math.PI * 2;
  const orbitSpeed = 0.012 + (index % 3) * 0.004;
  const angle = baseAngle + frame * orbitSpeed;
  const radius = 150 + (index % 4) * 25;
  const size = 4 + (index % 3) * 3;

  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius * 0.6; // 椭圆轨道
  const twinkle = breathe(frame, 0.12 + index * 0.01, 0.4, 1);

  return (
    <div
      style={{
        position: "absolute",
        left: centerX,
        top: centerY,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}, ${color}80)`,
        boxShadow: `0 0 ${size * 4}px ${color}, 0 0 ${size * 2}px ${color}`,
        transform: `translate(${x}px, ${y}px)`,
        opacity: progress * twinkle,
      }}
    />
  );
};

// 脉冲按钮组件（增强版）
const PulseButton: React.FC<{
  icon: string;
  label: string;
  scale: number;
  opacity: number;
  pulsePhase: number;
  color: string;
  frame: number;
}> = ({ icon, label, scale, opacity, pulsePhase, color, frame }) => {
  const pulse = 1 + Math.sin(frame * 0.12 + pulsePhase) * 0.08;
  const glow = 0.5 + Math.sin(frame * 0.08 + pulsePhase) * 0.5;
  const float = floating(frame, 0.02 + pulsePhase * 0.01, 4);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        transform: `scale(${scale * pulse}) translate(${float.x}px, ${float.y}px)`,
        opacity,
      }}
    >
      {/* 按钮背景 */}
      <div
        style={{
          width: 110,
          height: 110,
          borderRadius: 30,
          background: `linear-gradient(135deg, ${color}40, ${color}15)`,
          border: `2px solid ${color}70`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `
            0 0 ${40 * glow}px ${color}60,
            0 0 ${60 * glow}px ${color}30,
            inset 0 0 25px ${color}25
          `,
          position: "relative",
          backdropFilter: "blur(10px)",
        }}
      >
        <span style={{ fontSize: 55 }}>{icon}</span>

        {/* 脉冲环 */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: 30,
            border: `2px solid ${color}`,
            opacity: glow * 0.6,
            transform: `scale(${1 + (1 - glow) * 0.3})`,
          }}
        />
      </div>

      {/* 标签 */}
      <span
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: "#fff",
          textShadow: `0 0 15px ${color}`,
        }}
      >
        {label}
      </span>
    </div>
  );
};

export const CTA: React.FC<CTAProps> = ({
  audioFile,
  narration,
  mainText,
  subText,
  icons = ["👍", "⭐", "➕"],
  brand,
}) => {
  const frame = useCurrentFrame();
  const progress = useProgress();

  // 中心坐标
  const centerX = 540; // 1080 / 2
  const centerY = 640; // 1920 * 0.35

  // 光芒射线（8-28%）
  const raysOpacity = atProgress(progress, 0.08, 0.28) * 0.7;
  const rays = React.useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      angle: (i / 20) * Math.PI * 2,
      length: 220 + (i % 5) * 60,
    }))
  , []);

  // 环绕粒子（持续）
  const orbitParticles = React.useMemo(() =>
    Array.from({ length: 35 }, (_, i) => ({ id: i }))
  , []);
  const orbitProgress = atProgress(progress, 0.1, 0.4);

  // 按钮脉冲入场（15-50%）- 使用增强动画
  const buttonAnimations = icons.map((_, i) =>
    staggerInEnhanced(progress, i, icons.length, {
      start: 0.15,
      end: 0.5,
      stagger: 0.12,
      useSpring: true,
      springType: "bouncy",
    })
  );

  // 文字淡入（45-60%）- spring 动画
  const textSpring = springProgress(atProgress(progress, 0.45, 0.62), "snappy");
  const textOpacity = atProgress(progress, 0.45, 0.6);
  const textY = (1 - textSpring) * 25;

  // 中心光晕（持续）
  const glowPulse = breathe(frame, 0.06, 0.4, 0.8);
  const glowScale = 1 + Math.sin(frame * 0.08) * 0.12;

  // 字幕
  const captionOpacity = atProgress(progress, ANIMATION_TIMING.caption.start, ANIMATION_TIMING.caption.end);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* 增强背景 */}
      <EnhancedBackground brand={brand} variant="aurora" intensity="high" />

      {/* 背景光晕 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "35%",
          transform: `translate(-50%, -50%) scale(${glowScale})`,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${brand.primary}40 0%, transparent 60%)`,
          opacity: glowPulse,
          filter: "blur(80px)",
        }}
      />

      {/* 光芒射线 */}
      {rays.map((ray, i) => (
        <LightRay
          key={i}
          angle={ray.angle}
          length={ray.length}
          opacity={raysOpacity}
          color={brand.primary}
          centerX={centerX}
          centerY={centerY}
          frame={frame}
        />
      ))}

      {/* 环绕粒子 */}
      {orbitParticles.map((p) => (
        <OrbitParticle
          key={p.id}
          index={p.id}
          total={35}
          progress={orbitProgress}
          frame={frame}
          color={brand.primary}
          centerX={centerX}
          centerY={centerY}
        />
      ))}

      {/* 内容容器 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          gap: 55,
        }}
      >
        {/* 按钮组 */}
        <div
          style={{
            display: "flex",
            gap: 55,
            alignItems: "center",
          }}
        >
          {icons.map((icon, i) => (
            <PulseButton
              key={i}
              icon={icon}
              label={i === 0 ? "点赞" : i === 1 ? "收藏" : "关注"}
              scale={buttonAnimations[i].scale}
              opacity={buttonAnimations[i].opacity}
              pulsePhase={i * 0.6}
              color={brand.primary}
              frame={frame}
            />
          ))}
        </div>

        {/* 文字 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
          }}
        >
          <p
            style={{
              fontSize: 46,
              fontWeight: 900,
              margin: 0,
              background: `linear-gradient(135deg, ${brand.primary} 0%, ${brand.secondary} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: `drop-shadow(0 0 35px ${brand.primary}50)`,
              letterSpacing: 2,
            }}
          >
            {mainText}
          </p>
          {subText && (
            <p
              style={{
                fontSize: 30,
                margin: 0,
                color: "rgba(255,255,255,0.9)",
                fontWeight: 500,
              }}
            >
              {subText}
            </p>
          )}
        </div>
      </div>

      {/* 底部装饰渐变 */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 220,
          background: `linear-gradient(0deg, ${brand.gradientStart}50, transparent)`,
        }}
      />

      {/* 字幕 */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: "50%",
          transform: "translateX(-50%)",
          background: "linear-gradient(135deg, #FFD700 0%, #FFC107 100%)",
          color: "#000",
          padding: "16px 32px",
          borderRadius: 12,
          fontSize: 29,
          fontWeight: 600,
          textAlign: "center",
          opacity: captionOpacity,
          maxWidth: "90%",
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
