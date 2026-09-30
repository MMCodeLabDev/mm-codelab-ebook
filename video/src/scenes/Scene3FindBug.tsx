import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../config/theme";
import { BEATS, SCENES } from "../config/timeline";
import { BUG_LINE_INDEX, HINT, SNIPPET_LINES } from "../code/snippet";
import { EASE, lerpFrames, withAlpha } from "../lib/anim";
import { Headline } from "../components/Headline";
import { CodeTerminal, TERMINAL, lineCenterY } from "../components/CodeTerminal";
import { Callout } from "../components/Callout";

export const HINT_TOP = 1262;
/** Slow push-in on the editor during this scene; later scenes start from it for seamless cuts. */
export const PUSH_IN = 0.035;

/** 0:07–0:14 — the camera stops on one module. A real C# bug. CAN YOU SEE IT? */
export const Scene3FindBug: React.FC = () => {
  const frame = useCurrentFrame();
  const b = BEATS.findBug;
  const dur = SCENES.findBug.duration;

  // Camera lands: from a close, tilted, blurred approach to a locked-off shot, then a slow push-in.
  const land = lerpFrames(frame, [0, 22], [0, 1], EASE.outExpo);
  const push = lerpFrames(frame, [22, dur], [0, 1]);
  const scale = 1.5 - 0.5 * land + push * PUSH_IN;
  const tilt = (1 - land) * 14;
  const blur = (1 - land) * 12;

  const linesVisible = lerpFrames(frame, [4, 30], [0, SNIPPET_LINES.length]);
  const spotlight = lerpFrames(frame, [b.spotlight, b.spotlight + 18], [0, 1], EASE.inOutCubic);
  const outputIn = lerpFrames(frame, [34, 44], [0, 1]);
  const hint = lerpFrames(frame, [b.hint, b.hint + 12], [0, 1], EASE.outExpo);
  const bugScreenY = TERMINAL.top + lineCenterY(BUG_LINE_INDEX);
  const beamPulse = 0.8 + 0.2 * Math.sin(frame * 0.25);

  return (
    <AbsoluteFill>
      {/* Volumetric light shaft onto the bug line */}
      <div
        style={{
          position: "absolute",
          left: 140,
          top: bugScreenY - 900,
          width: 800,
          height: 940,
          opacity: spotlight * 0.55 * beamPulse,
          background: `linear-gradient(to bottom, transparent 0%, ${withAlpha(COLORS.red, 0.08)} 45%, ${withAlpha(COLORS.redHot, 0.35)} 100%)`,
          clipPath: "polygon(42% 0%, 58% 0%, 100% 100%, 0% 100%)",
          filter: "blur(16px)",
          mixBlendMode: "screen",
        }}
      />

      <AbsoluteFill
        style={{
          transformOrigin: `50% ${bugScreenY}px`,
          transform: `perspective(1400px) rotateX(${tilt}deg) scale(${scale})`,
          filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
          opacity: land,
        }}
      >
        <CodeTerminal
          linesVisible={linesVisible}
          spotlight={spotlight}
          typed={0}
          showCursor={false}
          fixed={0}
          output="buggy"
          outputOpacity={outputIn}
          statusLabel="ANOMALY"
          statusIcon="alert"
        />
      </AbsoluteFill>

      <Headline text="CAN YOU SEE IT?" at={b.canYouSeeIt} y={392} size={92} color={COLORS.white} glow={withAlpha(COLORS.red, 0.8)} tracking={0.06} glitch={0.7} />

      {/* Hint so the story works with the sound off */}
      <div style={{ transform: `translateY(${(1 - hint) * 30}px)` }}>
        <Callout top={HINT_TOP} color={COLORS.red} opacity={hint * lerpFrames(frame, [dur - 6, dur], [1, 0.9])}>
          <div style={{ fontSize: 30, letterSpacing: "0.3em", color: COLORS.redHot, fontWeight: 600 }}>HINT</div>
          <div style={{ fontSize: 58, fontWeight: 700, letterSpacing: "0.04em", marginTop: 4 }}>{HINT.title}</div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 36, color: COLORS.redHot, marginTop: 6, fontVariantLigatures: "none" }}>{HINT.detail}</div>
        </Callout>
      </div>
    </AbsoluteFill>
  );
};
