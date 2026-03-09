// Steps 布局 - 垂直时间线 + 节点脉冲 + 连线动画（百分比时间轴 + 视觉增强版）
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

interface Step {
  num: string;
  title: string;
  desc: string;
  icon: string;
}

interface StepsProps {
  audioFile: string;
  narration: string;
  title: string;
  subtitle?: string;
  steps: Step[];
  brand: {
    primary: string;
    primaryDim: string;
    secondary: string;
    gradientStart: string;
    gradientEnd: string;
  };
}

// 时间线节点组件
const TimelineNode: React.FC<{
  step: Step;
  index: number;
  opacity: number;
  scale: number;
  isActive: boolean;
  isCompleted: boolean;
  brand: { primary: string; secondary: string };
}> = ({ step, index, opacity, scale, isActive, isCompleted, brand }) => {
  const frame = useCurrentFrame();
  const pulseScale = isActive ? 1 + Math.sin(frame * 0.2) * 0.15 : 1;
  const glowIntensity = isActive ? 1 : isCompleted ? 0.6 : 0.2;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 20,
        opacity,
        transform: `scale(${scale * pulseScale})`,
        marginBottom: 8,
      }}
    >
      {/* 时间线节点 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        {/* 节点圆圈 */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: isCompleted
              ? `linear-gradient(135deg, ${brand.primary}, ${brand.secondary})`
              : isActive
              ? brand.primary
              : "rgba(255,255,255,0.1)",
            border: `3px solid ${isCompleted || isActive ? brand.primary : "rgba(255,255,255,0.2)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            boxShadow: isActive
              ? `0 0 25px ${brand.primary}, 0 0 50px ${brand.primary}40`
              : isCompleted
              ? `0 0 15px ${brand.primary}60`
              : "none",
          }}
        >
          {/* 图标 */}
          <span style={{ fontSize: 26 }}>{step.icon}</span>

          {/* 脉冲环 */}
          {isActive && (
            <>
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  border: `2px solid ${brand.primary}`,
                  opacity: 0.5,
                  animation: "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  width: "150%",
                  height: "150%",
                  borderRadius: "50%",
                  border: `1px solid ${brand.primary}40`,
                  opacity: 0.3,
                }}
              />
            </>
          )}
        </div>
      </div>

      {/* 内容卡片 */}
      <div
        style={{
          flex: 1,
          padding: "16px 20px",
          background: isActive
            ? `linear-gradient(135deg, ${brand.primary}15, ${brand.primary}05)`
            : "rgba(255,255,255,0.05)",
          borderRadius: 14,
          border: `1px solid ${isActive ? `${brand.primary}40` : "rgba(255,255,255,0.1)"}`,
          boxShadow: isActive ? `0 0 20px ${brand.primary}20` : "none",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>
            {step.title}
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 900,
              color: brand.primary,
              opacity: 0.4,
            }}
          >
            {step.num}
          </div>
        </div>
        <div style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", marginTop: 6 }}>
          {step.desc}
        </div>
      </div>
    </div>
  );
};

// 时间线连接器组件
const TimelineConnector: React.FC<{
  index: number;
  total: number;
  progress: number;
  brand: { primary: string };
}> = ({ index, total, progress, brand }) => {
  const frame = useCurrentFrame();
  const height = 40;
  const isFilled = progress > (index + 1) / total;

  // 流动动画
  const flowOffset = frame * 2;

  return (
    <div
      style={{
        width: 56,
        display: "flex",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 4,
          height,
          background: "rgba(255,255,255,0.1)",
          borderRadius: 2,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 填充部分 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: isFilled ? "100%" : "0%",
            background: `linear-gradient(180deg, ${brand.primary}, ${brand.primary}80)`,
            borderRadius: 2,
            transition: "height 0.3s ease",
          }}
        />

        {/* 流动光点 */}
        {isFilled && (
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: 20,
              background: `linear-gradient(180deg, transparent, ${brand.primary}, transparent)`,
              top: `${flowOffset % height - 20}px`,
              opacity: 0.8,
            }}
          />
        )}
      </div>
    </div>
  );
};

export const Steps: React.FC<StepsProps> = ({
  audioFile,
  narration,
  title,
  subtitle,
  steps,
  brand,
}) => {
  const frame = useCurrentFrame();
  const progress = useProgress();

  // 当前激活的步骤
  const activeStep = Math.floor(progress * (steps.length + 1)) - 1;

  // 连接器进度
  const connectorProgress = atProgress(progress, 0.2, 0.75);

  // 标题
  const titleOpacity = atProgress(progress, 0.03, 0.12);

  // 进度条
  const progressWidth = atProgress(progress, 0.08, 0.8, 0, 100);

  // 步骤动画（增强版）
  const stepAnimations = steps.map((_, i) =>
    staggerInEnhanced(progress, i, steps.length, {
      start: 0.12,
      end: 0.7,
      stagger: 0.1,
      useSpring: true,
      springType: "snappy",
    })
  );

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
            fontSize: 44,
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
          <div
            style={{
              fontSize: 20,
              color: "rgba(255,255,255,0.6)",
              marginTop: 8,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>

      {/* 进度条 */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "65%",
          maxWidth: 380,
        }}
      >
        <div
          style={{
            height: 6,
            background: "rgba(255,255,255,0.1)",
            borderRadius: 3,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: `${progressWidth}%`,
              background: `linear-gradient(90deg, ${brand.primary}, ${brand.secondary})`,
              borderRadius: 3,
              boxShadow: `0 0 15px ${brand.primary}60`,
            }}
          />
        </div>
        <div
          style={{
            marginTop: 10,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          <span>开始</span>
          <span>{steps.length} 步完成</span>
        </div>
      </div>

      {/* 时间线区域 */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "88%",
          maxWidth: 500,
        }}
      >
        {steps.map((step, i) => (
          <React.Fragment key={i}>
            <TimelineNode
              step={step}
              index={i}
              opacity={stepAnimations[i].opacity}
              scale={stepAnimations[i].scale}
              isActive={activeStep === i}
              isCompleted={activeStep > i}
              brand={brand}
            />
            {i < steps.length - 1 && (
              <div style={{ display: "flex", justifyContent: "flex-start", marginLeft: 0 }}>
                <TimelineConnector
                  index={i}
                  total={steps.length}
                  progress={connectorProgress}
                  brand={brand}
                />
              </div>
            )}
          </React.Fragment>
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
