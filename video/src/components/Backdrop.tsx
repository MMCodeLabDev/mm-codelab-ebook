import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../config/theme";
import { SCENES, BEATS } from "../config/timeline";
import { lerpFrames } from "../lib/anim";
import { accentAt } from "../lib/systemState";

export type BackdropLook = {
  /** Opacity of the navy base layer at a frame. */
  base: (frame: number) => number;
  /** Intensity of the accent glows at a frame. */
  glow: (frame: number) => number;
  /** Accent colour of the glows. */
  accent: (frame: number, alpha: number) => string;
};

// Pure black for the first frames, then emergency light floods in with a flicker.
const FLICKER = [1, 0.2, 1, 0.1, 0.9, 1];
const boot = (frame: number) => {
  const lightsOn = BEATS.failure.lightsOn;
  return frame < lightsOn ? 0 : frame < lightsOn + FLICKER.length ? FLICKER[frame - lightsOn] : 1;
};
// Final scene: everything becomes dark and clean.
const calm = (frame: number) => lerpFrames(frame, [SCENES.reveal.from - 6, SCENES.reveal.from + 20], [1, 0.35]);
// Slow breathing on the glow — alarm pulse while red.
const pulse = (frame: number) => (frame < SCENES.wave.from ? 0.78 + 0.22 * Math.sin(frame * 0.42) : 1);

/** "The Last Line of Code" look (default). */
const LAST_LINE_LOOK: BackdropLook = {
  base: (frame) => boot(frame) * calm(frame),
  glow: (frame) => boot(frame) * calm(frame) * pulse(frame),
  accent: accentAt,
};

/** Deep navy/black base with volumetric accent glows. `look` drives it per composition. */
export const Backdrop: React.FC<{ look?: BackdropLook }> = ({ look = LAST_LINE_LOOK }) => {
  const frame = useCurrentFrame();
  const glow = look.glow(frame);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black }}>
      <AbsoluteFill
        style={{
          opacity: look.base(frame),
          background: `radial-gradient(120% 70% at 50% 45%, ${COLORS.navyLight} 0%, ${COLORS.navy} 38%, ${COLORS.void} 70%, ${COLORS.black} 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: glow,
          background: `radial-gradient(90% 38% at 50% 105%, ${look.accent(frame, 0.55)} 0%, transparent 70%),
                       radial-gradient(70% 28% at 50% -6%, ${look.accent(frame, 0.35)} 0%, transparent 72%)`,
        }}
      />
    </AbsoluteFill>
  );
};
