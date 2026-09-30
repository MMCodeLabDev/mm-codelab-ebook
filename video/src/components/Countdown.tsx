import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../config/theme";
import { COUNTDOWN, SCENES } from "../config/timeline";
import { SAFE } from "../config/video";
import { lerpFrames, withAlpha } from "../lib/anim";

const format = (sec: number) => {
  const s = Math.max(0, sec);
  const whole = Math.floor(s);
  const hundredths = Math.floor((s - whole) * 100);
  return `00:${String(whole).padStart(2, "0")}.${String(hundredths).padStart(2, "0")}`;
};

/**
 * "Core collapse" timer. Starts at 10 s on the "10 SECONDS REMAIN" beat, freezes
 * when the build succeeds (with < 1 s to spare) and turns blue.
 */
export const Countdown: React.FC = () => {
  const frame = useCurrentFrame();
  const appear = SCENES.flythrough.from - 4;
  if (frame < appear || frame > COUNTDOWN.hide) return null;

  const remaining = lerpFrames(frame, [COUNTDOWN.start, COUNTDOWN.stop], [COUNTDOWN.fromSeconds, COUNTDOWN.endSeconds]);
  const saved = frame >= COUNTDOWN.stop;
  const color = saved ? COLORS.blueHot : COLORS.red;
  const critical = !saved && remaining < 3;
  const pulse = critical ? 0.6 + 0.4 * Math.abs(Math.sin(frame * 0.5)) : 1;
  const opacity =
    lerpFrames(frame, [appear, appear + 8], [0, 1]) * lerpFrames(frame, [COUNTDOWN.hide - 12, COUNTDOWN.hide], [1, 0]);

  return (
    <div
      style={{
        position: "absolute",
        top: SAFE.top + 6,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.display,
          fontWeight: 600,
          fontSize: 24,
          letterSpacing: "0.32em",
          color: withAlpha(saved ? COLORS.blueIce : COLORS.redHot, 0.85),
        }}
      >
        {saved ? "CORE STABILIZED" : "CORE COLLAPSE IN"}
      </div>
      <div
        style={{
          fontFamily: FONTS.mono,
          fontWeight: 700,
          fontSize: 58,
          letterSpacing: "0.04em",
          color,
          opacity: pulse,
          textShadow: `0 0 20px ${withAlpha(color, 0.8)}, 0 0 50px ${withAlpha(color, 0.5)}`,
        }}
      >
        {format(remaining)}
      </div>
    </div>
  );
};
