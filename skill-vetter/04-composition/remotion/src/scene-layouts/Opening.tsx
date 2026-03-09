// Opening 布局 - 增强版：丰富背景 + spring 动画 + 微动效
import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";
import { Audio } from "@remotion/media";
import { noise2D } from "@remotion/noise";
import {
  useProgress,
  atProgress,
  ANIMATION_TIMING,
  floating,
  pulse,
  breathe,
  springProgress,
  staggerInEnhanced,
} from "../utils/animation";
import { EnhancedBackground } from "../components/EnhancedBackground";

interface OpeningProps {
  audioFile: string;
  narration: string;
  title: string;
  subtitle?: string;
  brand: {
    primary: string;
    primaryDim: string;
    secondary: string;
    gradientStart: string;
    gradientEnd: string;
  };
}

// 爆炸粒子组件（增强版）
const ExplosionParticle: React.FC<{
  index: number;
  progress: number;
  color: string;
  centerX: number;
  centerY: number;
}> = ({ index, progress, color, centerX, centerY }) => {
  const frame = useCurrentFrame();
  const angle = (index / 25) * Math.PI * 2 + Math.sin(index * 0.5) * 0.3;
  const speed = 100 + (index % 7) * 40;
  const size = 5 + (index % 4) * 4;

  // 使用 spring 进度
  const springProg = springProgress(progress, "bouncy");
  const distance = springProg * speed;

  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;
  const opacity = progress < 0.35 ? progress / 0.35 : 1 - (progress - 0.35) / 0.65;
  const scale = 1 - progress * 0.6;

  // 添加旋转
  const rotate = progress * 360 * (index % 2 === 0 ? 1 : -1);

  return (
    <div
      style={{
        position: "absolute",
        left: centerX,
        top: centerY,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${color}, ${color}80)`,
        boxShadow: `0 0 ${size * 3}px ${color}, 0 0 ${size * 5}px ${color}40`,
        transform: `translate(${x}px, ${y}px) scale(${scale}) rotate(${rotate}deg)`,
        opacity: opacity * 0.9,
      }}
    />
  );
};

// Logo 组装碎片（增强版 - 带微动效）
const LogoFragment: React.FC<{
  index: number;
  progress: number;
  isCenter: boolean;
  color: string;
  glowColor: string;
  frame: number;
}> = ({ index, progress, isCenter, color, glowColor, frame }) => {
  const positions = [
    { x: -200, y: -140 },
    { x: 200, y: -140 },
    { x: -200, y: 140 },
    { x: 200, y: 140 },
    { x: 0, y: 0 },
  ];

  const pos = positions[index];
  const springProg = springProgress(progress, "smooth");

  const x = pos.x * (1 - springProg);
  const y = pos.y * (1 - springProg);
  const scale = 0.4 + springProg * 0.6;
  const rotate = (1 - springProg) * (index * 50 - 100);
  const opacity = springProg;

  // 漂浮微动效（组装完成后）
  const float = progress > 0.8 ? floating(frame + index * 10, 0.03, 3) : { x: 0, y: 0, rotate: 0 };

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: isCenter ? 120 : 75,
        height: isCenter ? 120 : 75,
        background: `linear-gradient(135deg, ${color}, ${color}CC)`,
        borderRadius: isCenter ? 20 : 12,
        transform: `translate(-50%, -50%) translate(${x + float.x}px, ${y + float.y}px) scale(${scale}) rotate(${rotate + float.rotate}deg)`,
        opacity,
        boxShadow: `0 0 ${40 * progress}px ${glowColor}, 0 0 ${60 * progress}px ${glowColor}40`,
        border: `1px solid ${glowColor}30`,
      }}
    />
  );
};

export const Opening: React.FC<OpeningProps> = ({
  audioFile,
  narration,
  title,
  subtitle,
  brand,
}) => {
  const frame = useCurrentFrame();
  const progress = useProgress();
  const { width, height } = useVideoConfig();

  // 爆炸粒子（0-30%）
  const explosionProgress = atProgress(progress, 0, 0.3);
  const particles = React.useMemo(() =>
    Array.from({ length: 25 }, (_, i) => ({ id: i }))
  , []);

  // Logo 组装（12%-45%）
  const logoProgress = atProgress(progress, 0.12, 0.45);

  // 标题（40%-58%）
  const titleSpring = springProgress(atProgress(progress, 0.4, 0.58), "snappy");
  const titleOpacity = atProgress(progress, 0.4, 0.55);
  const titleY = (1 - titleSpring) * 40;

  // 副标题（48%-62%）
  const subtitleOpacity = subtitle ? atProgress(progress, 0.48, 0.62) : 0;

  // 装饰线（55%-72%）
  const lineWidth = atProgress(progress, 0.55, 0.72, 0, 400);

  // 角落装饰（60%-78%）
  const cornerOpacity = atProgress(progress, 0.6, 0.78);

  // 字幕
  const captionOpacity = atProgress(progress, ANIMATION_TIMING.caption.start, ANIMATION_TIMING.caption.end);

  // 中心坐标
  const centerX = width / 2;
  const centerY = height * 0.33;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* 增强背景 */}
      <EnhancedBackground brand={brand} variant="aurora" intensity="high" />

      {/* 爆炸粒子 */}
      {particles.map((p) => (
        <ExplosionParticle
          key={p.id}
          index={p.id}
          progress={explosionProgress}
          color={brand.primary}
          centerX={centerX}
          centerY={centerY}
        />
      ))}

      {/* Logo 碎片组装 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "33%",
          transform: "translate(-50%, -50%)",
          width: 350,
          height: 350,
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <LogoFragment
            key={i}
            index={i}
            progress={logoProgress}
            isCenter={i === 4}
            color={i === 4 ? brand.primary : brand.primaryDim}
            glowColor={brand.primary}
            frame={frame}
          />
        ))}
      </div>

      {/* 主标题 */}
      <div
        style={{
          position: "absolute",
          top: "53%",
          left: "50%",
          transform: `translateX(-50%) translateY(${titleY}px)`,
          textAlign: "center",
          opacity: titleOpacity,
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            background: `linear-gradient(135deg, ${brand.primary} 0%, ${brand.secondary} 50%, ${brand.primary} 100%)`,
            backgroundSize: "200% 200%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: 3,
            filter: `drop-shadow(0 0 30px ${brand.primary}60)`,
            animation: progress > 0.6 ? "shimmer 2s ease-in-out infinite" : undefined,
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: 30,
              color: "rgba(255,255,255,0.75)",
              marginTop: 20,
              opacity: subtitleOpacity,
              letterSpacing: 2,
              textShadow: "0 0 20px rgba(0,0,0,0.5)",
            }}
          >
            {subtitle}
          </div>
        )}
      </div>

      {/* 装饰线（带光晕） */}
      <div
        style={{
          position: "absolute",
          bottom: 210,
          left: "50%",
          transform: "translateX(-50%)",
          width: lineWidth,
          height: 4,
          background: `linear-gradient(90deg, transparent, ${brand.primary}, ${brand.secondary}, ${brand.primary}, transparent)`,
          boxShadow: `0 0 20px ${brand.primary}, 0 0 40px ${brand.primary}40`,
          borderRadius: 2,
        }}
      />

      {/* 角落装饰 */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 40,
          width: 70,
          height: 70,
          borderTop: `3px solid ${brand.primary}60`,
          borderLeft: `3px solid ${brand.primary}60`,
          opacity: cornerOpacity,
          filter: `drop-shadow(0 0 10px ${brand.primary}40)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 40,
          right: 40,
          width: 70,
          height: 70,
          borderTop: `3px solid ${brand.primary}60`,
          borderRight: `3px solid ${brand.primary}60`,
          opacity: cornerOpacity,
          filter: `drop-shadow(0 0 10px ${brand.primary}40)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 130,
          left: 40,
          width: 70,
          height: 70,
          borderBottom: `3px solid ${brand.primary}60`,
          borderLeft: `3px solid ${brand.primary}60`,
          opacity: cornerOpacity,
          filter: `drop-shadow(0 0 10px ${brand.primary}40)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 130,
          right: 40,
          width: 70,
          height: 70,
          borderBottom: `3px solid ${brand.primary}60`,
          borderRight: `3px solid ${brand.primary}60`,
          opacity: cornerOpacity,
          filter: `drop-shadow(0 0 10px ${brand.primary}40)`,
        }}
      />

      {/* 字幕（优化样式） */}
      <div
        style={{
          position: "absolute",
          bottom: 55,
          left: "50%",
          transform: "translateX(-50%)",
          background: "linear-gradient(135deg, #FFD700 0%, #FFC107 100%)",
          color: "#000",
          padding: "16px 32px",
          borderRadius: 12,
          fontSize: 27,
          fontWeight: 600,
          textAlign: "center",
          opacity: captionOpacity,
          maxWidth: "88%",
          lineHeight: 1.5,
          boxShadow: "0 4px 20px rgba(255, 215, 0, 0.4), 0 0 40px rgba(255, 215, 0, 0.2)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        {narration}
      </div>

      <Audio src={staticFile(`audio/${audioFile}`)} />
    </AbsoluteFill>
  );
};
