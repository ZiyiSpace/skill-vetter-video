// Skill Vetter - 音频时长配置
// 自动生成自 audio-durations.json

export const AUDIO_DURATIONS = {
  scene_001: 5.30,
  scene_002: 9.05,
  scene_003: 10.85,
  scene_004: 9.07,
  scene_005: 9.22,
  scene_006: 9.00,
  scene_007: 7.56,
  scene_008: 6.79,
  scene_009: 7.90,
  scene_010: 4.75
};

export const getFramesFromDuration = (duration: number) => Math.ceil(duration * 30);
