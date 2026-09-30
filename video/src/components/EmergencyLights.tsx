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
export const EmergencyLights: React.FC = () => {
  const frame = useCurrentFrame();
  const start = BEATS.failure.lightsOn;
  if (frame < start) return null;

  const alarm = 1 - restoreAmount(frame);
  if (alarm <= 0.001) return null;

  const flickerOn = [1, 0, 1, 0, 1, 1][frame - start] ?? 1;
  const intensity = alarm * flickerOn * lerpFrames(frame, [start, start + 2], [0, 1]);
  const edgePulse = 0.45 + 0.55 * Math.pow(Math.max(0, Math.sin(frame * 0.21)), 2);
  const rot = frame * 5.2;

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
