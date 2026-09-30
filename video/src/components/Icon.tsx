import React from "react";

export type IconName = "check" | "alert" | "dot" | "arrow";

/** Inline SVG icons — never depend on a font having ✓ ▲ ● → glyphs. */
export const Icon: React.FC<{ name: IconName; size: number; color: string; style?: React.CSSProperties }> = ({ name, size, color, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "inline-block", verticalAlign: "-0.12em", overflow: "visible", ...style }}>
    {name === "check" && <path d="M4 12.5l5 5L20 6.5" fill="none" stroke={color} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" />}
    {name === "alert" && (
      <>
        <path d="M12 2.5L22.5 21h-21z" fill={color} />
        <path d="M12 9v5.5M12 17.2v.3" stroke="#05070f" strokeWidth={2.6} strokeLinecap="round" />
      </>
    )}
    {name === "dot" && <circle cx={12} cy={12} r={6} fill={color} />}
    {name === "arrow" && <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke={color} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" />}
  </svg>
);
