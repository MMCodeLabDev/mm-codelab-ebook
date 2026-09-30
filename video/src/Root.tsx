import React from "react";
import { Composition } from "remotion";
import { VIDEO } from "./config/video";
import { LastLineOfCode } from "./Video";

export const RemotionRoot: React.FC = () => (
  <Composition
    id={VIDEO.id}
    component={LastLineOfCode}
    width={VIDEO.width}
    height={VIDEO.height}
    fps={VIDEO.fps}
    durationInFrames={VIDEO.durationInFrames}
  />
);
