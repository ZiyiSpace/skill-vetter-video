import React from "react";
import { Composition } from "remotion";
import { SkillVetterFull } from "./SkillVetterFull";
import { AUDIO_DURATIONS } from "./AudioDurations";

const getFramesFromDuration = (duration: number) => Math.ceil(duration * 30);

const totalDuration = Object.values(AUDIO_DURATIONS).reduce((sum, d) => sum + d, 0);
const totalFrames = getFramesFromDuration(totalDuration);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SkillVetter"
        component={SkillVetterFull}
        durationInFrames={totalFrames}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
