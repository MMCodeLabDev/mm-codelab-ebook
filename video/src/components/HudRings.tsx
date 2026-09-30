import React from "react";
import { useCurrentFrame } from "remotion";

type Props = {
  cx: number;
  cy: number;
  color: string;
  /** 0..1 — how much of each ring is drawn. */
  draw: number;
  scale?: number;
  opacity?: number;
};

const RINGS = [
  { r: 250, w: 2, dash: "none", speed: 0.4 },
  { r: 310, w: 6, dash: "60 24", speed: -0.8 },
  { r: 370, w: 2, dash: "4 14", speed: 0.5 },
  { r: 430, w: 10, dash: "180 60 20 60", speed: -0.3 },
] as const;

/** Rotating targeting rings — the "system interface activating". */
export const HudRings: React.FC<Props> = ({ cx, cy, color, draw, scale = 1, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const size = 1000;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{
        position: "absolute",
        left: cx - size / 2,
        top: cy - size / 2,
        transform: `scale(${scale})`,
        opacity,
        overflow: "visible",
        filter: `drop-shadow(0 0 12px ${color})`,
      }}
    >
      {RINGS.map((ring, i) => {
        const c = 2 * Math.PI * ring.r;
        const ringDraw = Math.max(0, Math.min(1, draw * 1.6 - i * 0.2));
        return (
          <g key={i} transform={`rotate(${frame * ring.speed * 3 + i * 40} 500 500)`}>
            <circle
              cx={500}
              cy={500}
              r={ring.r}
              fill="none"
              stroke={color}
              strokeWidth={ring.w}
              strokeOpacity={0.25 + (i % 2) * 0.35}
              strokeDasharray={ring.dash === "none" ? `${c * ringDraw} ${c}` : ring.dash}
              style={{ opacity: ringDraw }}
            />
          </g>
        );
      })}
      {/* Tick marks */}
      {new Array(48).fill(0).map((_, i) => {
        const a = (i / 48) * Math.PI * 2 + frame * 0.004;
        const r1 = 460;
        const r2 = i % 4 === 0 ? 490 : 474;
        return (
          <line
            key={i}
            x1={500 + Math.cos(a) * r1}
            y1={500 + Math.sin(a) * r1}
            x2={500 + Math.cos(a) * r2}
            y2={500 + Math.sin(a) * r2}
            stroke={color}
            strokeWidth={2}
            strokeOpacity={i / 48 < draw ? 0.6 : 0}
          />
        );
      })}
    </svg>
  );
};
