// 光晕过渡效果 - 用于场景切换
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

interface LightLeakTransitionProps {
  durationInFrames: number;
  color?: string;
  secondaryColor?: string;
  intensity?: number;
}

export const LightLeakTransition: React.FC<LightLeakTransitionProps> = ({
  durationInFrames,
  color = "#ff6b35",
  secondaryColor = "#ffd700",
  intensity = 1,
}) => {
  const frame = useCurrentFrame();
  const progress = frame / durationInFrames;

  // 光晕展开（0-50%）然后收缩（50%-100%）
  const reveal = progress < 0.5 ? progress * 2 : 2 - progress * 2;

  // 多层光晕
  const layer1Opacity = interpolate(reveal, [0, 0.3, 0.7, 1], [0, 0.8, 0.8, 0]);
  const layer2Opacity = interpolate(reveal, [0, 0.4, 0.6, 1], [0, 0.6, 0.6, 0]);
  const layer3Opacity = interpolate(reveal, [0, 0.5, 1], [0, 1, 0]);

  // 旋转角度
  const rotation = progress * 180;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* 主光晕层 */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 1500,
          height: 1500,
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          background: `radial-gradient(ellipse at center, ${color}${Math.round(layer1Opacity * intensity * 180).toString(16).padStart(2, '0')} 0%, transparent 60%)`,
          filter: "blur(40px)",
          opacity: layer1Opacity,
        }}
      />

      {/* 次光晕层 */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          right: "-20%",
          width: 800,
          height: 800,
          transform: `rotate(${rotation * 0.7}deg)`,
          background: `radial-gradient(circle, ${secondaryColor}${Math.round(layer2Opacity * intensity * 120).toString(16).padStart(2, '0')} 0%, transparent 50%)`,
          filter: "blur(50px)",
          opacity: layer2Opacity,
        }}
      />

      {/* 边缘光晕 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(135deg, ${color}${Math.round(layer3Opacity * intensity * 100).toString(16).padStart(2, '0')} 0%, transparent 30%),
            linear-gradient(225deg, ${secondaryColor}${Math.round(layer3Opacity * intensity * 100).toString(16).padStart(2, '0')} 0%, transparent 30%)
          `,
          opacity: layer3Opacity,
        }}
      />

      {/* 中心高亮 */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 300,
          height: 300,
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, rgba(255,255,255,${layer3Opacity * 0.5 * intensity}) 0%, transparent 70%)`,
          filter: "blur(30px)",
        }}
      />
    </AbsoluteFill>
  );
};

// 简化版闪光效果
export const FlashOverlay: React.FC<{
  frame: number;
  durationInFrames: number;
  color?: string;
}> = ({ frame, durationInFrames, color = "#ffffff" }) => {
  const progress = frame / durationInFrames;
  const opacity = interpolate(progress, [0, 0.2, 0.8, 1], [0, 0.8, 0.8, 0]);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 70%)`,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};

// 粒子爆炸过渡
export const ParticleBurst: React.FC<{
  frame: number;
  durationInFrames: number;
  color: string;
  count?: number;
}> = ({ frame, durationInFrames, color, count = 30 }) => {
  const progress = frame / durationInFrames;

  const particles = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    const speed = 200 + Math.sin(i) * 100;
    const distance = progress * speed;
    const size = 4 + (i % 5) * 2;
    const opacity = progress < 0.6 ? 1 : 1 - (progress - 0.6) / 0.4;

    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: size,
          height: size,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 ${size * 2}px ${color}`,
          transform: `translate(-50%, -50%) translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`,
          opacity: opacity * 0.8,
        }}
      />
    );
  });

  return <>{particles}</>;
};
