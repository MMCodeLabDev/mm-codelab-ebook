import React from "react";
import { random, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../../config/theme";
import { EASE, lerpFrames, withAlpha } from "../../lib/anim";
import { GlitchText } from "../../components/GlitchText";
import { Icon } from "../../components/Icon";
import { BEAT, SCENES } from "../timeline";

const SCRAMBLE = "ONLFIE#/0_";
const scramble = (word: string, frame: number) =>
  [...word].map((ch, i) => (random(`sp-${i}-${frame}`) < 0.5 ? SCRAMBLE[Math.floor(random(`spc-${i}-${frame}`) * SCRAMBLE.length)] : ch)).join("");

/** Where the plate sits: centre stage in scene 1, top HUD while working, centre again for the outage. */
const layout = (f: number) => {
  if (f < SCENES.legacy.from + 30) {
    const t = lerpFrames(f, [SCENES.legacy.from - 2, SCENES.legacy.from + 30], [0, 1], EASE.inOutCubic);
    return { y: 930 + (262 - 930) * t, scale: 1 - 0.42 * t };
  }
  if (f < BEAT.offline) return { y: 262, scale: 0.58 };
  if (f < SCENES.toldYou.from) {
    const t = lerpFrames(f, [BEAT.offline, BEAT.offline + 6], [0, 1], EASE.outExpo);
    return { y: 262 + (330 - 262) * t, scale: 0.58 + 0.42 * t };
  }
  return { y: 262, scale: 0.58 };
};

/**
 * "PRODUCTION — ONLINE". The status the whole story hangs on. Global layer driven by
 * absolute frame: flips to OFFLINE (scramble + glitch) on the outage beat.
 */
export const StatusPlate: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < BEAT.production || frame >= SCENES.reveal.from) return null;

  const { y, scale } = layout(frame);
  const labelIn = lerpFrames(frame, [BEAT.production, BEAT.production + 24], [0, 1], EASE.outExpo);
  const wordIn = lerpFrames(frame, [BEAT.online, BEAT.online + 20], [0, 1], EASE.outExpo);
  const flipping = frame >= BEAT.offline && frame < BEAT.offline + 8;
  const offline = frame >= BEAT.offline;
  const word = flipping ? scramble("OFFLINE", frame) : offline ? "OFFLINE" : "ONLINE";
  const color = offline ? COLORS.red : COLORS.blueHot;
  const glitch = offline ? lerpFrames(frame, [BEAT.offline, BEAT.offline + 16], [1, 0.12]) + (frame >= BEAT.signalLoss && frame < SCENES.toldYou.from ? 0.8 : 0) : 0;
  const dotOn = offline ? Math.floor(frame / 6) % 2 === 0 : 0.55 + 0.45 * Math.sin(frame * 0.12) > 0.5;
  // Silence before the build: even the status light holds its breath.
  const hush = frame >= BEAT.enterAt && frame < BEAT.silenceEnd ? 0.45 : 1;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform: `scale(${scale})`,
        transformOrigin: "50% 0%",
        opacity: hush,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.display,
          fontWeight: 600,
          fontSize: 38,
          letterSpacing: `${0.5 + (1 - labelIn) * 0.3}em`,
          marginRight: "-0.5em",
          color: withAlpha(COLORS.white, 0.78),
          opacity: labelIn,
          filter: `blur(${(1 - labelIn) * 8}px)`,
        }}
      >
        PRODUCTION
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 6, opacity: wordIn, filter: `blur(${(1 - wordIn) * 10}px)` }}>
        <Icon name="dot" size={34} color={color} style={{ opacity: dotOn ? 1 : 0.25, filter: `drop-shadow(0 0 12px ${color})` }} />
        <GlitchText
          text={word}
          intensity={glitch}
          color={offline ? COLORS.red : COLORS.blueIce}
          glow={withAlpha(color, 0.85)}
          seed="plate"
          style={{ fontFamily: FONTS.display, fontWeight: 700, fontSize: 104, lineHeight: 1, letterSpacing: "0.14em" }}
        />
      </div>
    </div>
  );
};
