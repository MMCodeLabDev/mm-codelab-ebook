import React, { useMemo } from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { SCENES } from "../config/timeline";
import { lerpFrames } from "../lib/anim";
import { accentAt } from "../lib/systemState";
import { VIDEO } from "../config/video";

const COUNT = 26;

/** Thin vertical light streaks falling through the background — energy running through the system. */
export const DataStreams: React.FC = () => {
  const frame = useCurrentFrame();
  const streams = useMemo(
    () =>
      new Array(COUNT).fill(0).map((_, i) => ({
        x: random(`dx${i}`) * VIDEO.width,
        len: 120 + random(`dl${i}`) * 380,
        speed: 14 + random(`dv${i}`) * 30,
        offset: random(`do${i}`) * 3000,
        alpha: 0.12 + random(`da${i}`) * 0.3,
      })),
    [],
  );
  const visible =
    lerpFrames(frame, [10, 40], [0, 1]) * lerpFrames(frame, [SCENES.reveal.from - 4, SCENES.reveal.from + 12], [1, 0]);
  if (visible <= 0) return null;
  const color = accentAt(frame, 1);

  return (
    <AbsoluteFill style={{ opacity: visible, pointerEvents: "none" }}>
      {streams.map((s, i) => {
        const y = ((s.offset + frame * s.speed) % (VIDEO.height + s.len)) - s.len;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: s.x,
              top: y,
              width: 2,
              height: s.len,
              opacity: s.alpha,
              background: `linear-gradient(to bottom, transparent, ${color})`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
