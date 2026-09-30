import { VIDEO } from "./video";

const s = (seconds: number) => Math.round(seconds * VIDEO.fps);

/**
 * Global timeline (absolute frames @ 30 fps).
 * NOTE: scripts/generate-soundtrack.mjs mirrors these timings in seconds —
 * keep both in sync if you retime a scene.
 */
export const SCENES = {
  failure: { from: s(0), duration: s(3) }, //    0 –  90
  flythrough: { from: s(3), duration: s(4) }, // 90 – 210
  findBug: { from: s(7), duration: s(7) }, //   210 – 420
  fix: { from: s(14), duration: s(4) }, //      420 – 540
  wave: { from: s(18), duration: s(3) }, //     540 – 630
  reveal: { from: s(21), duration: s(4) }, //   630 – 750
} as const;

/** Beats inside scenes (frames relative to the scene start). */
export const BEATS = {
  failure: {
    lightsOn: 4,
    interfaceOn: 10,
    systemFailure: 12,
    secondsRemain: 44,
  },
  flythrough: {
    findTheBug: 44,
  },
  findBug: {
    canYouSeeIt: 16,
    spotlight: 70,
    hint: 138,
  },
  fix: {
    cursorIn: 4,
    typeStart: 12,
    framesPerChar: 3,
    buildStart: 44,
    buildEnd: 84,
  },
  wave: {
    impact: 0,
  },
  reveal: {
    master: 6,
    oneLine: 18,
    productIn: 52,
    title: 64,
    brand: 74,
    cta: 88,
  },
} as const;

/** Countdown HUD: shown from "10 SECONDS REMAIN" until the build succeeds. */
export const COUNTDOWN = {
  start: SCENES.failure.from + BEATS.failure.secondsRemain,
  stop: SCENES.fix.from + BEATS.fix.buildEnd,
  hide: SCENES.wave.from + 20,
  fromSeconds: 10,
  /** Time left on the clock when the build lands — "saved with 00:00.87 to spare". */
  endSeconds: 0.87,
} as const;

/** 0 = emergency red, 1 = electric blue. Environment flips during the wave. */
export const SYSTEM_RESTORE = {
  from: SCENES.wave.from,
  to: SCENES.wave.from + 26,
} as const;
