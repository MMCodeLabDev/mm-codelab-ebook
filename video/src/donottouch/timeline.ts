import { VIDEO } from "../config/video";

/**
 * "DO NOT TOUCH THE CODE" — global timeline (absolute frames @ 30 fps, 750 frames).
 * NOTE: scripts/generate-soundtrack-do-not-touch.mjs mirrors these frames — keep in sync.
 *
 *   CURIOSITY → SUSPENSE → TENSION → FALSE RELIEF → DISASTER → PUNCHLINE
 */
export const DNTC = {
  id: "DoNotTouchTheCode",
  durationInFrames: VIDEO.durationInFrames, // 25 s
} as const;

export const SCENES = {
  warning: { from: 0, duration: 120 }, //   0:00–0:04  curiosity
  legacy: { from: 120, duration: 120 }, //  0:04–0:08  suspense
  cleanup: { from: 240, duration: 156 }, // 0:08–0:13.2 tension → false relief
  outage: { from: 396, duration: 114 }, //  0:13.2–0:17 disaster
  toldYou: { from: 510, duration: 120 }, // 0:17–0:21  punchline
  reveal: { from: 630, duration: 120 }, //  0:21–0:25  brand
} as const;

/** Absolute beats. */
export const BEAT = {
  // Scene 1
  lampOn: 6,
  titleLine1: 24,
  titleLine2: 34,
  production: 76,
  online: 88,
  // Scene 2
  lastModified: 196,
  // Scene 3
  pointerIn: 244,
  typeStart: 262,
  typeFramesPerChar: 2,
  selectStart: 316,
  selectEnd: 328,
  deleteAt: 338,
  enterAt: 354,
  silenceEnd: 368, // BUILD SUCCESSFUL
  reliefEnd: 392,
  // Scene 4 — accelerating hits
  offline: 396,
  database: 426,
  auth: 444,
  api: 458,
  everything: 472,
  signalLoss: 498,
  // Scene 5
  editorBack: 512,
  ghostMoveStart: 522,
  ghostMoveEnd: 556,
  ghostTypeStart: 568,
  ghostFramesPerChar: 2,
  punchline: 596,
  // Scene 6
  blackUntil: 648,
  everyDev: 648,
  lift: 678,
  cover: 680,
  title: 692,
  subtitle: 702,
  brand: 712,
} as const;

export const seconds = (frame: number) => frame / VIDEO.fps;
