import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../config/theme";
import { SCENES, BEATS } from "../config/timeline";
import { lerpFrames } from "../lib/anim";
import { accentAt } from "../lib/systemState";

/** Deep navy/black base with volumetric accent glows that follow the system state. */
export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const lightsOn = BEATS.failure.lightsOn;

  // Pure black for the first frames, then emergency light floods in with a flicker.
  const flicker = [1, 0.2, 1, 0.1, 0.9, 1];
  const boot = frame < lightsOn ? 0 : frame < lightsOn + flicker.length ? flicker[frame - lightsOn] : 1;

  // Final scene: everything becomes dark and clean.
  const calm = lerpFrames(frame, [SCENES.reveal.from - 6, SCENES.reveal.from + 20], [1, 0.35]);
  // Slow breathing on the glow — alarm pulse while red.
  const pulse = frame < SCENES.wave.from ? 0.78 + 0.22 * Math.sin(frame * 0.42) : 1;
  const glow = boot * calm * pulse;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black }}>
      <AbsoluteFill
        style={{
          opacity: boot * calm,
          background: `radial-gradient(120% 70% at 50% 45%, ${COLORS.navyLight} 0%, ${COLORS.navy} 38%, ${COLORS.void} 70%, ${COLORS.black} 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: glow,
          background: `radial-gradient(90% 38% at 50% 105%, ${accentAt(frame, 0.55)} 0%, transparent 70%),
                       radial-gradient(70% 28% at 50% -6%, ${accentAt(frame, 0.35)} 0%, transparent 72%)`,
        }}
      />
    </AbsoluteFill>
  );
};
