import React from "react";
import { Opening } from "./Opening";
import { PainPoint } from "./PainPoint";
import { Pipeline } from "./Pipeline";
import { Terminal } from "./Terminal";
import { Comparison } from "./Comparison";
import { FeatureGrid } from "./FeatureGrid";
import { IconMatrix } from "./IconMatrix";
import { VSTable } from "./VSTable";
import { Steps } from "./Steps";
import { CTA } from "./CTA";

// 布局组件导出
export { Opening, PainPoint, Pipeline, Terminal, Comparison, FeatureGrid, IconMatrix, VSTable, Steps, CTA };

// 布局类型定义
export type LayoutType =
  | "Opening"
  | "PainPoint"
  | "Pipeline"
  | "Terminal"
  | "Comparison"
  | "FeatureGrid"
  | "IconMatrix"
  | "VSTable"
  | "Steps"
  | "CTA";

// 布局组件映射
const LAYOUT_COMPONENTS: Record<LayoutType, React.ComponentType<any>> = {
  Opening,
  PainPoint,
  Pipeline,
  Terminal,
  Comparison,
  FeatureGrid,
  IconMatrix,
  VSTable,
  Steps,
  CTA,
};

/**
 * 根据布局类型获取对应的 React 组件
 */
export function getLayoutComponent(layoutType: LayoutType): React.ComponentType<any> {
  return LAYOUT_COMPONENTS[layoutType];
}
