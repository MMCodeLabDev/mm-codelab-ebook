import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SCENES } from "../config/timeline";
import { lerpFrames } from "../lib/anim";
import { accentAt } from "../lib/systemState";

const CELL = 120;

/** Camera speed (px of travel per frame) — fast during the fly-through, slow elsewhere. */
const speedAt = (f: number) => {
  const { flythrough, findBug, wave } = SCENES;
  if (f < flythrough.from) return 2;
  if (f < findBug.from) return lerpFrames(f, [flythrough.from, flythrough.from + 20, findBug.from - 10, findBug.from], [8, 46, 46, 3]);
  if (f < wave.from) return 1.2;
  return lerpFrames(f, [wave.from, wave.from + 10, wave.from + 70], [1.2, 30, 3]);
};

/** Deterministic travel distance: sum of speeds up to this frame. */
const travelAt = (frame: number, speed: (f: number) => number) => {
  let d = 0;
  for (let f = 0; f < frame; f++) d += speed(f);
  return d;
};

export type GridLook = {
  speed: (frame: number) => number;
  visible: (frame: number) => number;
  color: (frame: number) => string;
};

const LAST_LINE_LOOK: GridLook = {
  speed: speedAt,
  visible: (frame) =>
    lerpFrames(frame, [8, 30], [0, 1]) * lerpFrames(frame, [SCENES.reveal.from - 4, SCENES.reveal.from + 16], [1, 0.12]),
  color: (frame) => accentAt(frame, 0.55),
};

const Plane: React.FC<{ color: string; offset: number; ceiling?: boolean; opacity: number }> = ({
  color,
  offset,
  ceiling,
  opacity,
}) => (
  <div
    style={{
      position: "absolute",
      left: -1500,
      width: 4080,
      height: 3200,
      [ceiling ? "top" : "bottom"]: -300,
      transformOrigin: ceiling ? "50% 0%" : "50% 100%",
      transform: `rotateX(${ceiling ? -78 : 78}deg)`,
      opacity,
      backgroundImage: `linear-gradient(${color} 2px, transparent 2px), linear-gradient(90deg, ${color} 2px, transparent 2px)`,
      backgroundSize: `${CELL}px ${CELL}px`,
      backgroundPosition: `0px ${ceiling ? -offset : offset}px`,
      maskImage: `linear-gradient(${ceiling ? "to bottom" : "to top"}, black 0%, black 25%, transparent 85%)`,
      WebkitMaskImage: `linear-gradient(${ceiling ? "to bottom" : "to top"}, black 0%, black 25%, transparent 85%)`,
    }}
  />
);

/** Perspective floor + ceiling grid: gives depth and a sense of motion through the system. */
export const GridTunnel: React.FC<{ look?: GridLook }> = ({ look = LAST_LINE_LOOK }) => {
  const frame = useCurrentFrame();
  const offset = travelAt(frame, look.speed) % CELL;
  const visible = look.visible(frame);
  const color = look.color(frame);

  return (
    <AbsoluteFill style={{ perspective: 900, perspectiveOrigin: "50% 48%", overflow: "hidden" }}>
      <Plane color={color} offset={offset} opacity={visible * 0.55} />
      <Plane color={color} offset={offset} ceiling opacity={visible * 0.22} />
    </AbsoluteFill>
  );
};
