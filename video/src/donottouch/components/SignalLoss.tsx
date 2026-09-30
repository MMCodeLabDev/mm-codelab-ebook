import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { COLORS } from "../../config/theme";
import { withAlpha } from "../../lib/anim";

const BANDS = 9;

/**
 * Screen tearing / signal loss: horizontal bands of displaced colour and black.
 * `intensity` 0..1 is driven by the parent; pattern is seeded per frame.
 */
export const SignalLoss: React.FC<{ intensity: number; seed?: string }> = ({ intensity, seed = "sl" }) => {
  const frame = useCurrentFrame();
  if (intensity <= 0.02) return null;
  const r = (k: string) => random(`${seed}-${k}-${frame}`);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {new Array(BANDS).fill(0).map((_, i) => {
        if (r(`on${i}`) > intensity * 0.9) return null;
        const top = r(`t${i}`) * 1920;
        const h = 6 + r(`h${i}`) * 90 * intensity;
        const dx = (r(`x${i}`) - 0.5) * 260 * intensity;
        const kind = r(`k${i}`);
        const background =
          kind < 0.35
            ? withAlpha(COLORS.red, 0.35 + 0.4 * intensity)
            : kind < 0.55
              ? withAlpha("#39c6ff", 0.25 + 0.3 * intensity)
              : kind < 0.8
                ? "rgba(0,0,0,0.85)"
                : `repeating-linear-gradient(90deg, rgba(255,255,255,0.35) 0 3px, transparent 3px 9px)`;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: dx - 40,
              width: 1160,
              top,
              height: h,
              background,
              mixBlendMode: kind < 0.55 ? "screen" : "normal",
            }}
          />
        );
      })}
      <AbsoluteFill style={{ background: withAlpha(COLORS.red, 0.08 * intensity), mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};
