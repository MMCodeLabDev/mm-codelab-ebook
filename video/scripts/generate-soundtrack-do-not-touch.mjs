/**
 * Suspense score for "DO NOT TOUCH THE CODE".
 *
 * Original, synthesised in code with the shared MM CodeLab synth (scripts/lib/synth.mjs),
 * so it is safe for commercial use. Deterministic: same bytes on every run.
 *
 *   node scripts/generate-soundtrack-do-not-touch.mjs  →  public/audio/do-not-touch-the-code.wav
 *
 * Arc: server-room ambience → slow tension → dead silence → false-relief chime →
 * near-silence → the outage hits hard → eerie stillness → punchline sting → clean resolution.
 * Timings mirror src/donottouch/timeline.ts (30 fps). Keep them in sync if you retime.
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createSynth, lowpass, midi, saw, SR, TAU } from "./lib/synth.mjs";

const DURATION = 25;
const f = (frame) => frame / 30;

// ── Timeline (seconds) — mirrors BEAT / SCENES in src/donottouch/timeline.ts ──
const T = {
  titleLine1: f(24),
  titleLine2: f(34),
  production: f(76),
  online: f(88),
  legacy: f(120),
  lastModified: f(196),
  pointerIn: f(244),
  clickComment: f(258),
  typeStart: f(262),
  selectStart: f(316),
  selectEnd: f(328),
  deleteAt: f(338),
  terminalIn: f(342),
  enterAt: f(354),
  silenceEnd: f(368),
  offline: f(396),
  database: f(426),
  auth: f(444),
  api: f(458),
  everything: f(472),
  signalLoss: f(498),
  toldYou: f(510),
  ghostMoveStart: f(522),
  ghostMoveEnd: f(556),
  ghostTypeStart: f(568),
  punchline: f(596),
  reveal: f(630),
  everyDev: f(648),
  cover: f(680),
  brand: f(712),
};

// Different seed from the first score — a new piece, same instrument.
const { rand, add, subDrop, noiseHit, braam, whoosh, riser, click, bell, pad, writeWav } = createSynth({
  duration: DURATION,
  seed: 0x444e5443, // "DNTC"
});

const clamp01 = (x) => Math.max(0, Math.min(1, x));
const ramp = (t, a, b) => clamp01((t - a) / (b - a));

// ── Server-room ambience (fans + mains hum). Its envelope carries the story. ──
const ambienceLevel = (t) => {
  if (t < T.enterAt) return ramp(t, 0, 1.6); // fade up from black
  if (t < T.silenceEnd) return 0; // ENTER → complete silence
  if (t < T.offline) return 0.45 * (1 - ramp(t, T.offline - 0.4, T.offline - 0.12)); // relief, then near-silence
  if (t < T.toldYou) return 0; // buried under the outage
  if (t < T.reveal) return 0.32; // dead, empty room
  return 0;
};
{
  const fan = lowpass();
  const fan2 = lowpass();
  let hum = 0;
  add(0, DURATION, (t) => {
    const lvl = ambienceLevel(t);
    const n = rand() * 2 - 1; // always draw, keeps the PRNG stream stable
    if (lvl <= 0) return 0;
    hum += 60 / SR;
    const airflow = fan(n, 420) - fan2(n, 90);
    const mains = Math.sin(TAU * hum) * 0.5 + Math.sin(TAU * hum * 2) * 0.25 + Math.sin(TAU * hum * 3) * 0.08;
    return (airflow * 0.9 + mains * 0.18) * lvl;
  }, 0.09);
}

// ── Scene 1: the lamp breathes. Low alarm swell on every lamp peak. ────────────
for (let k = 0; k < 8; k++) {
  const peak = f(24 + 48 * k);
  if (peak > T.enterAt - 0.2) break;
  const growth = Math.min(1, 0.35 + k * 0.18);
  let ph = 0;
  add(peak - 0.6, 1.3, (t) => {
    ph += 98 / SR;
    const e = Math.sin((Math.PI * t) / 1.3) ** 2;
    return (Math.sin(TAU * ph) + 0.3 * Math.sin(TAU * ph * 2.01)) * e;
  }, 0.07 * growth);
}

// Title: a heavy, restrained film impact — not a slam.
subDrop(T.titleLine1, { from: 48, to: 28, dur: 2.6, gain: 0.22 });
noiseHit(T.titleLine1, { dur: 0.9, cutoff: 700, gain: 0.07 });
subDrop(T.titleLine2, { from: 42, to: 30, dur: 1.8, gain: 0.12 });
// PRODUCTION · ONLINE — a calm system chime (everything is fine… for now).
bell(T.production, 76, { dur: 2.2, gain: 0.035, pan: -0.2 });
bell(T.online, 83, { dur: 2.8, gain: 0.045, pan: 0.2 });

// ── Scenes 2–3: slow tension ──────────────────────────────────────────────────
// Dissonant low drone whose filter slowly opens; cut dead at ENTER.
{
  const lps = [lowpass(), lowpass(), lowpass()];
  const ph = [0, 0.25, 0.5];
  const fr = [midi(33), midi(34.02), midi(45)]; // A1, Bb1, A2 — a minor second of dread
  add(3.2, T.enterAt - 3.2, (t) => {
    const p = t / (T.enterAt - 3.2);
    let v = 0;
    for (let k = 0; k < 3; k++) {
      ph[k] += fr[k] / SR;
      v += lps[k](saw(ph[k]), 110 + 700 * p * p);
    }
    return v * Math.min(1, t / 1.5) * (0.4 + 0.6 * p);
  }, 0.1);
}
// Heartbeat under the dolly and the cleanup.
for (let t = T.legacy + 0.3; t < T.enterAt - 0.3; t += 0.85) {
  subDrop(t, { from: 58, to: 40, dur: 0.32, gain: 0.26 });
  subDrop(t + 0.2, { from: 52, to: 38, dur: 0.28, gain: 0.16 });
}
// Tiny warning indicators: faint paired beeps.
for (let t = 5.0; t < T.clickComment; t += 1.6) {
  [0, 0.12].forEach((d) => add(t + d, 0.07, (x) => Math.sin(TAU * 1760 * x) * Math.exp(-x * 40), 0.018, 0.4));
}
// LAST MODIFIED: 847 DAYS AGO — low hit + digit scramble blips + a sour bell.
subDrop(T.lastModified, { from: 60, to: 30, dur: 1.8, gain: 0.45 });
for (let k = 0; k < 6; k++) {
  const fr = 900 + rand() * 1600;
  add(T.lastModified + k * 0.05, 0.04, (x) => Math.sign(Math.sin(TAU * fr * x)) * Math.exp(-x * 70), 0.025, rand() - 0.5);
}
bell(T.lastModified + 0.02, 70, { dur: 3, gain: 0.04 }); // Bb4 against the A drone
bell(T.lastModified + 0.02, 69, { dur: 3, gain: 0.03 });

// Pointer click, typing "// Let's clean this up.", selection, delete.
click(T.clickComment, { freq: 2600, gain: 0.07 });
for (let k = 0; k < 23; k++) click(T.typeStart + k * f(2), { freq: 3000 + rand() * 1200, gain: 0.05, pan: rand() - 0.5 });
whoosh(T.selectStart, { dur: T.selectEnd - T.selectStart + 0.15, gain: 0.05, pan: 0.3 });
click(T.deleteAt, { freq: 1500, gain: 0.11 });
subDrop(T.deleteAt, { from: 70, to: 45, dur: 0.5, gain: 0.3 });
riser(T.selectEnd - 0.2, T.enterAt - T.selectEnd + 0.2, 0.09);
for (let k = 0; k < 12; k++) click(T.terminalIn + 0.07 + k * 0.03, { freq: 3200 + rand() * 900, gain: 0.04, pan: 0.2 });
// ENTER — then nothing at all.
click(T.enterAt, { freq: 1200, gain: 0.16 });
subDrop(T.enterAt, { from: 60, to: 50, dur: 0.12, gain: 0.25 });

// ── False relief: BUILD SUCCESSFUL ────────────────────────────────────────────
[69, 73, 76, 81].forEach((n, k) => bell(T.silenceEnd + k * 0.06, n + 12, { dur: 1.6, gain: 0.07, pan: (k - 1.5) * 0.3 }));
pad(T.silenceEnd, T.offline - 0.35 - T.silenceEnd, [57, 61, 64], { gain: 0.08, attack: 0.25, release: 0.35, cutoff: 1800 });

// ── DISASTER: production goes down. Accelerating, hitting hard. ───────────────
subDrop(T.offline, { from: 110, to: 25, dur: 3.2, gain: 1 });
noiseHit(T.offline, { dur: 1.4, cutoff: 7000, gain: 0.6 });
braam(T.offline, [33, 34, 40, 45], { dur: 3.2, gain: 0.6, cutoff: 1400 });
[
  [T.database, 0.6],
  [T.auth, 0.72],
  [T.api, 0.84],
].forEach(([t, g]) => {
  subDrop(t, { from: 90, to: 30, dur: 1.2, gain: g });
  noiseHit(t, { dur: 0.6, cutoff: 5000, gain: 0.35 * g });
  braam(t, [33, 39], { dur: 1, gain: 0.3 * g, cutoff: 1200 });
});
subDrop(T.everything, { from: 120, to: 24, dur: 2.2, gain: 1 });
noiseHit(T.everything, { dur: 1.2, cutoff: 9000, gain: 0.65 });
braam(T.everything, [33, 34, 39, 45, 46], { dur: 1.6, gain: 0.7, cutoff: 2600 });

// Klaxon: two-tone, faster than the first film, filtered.
for (let t = T.offline + 0.05; t < T.signalLoss; t += 0.4) {
  const lp = lowpass();
  const hi = Math.floor((t - T.offline) / 0.4) % 2 === 0;
  const fr = hi ? 830 : 620;
  add(t, 0.34, (x) => lp(Math.sign(Math.sin(TAU * fr * x)) * 0.5 + Math.sin(TAU * fr * x) * 0.5, 1900) * Math.min(1, x / 0.01) * Math.exp(-x * 3), 0.05, hi ? -0.35 : 0.35);
}
// Driving pulse that accelerates into the collapse.
for (let t = T.offline + 0.2, step = 0.2; t < T.signalLoss; t += step, step = Math.max(0.075, step * 0.94)) {
  const lp = lowpass();
  let ph = 0;
  const fr = midi(33);
  add(t, 0.16, (x) => {
    ph += fr / SR;
    return lp(saw(ph), 1000 * Math.exp(-x * 22) + 120) * Math.exp(-x * 16);
  }, 0.24);
}
// Signal loss: glitch stutter, then a hard cut to silence.
for (let k = 0; k < 16; k++) {
  const t = T.signalLoss + k * 0.025;
  const fr = 180 + rand() * 2400;
  add(t, 0.022, (x) => Math.sign(Math.sin(TAU * fr * x)) * 0.7 + (rand() - 0.5) * 0.6, 0.09, rand() * 1.6 - 0.8);
}

// ── Stillness: the pointer moves by itself ────────────────────────────────────
// Distant, filtered echo of the alarm dying out.
for (let t = T.toldYou + 0.15; t < T.toldYou + 1.6; t += 0.4) {
  const lp = lowpass();
  const fade = 1 - (t - T.toldYou) / 1.6;
  add(t, 0.3, (x) => lp(Math.sign(Math.sin(TAU * 830 * x)), 500) * Math.exp(-x * 5), 0.02 * fade, 0.5);
}
// A thin, bending tone as the pointer glides back — something else is in control.
{
  let ph = 0;
  const dur = T.ghostMoveEnd - T.ghostMoveStart + 0.3;
  add(T.ghostMoveStart, dur, (t) => {
    const p = t / dur;
    ph += (1320 - 180 * p + 6 * Math.sin(TAU * 5 * t)) / SR;
    return Math.sin(TAU * ph) * Math.sin(Math.PI * p);
  }, 0.018, -0.2);
}
click(T.ghostMoveEnd, { freq: 2200, gain: 0.08 });
for (let k = 0; k < 14; k++) {
  const t = T.ghostTypeStart + k * f(2);
  click(t, { freq: 2600 + k * 60, gain: 0.05 + k * 0.004, pan: 0.1 });
  add(t, 0.09, (x) => Math.sin(TAU * midi(45) * x) * Math.exp(-x * 30), 0.03);
}
// Punchline sting: one low toll that lands and hangs, dying before the cut.
subDrop(T.punchline, { from: 64, to: 30, dur: 1.1, gain: 0.8 });
braam(T.punchline, [33, 45], { dur: 1.1, gain: 0.35, cutoff: 900 });
bell(T.punchline, 57, { dur: 1.1, gain: 0.12 });

// ── Resolution: dark, clean, finally in tune ──────────────────────────────────
[57, 64, 69, 73].forEach((n, k) => bell(T.everyDev + k * 0.09, n, { dur: 3.2, gain: 0.07, pan: (k - 1.5) * 0.25 }));
pad(T.everyDev + 0.05, DURATION - T.everyDev - 0.05, [45, 52, 57, 61, 64], { gain: 0.14, attack: 1, release: 2.2, cutoff: 1500 });
bell(T.cover, 81, { dur: 2.5, gain: 0.04, pan: 0.3 });
subDrop(T.brand, { from: 48, to: 30, dur: 2.2, gain: 0.35 });
bell(T.brand, 69, { dur: 3, gain: 0.08, pan: -0.15 });
bell(T.brand + 0.08, 76, { dur: 3, gain: 0.06, pan: 0.15 });

// ── Master automation: silence must be silence, cuts must be cuts ─────────────
const window = (t, start, end, floor, fade = 0.03) => {
  if (t < start - fade || t > end + fade) return 1;
  if (t < start) return 1 - (1 - floor) * ((t - (start - fade)) / fade);
  if (t > end) return floor + (1 - floor) * ((t - end) / fade);
  return floor;
};
const automation = (t) =>
  window(t, T.enterAt + 0.1, T.silenceEnd - 0.02, 0.015) * // ENTER → complete silence
  window(t, T.offline - 0.3, T.offline - 0.01, 0.08, 0.08) * // near-silence before the failure
  window(t, T.toldYou, T.toldYou + 0.3, 0.12, 0.01) * // hard cut out of the outage
  window(t, T.reveal, T.everyDev - 0.05, 0.01, 0.01); // hard cut to black

writeWav(join(dirname(fileURLToPath(import.meta.url)), "..", "public", "audio", "do-not-touch-the-code.wav"), { fadeOutSeconds: 0.8, automation });
