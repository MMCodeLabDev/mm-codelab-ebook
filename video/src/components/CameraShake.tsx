import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";

export type Impact = { at: number; strength: number; decay?: number };

/** Deterministic camera shake: sums decaying jitter from each impact. */
export const shakeAt = (frame: number, impacts: readonly Impact[]) => {
  let x = 0;
  let y = 0;
  let r = 0;
  for (const { at, strength, decay = 14 } of impacts) {
    const t = frame - at;
    if (t < 0 || t > decay * 3) continue;
    const amp = strength * Math.exp(-t / decay);
    x += (random(`sx${at}-${frame}`) - 0.5) * 2 * amp;
    y += (random(`sy${at}-${frame}`) - 0.5) * 2 * amp;
    r += (random(`sr${at}-${frame}`) - 0.5) * 0.12 * amp;
  }
  return { x, y, r };
};

export const CameraShake: React.FC<{ impacts: readonly Impact[]; children: React.ReactNode }> = ({ impacts, children }) => {
  const frame = useCurrentFrame();
  const { x, y, r } = shakeAt(frame, impacts);
  return <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px) rotate(${r}deg) scale(1.02)` }}>{children}</AbsoluteFill>;
};
