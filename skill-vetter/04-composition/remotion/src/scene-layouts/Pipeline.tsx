// Pipeline 布局 - 管道动画 + 数据流动 + 节点脉冲（百分比时间轴 + 视觉增强版）
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

interface PipelineProps {
  audioFile: string;
  narration: string;
  title: string;
  subtitle?: string;
  steps: string[];
  techStack?: string[];
  brand: {
    primary: string;
    primaryDim: string;
    secondary: string;
    gradientStart: string;
    gradientEnd: string;
  };
}

// 数据粒子组件
const DataParticle: React.FC<{
  startX: number;
  endX: number;
  delay: number;
  color: string;
  size?: number;
}> = ({ startX, endX, delay, color, size = 6 }) => {
  const frame = useCurrentFrame();
  const progress = ((frame - delay) % 60) / 60;
  const x = startX + (endX - startX) * progress;
  const opacity = progress < 0.1 ? progress * 10 : progress > 0.9 ? (1 - progress) * 10 : 1;

  if (frame < delay) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: "50%",
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
        opacity: opacity * 0.8,
        transform: "translateY(-50%)",
      }}
    />
  );
};

// 管道节点组件
const PipelineNode: React.FC<{
  label: string;
  index: number;
  opacity: number;
  scale: number;
  isActive: boolean;
  brand: { primary: string; secondary: string };
}> = ({ label, index, opacity, scale, isActive, brand }) => {
  const frame = useCurrentFrame();
  const pulseScale = isActive ? 1 + Math.sin(frame * 0.2) * 0.1 : 1;
  const glowOpacity = isActive ? 0.8 : 0.3;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity,
        transform: `scale(${scale * pulseScale})`,
        transition: "transform 0.3s ease",
      }}
    >
      {/* 节点圆圈 */}
      <div
        style={{
          width: 70,
          height: 70,
          borderRadius: "50%",
          background: isActive
            ? `linear-gradient(135deg, ${brand.primary}, ${brand.secondary})`
            : "rgba(255,255,255,0.1)",
          border: `2px solid ${brand.primary}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: isActive ? `0 0 30px ${brand.primary}` : `0 0 10px ${brand.primary}40`,
          position: "relative",
        }}
      >
        <span style={{ fontSize: 28, fontWeight: 700, color: "#fff" }}>
          {index + 1}
        </span>
        {/* 脉冲光环 */}
        {isActive && (
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              border: `2px solid ${brand.primary}`,
              opacity: glowOpacity,
              animation: "pulse 1s ease-out infinite",
            }}
          />
        )}
      </div>
      {/* 标签 */}
      <div
        style={{
          marginTop: 12,
          fontSize: 16,
          fontWeight: 600,
          color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
          textAlign: "center",
          maxWidth: 100,
        }}
      >
        {label}
      </div>
    </div>
  );
};

// 管道连接线组件
const PipelineConnector: React.FC<{
  opacity: number;
  hasFlow: boolean;
  brand: { primary: string };
}> = ({ opacity, hasFlow, brand }) => {
  const frame = useCurrentFrame();
  const dashOffset = hasFlow ? frame * 2 : 0;

  return (
    <div
      style={{
        flex: 1,
        height: 3,
        background: "rgba(255,255,255,0.1)",
        position: "relative",
        margin: "0 8px",
        marginBottom: 40,
        opacity,
      }}
    >
      {/* 虚线流动效果 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "100%",
          background: `repeating-linear-gradient(
            90deg,
            ${brand.primary} 0px,
            ${brand.primary} 10px,
            transparent 10px,
            transparent 20px
          )`,
          backgroundPosition: `${dashOffset}px 0`,
          opacity: hasFlow ? 1 : 0.3,
        }}
      />
      {/* 发光效果 */}
      {hasFlow && (
        <div
          style={{
            position: "absolute",
            top: -2,
            left: 0,
            right: 0,
            height: 7,
            background: `linear-gradient(90deg, transparent, ${brand.primary}40, transparent)`,
            filter: "blur(3px)",
          }}
        />
      )}
    </div>
  );
};

export const Pipeline: React.FC<PipelineProps> = ({
  audioFile,
  narration,
  title,
  subtitle,
  steps,
  techStack,
  brand,
}) => {
  const frame = useCurrentFrame();
  const progress = useProgress();

  // 标题（spring 动画）
  const titleOpacity = atProgress(progress, 0.03, 0.12);
  const titleSpring = springProgress(atProgress(progress, 0.03, 0.12), "snappy");
  const titleScale = 0.9 + titleSpring * 0.1;

  // 管道节点动画（增强版）
  const nodeAnimations = steps.map((_, i) =>
    staggerInEnhanced(progress, i, steps.length, {
      start: 0.1,
      end: 0.5,
      stagger: 0.08,
      useSpring: true,
      springType: "bouncy",
    })
  );

  // 当前激活的节点（循环）
  const activeNodeIndex = Math.floor((progress - 0.3) * steps.length * 2) % steps.length;
  const showFlow = progress > 0.35;

  // 连接线动画
  const connectorOpacity = atProgress(progress, 0.2, 0.4);

  // 数据粒子
  const particles = React.useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      delay: i * 20,
    }));
  }, []);

  // 技术栈标签（增强动画）
  const techAnimations = (techStack || []).map((_, i) =>
    staggerInEnhanced(progress, i, techStack?.length || 1, {
      start: 0.55,
      end: 0.75,
      stagger: 0.05,
      useSpring: true,
      springType: "snappy",
    })
  );

  // 字幕
  const captionOpacity = atProgress(progress, ANIMATION_TIMING.caption.start, ANIMATION_TIMING.caption.end);

  // 计算节点位置
  const nodeWidth = 70;
  const gap = 100 / (steps.length + 1);

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
            fontSize: 52,
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
          <div
            style={{
              fontSize: 22,
              color: "rgba(255,255,255,0.6)",
              marginTop: 8,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>

      {/* 管道区域 */}
      <div
        style={{
          position: "absolute",
          top: "35%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "90%",
          maxWidth: 650,
        }}
      >
        {/* 数据粒子 */}
        {showFlow && particles.map((p) => (
          <DataParticle
            key={p.id}
            startX={5}
            endX={95}
            delay={p.delay}
            color={brand.primary}
          />
        ))}

        {/* 节点和连接线 */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          {steps.map((step, i) => (
            <React.Fragment key={i}>
              <PipelineNode
                label={step}
                index={i}
                opacity={nodeAnimations[i].opacity}
                scale={nodeAnimations[i].scale}
                isActive={showFlow && activeNodeIndex === i}
                brand={brand}
              />
              {i < steps.length - 1 && (
                <PipelineConnector
                  opacity={connectorOpacity}
                  hasFlow={showFlow}
                  brand={brand}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 技术栈标签 */}
      {techStack && techStack.length > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: "25%",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: "80%",
          }}
        >
          {techStack.map((tech, i) => (
            <div
              key={i}
              style={{
                padding: "10px 24px",
                background: "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
                borderRadius: 22,
                fontSize: 18,
                color: brand.primary,
                fontWeight: 600,
                border: `1px solid ${brand.primary}50`,
                opacity: techAnimations[i].opacity,
                transform: `translateY(${techAnimations[i].y}px) scale(${techAnimations[i].scale})`,
                boxShadow: `0 0 15px ${brand.primary}30`,
                backdropFilter: "blur(10px)",
              }}
            >
              {tech}
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
