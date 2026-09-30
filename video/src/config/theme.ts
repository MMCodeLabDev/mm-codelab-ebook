import { loadLocalFonts } from "../lib/fonts";

loadLocalFonts();

export const FONTS = {
  display: "Rajdhani, sans-serif", // HUD / cinematic titles
  brand: "Manrope, sans-serif", // matches the MM CodeLab website
  mono: "'JetBrains Mono', monospace", // code
} as const;

export const COLORS = {
  black: "#010207",
  void: "#03050d",
  navy: "#060b1f",
  navyLight: "#0c1636",
  panel: "rgba(8, 14, 36, 0.78)",

  blue: "#2f8bff",
  blueHot: "#6cc4ff",
  blueIce: "#d6ecff",

  red: "#ff2b3d",
  redHot: "#ff6b6b",
  redDeep: "#5a0710",

  white: "#f4f7ff",
  muted: "#7d8bb3",
  dim: "#3a4466",

  // Brand accents from the MM CodeLab logo / website.
  brandBlue: "#000099",
  brandPink: "#ff66cc",
} as const;

/** Syntax colours — cinematic, deliberately not the "green hacker" palette. */
export const SYNTAX = {
  keyword: "#7aa2ff",
  type: "#5fd4ff",
  number: "#ffb86b",
  string: "#ffd28a",
  ident: "#e6ecff",
  punct: "#8f9bc2",
  method: "#c3a6ff",
  comment: "#56618a",
} as const;
