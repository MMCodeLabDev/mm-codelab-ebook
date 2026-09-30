import React, { useMemo } from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { COLORS } from "../config/theme";
import { SCENES } from "../config/timeline";
import { EASE, lerpFrames, mixColor } from "../lib/anim";
import { restoreAmount } from "../lib/systemState";
import { VIDEO } from "../config/video";

type Particle = { x: number; y: number; z: number; size: number; drift: number; phase: number; angle: number; speed: number };

const COUNT = 90;

/**
 * Depth-of-field dust / data motes. Fully deterministic (seeded `random`).
 * At the system-restore wave, every mote is blasted outward from the centre.
 */
export const Particles: React.FC<{ burstCenterY?: number }> = ({ burstCenterY = 860 }) => {
  const frame = useCurrentFrame();

  const particles = useMemo<Particle[]>(
    () =>
      new Array(COUNT).fill(0).map((_, i) => ({
        x: random(`px${i}`) * VIDEO.width,
        y: random(`py${i}`) * VIDEO.height,
        z: random(`pz${i}`), // 0 = far, 1 = near
        size: 2 + random(`ps${i}`) * 5,
        drift: 0.3 + random(`pd${i}`) * 1.2,
        phase: random(`pp${i}`) * Math.PI * 2,
        angle: random(`pa${i}`) * Math.PI * 2,
        speed: 900 + random(`pv${i}`) * 1400,
      })),
    [],
  );

  const burst = lerpFrames(frame, [SCENES.wave.from, SCENES.wave.from + 75], [0, 1], EASE.outExpo);
  const visible = lerpFrames(frame, [6, 24], [0, 1]) * lerpFrames(frame, [SCENES.reveal.from, SCENES.reveal.from + 20], [1, 0.45]);
  const t = restoreAmount(frame);

  return (
    <AbsoluteFill style={{ opacity: visible, pointerEvents: "none" }}>
      {particles.map((p, i) => {
        const depthScale = 0.4 + p.z * 1.6;
        // Upward drift + gentle sway (rising embers while red, floating data while blue).
        let x = p.x + Math.sin(frame * 0.03 + p.phase) * 18 * depthScale;
        let y = ((p.y - frame * p.drift * depthScale * 1.6) % VIDEO.height + VIDEO.height) % VIDEO.height;
        if (burst > 0) {
          const bx = Math.cos(p.angle) * p.speed * burst;
          const by = Math.sin(p.angle) * p.speed * burst;
          x = x + (x - VIDEO.width / 2) * burst * 0.6 + bx;
          y = y + (y - burstCenterY) * burst * 0.6 + by;
        }
        const size = p.size * depthScale;
        const color = mixColor(i % 3 === 0 ? COLORS.redHot : COLORS.red, i % 3 === 0 ? COLORS.blueIce : COLORS.blueHot, t);
        const twinkle = 0.55 + 0.45 * Math.sin(frame * 0.12 + p.phase * 3);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: color,
              opacity: (0.25 + p.z * 0.6) * twinkle,
              filter: p.z < 0.25 ? "blur(2px)" : p.z > 0.85 ? "blur(3px)" : undefined,
              boxShadow: `0 0 ${size * 3}px ${color}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
