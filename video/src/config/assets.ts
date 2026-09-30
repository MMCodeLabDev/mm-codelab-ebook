import { staticFile } from "remotion";

/**
 * ─── BRAND ASSETS ────────────────────────────────────────────────────────────
 * Replace the files in /public at these exact paths to swap assets.
 * Keep the same filenames and nothing else needs to change.
 *
 *  public/brand/mm-codelab-logo.png  → MM CodeLab logo (transparent PNG, wide)
 *  public/brand/ebook-cover.png      → "C# No Complications" cover (portrait, ~0.64 ratio)
 *  public/audio/soundtrack.wav       → "The Last Line of Code" soundtrack (25 s). Generated
 *                                       procedurally by scripts/generate-soundtrack.mjs
 *                                       (royalty-free, original).
 *  public/audio/do-not-touch-the-code.wav → "DO NOT TOUCH THE CODE" soundtrack (25 s),
 *                                       scripts/generate-soundtrack-do-not-touch.mjs.
 */
export const ASSETS = {
  logo: staticFile("brand/mm-codelab-logo.png"),
  cover: staticFile("brand/ebook-cover.png"),
  soundtrack: staticFile("audio/soundtrack.wav"),
  soundtrackDoNotTouch: staticFile("audio/do-not-touch-the-code.wav"),
} as const;

/** Native pixel sizes — used to keep aspect ratios exact. Update if you swap files. */
export const ASSET_SIZES = {
  logo: { width: 1400, height: 506 },
  cover: { width: 512, height: 800 },
} as const;

/** Final call-to-action copy (kept subtle; works on Reels, TikTok and Shorts). */
export const CTA = {
  primary: "Free sample · link in bio",
} as const;
