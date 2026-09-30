import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONTS } from "../config/theme";
import { BEATS, SCENES } from "../config/timeline";
import { lerpFrames } from "../lib/anim";
import { Icon } from "./Icon";
import { accentAt, restoreAmount } from "../lib/systemState";

const Corner: React.FC<{ x: number; y: number; flipX?: boolean; flipY?: boolean; color: string }> = ({ x, y, flipX, flipY, color }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: 64,
      height: 64,
      borderColor: color,
      borderStyle: "solid",
      borderWidth: 0,
      borderTopWidth: flipY ? 0 : 3,
      borderBottomWidth: flipY ? 3 : 0,
      borderLeftWidth: flipX ? 0 : 3,
      borderRightWidth: flipX ? 3 : 0,
      filter: `drop-shadow(0 0 8px ${color})`,
    }}
  />
);

export type HudLook = {
  opacity: (frame: number) => number;
  color: (frame: number) => string;
  title: string;
  status: (frame: number) => { text: string; alert: boolean };
};

const LAST_LINE_LOOK: HudLook = {
  opacity: (frame) => {
    const on = BEATS.failure.interfaceOn;
    if (frame < on) return 0;
    const boot = lerpFrames(frame, [on, on + 10], [0, 1]);
    const hide = lerpFrames(frame, [SCENES.reveal.from - 4, SCENES.reveal.from + 12], [1, 0]);
    return boot * hide;
  },
  color: (frame) => accentAt(frame, 0.9),
  title: "MM//CORE-OS  v4.2",
  status: (frame) => {
    const restored = restoreAmount(frame) > 0.5;
    return { text: restored ? "STATE: STABLE" : "STATE: CRITICAL", alert: !restored };
  },
};

/** Decorative sci-fi interface frame: corner brackets, status lines, scanning bar. */
export const HudOverlay: React.FC<{ look?: HudLook }> = ({ look = LAST_LINE_LOOK }) => {
  const frame = useCurrentFrame();
  const opacity = look.opacity(frame);
  if (opacity <= 0) return null;

  const color = look.color(frame);
  const status = look.status(frame);
  const scanY = 200 + ((frame * 9) % 1520);
  const label: React.CSSProperties = {
    position: "absolute",
    fontFamily: FONTS.mono,
    fontSize: 20,
    letterSpacing: "0.18em",
    color,
    opacity: 0.8,
    whiteSpace: "pre",
  };
  const blink = Math.floor(frame / 8) % 2 === 0;

  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none" }}>
      <Corner x={40} y={150} color={color} />
      <Corner x={976} y={150} flipX color={color} />
      <Corner x={40} y={1706} flipY color={color} />
      <Corner x={976} y={1706} flipX flipY color={color} />

      <div style={{ ...label, left: 60, top: 110 }}>{look.title}</div>
      <div style={{ ...label, right: 60, top: 110, textAlign: "right" }}>
        {status.text}
        {status.alert && <Icon name="dot" size={16} color={color} style={{ marginLeft: 10, opacity: blink ? 1 : 0 }} />}
      </div>
      <div style={{ ...label, left: 60, bottom: 150, fontSize: 18, opacity: 0.55 }}>
        {`NODE 0x${(0x3fa0 + frame * 7).toString(16).toUpperCase()}  ·  SEC ${String(frame % 1000).padStart(3, "0")}`}
      </div>

      {/* Slow scanning bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: scanY,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          opacity: 0.25,
        }}
      />
      {/* Hairline rules */}
      <div style={{ position: "absolute", left: 60, right: 60, top: 146, height: 1, background: color, opacity: 0.25 }} />
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 196, height: 1, background: color, opacity: 0.18 }} />
    </AbsoluteFill>
  );
};
