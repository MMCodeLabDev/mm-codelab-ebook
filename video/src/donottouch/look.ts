import { COLORS } from "../config/theme";
import { lerpFrames, mixColor } from "../lib/anim";
import type { BackdropLook } from "../components/Backdrop";
import type { GridLook } from "../components/GridTunnel";
import type { StreamsLook } from "../components/DataStreams";
import type { ParticlesLook } from "../components/Particles";
import type { HudLook } from "../components/HudOverlay";
import type { Impact } from "../components/CameraShake";
import { BEAT, SCENES } from "./timeline";

/**
 * Lighting design for "DO NOT TOUCH THE CODE".
 * Red is the default. Blue only appears for the false relief — and for the final brand card.
 */
export const blueAmount = (f: number) =>
  lerpFrames(
    f,
    [BEAT.silenceEnd - 1, BEAT.silenceEnd + 4, BEAT.offline - 3, BEAT.offline, SCENES.reveal.from - 1, SCENES.reveal.from],
    [0, 1, 1, 0, 0, 1],
  );

export const accent = (f: number, alpha = 1) => mixColor(COLORS.red, COLORS.blue, blueAmount(f), alpha);

/** Slow emergency-lamp pulse (period 48 frames), 0..1. */
export const lampPulse = (f: number, period = 48) => Math.pow((Math.sin((f / period) * Math.PI * 2 - Math.PI / 2) + 1) / 2, 2);

const isSilent = (f: number) => f >= BEAT.enterAt && f < BEAT.silenceEnd;
const isBlackout = (f: number) => f >= SCENES.reveal.from && f < BEAT.blackUntil;

export const BACKDROP: BackdropLook = {
  base: (f) => {
    if (isBlackout(f)) return 0;
    if (f >= SCENES.reveal.from) return lerpFrames(f, [BEAT.blackUntil, BEAT.blackUntil + 30], [0, 0.55]);
    if (f < SCENES.legacy.from) return lerpFrames(f, [BEAT.lampOn, SCENES.legacy.from], [0, 0.45]);
    if (isSilent(f)) return 0.35;
    if (f >= SCENES.toldYou.from) return 0.55;
    return 0.8;
  },
  glow: (f) => {
    if (isBlackout(f)) return 0;
    if (f >= SCENES.reveal.from) return lerpFrames(f, [BEAT.everyDev + 20, BEAT.cover + 20], [0, 0.45]);
    if (f < SCENES.legacy.from) return lerpFrames(f, [BEAT.lampOn, 90], [0, 0.55]) * (0.2 + 0.8 * lampPulse(f));
    if (isSilent(f)) return 0.05;
    if (f >= BEAT.silenceEnd && f < BEAT.offline) return 0.75;
    if (f >= BEAT.offline && f < SCENES.toldYou.from) return 0.75 + 0.25 * Math.abs(Math.sin(f * 0.55));
    if (f >= SCENES.toldYou.from) return 0.25 + 0.3 * lampPulse(f, 60);
    return 0.35 + 0.35 * lampPulse(f);
  },
  accent,
};

const liveFrames = (f: number) => (f >= SCENES.legacy.from && f < SCENES.reveal.from ? 1 : 0);

export const GRID: GridLook = {
  speed: (f) => (f >= BEAT.offline && f < SCENES.toldYou.from ? 6 : 0.9),
  visible: (f) =>
    liveFrames(f) * lerpFrames(f, [SCENES.legacy.from, SCENES.legacy.from + 40], [0, 0.7]) * (isSilent(f) ? 0.3 : 1),
  color: (f) => accent(f, 0.5),
};

export const STREAMS: StreamsLook = {
  visible: (f) => liveFrames(f) * (isSilent(f) ? 0 : f >= BEAT.offline && f < SCENES.toldYou.from ? 0.9 : 0.35),
  color: (f) => accent(f, 1),
};

export const PARTICLES: ParticlesLook = {
  burst: () => 0,
  visible: (f) => {
    if (isBlackout(f)) return 0;
    if (f >= SCENES.reveal.from) return lerpFrames(f, [BEAT.cover, BEAT.cover + 30], [0, 0.35]);
    return lerpFrames(f, [10, 90], [0, 0.6]) * (isSilent(f) ? 0.4 : 1);
  },
  blueness: blueAmount,
};

export const HUD: HudLook = {
  opacity: (f) => liveFrames(f) * lerpFrames(f, [SCENES.legacy.from, SCENES.legacy.from + 16], [0, 0.85]),
  color: (f) => accent(f, 0.85),
  title: "PROD-CLUSTER-01 // LEGACY",
  // The interface insists everything is fine — until it isn't.
  status: (f) => (f >= BEAT.offline ? { text: "SYS: FAILURE", alert: true } : { text: "SYS: NOMINAL", alert: false }),
};

/** Rotating beacons only once production is down. */
export const beaconIntensity = (f: number) => {
  if (f >= BEAT.offline && f < SCENES.toldYou.from) {
    const flicker = [1, 0, 1, 0.3, 1][f - BEAT.offline] ?? 1;
    return flicker * lerpFrames(f, [SCENES.toldYou.from - 10, SCENES.toldYou.from], [1, 0.3]);
  }
  if (f >= SCENES.toldYou.from && f < SCENES.reveal.from) return 0.18;
  return 0;
};

/** Camera impacts — escalating through the outage. Mirrored in the soundtrack. */
export const IMPACTS: readonly Impact[] = [
  { at: BEAT.titleLine1, strength: 5, decay: 10 },
  { at: BEAT.deleteAt, strength: 4, decay: 6 },
  { at: BEAT.enterAt, strength: 3, decay: 5 },
  { at: BEAT.offline, strength: 26, decay: 14 },
  { at: BEAT.database, strength: 16, decay: 10 },
  { at: BEAT.auth, strength: 20, decay: 10 },
  { at: BEAT.api, strength: 24, decay: 10 },
  { at: BEAT.everything, strength: 36, decay: 18 },
  { at: BEAT.signalLoss, strength: 22, decay: 8 },
  { at: BEAT.punchline, strength: 7, decay: 10 },
];

/** The single red emergency lamp — the heartbeat of the first act. */
export const lampIntensity = (f: number) => {
  if (f < BEAT.lampOn) return 0;
  if (f < SCENES.legacy.from) return lerpFrames(f, [BEAT.lampOn, 90], [0, 1]) * (0.25 + 0.75 * lampPulse(f));
  if (f < BEAT.enterAt) return 0.55 * (0.3 + 0.7 * lampPulse(f));
  if (f < BEAT.offline) return 0; // silence, then false relief: the alarm goes quiet
  if (f < SCENES.toldYou.from) return 0.6 + 0.4 * Math.abs(Math.sin(f * 0.8));
  if (f < SCENES.reveal.from) return 0.35 * (0.3 + 0.7 * lampPulse(f, 60));
  return 0;
};

/** Relative frame helper: absolute beat → frame inside a scene's <Sequence>. */
export const rel = (scene: { from: number }, absolute: number) => absolute - scene.from;
