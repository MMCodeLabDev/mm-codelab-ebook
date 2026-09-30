export const VIDEO = {
  id: "LastLineOfCode",
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 750, // 25 s
} as const;

/**
 * Social-media safe area (Reels / TikTok / Shorts overlap).
 * Top: status bar + account/title UI. Bottom: caption, audio ticker, CTA bar.
 * Right: like / comment / share column.
 * Every important element (text, code, product) stays inside this box.
 */
export const SAFE = {
  top: 260,
  bottom: 440,
  left: 90,
  right: 150,
} as const;

export const SAFE_BOX = {
  x: SAFE.left,
  y: SAFE.top,
  width: VIDEO.width - SAFE.left - SAFE.right, // 840
  height: VIDEO.height - SAFE.top - SAFE.bottom, // 1220
} as const;

/** Toggle in Remotion Studio to see the safe area overlay. Never enable for the final render. */
export const SHOW_SAFE_AREA_GUIDE = false;
