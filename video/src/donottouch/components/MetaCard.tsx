import React from "react";
import { random } from "remotion";
import { COLORS, FONTS } from "../../config/theme";
import { EASE, lerpFrames, withAlpha } from "../../lib/anim";
import { BEAT } from "../timeline";

const DAYS = "847";

/** "LAST MODIFIED: 847 DAYS AGO" — the file's ominous metadata, film-title style. */
export const MetaCard: React.FC<{ f: number; opacity: number }> = ({ f, opacity }) => {
  const enter = lerpFrames(f, [BEAT.lastModified, BEAT.lastModified + 22], [0, 1], EASE.outExpo);
  const settle = BEAT.lastModified + 10;
  // Digits scramble briefly, then lock — as if the system itself hesitates.
  const days = f < settle ? [...DAYS].map((_, i) => String(Math.floor(random(`d${i}-${f}`) * 10))).join("") : DAYS;
  const rule = lerpFrames(f, [BEAT.lastModified + 4, BEAT.lastModified + 30], [0, 1], EASE.outExpo);
  if (opacity * enter <= 0) return null;

  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1262, textAlign: "center", opacity: opacity * enter }}>
      <div style={{ margin: "0 auto", width: 560 * rule, height: 1, background: withAlpha(COLORS.red, 0.6) }} />
      <div
        style={{
          marginTop: 22,
          fontFamily: FONTS.display,
          fontWeight: 600,
          fontSize: 30,
          letterSpacing: `${0.42 + (1 - enter) * 0.3}em`,
          marginRight: "-0.42em",
          color: withAlpha(COLORS.white, 0.7),
        }}
      >
        LAST MODIFIED
      </div>
      <div
        style={{
          marginTop: 4,
          fontFamily: FONTS.display,
          fontWeight: 700,
          fontSize: 80,
          lineHeight: 1.05,
          letterSpacing: "0.08em",
          color: COLORS.white,
          filter: `blur(${(1 - enter) * 8}px)`,
          textShadow: `0 0 24px ${withAlpha(COLORS.red, 0.55)}`,
        }}
      >
        <span style={{ color: COLORS.redHot, fontFamily: FONTS.mono, fontWeight: 700, fontSize: 74 }}>{days}</span> DAYS AGO
      </div>
      <div style={{ margin: "20px auto 0", width: 560 * rule, height: 1, background: withAlpha(COLORS.red, 0.6) }} />
    </div>
  );
};
