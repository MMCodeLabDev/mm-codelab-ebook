import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../config/theme";
import { BEATS, SCENES } from "../config/timeline";
import { EASE, lerpFrames, withAlpha } from "../lib/anim";
import { Headline } from "../components/Headline";
import { HudRings } from "../components/HudRings";

const BOOT_LOG = ["> integrity check ....... FAILED", "> core power ............ 0%", "> auto-recovery ......... OFFLINE"];

/** 0:00–0:03 — black, impact, emergency lights, interface boots: SYSTEM FAILURE / 10 SECONDS REMAIN. */
export const Scene1Failure: React.FC = () => {
  const frame = useCurrentFrame();
  const b = BEATS.failure;
  const end = SCENES.failure.duration;

  const ringsDraw = lerpFrames(frame, [b.interfaceOn, b.interfaceOn + 30], [0, 1], EASE.outExpo);
  const ringsPulse = 1 + 0.03 * Math.sin(frame * 0.4);
  const exit = lerpFrames(frame, [end - 8, end], [0, 1], EASE.inExpo);

  const tenIn = lerpFrames(frame, [b.secondsRemain, b.secondsRemain + 10], [0, 1], EASE.outExpo);
  const tenScale = 1.6 - 0.6 * tenIn;

  return (
    <AbsoluteFill style={{ opacity: 1 - exit * 0.9, transform: `scale(${1 + exit * 0.15})`, filter: `blur(${exit * 8}px)` }}>
      <HudRings cx={540} cy={860} color={COLORS.red} draw={ringsDraw} scale={ringsPulse} opacity={0.75} />

      <Headline text="SYSTEM" at={b.systemFailure} y={620} size={176} color={COLORS.white} glow={withAlpha(COLORS.red, 0.9)} tracking={0.12} seed="sys" />
      <Headline text="FAILURE" at={b.systemFailure + 3} y={790} size={176} color={COLORS.red} glow={withAlpha(COLORS.red, 0.9)} tracking={0.12} seed="fail" />

      {frame >= b.secondsRemain && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1040,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 28,
            opacity: tenIn,
            transform: `scale(${tenScale})`,
          }}
        >
          <span
            style={{
              fontFamily: FONTS.display,
              fontWeight: 700,
              fontSize: 190,
              color: COLORS.red,
              textShadow: `0 0 30px ${COLORS.red}, 0 0 90px ${withAlpha(COLORS.red, 0.6)}`,
              lineHeight: 1,
            }}
          >
            10
          </span>
          <span
            style={{
              fontFamily: FONTS.display,
              fontWeight: 700,
              fontSize: 62,
              lineHeight: 0.95,
              letterSpacing: "0.12em",
              color: COLORS.white,
              textShadow: `0 0 20px ${withAlpha(COLORS.red, 0.8)}`,
            }}
          >
            SECONDS
            <br />
            REMAIN
          </span>
        </div>
      )}

      {/* Boot log — foreshadows the bug ("core power 0%") */}
      <div style={{ position: "absolute", left: 140, top: 1300 }}>
        {BOOT_LOG.map((line, i) => {
          const start = b.interfaceOn + 6 + i * 7;
          const chars = Math.floor(lerpFrames(frame, [start, start + 14], [0, line.length]));
          return (
            <div
              key={i}
              style={{
                fontFamily: FONTS.mono,
                fontSize: 26,
                lineHeight: 1.6,
                color: i === 1 ? COLORS.redHot : withAlpha(COLORS.redHot, 0.65),
                whiteSpace: "pre",
              }}
            >
              {line.slice(0, chars)}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
