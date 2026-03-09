// Scene001: 钩子（示例）
// AI 应根据 timeline.md 中的内容修改此文件

import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import {SceneBase, FadeInText} from '../components/SceneBase';
import {COLORS, TYPOGRAPHY, SPACING, DURATION} from '../design';

export interface Scene001Props {
  // 从 timeline.md 提取的参数
  title?: string;
  subtitle?: string;
  highlight?: string;
}

export const Scene001: React.FC<Scene001Props> = ({
  title = "每天一个 OpenClaw Skill",
  subtitle = "今天是 {工具名}",
  highlight = "{核心增益}",
}) => {
  const frame = useCurrentFrame();

  return (
    <SceneBase sceneNumber="001" audioFile="scene_001.wav">
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: SPACING.xl,
        }}
      >
        {/* 系列标题 */}
        <FadeInText delay={0}>
          <div
            style={{
              fontSize: TYPOGRAPHY.bodyLg,
              color: COLORS.textSecondary,
              marginBottom: SPACING.md,
            }}
          >
            {title}
          </div>
        </FadeInText>

        {/* 工具名 */}
        <FadeInText delay={15}>
          <div
            style={{
              fontSize: TYPOGRAPHY.titleXl,
              fontWeight: 'bold',
              color: COLORS.primary,
              marginBottom: SPACING.lg,
            }}
          >
            {subtitle}
          </div>
        </FadeInText>

        {/* 核心增益强调 */}
        <FadeInText delay={30}>
          <div
            style={{
              fontSize: TYPOGRAPHY.titleLg,
              fontWeight: 'bold',
              color: COLORS.accent,
              textAlign: 'center',
            }}
          >
            {highlight}
          </div>
        </FadeInText>

        {/* 装饰元素 */}
        <div
          style={{
            position: 'absolute',
            bottom: 200,
            width: 200,
            height: 4,
            backgroundColor: COLORS.primary,
            borderRadius: 2,
          }}
        />
      </AbsoluteFill>
    </SceneBase>
  );
};
