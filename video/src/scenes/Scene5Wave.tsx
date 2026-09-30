import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../config/theme";
import { SCENES } from "../config/timeline";
import { BUG_LINE_INDEX, FRAGMENTS } from "../code/snippet";
import { EASE, lerpFrames, withAlpha } from "../lib/anim";
import { CodeTerminal, TERMINAL, lineCenterY } from "../components/CodeTerminal";
import { Headline } from "../components/Headline";
import { HudRings } from "../components/HudRings";
import { HoloPanel } from "../components/HoloPanel";
import { PUSH_IN } from "./Scene3FindBug";

const ORIGIN_Y = TERMINAL.top + lineCenterY(BUG_LINE_INDEX);

const RING_PANELS = [
  { x: -300, y: -560, r: -8, frag: 0 },
  { x: 330, y: -420, r: 6, frag: 2 },
  { x: -340, y: 380, r: 5, frag: 3 },
  { x: 320, y: 540, r: -6, frag: 5 },
  { x: -80, y: -780, r: 2, frag: 7 },
  { x: 60, y: 760, r: -3, frag: 9 },
];

/** 0:18–0:21 — red → electric blue. A wave of light rolls through the system; the climax. */
export const Scene5Wave: React.FC = () => {
  const frame = useCurrentFrame();
  const dur = SCENES.wave.duration;

  // Editor recedes into the system as the wave is released.
  const recede = lerpFrames(frame, [0, 30], [0, 1], EASE.outExpo);
  const editorOpacity = lerpFrames(frame, [8, 30], [1, 0]);

  // Expanding shockwave rings from the fixed line.
  const rings = [0, 6, 12].map((delay) => lerpFrames(frame, [delay, delay + 40], [0, 1], EASE.outExpo));

  // Horizontal light wave sweeping bottom → top through the whole frame.
  const sweepY = lerpFrames(frame, [2, 40], [2100, -500], EASE.inOutCubic);

  const exit = lerpFrames(frame, [dur - 14, dur], [0, 1]);

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      {/* Modules around the core light up as the wave passes */}
      {RING_PANELS.map((p, i) => {
        const screenY = 900 + p.y;
        const lit = lerpFrames(sweepY, [screenY - 100, screenY + 200], [1, 0]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 540 + p.x,
              top: screenY,
              transform: `translate(-50%, -50%) rotate(${p.r}deg) scale(${0.62 + lit * 0.06})`,
              opacity: lit * 0.75,
              filter: `blur(${(1 - lit) * 6 + 1.5}px)`,
            }}
          >
            <HoloPanel lines={FRAGMENTS[p.frag]} title={`module_${String(p.frag + 1).padStart(2, "0")}.cs`} accent={COLORS.blue} seed={`w${i}`} width={520} ok />
          </div>
        );
      })}

      <AbsoluteFill
        style={{
          transformOrigin: `50% ${ORIGIN_Y}px`,
          transform: `scale(${(1 + PUSH_IN) * (1 - recede * 0.35)})`,
          opacity: editorOpacity,
          filter: `blur(${recede * 6}px)`,
        }}
      >
        <CodeTerminal linesVisible={99} spotlight={1 - recede} typed={99} showCursor={false} fixed={1} output="fixed" outputOpacity={1} statusLabel="BUILD OK" statusIcon="check" />
      </AbsoluteFill>

      {rings.map((t, i) =>
        t > 0 && t < 1 ? (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 540 - 1400 * t,
              top: ORIGIN_Y - 1400 * t,
              width: 2800 * t,
              height: 2800 * t,
              borderRadius: "50%",
              border: `${10 - i * 3}px solid ${withAlpha(COLORS.blueHot, (1 - t) * 0.9)}`,
              boxShadow: `0 0 80px ${withAlpha(COLORS.blue, (1 - t) * 0.8)}, inset 0 0 80px ${withAlpha(COLORS.blue, (1 - t) * 0.6)}`,
            }}
          />
        ) : null,
      )}

      {/* Light wave band */}
      <div
        style={{
          position: "absolute",
          left: -100,
          right: -100,
          top: sweepY - 260,
          height: 520,
          background: `linear-gradient(to bottom, transparent 0%, ${withAlpha(COLORS.blue, 0.45)} 35%, ${withAlpha(COLORS.blueHot, 0.9)} 50%, ${withAlpha(COLORS.blue, 0.45)} 65%, transparent 100%)`,
          mixBlendMode: "screen",
          filter: "blur(10px)",
        }}
      />

      <HudRings
        cx={540}
        cy={900}
        color={COLORS.blueHot}
        draw={lerpFrames(frame, [18, 50], [0, 1], EASE.outExpo)}
        scale={0.8 + lerpFrames(frame, [18, dur], [0, 0.25])}
        opacity={0.8}
      />
      <Headline text="SYSTEM" at={26} y={740} size={150} color={COLORS.white} glow={withAlpha(COLORS.blue, 0.95)} tracking={0.16} glitch={0.4} seed="s5a" />
      <Headline text="RESTORED" at={30} y={890} size={150} color={COLORS.blueHot} glow={withAlpha(COLORS.blue, 0.95)} tracking={0.1} glitch={0.4} seed="s5b" />
    </AbsoluteFill>
  );
};
