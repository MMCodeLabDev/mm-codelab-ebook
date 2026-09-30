import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS } from "../../config/theme";
import { withAlpha } from "../../lib/anim";

/**
 * A single ceiling-mounted emergency lamp: small hot source, volumetric cone,
 * and a wide bloom on the room. `intensity` is driven per frame by the parent.
 */
export const PulseLamp: React.FC<{ intensity: number; color?: string; x?: number; y?: number }> = ({
  intensity,
  color = COLORS.red,
  x = 540,
  y = 150,
}) => {
  if (intensity <= 0.001) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Room bloom */}
      <AbsoluteFill
        style={{
          opacity: intensity * 0.9,
          background: `radial-gradient(70% 45% at ${(x / 1080) * 100}% ${(y / 1920) * 100}%, ${withAlpha(color, 0.45)} 0%, ${withAlpha(color, 0.12)} 45%, transparent 75%)`,
        }}
      />
      {/* Volumetric cone */}
      <div
        style={{
          position: "absolute",
          left: x - 520,
          top: y,
          width: 1040,
          height: 1500,
          opacity: intensity * 0.55,
          background: `linear-gradient(to bottom, ${withAlpha(color, 0.55)} 0%, ${withAlpha(color, 0.12)} 45%, transparent 90%)`,
          clipPath: "polygon(46% 0%, 54% 0%, 100% 100%, 0% 100%)",
          filter: "blur(22px)",
          mixBlendMode: "screen",
        }}
      />
      {/* Fixture */}
      <div
        style={{
          position: "absolute",
          left: x - 70,
          top: y - 16,
          width: 140,
          height: 26,
          borderRadius: 13,
          background: `linear-gradient(to bottom, ${withAlpha(COLORS.white, 0.9 * intensity)}, ${withAlpha(color, 1)})`,
          boxShadow: `0 0 ${40 * intensity}px ${withAlpha(color, intensity)}, 0 0 ${120 * intensity}px ${withAlpha(color, 0.7 * intensity)}`,
          opacity: 0.35 + 0.65 * intensity,
        }}
      />
    </AbsoluteFill>
  );
};
