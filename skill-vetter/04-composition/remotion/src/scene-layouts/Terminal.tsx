// Terminal 布局 - 扫描线 + 代码雨 + 打字机效果（百分比时间轴 + 视觉增强版）
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

interface TerminalProps {
  audioFile: string;
  narration: string;
  command: string;
  outputLines: string[];
  brand: {
    primary: string;
    primaryDim: string;
    secondary: string;
    gradientStart: string;
    gradientEnd: string;
  };
}

// 代码雨组件
const CodeRain: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();
  const columns = 20;
  const rows = 12;

  const chars = React.useMemo(() => {
    return Array.from({ length: columns }, (_, col) => ({
      col,
      speed: 0.5 + Math.random() * 1.5,
      offset: Math.random() * 100,
    }));
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity,
        overflow: "hidden",
        fontFamily: "monospace",
      }}
    >
      {chars.map((char) => (
        <div
          key={char.col}
          style={{
            position: "absolute",
            left: `${(char.col / columns) * 100}%`,
            top: `${(((frame * char.speed + char.offset) % 120) / rows) * 100}%`,
            fontSize: 14,
            color: `rgba(0, 255, 100, ${0.1 + Math.random() * 0.2})`,
            textShadow: "0 0 5px rgba(0,255,100,0.5)",
            whiteSpace: "nowrap",
          }}
        >
          {Array.from({ length: 8 }, () =>
            String.fromCharCode(0x30 + Math.floor(Math.random() * 2))
          ).join("")}
        </div>
      ))}
    </div>
  );
};

// 扫描线组件
const ScanLine: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();
  const y = (frame * 3) % 110; // 0-110% 循环

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: `${y}%`,
        height: 2,
        background: `linear-gradient(90deg, transparent, rgba(0,255,100,0.6), transparent)`,
        opacity,
        boxShadow: "0 0 10px rgba(0,255,100,0.8)",
      }}
    />
  );
};

export const Terminal: React.FC<TerminalProps> = ({
  audioFile,
  narration,
  command,
  outputLines,
  brand,
}) => {
  const frame = useCurrentFrame();
  const progress = useProgress();

  // 代码雨背景
  const codeRainOpacity = atProgress(progress, 0.02, 0.12) * 0.5;

  // 扫描线
  const scanLineOpacity = atProgress(progress, 0.05, 0.15) * 0.8;

  // 终端窗口入场（spring 动画）
  const terminalSpring = springProgress(atProgress(progress, 0.08, 0.22), "smooth");
  const terminalScale = 0.9 + terminalSpring * 0.1;
  const terminalOpacity = atProgress(progress, 0.08, 0.18);

  // 打字机效果（15%~55%）
  const commandProgress = atProgress(progress, 0.18, 0.55, 0, 1);
  const displayedChars = Math.floor(commandProgress * command.length);
  const displayedCommand = command.slice(0, displayedChars);

  // 光标闪烁
  const cursorVisible = Math.floor(frame / 12) % 2 === 0;

  // 输出行依次出现（55%~88%）- 增强动画
  const outputAnimations = outputLines.map((_, i) =>
    staggerInEnhanced(progress, i, outputLines.length, {
      start: 0.55,
      end: 0.88,
      stagger: 0.06,
      useSpring: true,
      springType: "snappy",
    })
  );

  // 提示文字
  const hintOpacity = atProgress(progress, 0.1, 0.18);

  // 底部进度条
  const progressBarOpacity = atProgress(progress, 0.6, 0.7);
  const progressBarWidth = atProgress(progress, 0.7, 0.95, 0, 100);

  // 字幕
  const captionOpacity = atProgress(progress, ANIMATION_TIMING.caption.start, ANIMATION_TIMING.caption.end);

  return (
    <AbsoluteFill
      style={{
        background: "#0a0a0a",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      }}
    >
      {/* 代码雨背景 */}
      <CodeRain opacity={codeRainOpacity} />

      {/* 扫描线 */}
      <ScanLine opacity={scanLineOpacity} />

      {/* 网格背景 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(rgba(0,255,100,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,100,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "30px 30px",
          opacity: 0.5,
        }}
      />

      {/* 终端窗口 */}
      <div
        style={{
          position: "absolute",
          top: "12%",
          left: "50%",
          transform: `translateX(-50%) scale(${terminalScale})`,
          width: "88%",
          maxWidth: 680,
          background: "#0d1117",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: `
            0 0 0 1px rgba(0,255,100,0.2),
            0 20px 60px rgba(0,0,0,0.8),
            0 0 40px rgba(0,255,100,0.1)
          `,
          border: "1px solid rgba(0,255,100,0.3)",
          opacity: terminalOpacity,
        }}
      >
        {/* 终端标题栏 */}
        <div
          style={{
            background: "#161b22",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            borderBottom: "1px solid rgba(0,255,100,0.2)",
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f56" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#27ca40" }} />
          <span style={{ marginLeft: 16, color: "#00ff64", fontSize: 13, fontWeight: 500 }}>
            terminal@openclaw:~
          </span>
        </div>

        {/* 终端内容 */}
        <div style={{ padding: 24, minHeight: 320, background: "rgba(0,0,0,0.3)" }}>
          {/* 命令行 */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
            <span style={{ color: "#00ff64", fontSize: 18, marginRight: 10, fontWeight: 600 }}>
              $
            </span>
            <span style={{ color: "#e0e0e0", fontSize: 17, letterSpacing: 0.5 }}>
              {displayedCommand}
              <span
                style={{
                  opacity: cursorVisible ? 1 : 0,
                  color: "#00ff64",
                  marginLeft: 2,
                  fontWeight: 600,
                }}
              >
                ▊
              </span>
            </span>
          </div>

          {/* 输出结果 */}
          {outputLines.map((line, i) => (
            <div
              key={i}
              style={{
                color: i === 0 ? "#00ff64" : "#8b949e",
                fontSize: 15,
                marginBottom: 10,
                opacity: outputAnimations[i].opacity,
                transform: `translateX(${outputAnimations[i].y}px) translateY(${outputAnimations[i].y}px) scale(${outputAnimations[i].scale})`,
                paddingLeft: i > 0 ? 20 : 0,
                letterSpacing: 0.3,
              }}
            >
              {i === 0 && "✓ "}
              {line}
            </div>
          ))}
        </div>
      </div>

      {/* 提示文字 */}
      <div
        style={{
          position: "absolute",
          top: "5%",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 26,
          fontWeight: 700,
          color: "#00ff64",
          opacity: hintOpacity,
          textShadow: "0 0 10px rgba(0,255,100,0.5)",
          letterSpacing: 2,
        }}
      >
        {"< 命令演示 />"}
      </div>

      {/* 底部进度条 */}
      <div
        style={{
          position: "absolute",
          bottom: "22%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          maxWidth: 400,
          opacity: progressBarOpacity,
        }}
      >
        <div
          style={{
            height: 4,
            background: "rgba(0,255,100,0.1)",
            borderRadius: 2,
            position: "relative",
          }}
        >
          <div
            style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: `${progressBarWidth}%`,
            background: "#00ff64",
            borderRadius: 2,
            boxShadow: "0 0 10px rgba(0,255,100,0.8)",
          }}
          />
        </div>
        <div
          style={{
            marginTop: 8,
            textAlign: "center",
            color: "#00ff64",
            fontSize: 12,
            letterSpacing: 1,
          }}
        >
          执行进度 {Math.round(progressBarWidth)}%
        </div>
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
