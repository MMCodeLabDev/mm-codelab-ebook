import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../config/theme";
import { BEATS } from "../config/timeline";
import { lerpFrames, withAlpha } from "../lib/anim";
import { restoreAmount } from "../lib/systemState";

const Beacon: React.FC<{ x: number; y: number; angle: number; intensity: number }> = ({ x, y, angle, intensity }) => (
  <div
    style={{
      position: "absolute",
      left: x - 1400,
      top: y - 1400,
      width: 2800,
      height: 2800,
      opacity: intensity,
      mixBlendMode: "screen",
      background: `conic-gradient(from ${angle}deg at 50% 50%,
        transparent 0deg, ${withAlpha(COLORS.red, 0.0)} 6deg, ${withAlpha(COLORS.red, 0.5)} 18deg,
        ${withAlpha(COLORS.redHot, 0.18)} 30deg, transparent 44deg, transparent 180deg,
        ${withAlpha(COLORS.red, 0.5)} 198deg, ${withAlpha(COLORS.redHot, 0.18)} 210deg, transparent 224deg, transparent 360deg)`,
      maskImage: "radial-gradient(circle at 50% 50%, black 0%, black 18%, transparent 55%)",
      WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 0%, black 18%, transparent 55%)",
      filter: "blur(18px)",
    }}
  />
);

/** Rotating emergency beacons + pulsing red edge light. Fade away when the system is restored. */
/** "The Last Line of Code": flicker on at lights-on, fade out as the system is restored. */
const lastLineIntensity = (frame: number) => {
  const start = BEATS.failure.lightsOn;
  if (frame < start) return 0;
  const alarm = 1 - restoreAmount(frame);
  if (alarm <= 0.001) return 0;
  const flickerOn = [1, 0, 1, 0, 1, 1][frame - start] ?? 1;
  return alarm * flickerOn * lerpFrames(frame, [start, start + 2], [0, 1]);
};

export const EmergencyLights: React.FC<{ intensityAt?: (frame: number) => number; speed?: number }> = ({
  intensityAt = lastLineIntensity,
  speed = 5.2,
}) => {
  const frame = useCurrentFrame();
  const intensity = intensityAt(frame);
  if (intensity <= 0) return null;
  const edgePulse = 0.45 + 0.55 * Math.pow(Math.max(0, Math.sin(frame * 0.21)), 2);
  const rot = frame * speed;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <Beacon x={-40} y={120} angle={rot} intensity={intensity * 0.9} />
      <Beacon x={1120} y={120} angle={-rot + 90} intensity={intensity * 0.9} />
      <AbsoluteFill
        style={{
          opacity: intensity * edgePulse,
          boxShadow: `inset 0 0 220px 40px ${withAlpha(COLORS.red, 0.55)}, inset 0 0 60px 6px ${withAlpha(COLORS.redHot, 0.5)}`,
        }}
      />
    </AbsoluteFill>
  );
};
