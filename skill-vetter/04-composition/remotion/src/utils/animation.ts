// 动画工具函数 - 百分比时间轴
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

/**
 * 获取当前播放进度 (0~1)
 * 根据场景总时长自动计算
 */
export function useProgress(): number {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return frame / Math.max(durationInFrames, 1);
}

/**
 * 根据进度插值
 * @param progress 当前进度 0~1
 * @param start 开始百分比 (如 0.1 表示 10%)
 * @param end 结束百分比 (如 0.25 表示 25%)
 * @param from 起始值
 * @param to 目标值
 */
export function atProgress(
  progress: number,
  start: number,
  end: number,
  from: number = 0,
  to: number = 1
): number {
  return interpolate(progress, [start, end], [from, to], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
}

/**
 * 根据进度淡入
 */
export function fadeIn(progress: number, start: number, end: number): number {
  return atProgress(progress, start, end, 0, 1);
}

/**
 * 根据进度淡出
 */
export function fadeOut(progress: number, start: number, end: number): number {
  return atProgress(progress, start, end, 1, 0);
}

/**
 * 根据进度滑入 (X轴)
 */
export function slideInX(
  progress: number,
  start: number,
  end: number,
  distance: number
): number {
  return atProgress(progress, start, end, distance, 0);
}

/**
 * 根据进度滑入 (Y轴)
 */
export function slideInY(
  progress: number,
  start: number,
  end: number,
  distance: number
): number {
  return atProgress(progress, start, end, distance, 0);
}

/**
 * 根据进度缩放
 */
export function scaleIn(
  progress: number,
  start: number,
  end: number,
  from: number = 0.5
): number {
  return atProgress(progress, start, end, from, 1);
}

/**
 * 依次入场动画（用于列表项）
 * @param progress 当前进度
 * @param index 列表项索引
 * @param total 总数量
 * @param start 整体开始百分比
 * @param end 整体结束百分比
 * @param stagger 每项间隔百分比
 */
export function staggerIn(
  progress: number,
  index: number,
  total: number,
  start: number = 0.2,
  end: number = 0.6,
  stagger: number = 0.05
): { opacity: number; y: number; scale: number } {
  const itemStart = start + index * stagger;
  const itemEnd = itemStart + (end - start) / total;

  return {
    opacity: fadeIn(progress, itemStart, itemEnd),
    y: slideInY(progress, itemStart, itemEnd, 30),
    scale: scaleIn(progress, itemStart, itemEnd, 0.9),
  };
}

/**
 * 标准动画时机配置
 */
export const ANIMATION_TIMING = {
  // 字幕
  caption: { start: 0.05, end: 0.12 },

  // 标题区
  title: { start: 0.1, end: 0.22 },
  subtitle: { start: 0.2, end: 0.32 },

  // 内容区
  contentStart: 0.25,
  contentEnd: 0.75,
  contentStagger: 0.06,  // 每项间隔

  // 装饰/收尾
  decoration: { start: 0.8, end: 0.95 },
} as const;

/**
 * Spring 动画配置
 */
export const SPRING_CONFIGS = {
  smooth: { damping: 200, stiffness: 100, mass: 1 },
  snappy: { damping: 20, stiffness: 200, mass: 0.8 },
  bouncy: { damping: 12, stiffness: 180, mass: 0.6 },
  heavy: { damping: 15, stiffness: 80, mass: 2 },
  gentle: { damping: 25, stiffness: 120, mass: 1.2 },
} as const;

/**
 * 模拟 spring 动画（简化版，用于 interpolate）
 * 返回一个 0-1 的值，模拟 spring 的缓动效果
 */
export function springProgress(
  progress: number,
  config: keyof typeof SPRING_CONFIGS = "smooth"
): number {
  const { damping, stiffness } = SPRING_CONFIGS[config];
  const dampingRatio = damping / (2 * Math.sqrt(stiffness));

  // 简化的 spring 曲线
  if (dampingRatio >= 1) {
    // 过阻尼 - 无振荡
    return 1 - Math.exp(-damping * progress * 0.1);
  } else {
    // 欠阻尼 - 有振荡
    const omega = Math.sqrt(stiffness) * 0.1;
    return 1 - Math.exp(-damping * progress * 0.05) * Math.cos(omega * progress);
  }
}

/**
 * 漂浮动画（微动效）
 * @param frame 当前帧
 * @param speed 速度
 * @param amplitude 振幅（像素）
 */
export function floating(
  frame: number,
  speed: number = 0.05,
  amplitude: number = 10
): { x: number; y: number; rotate: number } {
  return {
    x: Math.sin(frame * speed) * amplitude,
    y: Math.cos(frame * speed * 0.7) * amplitude * 0.8,
    rotate: Math.sin(frame * speed * 0.5) * 2,
  };
}

/**
 * 脉冲动画
 * @param frame 当前帧
 * @param speed 速度
 * @param minScale 最小缩放
 * @param maxScale 最大缩放
 */
export function pulse(
  frame: number,
  speed: number = 0.1,
  minScale: number = 0.95,
  maxScale: number = 1.05
): number {
  return minScale + (Math.sin(frame * speed) * 0.5 + 0.5) * (maxScale - minScale);
}

/**
 * 呼吸动画（透明度）
 */
export function breathe(
  frame: number,
  speed: number = 0.08,
  minOpacity: number = 0.6,
  maxOpacity: number = 1
): number {
  return minOpacity + (Math.sin(frame * speed) * 0.5 + 0.5) * (maxOpacity - minOpacity);
}

/**
 * 弹跳入场
 */
export function bounceIn(
  progress: number,
  start: number = 0,
  end: number = 1
): { scale: number; y: number } {
  const t = atProgress(progress, start, end);
  const scale = t < 0.5
    ? 0.5 + t * t * 2
    : 1 - Math.pow(1 - t, 2) * 0.3;
  const y = (1 - t) * 30;

  return { scale, y };
}

/**
 * 交错动画增强版
 */
export function staggerInEnhanced(
  progress: number,
  index: number,
  total: number,
  config?: {
    start?: number;
    end?: number;
    stagger?: number;
    useSpring?: boolean;
    springType?: keyof typeof SPRING_CONFIGS;
  }
): { opacity: number; y: number; scale: number; rotate: number } {
  const {
    start = 0.2,
    end = 0.6,
    stagger = 0.04,
    useSpring = true,
    springType = "snappy",
  } = config || {};

  const itemStart = start + index * stagger;
  const itemEnd = itemStart + (end - start) / Math.min(total, 5);
  const t = atProgress(progress, itemStart, itemEnd);

  const animProgress = useSpring ? springProgress(t, springType) : t;

  return {
    opacity: animProgress,
    y: (1 - animProgress) * 40,
    scale: 0.8 + animProgress * 0.2,
    rotate: (1 - animProgress) * (index % 2 === 0 ? 5 : -5),
  };
}
