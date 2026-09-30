import React from "react";
import { random, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../config/theme";
import { withAlpha } from "../lib/anim";
import { CodeLine } from "./CodeLine";
import { Icon } from "./Icon";

const GLYPHS = "#%&@$!?/\\|<>*=";

/** Corrupt random characters of a line (changes every 2 frames, deterministic). */
const corrupt = (line: string, seed: string, frame: number, amount: number) =>
  [...line]
    .map((ch, i) => {
      if (ch === " ") return ch;
      const r = random(`${seed}-${i}-${Math.floor(frame / 2)}`);
      return r < amount ? GLYPHS[Math.floor(random(`${seed}-g${i}-${frame}`) * GLYPHS.length)] : ch;
    })
    .join("");

type Props = {
  lines: readonly string[];
  title: string;
  accent: string;
  broken?: boolean;
  width?: number;
  fontSize?: number;
  seed: string;
  /** Show a check mark next to the title (restored modules). */
  ok?: boolean;
};

/** Floating holographic code panel used in the fly-through. */
export const HoloPanel: React.FC<Props> = ({ lines, title, accent, broken = false, width = 560, fontSize = 26, seed, ok = false }) => {
  const frame = useCurrentFrame();
  const flicker = broken ? (random(`${seed}-f-${frame}`) < 0.18 ? 0.35 : 1) : 1;
  const jitter = broken && random(`${seed}-j-${frame}`) < 0.25 ? (random(`${seed}-jx-${frame}`) - 0.5) * 30 : 0;
  const edge = broken ? COLORS.red : accent;

  return (
    <div
      style={{
        width,
        padding: "18px 26px 24px",
        borderRadius: 14,
        background: `linear-gradient(160deg, ${withAlpha(COLORS.navyLight, 0.7)}, ${withAlpha(COLORS.black, 0.55)})`,
        border: `2px solid ${typeof edge === "string" && edge.startsWith("#") ? withAlpha(edge, 0.7) : edge}`,
        boxShadow: `0 0 40px ${broken ? withAlpha(COLORS.red, 0.45) : withAlpha(COLORS.blue, 0.25)}, inset 0 0 30px ${withAlpha(COLORS.blue, 0.08)}`,
        opacity: flicker,
        transform: `translateX(${jitter}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: FONTS.mono,
          fontSize: 18,
          letterSpacing: "0.1em",
          color: broken ? COLORS.redHot : COLORS.muted,
          marginBottom: 10,
        }}
      >
        <span>{title}</span>
        {ok && <Icon name="check" size={20} color={COLORS.blueHot} />}
        {broken && (
          <span style={{ color: COLORS.red, fontWeight: 700 }}>
            <Icon name="alert" size={18} color={COLORS.red} /> FAULT
          </span>
        )}
      </div>
      {lines.map((line, i) => (
        <div key={i} style={{ lineHeight: 1.55 }}>
          <CodeLine
            line={broken ? corrupt(line, `${seed}${i}`, frame, 0.14) : line}
            fontSize={fontSize}
            tint={broken && i % 2 === 0 ? COLORS.redHot : undefined}
          />
        </div>
      ))}
    </div>
  );
};
