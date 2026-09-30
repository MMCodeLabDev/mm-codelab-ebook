import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../../config/theme";
import { EASE, lerpFrames, withAlpha } from "../../lib/anim";
import { GlitchText } from "../../components/GlitchText";
import { BEAT, SCENES } from "../timeline";
import { OUTAGE } from "../code";
import { SignalLoss } from "../components/SignalLoss";

const HITS = [BEAT.offline, BEAT.database, BEAT.auth, BEAT.api, BEAT.everything, BEAT.signalLoss];

/** Glitch energy: decaying spike after every hit, total collapse at the end. */
const energyAt = (f: number) => {
  let e = 0;
  for (const h of HITS) if (f >= h) e = Math.max(e, Math.exp(-(f - h) / 6));
  return Math.min(1, e + lerpFrames(f, [BEAT.signalLoss, SCENES.toldYou.from], [0, 1]));
};

const Row: React.FC<{ f: number; at: number; label: string; y: number; size: number; stacked?: boolean }> = ({ f, at, label, y, size, stacked }) => {
  if (f < at) return null;
  const t = lerpFrames(f, [at, at + 7], [0, 1], EASE.outExpo);
  const glitch = lerpFrames(f, [at, at + 10], [1, 0.1]) + energyAt(f) * 0.35;
  const style = { fontFamily: FONTS.display, fontWeight: 700, fontSize: size, lineHeight: 1, letterSpacing: "0.06em" } as const;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        display: "flex",
        flexDirection: stacked ? "column" : "row",
        alignItems: "center",
        justifyContent: "center",
        gap: stacked ? 8 : 22,
        opacity: t,
        transform: `scale(${1.35 - 0.35 * t})`,
        filter: `blur(${(1 - t) * 12}px)`,
      }}
    >
      <GlitchText text={label} intensity={glitch} color={COLORS.white} glow={withAlpha(COLORS.red, 0.6)} seed={`r-${label}`} style={style} />
      {!stacked && <span style={{ ...style, color: withAlpha(COLORS.white, 0.5) }}>—</span>}
      <GlitchText text="OFFLINE" intensity={glitch} color={COLORS.red} glow={withAlpha(COLORS.red, 0.95)} seed={`o-${label}`} style={style} />
    </div>
  );
};

/** 0:13–0:17 — production collapses. Accelerating hits, shake, tearing. */
export const S4Outage: React.FC = () => {
  const frame = useCurrentFrame();
  const f = frame + SCENES.outage.from;
  const energy = energyAt(f);
  const rows = [BEAT.database, BEAT.auth, BEAT.api];

  return (
    <AbsoluteFill>
      {/* Red strobe wash on each hit */}
      <AbsoluteFill style={{ background: withAlpha(COLORS.redDeep, 0.35 * energy), mixBlendMode: "screen" }} />

      {OUTAGE.map((label, i) => (
        <Row key={label} f={f} at={rows[i]} label={label} y={650 + i * 104} size={54} />
      ))}
      <Row f={f} at={BEAT.everything} label="EVERYTHING" y={1000} size={124} stacked />

      <SignalLoss intensity={energy * 0.9} seed="outage" />
    </AbsoluteFill>
  );
};
