/**
 * 动态时长视频组合模板
 *
 * 根据音频实际时长动态设置每个场景的帧数
 * 使用方法：
 * 1. 从 audio-durations.json 复制时长数据
 * 2. 替换下面的 AUDIO_DURATIONS
 * 3. 导入对应的场景组件
 */

import { AbsoluteFill, Sequence, Audio } from 'remotion';
import { staticFile } from 'remotion';
import { CANVAS_SIZE, getFramesFromDuration, calculateSequenceOffsets } from './design';
import { getBrandConfig } from './design';

// ============ 配置区域 ============

// Skill 名称
const SKILL_NAME = '{SkillName}';

// 品牌配置
const BRAND = getBrandConfig(SKILL_NAME);

// 音频时长数据（从 audio-durations.json 复制）
// 格式: { "scene_001": 5.2, "scene_002": 6.8, ... }
const AUDIO_DURATIONS: Record<string, number> = {
  scene_001: 5.0,
  scene_002: 5.0,
  scene_003: 5.0,
  // ... 添加更多场景
};

// ============ 自动计算 ============

// 场景列表
const SCENES = Object.keys(AUDIO_DURATIONS).sort();

// 每个场景的帧数
const SCENE_FRAMES = SCENES.map(key => getFramesFromDuration(AUDIO_DURATIONS[key]));

// 每个场景的起始帧
const SCENE_OFFSETS = calculateSequenceOffsets(Object.values(AUDIO_DURATIONS));

// 总帧数
const TOTAL_FRAMES = SCENE_OFFSETS[SCENE_OFFSETS.length - 1] + SCENE_FRAMES[SCENE_FRAMES.length - 1];

// ============ 场景组件导入 ============
// 取消注释并修改为实际的场景组件
// import { Scene001 } from './scenes/Scene001';
// import { Scene002 } from './scenes/Scene002';
// ...

// ============ 主组件 ============

export const SkillFull: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.gradientStart }}>
      {/* Scene 001 */}
      <Sequence
        from={SCENE_OFFSETS[0]}
        durationInFrames={SCENE_FRAMES[0]}
      >
        {/* <Scene001 brand={BRAND} audioFile="scene_001.wav" /> */}
        <Audio src={staticFile(`audio/scene_001.wav`)} />
      </Sequence>

      {/* Scene 002 */}
      <Sequence
        from={SCENE_OFFSETS[1]}
        durationInFrames={SCENE_FRAMES[1]}
      >
        {/* <Scene002 brand={BRAND} audioFile="scene_002.wav" /> */}
        <Audio src={staticFile(`audio/scene_002.wav`)} />
      </Sequence>

      {/* 添加更多场景... */}
    </AbsoluteFill>
  );
};

// 导出配置供 Root.tsx 使用
export const VIDEO_CONFIG = {
  id: `${SKILL_NAME}Full`,
  durationInFrames: TOTAL_FRAMES,
  fps: CANVAS_SIZE.fps,
  width: CANVAS_SIZE.width,
  height: CANVAS_SIZE.height,
};
