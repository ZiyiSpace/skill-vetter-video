// 增强背景组件 - 渐变 + 噪点 + 光晕 + 粒子
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { noise2D, noise3D } from "@remotion/noise";

interface EnhancedBackgroundProps {
  brand: {
    primary: string;
    primaryDim: string;
    secondary: string;
    gradientStart: string;
    gradientEnd: string;
  };
  variant?: "default" | "aurora" | "mesh" | "particles";
  intensity?: "low" | "medium" | "high";
}

// 极光渐变背景
const AuroraGradient: React.FC<{
  colors: { start: string; mid: string; end: string };
  frame: number;
  intensity: number;
}> = ({ colors, frame, intensity }) => {
  const offset1 = Math.sin(frame * 0.02) * 0.1;
  const offset2 = Math.cos(frame * 0.015) * 0.15;

  return (
    <AbsoluteFill
      style={{
        background: `
          radial-gradient(ellipse at ${50 + offset1 * 100}% ${30 + offset2 * 100}%, ${colors.mid}${Math.round(intensity * 40).toString(16).padStart(2, '0')} 0%, transparent 50%),
          radial-gradient(ellipse at ${70 - offset2 * 100}% ${70 + offset1 * 100}%, ${colors.end}${Math.round(intensity * 30).toString(16).padStart(2, '0')} 0%, transparent 45%),
          linear-gradient(135deg, ${colors.start} 0%, ${colors.mid} 50%, ${colors.end} 100%)
        `,
      }}
    />
  );
};

// 噪点叠加层
const NoiseOverlay: React.FC<{
  frame: number;
  opacity: number;
  color: string;
}> = ({ frame, opacity, color }) => {
  // 生成动态噪点
  const noiseValue = noise3D(frame * 0.05, 0, 0);

  return (
    <AbsoluteFill
      style={{
        opacity: opacity,
        mixBlendMode: "overlay",
        background: `
          repeating-radial-gradient(
            circle at 50% 50%,
            transparent 0,
            ${color}05 1px,
            transparent 2px
          )
        `,
        filter: `contrast(${1 + noiseValue * 0.1})`,
      }}
    />
  );
};

// 光晕层
const GlowLayers: React.FC<{
  frame: number;
  primaryColor: string;
  secondaryColor: string;
  intensity: number;
}> = ({ frame, primaryColor, secondaryColor, intensity }) => {
  const pulse1 = Math.sin(frame * 0.08) * 0.3 + 0.7;
  const pulse2 = Math.cos(frame * 0.06) * 0.25 + 0.75;
  const drift1 = Math.sin(frame * 0.03) * 0.1;
  const drift2 = Math.cos(frame * 0.025) * 0.12;

  return (
    <>
      {/* 主光晕 */}
      <div
        style={{
          position: "absolute",
          left: `${30 + drift1 * 100}%`,
          top: `${20 + drift2 * 100}%`,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${primaryColor}${Math.round(intensity * pulse1 * 80).toString(16).padStart(2, '0')} 0%, transparent 60%)`,
          filter: "blur(60px)",
          transform: "translate(-50%, -50%)",
        }}
      />
      {/* 次光晕 */}
      <div
        style={{
          position: "absolute",
          right: `${25 - drift2 * 100}%`,
          bottom: `${30 + drift1 * 100}%`,
          width: 450,
          height: 450,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${secondaryColor}${Math.round(intensity * pulse2 * 60).toString(16).padStart(2, '0')} 0%, transparent 55%)`,
          filter: "blur(50px)",
          transform: "translate(50%, 50%)",
        }}
      />
    </>
  );
};

// 漂浮粒子
const FloatingParticles: React.FC<{
  frame: number;
  color: string;
  count: number;
}> = ({ frame, color, count }) => {
  const particles = Array.from({ length: count }, (_, i) => {
    const x = noise2D(i * 0.1, frame * 0.01) * 0.8 + 0.1;
    const y = noise2D(i * 0.1 + 100, frame * 0.01) * 0.8 + 0.1;
    const size = noise2D(i * 0.1 + 200, frame * 0.01) * 4 + 2;
    const opacity = noise2D(i * 0.1 + 300, frame * 0.02) * 0.4 + 0.2;

    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${x * 100}%`,
          top: `${y * 100}%`,
          width: size,
          height: size,
          borderRadius: "50%",
          background: color,
          opacity,
          boxShadow: `0 0 ${size * 3}px ${color}`,
        }}
      />
    );
  });

  return <>{particles}</>;
};

// 网格背景
const MeshGrid: React.FC<{
  frame: number;
  color: string;
  opacity: number;
}> = ({ frame, color, opacity }) => {
  const pulse = 0.3 + Math.sin(frame * 0.05) * 0.1;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          linear-gradient(${color}${Math.round(opacity * 25).toString(16).padStart(2, '0')} 1px, transparent 1px),
          linear-gradient(90deg, ${color}${Math.round(opacity * 25).toString(16).padStart(2, '0')} 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        opacity: pulse,
      }}
    />
  );
};

export const EnhancedBackground: React.FC<EnhancedBackgroundProps> = ({
  brand,
  variant = "aurora",
  intensity = "medium",
}) => {
  const frame = useCurrentFrame();

  const intensityMap = {
    low: 0.4,
    medium: 0.7,
    high: 1.0,
  };

  const int = intensityMap[intensity];

  const colors = {
    start: brand.gradientStart,
    mid: brand.primary,
    end: brand.gradientEnd,
  };

  return (
    <AbsoluteFill>
      {/* 基础渐变 */}
      {variant === "aurora" && (
        <AuroraGradient colors={colors} frame={frame} intensity={int} />
      )}
      {variant === "default" && (
        <AbsoluteFill
          style={{
            background: `linear-gradient(135deg, ${brand.gradientStart} 0%, ${brand.gradientEnd} 100%)`,
          }}
        />
      )}
      {variant === "mesh" && (
        <>
          <AbsoluteFill
            style={{
              background: `linear-gradient(180deg, ${brand.gradientStart} 0%, ${brand.gradientEnd} 100%)`,
            }}
          />
          <MeshGrid frame={frame} color={brand.primary} opacity={int} />
        </>
      )}
      {variant === "particles" && (
        <>
          <AbsoluteFill
            style={{
              background: `linear-gradient(135deg, ${brand.gradientStart} 0%, ${brand.gradientEnd} 100%)`,
            }}
          />
          <FloatingParticles
            frame={frame}
            color={brand.primary}
            count={30}
          />
        </>
      )}

      {/* 光晕层（所有变体都有） */}
      <GlowLayers
        frame={frame}
        primaryColor={brand.primary}
        secondaryColor={brand.secondary}
        intensity={int}
      />

      {/* 噪点叠加（所有变体都有） */}
      <NoiseOverlay frame={frame} opacity={0.15} color={brand.primary} />
    </AbsoluteFill>
  );
};

// 简化版：只加噪点 + 光晕
export const QuickEnhance: React.FC<{
  brand: {
    primary: string;
    secondary: string;
    gradientStart: string;
    gradientEnd: string;
  };
}> = ({ brand }) => {
  const frame = useCurrentFrame();

  const pulse = Math.sin(frame * 0.08) * 0.3 + 0.7;

  return (
    <>
      {/* 光晕 */}
      <div
        style={{
          position: "absolute",
          left: "30%",
          top: "25%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${brand.primary}50 0%, transparent 60%)`,
          filter: "blur(60px)",
          opacity: pulse,
        }}
      />
      {/* 噪点 */}
      <AbsoluteFill
        style={{
          opacity: 0.12,
          mixBlendMode: "overlay",
          background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </>
  );
};
