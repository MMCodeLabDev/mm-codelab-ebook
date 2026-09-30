/**
 * Procedural cinematic soundtrack for "The Last Line of Code".
 *
 * 100% original, synthesised from scratch — no samples, no third-party audio,
 * so it is safe for commercial use. Deterministic (seeded PRNG): running it twice
 * produces the identical file.
 *
 *   node scripts/generate-soundtrack.mjs   →   public/audio/soundtrack.wav
 *
 * Timings mirror src/config/timeline.ts (30 fps). Keep them in sync if you retime.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SR = 44100;
const DURATION = 25;
const N = SR * DURATION;
const FPS = 30;
const f = (frame) => frame / FPS; // frame → seconds

// ── Timeline (seconds) ───────────────────────────────────────────────────────
const T = {
  impact: 0,
  systemFailure: f(12),
  secondsRemain: f(44),
  flythrough: f(90),
  findBug: f(210),
  hint: f(210 + 138),
  fix: f(420),
  typeStart: f(420 + 12),
  buildStart: f(420 + 44),
  buildEnd: f(420 + 84),
  wave: f(540),
  reveal: f(630),
  brand: f(630 + 74),
};

// ── Utilities ────────────────────────────────────────────────────────────────
let seed = 0x4d4d434c; // "MMCL"
const rand = () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const L = new Float32Array(N);
const R = new Float32Array(N);
const TAU = Math.PI * 2;
const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);

/** Add a mono voice into the stereo bus. fn(t, i) returns a sample for local time t. */
const add = (start, dur, fn, gain = 1, pan = 0) => {
  const s0 = Math.max(0, Math.floor(start * SR));
  const s1 = Math.min(N, Math.floor((start + dur) * SR));
  const gl = gain * Math.cos(((pan + 1) * Math.PI) / 4) * Math.SQRT2;
  const gr = gain * Math.sin(((pan + 1) * Math.PI) / 4) * Math.SQRT2;
  for (let i = s0; i < s1; i++) {
    const v = fn((i - s0) / SR, i - s0);
    L[i] += v * gl;
    R[i] += v * gr;
  }
};

/** One-pole low-pass state holder. */
const lowpass = () => {
  let y = 0;
  return (x, cutoff) => {
    const a = 1 - Math.exp((-TAU * cutoff) / SR);
    y += a * (x - y);
    return y;
  };
};

const saw = (phase) => 2 * (phase - Math.floor(phase + 0.5));
const env = (t, attack, decay) => (t < attack ? t / attack : Math.exp(-(t - attack) / decay));

// ── Sound design building blocks ─────────────────────────────────────────────
const subDrop = (at, { from = 70, to = 28, dur = 2.2, gain = 0.9 } = {}) => {
  let phase = 0;
  add(at, dur, (t) => {
    const freq = to + (from - to) * Math.exp(-t * 3);
    phase += freq / SR;
    return Math.sin(TAU * phase) * env(t, 0.004, dur / 3.2);
  }, gain);
};

const noiseHit = (at, { dur = 0.8, cutoff = 1800, gain = 0.5, pan = 0 } = {}) => {
  const lp = lowpass();
  add(at, dur, (t) => lp(rand() * 2 - 1, cutoff * Math.exp(-t * 3) + 80) * env(t, 0.002, dur / 5), gain, pan);
};

/** Cinematic "braam": detuned, filtered saw stack. */
const braam = (at, notes, { dur = 2.4, gain = 0.28, cutoff = 900 } = {}) => {
  notes.forEach((n) => {
    [-0.12, 0.12].forEach((det, d) => {
      const lp = lowpass();
      let phase = rand();
      const freq = midi(n + det);
      add(at, dur, (t) => {
        phase += freq / SR;
        const c = cutoff * (0.35 + 0.65 * Math.exp(-t * 1.2)) + 60;
        return lp(saw(phase), c) * env(t, 0.03, dur / 2.6);
      }, gain / notes.length, d === 0 ? -0.35 : 0.35);
    });
  });
};

const whoosh = (at, { dur = 0.7, gain = 0.22, pan = 0 } = {}) => {
  const lp = lowpass();
  const hp = lowpass();
  add(at, dur, (t) => {
    const x = rand() * 2 - 1;
    const cut = 300 + 5000 * Math.sin((Math.PI * t) / dur);
    const band = lp(x, cut) - hp(x, cut * 0.25);
    return band * Math.sin((Math.PI * t) / dur) ** 2;
  }, gain, pan);
};

const riser = (at, dur, gain = 0.2) => {
  const lp = lowpass();
  let phase = 0;
  add(at, dur, (t) => {
    const p = t / dur;
    phase += (200 + 1400 * p * p) / SR;
    const tone = Math.sin(TAU * phase) * 0.35;
    const noise = lp(rand() * 2 - 1, 400 + 7000 * p * p);
    return (tone + noise) * p * p;
  }, gain);
};

const click = (at, { freq = 2400, gain = 0.12, pan = 0 } = {}) => {
  add(at, 0.05, (t) => Math.sin(TAU * freq * t) * Math.exp(-t * 180) + (rand() - 0.5) * Math.exp(-t * 400), gain, pan);
};

const bell = (at, note, { dur = 2.5, gain = 0.12, pan = 0 } = {}) => {
  const fr = midi(note);
  add(at, dur, (t) => {
    const e = env(t, 0.003, dur / 4);
    return (Math.sin(TAU * fr * t) + 0.4 * Math.sin(TAU * fr * 2.01 * t) * Math.exp(-t * 3) + 0.2 * Math.sin(TAU * fr * 3.99 * t) * Math.exp(-t * 6)) * e;
  }, gain, pan);
};

const pluck = (at, note, { gain = 0.1, pan = 0 } = {}) => {
  const lp = lowpass();
  let phase = 0;
  const fr = midi(note);
  add(at, 0.5, (t) => {
    phase += fr / SR;
    return lp(saw(phase), 600 + 5000 * Math.exp(-t * 14)) * Math.exp(-t * 7);
  }, gain, pan);
};

const pad = (at, dur, notes, { gain = 0.16, attack = 0.8, release = 1.5, cutoff = 2200 } = {}) => {
  notes.forEach((n, k) => {
    [-0.08, 0.08].forEach((det, d) => {
      const lp = lowpass();
      let phase = rand();
      const fr = midi(n + det);
      add(at, dur, (t) => {
        phase += fr / SR;
        const a = Math.min(1, t / attack) * Math.min(1, Math.max(0, (dur - t) / release));
        return lp(saw(phase), cutoff) * a;
      }, gain / notes.length, (k % 2 ? 0.4 : -0.4) * (d ? 1 : -1));
    });
  });
};

// ── Score ────────────────────────────────────────────────────────────────────
// SCENE 1 — impact in black, emergency, SYSTEM FAILURE, 10 SECONDS REMAIN.
subDrop(T.impact, { from: 55, to: 26, dur: 2.2, gain: 0.8 });
noiseHit(T.impact, { dur: 0.6, cutoff: 900, gain: 0.35 });
subDrop(T.systemFailure, { from: 90, to: 30, dur: 2.6, gain: 1 });
noiseHit(T.systemFailure, { dur: 1.2, cutoff: 3500, gain: 0.5 });
braam(T.systemFailure, [33, 40, 45, 46], { dur: 2.8, gain: 0.5, cutoff: 1100 }); // A1 E2 A2 Bb2 — dissonant
subDrop(T.secondsRemain, { from: 70, to: 32, dur: 1.4, gain: 0.6 });
noiseHit(T.secondsRemain, { dur: 0.5, cutoff: 5000, gain: 0.25 });

// Emergency alarm: two-tone, filtered so it is tense rather than annoying.
for (let t = 0.3; t < T.findBug; t += 0.6) {
  const fade = t < T.flythrough ? 1 : Math.max(0, 1 - (t - T.flythrough) / 3);
  const lp = lowpass();
  add(t, 0.28, (x) => lp(Math.sign(Math.sin(TAU * 740 * x)) * 0.5 + Math.sin(TAU * 740 * x) * 0.5, 1600) * env(x, 0.01, 0.12), 0.05 * fade, -0.3);
  const lp2 = lowpass();
  add(t + 0.3, 0.28, (x) => lp2(Math.sign(Math.sin(TAU * 587 * x)) * 0.5 + Math.sin(TAU * 587 * x) * 0.5, 1600) * env(x, 0.01, 0.12), 0.05 * fade, 0.3);
}

// Tension drone under scenes 1–4: filter slowly opens.
{
  const lps = [lowpass(), lowpass(), lowpass()];
  const phases = [0, 0.3, 0.6];
  const freqs = [midi(33), midi(33.1), midi(45.05)];
  add(0.02, T.wave - 0.02, (t) => {
    let v = 0;
    const cut = 140 + 900 * Math.pow(t / T.wave, 2);
    for (let k = 0; k < 3; k++) {
      phases[k] += freqs[k] / SR;
      v += lps[k](saw(phases[k]), cut);
    }
    const swell = Math.min(1, t / 0.5) * (t > T.wave - 0.4 ? (T.wave - t) / 0.4 : 1);
    return v * swell;
  }, 0.12);
}

// Countdown ticks (one per displayed second) until the build lands.
for (let t = T.secondsRemain, k = 0; t < T.buildEnd - 0.05; t += 1, k++) {
  click(t, { freq: k % 2 ? 1500 : 2100, gain: 0.1, pan: k % 2 ? 0.2 : -0.2 });
}

// SCENE 2 — fly-through: driving pulse, whooshes past each panel, glitch blips.
subDrop(T.flythrough, { from: 80, to: 30, dur: 1.2, gain: 0.6 });
noiseHit(T.flythrough, { dur: 0.4, cutoff: 6000, gain: 0.25 });
for (let t = T.flythrough; t < T.findBug - 0.1; t += 60 / 140 / 2) {
  const lp = lowpass();
  let phase = 0;
  const fr = midi(33);
  add(t, 0.2, (x) => {
    phase += fr / SR;
    return lp(saw(phase), 900 * Math.exp(-x * 20) + 120) * Math.exp(-x * 14);
  }, 0.22);
}
[3.25, 3.75, 4.2, 4.6, 5.0, 5.35, 5.7, 6.0, 6.3].forEach((t, k) => whoosh(t, { dur: 0.55, gain: 0.2, pan: k % 2 ? 0.6 : -0.6 }));
for (let k = 0; k < 14; k++) {
  const t = T.flythrough + 0.2 + rand() * 3.6;
  const fr = 900 + rand() * 2600;
  add(t, 0.06, (x) => Math.sign(Math.sin(TAU * fr * x)) * Math.exp(-x * 60), 0.035, rand() * 1.6 - 0.8);
}
riser(T.findBug - 1.1, 1.1, 0.18);

// SCENE 3 — the camera stops. Heartbeat, dissonant high strings, riser to the fix.
subDrop(T.findBug, { from: 60, to: 28, dur: 2.4, gain: 0.85 });
noiseHit(T.findBug, { dur: 0.9, cutoff: 2500, gain: 0.3 });
for (let t = T.findBug + 0.9; t < T.fix; t += 0.82) {
  subDrop(t, { from: 62, to: 40, dur: 0.35, gain: 0.35 });
  subDrop(t + 0.22, { from: 55, to: 38, dur: 0.3, gain: 0.22 });
}
pad(T.findBug + 0.3, T.fix - T.findBug - 0.1, [81, 82, 88], { gain: 0.06, attack: 3, release: 0.4, cutoff: 3200 }); // A5 Bb5 E6
bell(T.hint, 76, { gain: 0.06 });
riser(T.fix - 1.6, 1.6, 0.16);

// SCENE 4 — the cursor types the fix, the build runs, success chime.
for (let k = 0; k < 8; k++) click(T.typeStart + k * 0.1, { freq: 3200 + rand() * 900, gain: 0.08, pan: rand() - 0.5 });
{
  let phase = 0;
  const dur = T.buildEnd - T.buildStart;
  add(T.buildStart, dur, (t) => {
    const p = t / dur;
    phase += (110 + 330 * p * p) / SR;
    return (Math.sin(TAU * phase) * 0.6 + saw(phase * 2) * 0.15) * p;
  }, 0.14);
  for (let t = T.buildStart; t < T.buildEnd; t += 0.12) click(t, { freq: 1800 + (t - T.buildStart) * 900, gain: 0.04 });
}
[69, 73, 76, 81].forEach((n, k) => bell(T.buildEnd + k * 0.07, n + 12, { dur: 2.2, gain: 0.09, pan: (k - 1.5) * 0.3 })); // A major
subDrop(T.buildEnd, { from: 60, to: 35, dur: 0.8, gain: 0.35 });
riser(T.wave - 1.2, 1.2, 0.22);

// SCENE 5 — CLIMAX: massive impact, A-major braam, bright pad, arpeggio shimmer.
subDrop(T.wave, { from: 100, to: 27, dur: 3.2, gain: 1 });
noiseHit(T.wave, { dur: 1.6, cutoff: 8000, gain: 0.55 });
braam(T.wave, [33, 45, 49, 52], { dur: 3.2, gain: 0.55, cutoff: 2200 }); // A1 A2 C#3 E3
pad(T.wave + 0.05, 7, [45, 52, 57, 61, 64, 69], { gain: 0.22, attack: 0.5, release: 3, cutoff: 3200 });
{
  const arp = [69, 73, 76, 81, 76, 73];
  const step = 60 / 140 / 4;
  for (let t = T.wave, k = 0; t < T.reveal + 0.6; t += step, k++) {
    const fade = t > T.reveal - 0.5 ? Math.max(0, 1 - (t - (T.reveal - 0.5)) / 1.1) : 1;
    pluck(t, arp[k % arp.length] + (k % 12 >= 6 ? 12 : 0), { gain: 0.07 * fade, pan: k % 2 ? 0.45 : -0.45 });
  }
}

// SCENE 6 — dark and clean. Soft brand hit, then the pad resolves.
subDrop(T.brand, { from: 50, to: 30, dur: 2.5, gain: 0.45 });
bell(T.brand, 69, { dur: 3.5, gain: 0.1, pan: -0.2 });
bell(T.brand + 0.09, 76, { dur: 3.5, gain: 0.08, pan: 0.2 });
pad(T.reveal + 0.3, DURATION - T.reveal - 0.3, [45, 57, 64, 69], { gain: 0.1, attack: 1.2, release: 2.5, cutoff: 1400 });

// ── Master: stereo reverb, soft clip, normalise ──────────────────────────────
const reverb = (input, combs, allpasses, wet) => {
  const out = new Float32Array(N);
  for (const len of combs) {
    const buf = new Float32Array(len);
    let idx = 0;
    let lp = 0;
    for (let i = 0; i < N; i++) {
      const y = buf[idx];
      lp = y * 0.7 + lp * 0.3;
      buf[idx] = input[i] + lp * 0.8;
      out[i] += y / combs.length;
      idx = (idx + 1) % len;
    }
  }
  for (const len of allpasses) {
    const buf = new Float32Array(len);
    let idx = 0;
    for (let i = 0; i < N; i++) {
      const b = buf[idx];
      const y = -out[i] + b;
      buf[idx] = out[i] + b * 0.5;
      out[i] = y;
      idx = (idx + 1) % len;
    }
  }
  for (let i = 0; i < N; i++) out[i] = input[i] + out[i] * wet;
  return out;
};

const wetL = reverb(L, [1557, 1617, 1491, 1422], [225, 556], 0.32);
const wetR = reverb(R, [1277, 1356, 1188, 1116], [341, 441], 0.32);

let peak = 0;
for (let i = 0; i < N; i++) {
  wetL[i] = Math.tanh(wetL[i] * 1.2);
  wetR[i] = Math.tanh(wetR[i] * 1.2);
  peak = Math.max(peak, Math.abs(wetL[i]), Math.abs(wetR[i]));
}
const norm = 0.89 / peak; // ≈ -1 dBFS
// Short fades to avoid clicks at the very start/end.
const fadeIn = Math.floor(0.004 * SR);
const fadeOut = Math.floor(0.6 * SR);

const data = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) {
  let g = norm;
  if (i < fadeIn) g *= i / fadeIn;
  if (i > N - fadeOut) g *= (N - i) / fadeOut;
  data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, wetL[i] * g)) * 32767), i * 4);
  data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, wetR[i] * g)) * 32767), i * 4 + 2);
}

const header = Buffer.alloc(44);
header.write("RIFF", 0);
header.writeUInt32LE(36 + data.length, 4);
header.write("WAVE", 8);
header.write("fmt ", 12);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20); // PCM
header.writeUInt16LE(2, 22); // stereo
header.writeUInt32LE(SR, 24);
header.writeUInt32LE(SR * 4, 28);
header.writeUInt16LE(4, 32);
header.writeUInt16LE(16, 34);
header.write("data", 36);
header.writeUInt32LE(data.length, 40);

const outPath = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "audio", "soundtrack.wav");
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, Buffer.concat([header, data]));
console.log(`Soundtrack written → ${outPath} (${DURATION}s, ${SR} Hz stereo)`);
