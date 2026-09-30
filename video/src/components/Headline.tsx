import React from "react";
import { useCurrentFrame } from "remotion";
import { FONTS } from "../config/theme";
import { EASE, lerpFrames } from "../lib/anim";
import { GlitchText } from "./GlitchText";

type Props = {
  text: string;
  /** Frame (relative to the parent Sequence) at which the headline slams in. */
  at: number;
  /** Frame at which it leaves (optional). */
  out?: number;
  y: number;
  size?: number;
  color: string;
  glow?: string;
  tracking?: number;
  glitch?: number;
  seed?: string;
  font?: string;
  weight?: number;
};

/**
 * Centered cinematic headline: tracks in from wide letter-spacing + blur,
 * with a glitch burst on entry that settles.
 */
export const Headline: React.FC<Props> = ({
  text,
  at,
  out,
  y,
  size = 120,
  color,
  glow,
  tracking = 0.08,
  glitch = 1,
  seed,
  font = FONTS.display,
  weight = 700,
}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;

  const t = lerpFrames(frame, [at, at + 14], [0, 1], EASE.outExpo);
  const exit = out === undefined ? 0 : lerpFrames(frame, [out - 8, out], [0, 1], EASE.inExpo);
  const glitchAmt = glitch * (lerpFrames(frame, [at, at + 16], [1, 0.08]) + exit);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        display: "flex",
        justifyContent: "center",
        opacity: t * (1 - exit),
        transform: `scale(${1.25 - 0.25 * t + exit * 0.1})`,
        filter: `blur(${(1 - t) * 14 + exit * 10}px)`,
      }}
    >
      <GlitchText
        text={text}
        intensity={glitchAmt}
        color={color}
        glow={glow}
        seed={seed ?? text}
        style={{
          fontFamily: font,
          fontWeight: weight,
          fontSize: size,
          lineHeight: 1,
          letterSpacing: `${tracking + (1 - t) * 0.3}em`,
          textTransform: "uppercase",
          // Optical centering: letter-spacing adds trailing space on the last glyph.
          marginRight: `-${tracking}em`,
        }}
      />
    </div>
  );
};
