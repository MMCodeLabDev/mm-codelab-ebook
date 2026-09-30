import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

/**
 * Cinematic finishing layer: film grain (seeded SVG turbulence), scanlines and vignette.
 * Grain seed cycles with the frame so it is deterministic yet alive.
 */
export const LensOverlay: React.FC<{ grain?: number; scanlines?: number }> = ({ grain = 0.07, scanlines = 0.1 }) => {
  const frame = useCurrentFrame();
  const seed = frame % 12;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          opacity: scanlines,
          backgroundImage: "repeating-linear-gradient(to bottom, rgba(0,0,0,0.9) 0px, rgba(0,0,0,0.9) 1px, transparent 2px, transparent 4px)",
        }}
      />
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: grain, mixBlendMode: "overlay" }}>
        <filter id={`grain-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
      </svg>
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse 85% 70% at 50% 48%, transparent 45%, rgba(0,0,0,0.55) 80%, rgba(0,0,0,0.9) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
