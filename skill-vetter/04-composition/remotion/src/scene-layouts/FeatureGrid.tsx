// FeatureGrid 布局 - 技能雷达图 + 卡片网格 + 光效（百分比时间轴 + 视觉增强版）
import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  staticFile,
} from "remotion";
import { Audio } from "@remotion/media";
import { useProgress, atProgress, staggerInEnhanced, ANIMATION_TIMING } from "../utils/animation";
import { QuickEnhance } from "../components/EnhancedBackground";

interface Feature {
  icon: string;
  title: string;
  desc: string;
}

interface FeatureGridProps {
  audioFile: string;
  narration: string;
  title: string;
  features: Feature[];
  brand: {
    primary: string;
    primaryDim: string;
    secondary: string;
    gradientStart: string;
    gradientEnd: string;
  };
}

// 雷达图组件
const RadarChart: React.FC<{
  skills: { name: string; value: number }[];
  progress: number;
  color: string;
  size?: number;
}> = ({ skills, progress, color, size = 200 }) => {
  const frame = useCurrentFrame();
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 30;
  const angleStep = (2 * Math.PI) / skills.length;

  // 计算每个技能的点位置
  const points = skills.map((skill, i) => {
    const angle = i * angleStep - Math.PI / 2; // 从顶部开始
    const r = radius * (skill.value / 100) * progress;
    return {
      x: centerX + Math.cos(angle) * r,
      y: centerY + Math.sin(angle) * r,
      name: skill.name,
    };
  });

  // 多边形路径
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  // 脉冲效果
  const pulse = Math.sin(frame * 0.1) * 0.1 + 1;

  return (
    <svg width={size} height={size} style={{ transform: `scale(${pulse})` }}>
      {/* 背景网格 */}
      {[20, 40, 60, 80, 100].map((level) => {
        const r = radius * (level / 100);
        const gridPoints = skills.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          return `${centerX + Math.cos(angle) * r},${centerY + Math.sin(angle) * r}`;
        }).join(' ');
        return (
          <polygon
            key={level}
            points={gridPoints}
            fill="none"
            stroke={color}
            strokeWidth={1}
            opacity={0.15}
          />
        );
      })}

      {/* 轴线 */}
      {skills.map((_, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const endX = centerX + Math.cos(angle) * radius;
        const endY = centerY + Math.sin(angle) * radius;
        return (
          <line
            key={i}
            x1={centerX}
            y1={centerY}
            x2={endX}
            y2={endY}
            stroke={color}
            strokeWidth={1}
            opacity={0.3}
          />
        );
      })}

      {/* 技能区域 */}
      <path
        d={pathD}
        fill={color}
        fillOpacity={0.3}
        stroke={color}
        strokeWidth={2}
        style={{
          filter: `drop-shadow(0 0 10px ${color})`,
        }}
      />

      {/* 技能点 */}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={5}
          fill={color}
          style={{
            filter: `drop-shadow(0 0 5px ${color})`,
          }}
        />
      ))}

      {/* 标签 */}
      {skills.map((skill, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const labelRadius = radius + 20;
        const x = centerX + Math.cos(angle) * labelRadius;
        const y = centerY + Math.sin(angle) * labelRadius;
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#fff"
            fontSize={10}
            fontWeight={500}
          >
            {skill.name}
          </text>
        );
      })}
    </svg>
  );
};

// 特性卡片组件（增强版）
const FeatureCard: React.FC<{
  feature: Feature;
  index: number;
  opacity: number;
  scale: number;
  y: number;
  rotate?: number;
  brand: { primary: string };
}> = ({ feature, index, opacity, scale, y, rotate = 0, brand }) => {
  const frame = useCurrentFrame();
  const glow = Math.sin(frame * 0.1 + index) * 0.3 + 0.7;

  return (
    <div
      style={{
        background: `linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))`,
        borderRadius: 16,
        padding: 18,
        display: "flex",
        alignItems: "center",
        gap: 14,
        border: `1px solid ${brand.primary}30`,
        opacity,
        transform: `scale(${scale}) translateY(${y}px) rotate(${rotate}deg)`,
        boxShadow: `0 0 ${15 * glow}px ${brand.primary}20`,
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          fontSize: 36,
          filter: `drop-shadow(0 0 10px ${brand.primary}60)`,
        }}
      >
        {feature.icon}
      </div>
      <div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>
          {feature.title}
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 3 }}>
          {feature.desc}
        </div>
      </div>
    </div>
  );
};

export const FeatureGrid: React.FC<FeatureGridProps> = ({
  audioFile,
  narration,
  title,
  features,
  brand,
}) => {
  const frame = useCurrentFrame();
  const progress = useProgress();

  // 标题
  const titleOpacity = atProgress(progress, 0.03, 0.12);
  const titleScale = atProgress(progress, 0.03, 0.12, 0.9, 1);

  // 雷达图动画
  const radarProgress = atProgress(progress, 0.1, 0.35);

  // 卡片动画（使用增强版）
  const cardAnimations = features.map((_, i) =>
    staggerInEnhanced(progress, i, features.length, {
      start: 0.2,
      end: 0.7,
      stagger: 0.05,
      useSpring: true,
      springType: "snappy",
    })
  );

  // 生成雷达图技能数据
  const radarSkills = React.useMemo(() => {
    return features.slice(0, 6).map((f, i) => ({
      name: f.title.slice(0, 4),
      value: 70 + (i % 4) * 8,
    }));
  }, [features]);

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
            fontSize: 46,
            fontWeight: 900,
            background: `linear-gradient(135deg, ${brand.primary} 0%, ${brand.secondary} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: `drop-shadow(0 0 20px ${brand.primary}40)`,
          }}
        >
          {title}
        </div>
      </div>

      {/* 雷达图区域 */}
      <div
        style={{
          position: "absolute",
          top: "14%",
          left: "50%",
          transform: "translateX(-50%)",
          opacity: atProgress(progress, 0.08, 0.18),
        }}
      >
        <RadarChart
          skills={radarSkills}
          progress={radarProgress}
          color={brand.primary}
          size={220}
        />
      </div>

      {/* 功能卡片网格 */}
      <div
        style={{
          position: "absolute",
          top: "38%",
          left: "50%",
          transform: "translateX(-50%)",
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 14,
          width: "88%",
          maxWidth: 580,
        }}
      >
        {features.map((feature, i) => (
          <FeatureCard
            key={i}
            feature={feature}
            index={i}
            opacity={cardAnimations[i].opacity}
            scale={cardAnimations[i].scale}
            y={cardAnimations[i].y}
            rotate={cardAnimations[i].rotate}
            brand={brand}
          />
        ))}
      </div>

      {/* 字幕 */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: "50%",
          transform: "translateX(-50%)",
          background: "#FFD700",
          color: "#000",
          padding: "14px 28px",
          borderRadius: 10,
          fontSize: 26,
          fontWeight: 600,
          textAlign: "center",
          opacity: captionOpacity,
          maxWidth: "85%",
          lineHeight: 1.4,
        }}
      >
        {narration}
      </div>

      <Audio src={staticFile(`audio/${audioFile}`)} />
    </AbsoluteFill>
  );
};
