import React from "react";
import { FONTS, SYNTAX } from "../config/theme";
import { tokenize, TokenKind } from "../code/tokenize";

type CharKind = TokenKind | "insert";

type Props = {
  line: string;
  /** Text being typed into the line (rendered with its own highlight). */
  insert?: { col: number; text: string; color: string };
  /** Columns [start, end) — measured in the final rendered line — to mark as an error. */
  mark?: { start: number; end: number; color: string; amount: number };
  fontSize: number;
  /** Colour override for every token (e.g. corrupted panels). */
  tint?: string;
};

const colorFor = (kind: CharKind) => (kind === "space" || kind === "insert" ? SYNTAX.ident : SYNTAX[kind]);

/** Renders a single syntax-highlighted C# line in a monospace grid (1 char = 1ch). */
export const CodeLine: React.FC<Props> = ({ line, insert, mark, fontSize, tint }) => {
  const chars: { ch: string; kind: CharKind }[] = [];
  for (const token of tokenize(line)) for (const ch of token.text) chars.push({ ch, kind: token.kind });
  if (insert && insert.text.length > 0) {
    chars.splice(insert.col, 0, ...[...insert.text].map((ch) => ({ ch, kind: "insert" as const })));
  }

  // Group consecutive characters sharing the same style into spans.
  const spans: { text: string; kind: CharKind; marked: boolean }[] = [];
  chars.forEach((c, i) => {
    const marked = !!mark && mark.amount > 0 && i >= mark.start && i < mark.end;
    const last = spans[spans.length - 1];
    if (last && last.kind === c.kind && last.marked === marked) last.text += c.ch;
    else spans.push({ text: c.ch, kind: c.kind, marked });
  });

  return (
    <span style={{ fontFamily: FONTS.mono, fontSize, whiteSpace: "pre", fontVariantLigatures: "none" }}>
      {spans.map((s, i) => {
        const isInsert = s.kind === "insert";
        return (
          <span
            key={i}
            style={{
              color: tint ?? (isInsert ? insert!.color : colorFor(s.kind)),
              fontWeight: isInsert ? 700 : s.kind === "keyword" || s.kind === "type" ? 600 : 400,
              textShadow: isInsert ? `0 0 14px ${insert!.color}` : undefined,
              textDecorationLine: s.marked ? "underline" : undefined,
              textDecorationStyle: s.marked ? "wavy" : undefined,
              textDecorationColor: s.marked ? mark!.color : undefined,
              textDecorationThickness: s.marked ? 3 : undefined,
              textUnderlineOffset: s.marked ? 10 : undefined,
              opacity: s.marked ? 1 : undefined,
            }}
          >
            {s.text}
          </span>
        );
      })}
    </span>
  );
};
