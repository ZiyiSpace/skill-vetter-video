// 布局智能匹配器 - 根据场景内容关键词自动选择布局
import { LayoutType } from "./scene-layouts";

// 关键词映射规则
const LAYOUT_KEYWORDS: Record<LayoutType, {
  keywords: string[];
  priority: number;
}> = {
  CTA: {
    keywords: ["点赞", "收藏", "关注", "明天见", "每天一个"],
    priority: 100, // 最高优先级
  },
  Opening: {
    keywords: ["开场", "每天一个", "今天是", "今天来"],
    priority: 90,
  },
  PainPoint: {
    keywords: ["痛点", "困境", "问题", "挑战", "难点", "麻烦"],
    priority: 80,
  },
  Pipeline: {
    keywords: ["流水线", "步骤", "流程", "架构", "五步", "三步"],
    priority: 70,
  },
  Terminal: {
    keywords: ["命令", "/digest", "演示", "执行", "运行", "输入"],
    priority: 70,
  },
  Comparison: {
    keywords: ["对比", "vs", "VS", "提升", "倍", "效率", "从", "到"],
    priority: 70,
  },
  FeatureGrid: {
    keywords: ["特性", "功能", "支持", "特性", "能力"],
    priority: 60,
  },
  IconMatrix: {
    keywords: ["场景", "适用", "人群", "用户", "团队"],
    priority: 60,
  },
  VSTable: {
    keywords: ["优势", "传统", "对比", "比较"],
    priority: 60,
  },
  Steps: {
    keywords: ["配置", "三步", "快速上手", "安装", "设置", "获取"],
    priority: 60,
  },
};

/**
 * 根据场景内容匹配最佳布局
 * @param sceneIndex 场景索引（0-based）
 * @param totalScenes 总场景数
 * @param title 场景标题
 * @param subtitle 场景副标题
 * @param narration 口播文案
 * @returns 匹配的布局类型
 */
export function matchLayout(
  sceneIndex: number,
  totalScenes: number,
  title: string,
  subtitle: string = "",
  narration: string = ""
): LayoutType {
  // 规则1：最后一个场景强制 CTA
  if (sceneIndex === totalScenes - 1) {
    return "CTA";
  }

  // 规则2：第一个场景优先 Opening
  if (sceneIndex === 0) {
    const content = `${title} ${subtitle} ${narration}`.toLowerCase();
    // 检查是否有其他高优先级关键词
    for (const [layout, config] of Object.entries(LAYOUT_KEYWORDS)) {
      if (layout === "Opening" || layout === "CTA") continue;
      if (config.keywords.some((kw) => content.includes(kw.toLowerCase()))) {
        if (config.priority >= 80) {
          return layout as LayoutType;
        }
      }
    }
    return "Opening";
  }

  // 规则3：关键词匹配
  const content = `${title} ${subtitle} ${narration}`.toLowerCase();
  let bestMatch: LayoutType = "FeatureGrid"; // 默认
  let bestScore = 0;

  for (const [layout, config] of Object.entries(LAYOUT_KEYWORDS)) {
    if (layout === "Opening" || layout === "CTA") continue;

    const matchCount = config.keywords.filter((kw) =>
      content.includes(kw.toLowerCase())
    ).length;

    const score = matchCount * config.priority;

    if (score > bestScore) {
      bestScore = score;
      bestMatch = layout as LayoutType;
    }
  }

  return bestMatch;
}

/**
 * 获取布局组件所需的 props
 * 根据布局类型从场景数据中提取所需字段
 */
export function getLayoutProps(
  layoutType: LayoutType,
  sceneData: {
    audioFile: string;
    narration: string;
    title: string;
    subtitle?: string;
    content?: string[];
  },
  brand: Record<string, string>
): Record<string, unknown> {
  const baseProps = {
    audioFile: sceneData.audioFile,
    narration: sceneData.narration,
    brand,
  };

  switch (layoutType) {
    case "Opening":
      return {
        ...baseProps,
        title: sceneData.title,
        subtitle: sceneData.subtitle,
      };

    case "PainPoint":
      return {
        ...baseProps,
        title: sceneData.title,
        points: sceneData.content || [],
      };

    case "Pipeline":
      return {
        ...baseProps,
        title: sceneData.title,
        subtitle: sceneData.subtitle,
        steps: sceneData.content || [],
      };

    case "Terminal":
      return {
        ...baseProps,
        command: sceneData.subtitle || "",
        outputLines: sceneData.content || [],
      };

    case "Comparison":
      // 从 content 中解析对比数据
      const compContent = sceneData.content || [];
      return {
        ...baseProps,
        title: sceneData.title,
        beforeValue: compContent[0]?.split("→")[0]?.trim() || "",
        afterValue: compContent[0]?.split("→")[1]?.trim() || "",
        beforeLabel: "传统方式",
        afterLabel: "AI 方式",
        boostValue: compContent[1],
        extraStats: compContent.slice(2).map((c) => ({
          label: c.split(":")[0]?.trim() || "",
          value: c.split(":")[1]?.trim() || c,
        })),
      };

    case "FeatureGrid":
      return {
        ...baseProps,
        title: sceneData.title,
        features: (sceneData.content || []).map((c, i) => {
          const icons = ["📡", "⚡", "🎯", "📂", "📝", "🌐", "📊", "📈"];
          const parts = c.split(":");
          return {
            icon: icons[i % icons.length],
            title: parts[0]?.trim() || c,
            desc: parts[1]?.trim() || "",
          };
        }),
      };

    case "IconMatrix":
      return {
        ...baseProps,
        title: sceneData.title,
        subtitle: sceneData.subtitle,
        scenarios: (sceneData.content || []).map((c, i) => {
          const icons = ["👥", "👤", "✍️", "📊", "📚", "🎤"];
          const parts = c.split(":");
          return {
            icon: icons[i % icons.length],
            title: parts[0]?.trim() || c,
            desc: parts[1]?.trim() || "",
          };
        }),
      };

    case "VSTable":
      return {
        ...baseProps,
        title: sceneData.title,
        subtitle: sceneData.subtitle,
        comparisons: (sceneData.content || []).map((c) => {
          const parts = c.split("|");
          return {
            feature: parts[0]?.trim() || c,
            traditional: parts[1]?.trim() || "-",
            ai: parts[2]?.trim() || "✓",
          };
        }),
      };

    case "Steps":
      return {
        ...baseProps,
        title: sceneData.title,
        subtitle: sceneData.subtitle,
        steps: (sceneData.content || []).map((c, i) => {
          const icons = ["🔑", "💻", "⚙️", "🚀", "✅"];
          const parts = c.split(":");
          return {
            num: String(i + 1).padStart(2, "0"),
            icon: icons[i % icons.length],
            title: parts[0]?.trim() || c,
            desc: parts[1]?.trim() || "",
          };
        }),
      };

    case "CTA":
      return {
        ...baseProps,
        mainText: sceneData.title || "每天一个 OpenClaw Skill",
        subText: sceneData.subtitle || "明天见",
      };

    default:
      return baseProps;
  }
}
