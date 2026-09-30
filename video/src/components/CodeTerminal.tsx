import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../config/theme";
import { BUG_LINE_INDEX, FIX_COLUMN, FIX_INSERT, OUTPUT, SNIPPET_LINES } from "../code/snippet";
import { mixColor, withAlpha } from "../lib/anim";
import { CodeLine } from "./CodeLine";
import { Icon, IconName } from "./Icon";

/** Fixed geometry — shared by the "find the bug" and "fix" scenes so the cut is seamless. */
export const TERMINAL = {
  left: 100,
  top: 540,
  width: 820,
  fontSize: 30,
  lineHeight: 54,
  headerHeight: 64,
  padTop: 26,
  gutter: 58,
  padLeft: 26,
} as const;

/** Y (inside the terminal) of the vertical centre of a code line. */
export const lineCenterY = (index: number) =>
  TERMINAL.headerHeight + TERMINAL.padTop + index * TERMINAL.lineHeight + TERMINAL.lineHeight / 2;

type Props = {
  /** Lines revealed so far (fractional = currently fading in). */
  linesVisible: number;
  /** 0..1 cinematic spotlight on the bug line. */
  spotlight: number;
  /** Number of characters of the fix typed so far. */
  typed: number;
  showCursor: boolean;
  /** 0 = red emergency, 1 = fixed (blue). */
  fixed: number;
  output: "none" | "buggy" | "fixed";
  outputOpacity: number;
  statusLabel: string;
  statusIcon: IconName;
};

/** The hero code editor: syntax-highlighted snippet, bug spotlight, live cursor and console output. */
export const CodeTerminal: React.FC<Props> = ({
  linesVisible,
  spotlight,
  typed,
  showCursor,
  fixed,
  output,
  outputOpacity,
  statusLabel,
  statusIcon,
}) => {
  const frame = useCurrentFrame();
  const accent = mixColor(COLORS.red, COLORS.blue, fixed);
  const accentHot = mixColor(COLORS.redHot, COLORS.blueHot, fixed);
  const typedText = FIX_INSERT.slice(0, Math.floor(typed));
  const bugY = lineCenterY(BUG_LINE_INDEX);
  const cursorBlink = typed > 0 && typed < FIX_INSERT.length ? 1 : Math.floor(frame / 9) % 2 === 0 ? 1 : 0;
  // Sweep of light crossing the bug line while it is under the spotlight.
  const sweepX = ((frame * 14) % 1400) - 300;
  const codeHeight = SNIPPET_LINES.length * TERMINAL.lineHeight + TERMINAL.padTop * 2;

  return (
    <div
      style={{
        position: "absolute",
        left: TERMINAL.left,
        top: TERMINAL.top,
        width: TERMINAL.width,
        borderRadius: 22,
        overflow: "hidden",
        background: `linear-gradient(170deg, ${withAlpha(COLORS.navyLight, 0.92)} 0%, ${withAlpha(COLORS.navy, 0.94)} 45%, ${withAlpha(COLORS.black, 0.96)} 100%)`,
        border: `2px solid ${mixColor(COLORS.red, COLORS.blue, fixed, 0.55)}`,
        boxShadow: `0 40px 120px rgba(0,0,0,0.7), 0 0 80px ${mixColor(COLORS.red, COLORS.blue, fixed, 0.28)}, inset 0 1px 0 rgba(255,255,255,0.08)`,
      }}
    >
      {/* Title bar */}
      <div
        style={{
          height: TERMINAL.headerHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 26px",
          borderBottom: `1px solid ${withAlpha(COLORS.muted, 0.18)}`,
          background: withAlpha(COLORS.black, 0.35),
        }}
      >
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {[COLORS.red, "#ffb020", COLORS.blue].map((c) => (
            <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c, opacity: 0.85 }} />
          ))}
          <span style={{ fontFamily: FONTS.mono, fontSize: 22, color: COLORS.muted, marginLeft: 14 }}>PowerCore.cs</span>
        </div>
        <span
          style={{
            fontFamily: FONTS.display,
            fontWeight: 700,
            fontSize: 24,
            letterSpacing: "0.2em",
            color: accentHot,
            textShadow: `0 0 12px ${accent}`,
          }}
        >
          <Icon name={statusIcon} size={22} color={accentHot} style={{ marginRight: 10 }} />
          {statusLabel}
        </span>
      </div>

      {/* Code */}
      <div style={{ position: "relative", height: codeHeight }}>
        {/* Bug-line light bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: bugY - TERMINAL.headerHeight - TERMINAL.lineHeight / 2 - 4,
            height: TERMINAL.lineHeight + 8,
            opacity: spotlight,
            background: `linear-gradient(90deg, ${withAlpha(COLORS.black, 0)} 0%, ${mixColor(COLORS.red, COLORS.blue, fixed, 0.32)} 18%, ${mixColor(COLORS.red, COLORS.blue, fixed, 0.14)} 100%)`,
            borderTop: `1px solid ${mixColor(COLORS.red, COLORS.blue, fixed, 0.6)}`,
            borderBottom: `1px solid ${mixColor(COLORS.red, COLORS.blue, fixed, 0.6)}`,
            boxShadow: `0 0 60px ${mixColor(COLORS.red, COLORS.blue, fixed, 0.45)}`,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: sweepX,
              width: 220,
              background: `linear-gradient(90deg, transparent, ${withAlpha(COLORS.white, 0.16)}, transparent)`,
            }}
          />
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 6, background: accentHot, boxShadow: `0 0 20px ${accentHot}` }} />
        </div>

        {SNIPPET_LINES.map((line, i) => {
          const appear = Math.max(0, Math.min(1, linesVisible - i));
          const isBug = i === BUG_LINE_INDEX;
          const dim = isBug ? 1 : 1 - spotlight * 0.45;
          const lineTop = TERMINAL.padTop + i * TERMINAL.lineHeight;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: lineTop,
                height: TERMINAL.lineHeight,
                display: "flex",
                alignItems: "center",
                opacity: appear * dim,
                transform: `translateX(${(1 - appear) * -24}px)`,
                filter: !isBug && spotlight > 0 ? `blur(${spotlight * 0.8}px)` : undefined,
              }}
            >
              <span
                style={{
                  width: TERMINAL.gutter,
                  textAlign: "right",
                  paddingRight: 22,
                  flexShrink: 0,
                  fontFamily: FONTS.mono,
                  fontSize: 22,
                  color: isBug && spotlight > 0 ? accentHot : COLORS.dim,
                  boxSizing: "content-box",
                  marginLeft: TERMINAL.padLeft - 22,
                }}
              >
                {i + 1}
              </span>
              <span style={{ position: "relative", marginLeft: 22 }}>
                <CodeLine
                  line={line}
                  fontSize={TERMINAL.fontSize}
                  insert={isBug ? { col: FIX_COLUMN, text: typedText, color: COLORS.blueHot } : undefined}
                  mark={
                    isBug
                      ? {
                          start: FIX_COLUMN + typedText.length,
                          end: FIX_COLUMN + typedText.length + "online / total".length,
                          color: COLORS.red,
                          amount: spotlight * (1 - fixed),
                        }
                      : undefined
                  }
                />
                {isBug && showCursor && (
                  <span
                    style={{
                      position: "absolute",
                      top: -4,
                      left: `${FIX_COLUMN + typedText.length}ch`,
                      width: 4,
                      height: TERMINAL.fontSize + 12,
                      background: COLORS.blueIce,
                      boxShadow: `0 0 14px ${COLORS.blueHot}, 0 0 30px ${COLORS.blue}`,
                      opacity: cursorBlink,
                      // `ch` must resolve against the code font for exact column placement.
                      fontFamily: FONTS.mono,
                      fontSize: TERMINAL.fontSize,
                    }}
                  />
                )}
              </span>
            </div>
          );
        })}
      </div>

      {/* Console output */}
      <div
        style={{
          borderTop: `1px solid ${withAlpha(COLORS.muted, 0.18)}`,
          background: withAlpha(COLORS.black, 0.45),
          padding: "18px 30px 24px",
          minHeight: 120,
          boxSizing: "border-box",
        }}
      >
        <div style={{ fontFamily: FONTS.display, fontWeight: 600, fontSize: 22, letterSpacing: "0.3em", color: COLORS.muted }}>
          OUTPUT
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginTop: 8,
            opacity: outputOpacity,
            fontFamily: FONTS.mono,
            fontSize: 32,
          }}
        >
          {output === "buggy" && (
            <>
              <span style={{ color: COLORS.redHot, fontWeight: 700, textShadow: `0 0 16px ${COLORS.red}` }}>
                {"> "}
                {OUTPUT.buggy}
              </span>
              <span style={{ color: COLORS.muted, fontSize: 26 }}>{OUTPUT.expected}</span>
            </>
          )}
          {output === "fixed" && (
            <>
              <span style={{ color: COLORS.blueIce, fontWeight: 700, textShadow: `0 0 16px ${COLORS.blue}` }}>
                {"> "}
                {OUTPUT.fixed}
              </span>
              <span style={{ color: COLORS.blueHot, fontSize: 26, fontFamily: FONTS.display, fontWeight: 700, letterSpacing: "0.15em" }}>
                <Icon name="check" size={24} color={COLORS.blueHot} /> CORRECT
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
