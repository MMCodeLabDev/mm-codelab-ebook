import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../../config/theme";
import { EASE, lerpFrames, withAlpha } from "../../lib/anim";
import { Icon } from "../../components/Icon";
import { BEAT, SCENES } from "../timeline";
import { accent, lampPulse } from "../look";
import { Caret, LegacyEditor, colX, lineY } from "../components/LegacyEditor";
import { MetaCard } from "../components/MetaCard";
import { MousePointer, pointerAt } from "../components/MousePointer";
import { KeyCap } from "../components/KeyCap";
import { COMMENT_LINE, DEV_COMMENT, INDENT, SACRED_LINE, SACRED_TEXT, WARNING_LINES } from "../code";

/** Rest position near the build terminal (scene 5 starts the pointer from here). */
export const POINTER_REST = { x: 872, y: 1406 } as const;

const CLICK_COMMENT = BEAT.typeStart - 4;
const typeEnd = BEAT.typeStart + DEV_COMMENT.length * BEAT.typeFramesPerChar;

const PATH = [
  [BEAT.pointerIn, 1010, 1540],
  [CLICK_COMMENT, colX(INDENT) + 2, lineY(COMMENT_LINE) - 6],
  [BEAT.typeStart + 18, colX(INDENT + 26), lineY(COMMENT_LINE) + 64],
  [BEAT.selectStart - 6, colX(INDENT + 26), lineY(COMMENT_LINE) + 64],
  [BEAT.selectStart, colX(INDENT) + 2, lineY(SACRED_LINE) - 6],
  [BEAT.selectEnd, colX(INDENT + SACRED_TEXT.length) + 2, lineY(SACRED_LINE) - 6],
  [BEAT.deleteAt + 6, colX(INDENT + SACRED_TEXT.length) + 2, lineY(SACRED_LINE) - 6],
  [BEAT.enterAt - 4, POINTER_REST.x, POINTER_REST.y],
] as const;

const TERMINAL_IN = BEAT.deleteAt + 4;
const COMMAND = "dotnet build";

/** 0:08–0:13 — "Let's clean this up." Select. Delete. Enter. Silence. BUILD SUCCESSFUL. */
export const S3Cleanup: React.FC = () => {
  const frame = useCurrentFrame();
  const f = frame + SCENES.cleanup.from;

  const commentChars = lerpFrames(f, [BEAT.typeStart, typeEnd], [0, DEV_COMMENT.length]);
  const selection = f >= BEAT.deleteAt ? 0 : lerpFrames(f, [BEAT.selectStart, BEAT.selectEnd], [0, 1]);
  const deleted = f >= BEAT.deleteAt;
  const silent = f >= BEAT.enterAt && f < BEAT.silenceEnd;
  const success = f >= BEAT.silenceEnd;

  let caret: Caret | null = null;
  if (f >= CLICK_COMMENT && f < BEAT.selectStart)
    caret = { line: COMMENT_LINE, col: INDENT + Math.floor(commentChars), blink: f < BEAT.typeStart || f >= typeEnd };
  else if (deleted) caret = { line: SACRED_LINE, col: INDENT, blink: true };

  const pointer = pointerAt(f, PATH);
  const pressed =
    lerpFrames(f, [CLICK_COMMENT - 1, CLICK_COMMENT, CLICK_COMMENT + 4], [0, 1, 0]) +
    (f >= BEAT.selectStart && f < BEAT.selectEnd ? 1 : 0);

  const focusLines = f < BEAT.selectStart - 6 ? [COMMENT_LINE, ...WARNING_LINES, SACRED_LINE] : [...WARNING_LINES, SACRED_LINE];
  const terminal = lerpFrames(f, [TERMINAL_IN, TERMINAL_IN + 8], [0, 1], EASE.outExpo);
  const commandChars = Math.floor(lerpFrames(f, [TERMINAL_IN + 2, BEAT.enterAt - 2], [0, COMMAND.length]));
  const keyPress = lerpFrames(f, [BEAT.enterAt - 2, BEAT.enterAt, BEAT.enterAt + 6], [0, 1, 0]);
  const successIn = lerpFrames(f, [BEAT.silenceEnd, BEAT.silenceEnd + 14], [0, 1], EASE.outExpo);
  const color = success ? COLORS.blueHot : COLORS.redHot;

  return (
    <AbsoluteFill>
      <LegacyEditor
        commentChars={commentChars}
        selection={selection}
        deleted={deleted}
        ghostChars={0}
        caret={caret}
        focus={success ? 0.3 : 0.4}
        focusLines={focusLines}
        warningPulse={silent || success ? 0.15 : lampPulse(f, 24)}
        border={accent(f, 0.5)}
        status={success ? { label: "BUILD OK", icon: "check", color: COLORS.blueHot } : { label: "LIVE", icon: "dot", color: COLORS.redHot }}
        brightness={silent ? 0.6 : 1}
      />

      <MetaCard f={f} opacity={lerpFrames(f, [BEAT.typeStart, BEAT.typeStart + 14], [1, 0])} />

      {/* Build terminal → result */}
      {f >= TERMINAL_IN && (
        <div
          style={{
            position: "absolute",
            left: 140,
            right: 140,
            top: 1270,
            height: 172,
            borderRadius: 18,
            border: `2px solid ${withAlpha(success ? COLORS.blue : COLORS.muted, success ? 0.8 : 0.35)}`,
            background: `linear-gradient(160deg, ${withAlpha(success ? COLORS.blue : COLORS.navyLight, success ? 0.18 : 0.6)}, ${withAlpha(COLORS.black, 0.75)})`,
            boxShadow: success ? `0 0 60px ${withAlpha(COLORS.blue, 0.4)}` : "none",
            opacity: terminal * (silent ? 0.7 : 1),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `translateY(${(1 - terminal) * 20}px)`,
          }}
        >
          {!success ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "0 34px" }}>
              <span style={{ fontFamily: FONTS.mono, fontSize: 34, color: COLORS.blueIce }}>
                <span style={{ color: COLORS.muted }}>{"> "}</span>
                {COMMAND.slice(0, commandChars)}
              </span>
              <KeyCap press={keyPress} color={COLORS.blueHot} />
            </div>
          ) : (
            <div style={{ textAlign: "center", opacity: successIn, transform: `scale(${0.94 + 0.06 * successIn})` }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 20,
                  fontFamily: FONTS.display,
                  fontWeight: 700,
                  fontSize: 66,
                  letterSpacing: "0.08em",
                  color: COLORS.white,
                  textShadow: `0 0 24px ${withAlpha(COLORS.blue, 0.9)}`,
                }}
              >
                BUILD SUCCESSFUL
                <Icon name="check" size={56} color={color} style={{ filter: `drop-shadow(0 0 12px ${COLORS.blue})` }} />
              </div>
              <div style={{ marginTop: 6, fontFamily: FONTS.mono, fontSize: 24, color: COLORS.blueHot }}>0 errors · 0 warnings</div>
            </div>
          )}
        </div>
      )}

      <MousePointer x={pointer.x} y={pointer.y} opacity={lerpFrames(f, [BEAT.pointerIn, BEAT.pointerIn + 8], [0, 1])} pressed={Math.min(1, pressed)} />
    </AbsoluteFill>
  );
};
