import React from "react";
import { random, useCurrentFrame } from "remotion";

type Props = {
  text: string;
  /** 0 = clean, 1 = heavy glitch. Animate it from the parent. */
  intensity: number;
  color: string;
  glow?: string;
  seed?: string;
  style?: React.CSSProperties;
};

const SLICES = 5;

/**
 * Cinematic glitch typography: chromatic aberration (red/cyan split) plus
 * horizontal slice displacement. Deterministic — driven by frame + seed.
 */
export const GlitchText: React.FC<Props> = ({ text, intensity, color, glow, seed = "g", style }) => {
  const frame = useCurrentFrame();
  const r = (k: string) => random(`${seed}-${k}-${frame}`);
  // Glitch comes in bursts rather than constantly.
  const active = intensity > 0 && r("on") < 0.35 + intensity * 0.6;
  const amt = active ? intensity : intensity * 0.15;
  const split = amt * 14;

  const base: React.CSSProperties = {
    margin: 0,
    ...style,
    whiteSpace: "pre",
    color,
  };
  const layer: React.CSSProperties = { ...base, position: "absolute", left: 0, top: 0, mixBlendMode: "screen" };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div style={{ ...base, textShadow: glow ? `0 0 18px ${glow}, 0 0 60px ${glow}` : undefined, opacity: active ? 0.9 : 1 }}>
        {text}
      </div>
      {split > 2 && (
        <>
          <div style={{ ...layer, color: "rgba(255,40,70,0.85)", transform: `translate(${-split}px, ${(r("ry") - 0.5) * split * 0.4}px)` }}>
            {text}
          </div>
          <div style={{ ...layer, color: "rgba(60,200,255,0.85)", transform: `translate(${split}px, ${(r("cy") - 0.5) * split * 0.4}px)` }}>
            {text}
          </div>
        </>
      )}
      {active &&
        intensity > 0.2 &&
        new Array(SLICES).fill(0).map((_, i) => {
          if (r(`s${i}`) > 0.55) return null;
          const top = r(`t${i}`) * 90;
          const h = 4 + r(`h${i}`) * 18;
          const dx = (r(`x${i}`) - 0.5) * 80 * intensity;
          return (
            <div
              key={i}
              style={{
                ...layer,
                mixBlendMode: "normal",
                clipPath: `inset(${top}% 0 ${Math.max(0, 100 - top - h)}% 0)`,
                transform: `translateX(${dx}px)`,
                textShadow: glow ? `0 0 12px ${glow}` : undefined,
              }}
            >
              {text}
            </div>
          );
        })}
    </div>
  );
};
