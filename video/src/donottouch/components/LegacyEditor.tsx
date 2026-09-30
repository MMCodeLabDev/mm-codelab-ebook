import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../../config/theme";
import { withAlpha } from "../../lib/anim";
import { CodeLine } from "../../components/CodeLine";
import { Icon, IconName } from "../../components/Icon";
import {
  COMMENT_LINE,
  DEV_COMMENT,
  EXTRA_TYPES,
  FILE_NAME,
  INDENT,
  LEGACY_LINES,
  PUNCHLINE,
  SACRED_LINE,
  SACRED_TEXT,
  WARNING_LINES,
} from "../code";

/** Fixed geometry, shared by every scene that shows the editor (seamless cuts). */
export const EDITOR = {
  left: 90,
  top: 404,
  width: 840,
  fontSize: 30,
  lineHeight: 48,
  headerHeight: 60,
  padTop: 16,
  padLeft: 18,
  gutter: 66,
  gap: 16,
} as const;

const CHAR_W = EDITOR.fontSize * 0.6; // JetBrains Mono advance width

const BORDER = 2;

/** Screen X of a code column / screen Y of a line centre (for the pointer). */
export const colX = (col: number) => EDITOR.left + BORDER + EDITOR.padLeft + EDITOR.gutter + EDITOR.gap + col * CHAR_W;
export const lineY = (line: number) =>
  EDITOR.top + BORDER + EDITOR.headerHeight + 1 + EDITOR.padTop + line * EDITOR.lineHeight + EDITOR.lineHeight / 2;

export type Caret = { line: number; col: number; blink: boolean };

type Props = {
  /** Characters of the developer's comment typed so far. */
  commentChars: number;
  /** 0..1 — how much of the sacred line is selected. */
  selection: number;
  deleted: boolean;
  /** Characters of the punchline typed by… something. */
  ghostChars: number;
  caret: Caret | null;
  /** 0..1 — dim every line except `focusLines`. */
  focus: number;
  focusLines: readonly number[];
  /** 0..1 — pulse of the tiny gutter warnings. */
  warningPulse: number;
  border: string;
  status: { label: string; icon: IconName; color: string };
  /** Brightness of the whole editor (silence / blackout moments). */
  brightness?: number;
  /** 0..1 — the punchline line lights up. */
  punchGlow?: number;
};

const WARNING_TINT = "#ff8f86";
const DEV_TINT = "#a9b4d8";
/** The punchline: bright, hot, unmistakable. */
const GHOST_TINT = "#ffc4c4";

/** A legacy production file in a cinematic IDE. */
export const LegacyEditor: React.FC<Props> = ({
  commentChars,
  selection,
  deleted,
  ghostChars,
  caret,
  focus,
  focusLines,
  warningPulse,
  border,
  status,
  brightness = 1,
  punchGlow = 0,
}) => {
  const frame = useCurrentFrame();
  const caretOn = caret ? (caret.blink ? Math.floor(frame / 9) % 2 === 0 : true) : false;
  const bodyHeight = LEGACY_LINES.length * EDITOR.lineHeight + EDITOR.padTop * 2;
  const mono: React.CSSProperties = { fontFamily: FONTS.mono, fontSize: EDITOR.fontSize };

  return (
    <div
      style={{
        position: "absolute",
        left: EDITOR.left,
        top: EDITOR.top,
        width: EDITOR.width,
        borderRadius: 20,
        overflow: "hidden",
        filter: brightness < 1 ? `brightness(${brightness})` : undefined,
        background: `linear-gradient(170deg, ${withAlpha(COLORS.navyLight, 0.94)} 0%, ${withAlpha(COLORS.navy, 0.95)} 45%, ${withAlpha(COLORS.black, 0.97)} 100%)`,
        border: `${BORDER}px solid ${border}`,
        boxShadow: `0 40px 120px rgba(0,0,0,0.75), 0 0 70px ${border}, inset 0 1px 0 rgba(255,255,255,0.07)`,
      }}
    >
      {/* Title bar */}
      <div
        style={{
          height: EDITOR.headerHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          borderBottom: `1px solid ${withAlpha(COLORS.muted, 0.18)}`,
          background: withAlpha(COLORS.black, 0.35),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {[COLORS.red, "#ffb020", COLORS.blue].map((c) => (
            <div key={c} style={{ width: 13, height: 13, borderRadius: 7, background: c, opacity: 0.8 }} />
          ))}
          <span style={{ fontFamily: FONTS.mono, fontSize: 22, color: COLORS.muted, marginLeft: 12 }}>{FILE_NAME}</span>
          <span style={{ fontFamily: FONTS.mono, fontSize: 18, color: COLORS.dim, marginLeft: 8 }}>core/legacy</span>
        </div>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontFamily: FONTS.display,
            fontWeight: 700,
            fontSize: 23,
            letterSpacing: "0.2em",
            color: status.color,
            textShadow: `0 0 12px ${withAlpha(status.color, 0.7)}`,
          }}
        >
          <Icon name={status.icon} size={20} color={status.color} />
          {status.label}
        </span>
      </div>

      {/* Code body */}
      <div style={{ position: "relative", height: bodyHeight }}>
        {LEGACY_LINES.map((source, i) => {
          const isComment = i === COMMENT_LINE;
          const isSacred = i === SACRED_LINE;
          const isWarning = (WARNING_LINES as readonly number[]).includes(i);
          const inFocus = focusLines.includes(i);
          const dim = inFocus ? 1 : 1 - focus * 0.55;

          let line: string = source;
          let tint: string | undefined;
          if (isComment) {
            line = commentChars > 0 ? " ".repeat(INDENT) + DEV_COMMENT.slice(0, Math.floor(commentChars)) : "";
            tint = DEV_TINT;
          } else if (isWarning) {
            tint = WARNING_TINT;
          } else if (isSacred && deleted) {
            line = "";
          }
          const ghost = isSacred && deleted && ghostChars > 0 ? " ".repeat(INDENT) + PUNCHLINE.slice(0, Math.floor(ghostChars)) : "";
          const showWarnIcon = isWarning || (isSacred && !deleted);

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: EDITOR.padTop + i * EDITOR.lineHeight,
                height: EDITOR.lineHeight,
                display: "flex",
                alignItems: "center",
                opacity: dim,
              }}
            >
              {/* Punchline line light */}
              {isSacred && punchGlow > 0 && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(90deg, transparent, ${withAlpha(COLORS.red, 0.28 * punchGlow)} 20%, ${withAlpha(COLORS.red, 0.08 * punchGlow)})`,
                    borderTop: `1px solid ${withAlpha(COLORS.red, 0.6 * punchGlow)}`,
                    borderBottom: `1px solid ${withAlpha(COLORS.red, 0.6 * punchGlow)}`,
                  }}
                />
              )}
              {/* Gutter */}
              <div style={{ position: "relative", width: EDITOR.gutter, marginLeft: EDITOR.padLeft, flexShrink: 0, height: "100%", display: "flex", alignItems: "center" }}>
                {showWarnIcon && (
                  <Icon
                    name="alert"
                    size={15}
                    color="#ffb020"
                    style={{ position: "absolute", left: 0, opacity: 0.35 + 0.65 * warningPulse, filter: `drop-shadow(0 0 ${6 * warningPulse}px #ffb020)` }}
                  />
                )}
                <span style={{ marginLeft: "auto", fontFamily: FONTS.mono, fontSize: 21, color: isSacred && deleted ? withAlpha(COLORS.red, 0.9) : COLORS.dim }}>
                  {i + 1}
                </span>
              </div>
              <span style={{ position: "relative", marginLeft: EDITOR.gap, ...mono }}>
                {/* Selection */}
                {isSacred && !deleted && selection > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: -6,
                      height: EDITOR.fontSize + 14,
                      left: `${INDENT}ch`,
                      width: `${SACRED_TEXT.length * selection}ch`,
                      background: withAlpha(COLORS.blue, 0.45),
                      borderRadius: 4,
                      ...mono,
                    }}
                  />
                )}
                {line.length > 0 && <CodeLine line={line} fontSize={EDITOR.fontSize} tint={tint} extraTypes={EXTRA_TYPES} />}
                {ghost.length > 0 && (
                  <CodeLine line="" fontSize={EDITOR.fontSize} insert={{ col: 0, text: ghost, color: GHOST_TINT }} />
                )}
                {/* Caret */}
                {caret && caret.line === i && (
                  <span
                    style={{
                      position: "absolute",
                      top: -5,
                      left: `${caret.col}ch`,
                      width: 4,
                      height: EDITOR.fontSize + 12,
                      background: COLORS.blueIce,
                      boxShadow: `0 0 12px ${COLORS.blueHot}`,
                      opacity: caretOn ? 1 : 0,
                      ...mono,
                    }}
                  />
                )}
                {/* Keeps empty lines at full height for caret placement */}
                <span style={{ ...mono, visibility: "hidden" }}> </span>
              </span>
            </div>
          );
        })}
      </div>

      {/* Status bar */}
      <div
        style={{
          height: 46,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          borderTop: `1px solid ${withAlpha(COLORS.muted, 0.18)}`,
          background: withAlpha(COLORS.black, 0.45),
          fontFamily: FONTS.mono,
          fontSize: 19,
          color: COLORS.muted,
        }}
      >
        <span>main · read-only</span>
        <span>{caret ? `Ln ${caret.line + 1}, Col ${caret.col + 1}` : "C# · UTF-8"}</span>
      </div>
    </div>
  );
};
