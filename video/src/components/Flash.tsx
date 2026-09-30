import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { lerpFrames } from "../lib/anim";

/** Short additive light flash (cut transitions, impacts). */
export const Flash: React.FC<{ at: number; duration?: number; color?: string; peak?: number }> = ({
  at,
  duration = 10,
  color = "#ffffff",
  peak = 0.85,
}) => {
  const frame = useCurrentFrame();
  const o = lerpFrames(frame, [at - 1, at, at + duration], [0, peak, 0]);
  if (o <= 0) return null;
  return <AbsoluteFill style={{ background: color, opacity: o, mixBlendMode: "screen", pointerEvents: "none" }} />;
};
