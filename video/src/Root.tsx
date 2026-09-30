import React from "react";
import { Composition } from "remotion";
import { VIDEO } from "./config/video";
import { LastLineOfCode } from "./Video";
import { DoNotTouchTheCode } from "./donottouch/DoNotTouchTheCode";
import { DNTC } from "./donottouch/timeline";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id={VIDEO.id}
      component={LastLineOfCode}
      width={VIDEO.width}
      height={VIDEO.height}
      fps={VIDEO.fps}
      durationInFrames={VIDEO.durationInFrames}
    />
    <Composition
      id={DNTC.id}
      component={DoNotTouchTheCode}
      width={VIDEO.width}
      height={VIDEO.height}
      fps={VIDEO.fps}
      durationInFrames={DNTC.durationInFrames}
    />
  </>
);
