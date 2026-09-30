import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../config/theme";
import { BEATS, SCENES } from "../config/timeline";
import { FRAGMENTS, SNIPPET_LINES } from "../code/snippet";
import { lerpFrames, withAlpha } from "../lib/anim";
import { Headline } from "../components/Headline";
import { HoloPanel } from "../components/HoloPanel";
import { Icon } from "../components/Icon";

const PERSPECTIVE = 1000;
const TARGET_Z = -5200;

type Placed = { x: number; y: number; z: number; ry: number; lines: readonly string[]; broken: boolean; title: string };

const BROKEN = new Set([1, 4, 6, 8]);

/** Panels spiral down a corridor; broken modules glitch in red. */
const PANELS: Placed[] = FRAGMENTS.map((lines, i) => {
  const side = i % 2 === 0 ? -1 : 1;
  return {
    x: side * (330 + (i % 3) * 60),
    y: -520 + ((i * 373) % 1040),
    z: -600 - i * 440,
    ry: -side * 28,
    lines,
    broken: BROKEN.has(i),
    title: `module_${String(i + 1).padStart(2, "0")}.cs`,
  };
});

const WARNINGS = [
  { x: 180, y: -380, z: -1300, text: "NullReferenceException" },
  { x: -260, y: 420, z: -2300, text: "STACK OVERFLOW" },
  { x: 240, y: 300, z: -3400, text: "CORE POWER 0%" },
  { x: -200, y: -300, z: -4100, text: "UNEXPECTED RESULT" },
];

/** 0:03–0:07 — rapid camera move through a holographic code system. FIND THE BUG. */
export const Scene2Flythrough: React.FC = () => {
  const frame = useCurrentFrame();
  const dur = SCENES.flythrough.duration;

  // Camera dolly: bursts forward, decelerates onto the target module.
  const camZ = lerpFrames(frame, [0, dur], [0, -TARGET_Z - 520], Easing.bezier(0.5, 0, 0.2, 1));
  const roll = Math.sin(frame * 0.05) * 4 - lerpFrames(frame, [0, dur], [6, 0]);
  const swayX = Math.sin(frame * 0.07) * 60 * lerpFrames(frame, [dur - 30, dur], [1, 0]);
  const speed = Math.abs(
    lerpFrames(frame + 1, [0, dur], [0, 1], Easing.bezier(0.5, 0, 0.2, 1)) - lerpFrames(frame, [0, dur], [0, 1], Easing.bezier(0.5, 0, 0.2, 1)),
  );
  const motionBlur = Math.min(6, speed * 260);
  const enter = lerpFrames(frame, [0, 8], [0, 1]);
  const exit = lerpFrames(frame, [dur - 6, dur], [0, 1]);

  const place = (x: number, y: number, z: number, ry: number, child: React.ReactNode, key: string) => {
    const zRel = z + camZ;
    if (zRel > PERSPECTIVE - 120) return null; // passed the camera
    const fog = lerpFrames(zRel, [-5200, -2800, 200, PERSPECTIVE - 160], [0, 1, 1, 0]);
    return (
      <div
        key={key}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) rotateY(${ry}deg)`,
          opacity: fog,
        }}
      >
        {child}
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ opacity: enter * (1 - exit * 0.4) }}>
      <AbsoluteFill style={{ perspective: PERSPECTIVE, perspectiveOrigin: "50% 50%", filter: motionBlur > 0.5 ? `blur(${motionBlur * 0.35}px)` : undefined }}>
        <div
          style={{
            position: "absolute",
            left: 540 + swayX,
            top: 900,
            transformStyle: "preserve-3d",
            transform: `rotateZ(${roll}deg) translateZ(${camZ}px)`,
          }}
        >
          {PANELS.map((p, i) =>
            place(
              p.x,
              p.y,
              p.z,
              p.ry,
              <HoloPanel lines={p.lines} title={p.title} accent={COLORS.blue} broken={p.broken} seed={`p${i}`} width={560} />,
              `panel${i}`,
            ),
          )}
          {WARNINGS.map((w, i) =>
            place(
              w.x,
              w.y,
              w.z,
              0,
              <div
                style={{
                  fontFamily: FONTS.display,
                  fontWeight: 700,
                  fontSize: 44,
                  letterSpacing: "0.1em",
                  padding: "10px 24px",
                  whiteSpace: "nowrap",
                  color: COLORS.white,
                  background: withAlpha(COLORS.red, 0.25),
                  border: `2px solid ${COLORS.red}`,
                  boxShadow: `0 0 40px ${withAlpha(COLORS.red, 0.6)}`,
                  opacity: Math.floor(frame / 4 + i) % 3 === 0 ? 0.4 : 1,
                }}
              >
                <Icon name="alert" size={40} color={COLORS.red} style={{ marginRight: 14 }} />
                {w.text}
              </div>,
              `warn${i}`,
            ),
          )}
          {/* The target module — becomes the hero editor in the next scene */}
          {place(0, -40, TARGET_Z, 0, <HoloPanel lines={SNIPPET_LINES} title="PowerCore.cs" accent={COLORS.red} seed="target" width={640} fontSize={24} />, "target")}
        </div>
      </AbsoluteFill>

      <Headline text="FIND" at={BEATS.flythrough.findTheBug} y={700} size={168} color={COLORS.white} glow={withAlpha(COLORS.blue, 0.9)} tracking={0.14} seed="find" />
      <Headline
        text="THE BUG."
        at={BEATS.flythrough.findTheBug + 4}
        y={872}
        size={168}
        color={COLORS.red}
        glow={withAlpha(COLORS.red, 0.9)}
        tracking={0.1}
        seed="bug"
      />
    </AbsoluteFill>
  );
};
