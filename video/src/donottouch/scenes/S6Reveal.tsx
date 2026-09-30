import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../../config/theme";
import { EASE, lerpFrames, mix, withAlpha } from "../../lib/anim";
import { BookCover } from "../../components/BookCover";
import { BrandPlate } from "../../components/BrandPlate";
import { BEAT, SCENES } from "../timeline";

/** 0:21–0:25 — hard cut to black. A knowing line. The book. Short and elegant. */
export const S6Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const f = frame + SCENES.reveal.from;

  const line = lerpFrames(f, [BEAT.everyDev, BEAT.everyDev + 18], [0, 1], EASE.outExpo);
  const lift = lerpFrames(f, [BEAT.lift, BEAT.lift + 20], [0, 1], EASE.inOutCubic);
  const cover = lerpFrames(f, [BEAT.cover, BEAT.cover + 26], [0, 1], EASE.outExpo);
  const title = lerpFrames(f, [BEAT.title, BEAT.title + 14], [0, 1], EASE.outExpo);
  const subtitle = lerpFrames(f, [BEAT.subtitle, BEAT.subtitle + 14], [0, 1], EASE.outExpo);
  const brand = lerpFrames(f, [BEAT.brand, BEAT.brand + 14], [0, 1], EASE.outExpo);
  const sheen = lerpFrames(f, [BEAT.cover + 14, BEAT.cover + 48], [-0.6, 1.6], EASE.inOutCubic);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: mix(800, 292, lift),
          textAlign: "center",
          transform: `scale(${mix(1, 0.74, lift)})`,
          transformOrigin: "50% 0%",
          opacity: line,
          filter: `blur(${(1 - line) * 10}px)`,
          fontFamily: FONTS.brand,
          fontWeight: 800,
          fontSize: 66,
          lineHeight: 1.15,
          letterSpacing: "-0.01em",
          color: COLORS.white,
        }}
      >
        Every developer
        <br />
        has seen <span style={{ color: COLORS.blueHot, textShadow: `0 0 24px ${withAlpha(COLORS.blue, 0.6)}` }}>this code.</span>
      </div>

      <BookCover cx={540} top={468} height={480} enter={cover} tilt={mix(24, 0, cover) + Math.sin(f * 0.05) * 2.5 * cover} sheen={sheen} />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1012,
          textAlign: "center",
          fontFamily: FONTS.brand,
          fontWeight: 800,
          fontSize: 58,
          color: COLORS.white,
          opacity: title,
          transform: `translateY(${(1 - title) * 18}px)`,
        }}
      >
        C# No Complications
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1092,
          textAlign: "center",
          fontFamily: FONTS.display,
          fontWeight: 600,
          fontSize: 42,
          letterSpacing: "0.05em",
          color: COLORS.blueHot,
          opacity: subtitle,
          transform: `translateY(${(1 - subtitle) * 14}px)`,
          textShadow: `0 0 20px ${withAlpha(COLORS.blue, 0.5)}`,
        }}
      >
        Learn what the code actually does.
      </div>
      <BrandPlate top={1182} logoHeight={58} enter={brand} />
    </AbsoluteFill>
  );
};
