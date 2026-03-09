// Remotion 竖版视频设计系统
// 基于 whisper 项目，支持品牌色配置

export interface BrandConfig {
  name: string;
  primary: string;
  primaryDim: string;
  secondary: string;
  accent: string;
  gradientStart: string;
  gradientEnd: string;
}

// 默认品牌色（基于 whisper）
export const DEFAULT_BRAND: BrandConfig = {
  name: "default",
  primary: "#00ff88",      // 主色
  primaryDim: "rgba(0, 255, 136, 0.3)",
  secondary: "#00d4ff",    // 次色
  accent: "#7fff00",       // 强调色
  gradientStart: "#0f0c29",
  gradientEnd: "#24243e",
};

// 品牌色配置（根据 Skill 类型自动选择）
export const BRAND_THEMES: Record<string, BrandConfig> = {
  whisper: {
    name: "whisper",
    primary: "#00ff88",
    primaryDim: "rgba(0, 255, 136, 0.3)",
    secondary: "#00d4ff",
    accent: "#7fff00",
    gradientStart: "#0f0c29",
    gradientEnd: "#24243e",
  },
  n8n: {
    name: "n8n",
    primary: "#ff6d5a",      // n8n 橙红色
    primaryDim: "rgba(255, 109, 90, 0.3)",
    secondary: "#ff9f1c",
    accent: "#ea4c89",
    gradientStart: "#1a1a2e",
    gradientEnd: "#16213e",
  },
  openclaw: {
    name: "openclaw",
    primary: "#ff6b35",      // 龙虾橙
    primaryDim: "rgba(255, 107, 53, 0.3)",
    secondary: "#f7931e",
    accent: "#ffd700",
    gradientStart: "#1e1e2f",
    gradientEnd: "#2d2d44",
  },
  tech: {
    name: "tech",
    primary: "#3b82f6",      // 科技蓝
    primaryDim: "rgba(59, 130, 246, 0.3)",
    secondary: "#8b5cf6",
    accent: "#06b6d4",
    gradientStart: "#0f172a",
    gradientEnd: "#1e293b",
  },
};

// 获取品牌配置
export function getBrandConfig(skillName: string): BrandConfig {
  // 根据 skill 名称自动选择主题
  if (skillName.includes("n8n")) return BRAND_THEMES.n8n;
  if (skillName.includes("whisper")) return BRAND_THEMES.whisper;
  if (skillName.includes("openclaw")) return BRAND_THEMES.openclaw;
  return BRAND_THEMES.tech;  // 默认用科技蓝
}

// 完整设计系统
export function createDesign(brand: BrandConfig) {
  return {
    fonts: {
      sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'SF Mono', 'Fira Code', 'Consolas', 'Monaco', monospace",
      notoSans: "'Noto Sans SC', sans-serif", // 中文支持
    },
    type: {
      display: 100,
      h1: 80,
      h2: 56,
      h3: 48,
      body: 42,
      small: 32,
      code: 36,
    },
    colors: {
      primary: brand.primary,
      primaryDim: brand.primaryDim,
      secondary: brand.secondary,
      accent: brand.accent,
      dark: "#0a0a0c",
      dark2: brand.gradientStart,
      dark3: "#302b63",
      dark4: brand.gradientEnd,
      surface: "#121216",
      text: "#ffffff",
      textSecondary: "rgba(255,255,255,0.7)",
      textTertiary: "rgba(255,255,255,0.5)",
      border: "rgba(255,255,255,0.08)",
      success: "#10b981",
      warning: "#f59e0b",
      danger: "#ff4757",
      dangerLight: "#ff6b81",
      highlight: "#ffcb6b",
    },
    spring: {
      smooth: { damping: 200 },
      snappy: { damping: 20, stiffness: 200 },
      bouncy: { damping: 8 },
      heavy: { damping: 15, stiffness: 80, mass: 2 },
    },
    easing: {
      easeOutExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      easeOutBack: (t: number) => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
      },
    },
    gradients: {
      main: `linear-gradient(135deg, ${brand.gradientStart} 0%, ${brand.gradientEnd} 100%)`,
      text: `linear-gradient(135deg, ${brand.primary} 0%, ${brand.secondary} 100%)`,
      glow: `radial-gradient(circle, ${brand.primaryDim} 0%, transparent 60%)`,
    },
  };
}

// 场景时长配置
export const SCENE_DURATION = 180; // 6秒 = 180帧（仅作为默认值）
export const FPS = 30;

// 动态时长工具函数
export function loadAudioDurations(jsonPath: string): Record<string, number> {
  // 在实际使用时，这个值会被替换为实际的 JSON 数据
  // 因为 Remotion 不支持运行时读取文件，需要在构建时注入
  return {};
}

// 根据音频时长计算帧数
export function getFramesFromDuration(durationInSeconds: number): number {
  return Math.ceil(durationInSeconds * FPS);
}

// 计算累计帧数（用于 Sequence from 属性）
export function calculateSequenceOffsets(durations: number[]): number[] {
  const offsets: number[] = [];
  let cumulative = 0;
  for (const duration of durations) {
    offsets.push(cumulative);
    cumulative += getFramesFromDuration(duration);
  }
  return offsets;
}

// 画布尺寸配置（竖版短视频 9:16）
export const CANVAS_SIZE = {
  width: 1080,   // 1080x1920 竖版
  height: 1920,
  fps: 30,
};

// 导出默认设计
export const DESIGN = createDesign(DEFAULT_BRAND);
