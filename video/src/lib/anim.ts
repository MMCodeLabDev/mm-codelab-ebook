import { Easing, interpolate } from "remotion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Clamped interpolate shorthand. */
export const lerpFrames = (
  frame: number,
  input: readonly number[],
  output: readonly number[],
  easing?: (t: number) => number,
) => interpolate(frame, input as number[], output as number[], { ...clamp, easing });

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

const hexToRgb = (hex: string) => {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255] as const;
};

/** Mix two hex colours, returns an rgba() string. */
export const mixColor = (a: string, b: string, t: number, alpha = 1) => {
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  const r = Math.round(mix(r1, r2, t));
  const g = Math.round(mix(g1, g2, t));
  const bl = Math.round(mix(b1, b2, t));
  return `rgba(${r}, ${g}, ${bl}, ${alpha})`;
};

export const withAlpha = (hex: string, alpha: number) => mixColor(hex, hex, 0, alpha);

export const EASE = {
  outExpo: Easing.bezier(0.16, 1, 0.3, 1),
  inOutCubic: Easing.bezier(0.65, 0, 0.35, 1),
  inExpo: Easing.bezier(0.7, 0, 0.84, 0),
  outBack: Easing.bezier(0.34, 1.56, 0.64, 1),
} as const;
