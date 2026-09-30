import React from "react";
import { COLORS } from "../../config/theme";

/** Classic arrow pointer. (x, y) is the tip. */
export const MousePointer: React.FC<{ x: number; y: number; opacity: number; pressed?: number }> = ({ x, y, opacity, pressed = 0 }) => (
  <svg
    width={44}
    height={60}
    viewBox="0 0 22 30"
    style={{
      position: "absolute",
      left: x,
      top: y,
      opacity,
      transform: `scale(${1 - pressed * 0.15})`,
      transformOrigin: "0 0",
      filter: `drop-shadow(0 4px 10px rgba(0,0,0,0.7)) drop-shadow(0 0 10px rgba(108,196,255,0.35))`,
      overflow: "visible",
    }}
  >
    <path d="M1 1 L1 23 L6.5 17.8 L10.2 26.5 L14 24.8 L10.4 16.4 L18 16.4 Z" fill={COLORS.white} stroke="#05070f" strokeWidth={1.6} strokeLinejoin="round" />
  </svg>
);

export type PointerKey = readonly [frame: number, x: number, y: number];

/** Deterministic pointer path through keyframes, eased between each pair. */
export const pointerAt = (f: number, keys: readonly PointerKey[]) => {
  if (f <= keys[0][0]) return { x: keys[0][1], y: keys[0][2] };
  for (let i = 1; i < keys.length; i++) {
    const [f1, x1, y1] = keys[i];
    const [f0, x0, y0] = keys[i - 1];
    if (f <= f1) {
      const p = (f - f0) / (f1 - f0);
      const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; // ease in-out cubic
      return { x: x0 + (x1 - x0) * e, y: y0 + (y1 - y0) * e };
    }
  }
  const last = keys[keys.length - 1];
  return { x: last[1], y: last[2] };
};
