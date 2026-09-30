import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../config/theme";
import { BEATS } from "../config/timeline";
import { FIX_INSERT } from "../code/snippet";
import { EASE, lerpFrames, mixColor, withAlpha } from "../lib/anim";
import { Headline } from "../components/Headline";
import { Callout } from "../components/Callout";
import { Icon } from "../components/Icon";
import { HINT_TOP, PUSH_IN } from "./Scene3FindBug";
import { BUG_LINE_INDEX } from "../code/snippet";
import { CodeTerminal, TERMINAL, lineCenterY } from "../components/CodeTerminal";

/** 0:14–0:18 — the cursor writes the fix, compilation runs: BUILDING… BUILD SUCCESSFUL. */
export const Scene4Fix: React.FC = () => {
  const frame = useCurrentFrame();
  const b = BEATS.fix;

  const typed = lerpFrames(frame, [b.typeStart, b.typeStart + FIX_INSERT.length * b.framesPerChar], [0, FIX_INSERT.length]);
  const building = frame >= b.buildStart && frame < b.buildEnd;
  const success = frame >= b.buildEnd;
  const buildProgress = lerpFrames(frame, [b.buildStart, b.buildEnd - 4], [0, 1], EASE.inOutCubic);
  const fixed = lerpFrames(frame, [b.buildEnd, b.buildEnd + 8], [0, 1]);
  const color = mixColor(COLORS.red, COLORS.blue, lerpFrames(frame, [b.typeStart, b.buildStart], [0, 1]));
  const dots = ".".repeat(1 + (Math.floor(frame / 5) % 3));
  const successPop = lerpFrames(frame, [b.buildEnd, b.buildEnd + 10], [0, 1], EASE.outBack);

  const status = success ? "BUILD OK" : building ? "BUILDING" : "EDITING";

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transformOrigin: `50% ${TERMINAL.top + lineCenterY(BUG_LINE_INDEX)}px`, transform: `scale(${1 + PUSH_IN})` }}>
        <CodeTerminal
          linesVisible={99}
          spotlight={1}
          typed={typed}
          showCursor={frame >= b.cursorIn && !success}
          fixed={fixed}
          output={success ? "fixed" : "buggy"}
          outputOpacity={success ? lerpFrames(frame, [b.buildEnd + 4, b.buildEnd + 12], [0, 1]) : lerpFrames(frame, [b.buildStart, b.buildStart + 6], [1, 0.25])}
          statusLabel={status}
          statusIcon={success ? "check" : "dot"}
        />
      </AbsoluteFill>

      {frame < b.buildStart && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 404,
            textAlign: "center",
            fontFamily: FONTS.display,
            fontWeight: 700,
            fontSize: 56,
            letterSpacing: "0.2em",
            color: COLORS.blueIce,
            opacity: lerpFrames(frame, [0, 8, b.buildStart - 6, b.buildStart], [0, 1, 1, 0]),
            textShadow: `0 0 20px ${COLORS.blue}`,
          }}
        >
          CAST ONE OPERAND
        </div>
      )}
      {building && <Headline text={`BUILDING${dots}`} at={b.buildStart} y={392} size={96} color={COLORS.blueIce} glow={withAlpha(COLORS.blue, 0.8)} tracking={0.1} glitch={0.3} seed="build" />}
      {success && (
        <Headline text="BUILD SUCCESSFUL" at={b.buildEnd} y={392} size={84} color={COLORS.white} glow={withAlpha(COLORS.blue, 0.95)} tracking={0.06} glitch={0.5} seed="ok" />
      )}

      {/* Build progress — takes over the hint card's slot from scene 3 */}
      <Callout top={HINT_TOP} color={color} opacity={1}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONTS.mono, fontSize: 26, color: COLORS.muted }}>
          <span>dotnet build</span>
          <span style={{ color: success ? COLORS.blueHot : COLORS.muted }}>
            {success ? "0 errors · 0 warnings" : frame >= b.buildStart ? `${Math.round(buildProgress * 100)}%` : "ready"}
          </span>
        </div>
        <div style={{ marginTop: 18, height: 14, borderRadius: 7, background: withAlpha(COLORS.muted, 0.2), overflow: "hidden" }}>
          <div
            style={{
              width: `${(success ? 1 : buildProgress) * 100}%`,
              height: "100%",
              borderRadius: 7,
              background: `linear-gradient(90deg, ${COLORS.blue}, ${COLORS.blueIce})`,
              boxShadow: `0 0 20px ${COLORS.blueHot}`,
            }}
          />
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: success ? COLORS.blueIce : COLORS.white,
            transform: `scale(${success ? 0.9 + successPop * 0.1 : 1})`,
          }}
        >
          {success ? (
            <>
              <Icon name="check" size={38} color={COLORS.blueHot} /> POWER RESTORED: 75%
            </>
          ) : frame >= b.buildStart ? (
            "COMPILING PowerCore.cs"
          ) : (
            "APPLYING FIX"
          )}
        </div>
      </Callout>
    </AbsoluteFill>
  );
};
