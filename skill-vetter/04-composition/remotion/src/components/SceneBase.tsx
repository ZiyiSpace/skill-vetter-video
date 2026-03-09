import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  Audio,
  interpolate,
} from 'remotion';
import {staticFile} from 'remotion';
import {
  COLORS,
  TYPOGRAPHY,
  CANVAS_SIZE,
  EASING,
  DURATION,
} from '../design';

// Scene 组件基础 Props
export interface SceneBaseProps {
  sceneNumber: string;
  audioFile: string;
  children: React.ReactNode;
}

// 场景基类组件 - 提供通用功能
export const SceneBase: React.FC<SceneBaseProps> = ({
  sceneNumber,
  audioFile,
  children,
}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  // 入场动画
  const opacity = interpolate(
    frame,
    [0, DURATION.normal],
    [0, 1],
    {extrapolateRight: 'clamp'}
  );

  // 缩放入场
  const scale = interpolate(
    frame,
    [0, DURATION.normal],
    [0.9, 1],
    {extrapolateRight: 'clamp'}
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        fontFamily: TYPOGRAPHY.fontFamily,
      }}
    >
      {/* 音频 */}
      <Audio src={staticFile(`audio/${audioFile}`)} />

      {/* 内容容器 */}
      <AbsoluteFill
        style={{
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </AbsoluteFill>

      {/* 场景编号（可选，调试用） */}
      {/* <div
        style={{
          position: 'absolute',
          bottom: 40,
          right: 40,
          fontSize: TYPOGRAPHY.labelSm,
          color: COLORS.textSecondary,
          opacity: 0.5,
        }}
      >
        Scene {sceneNumber}
      </div> */}
    </AbsoluteFill>
  );
};

// 文字淡入动画组件
export const FadeInText: React.FC<{
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}> = ({children, delay = 0, duration = DURATION.normal}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [delay, delay + duration],
    [0, 1],
    {extrapolateRight: 'clamp'}
  );

  return (
    <div style={{opacity}}>
      {children}
    </div>
  );
};

// 列表项依次弹出组件
export const StaggeredList: React.FC<{
  items: string[];
  delayPerItem?: number;
  textStyle?: React.CSSProperties;
}> = ({items, delayPerItem = 10, textStyle}) => {
  const frame = useCurrentFrame();

  return (
    <div>
      {items.map((item, index) => {
        const startFrame = index * delayPerItem;
        const opacity = interpolate(
          frame,
          [startFrame, startFrame + DURATION.fast],
          [0, 1],
          {extrapolateRight: 'clamp'}
        );
        const translateY = interpolate(
          frame,
          [startFrame, startFrame + DURATION.fast],
          [20, 0],
          {extrapolateRight: 'clamp'}
        );

        return (
          <div
            key={index}
            style={{
              opacity,
              transform: `translateY(${translateY}px)`,
              marginBottom: 16,
              ...textStyle,
            }}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
};

// 数字强调动画组件
export const NumberHighlight: React.FC<{
  number: string | number;
  label?: string;
}> = ({number, label}) => {
  const frame = useCurrentFrame();

  // 数字放大动画
  const scale = interpolate(
    frame,
    [0, 15, 30],
    [0.5, 1.3, 1],
    {extrapolateRight: 'clamp'}
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          fontSize: TYPOGRAPHY.titleXl,
          fontWeight: 'bold',
          color: COLORS.accent,
          transform: `scale(${scale})`,
        }}
      >
        {number}
      </div>
      {label && (
        <div
          style={{
            fontSize: TYPOGRAPHY.bodyLg,
            color: COLORS.textSecondary,
            marginTop: 16,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};

// 渐变背景组件
export const GradientBackground: React.FC<{
  colors?: [string, string];
}> = ({colors = [COLORS.gradientStart, COLORS.gradientEnd]}) => {
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${colors[0]} 0%, ${colors[1]} 100%)`,
      }}
    />
  );
};
