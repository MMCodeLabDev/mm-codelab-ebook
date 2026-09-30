import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../../config/theme";
import { EASE, lerpFrames, withAlpha } from "../../lib/anim";
import { Headline } from "../../components/Headline";
import { BEAT, SCENES } from "../timeline";
import { rel } from "../look";

/** 0:00–0:04 — darkness, one red lamp, a warning. No comedy. */
export const S1Warning: React.FC = () => {
  const frame = useCurrentFrame();
  const f = frame + SCENES.warning.from;
  const exit = lerpFrames(f, [SCENES.legacy.from - 16, SCENES.legacy.from], [0, 1], EASE.inOutCubic);
  const rule = lerpFrames(f, [BEAT.titleLine2 + 10, BEAT.titleLine2 + 50], [0, 1], EASE.outExpo);

  const film = { enterFrames: 42, scaleFrom: 1.06, glitch: 0.12, tracking: 0.1, size: 100 } as const;

  return (
    <AbsoluteFill style={{ opacity: 1 - exit, filter: exit > 0 ? `blur(${exit * 10}px)` : undefined }}>
      <Headline text="DO NOT TOUCH" at={rel(SCENES.warning, BEAT.titleLine1)} y={598} color={COLORS.white} glow={withAlpha(COLORS.red, 0.55)} seed="dnt1" {...film} />
      <Headline text="THIS CODE." at={rel(SCENES.warning, BEAT.titleLine2)} y={716} color={COLORS.red} glow={withAlpha(COLORS.red, 0.85)} seed="dnt2" {...film} />
      {/* Hairline under the title, drawn from the centre outward */}
      <div
        style={{
          position: "absolute",
          left: 540 - 300 * rule,
          width: 600 * rule,
          top: 846,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${withAlpha(COLORS.red, 0.9)}, transparent)`,
        }}
      />
    </AbsoluteFill>
  );
};
