/**
 * Shared deterministic synthesiser used by every MM CodeLab soundtrack.
 *
 * 100% original sound design synthesised from code — no samples, no third-party
 * audio — so every generated file is safe for commercial use. All randomness
 * comes from a seeded PRNG: the same score always yields the same bytes.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

export const SR = 44100;
export const TAU = Math.PI * 2;
export const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);
export const saw = (phase) => 2 * (phase - Math.floor(phase + 0.5));
export const env = (t, attack, decay) => (t < attack ? t / attack : Math.exp(-(t - attack) / decay));

/** One-pole low-pass state holder. */
export const lowpass = () => {
  let y = 0;
  return (x, cutoff) => {
    const a = 1 - Math.exp((-TAU * cutoff) / SR);
    y += a * (x - y);
    return y;
  };
};

/**
 * Create a stereo mix bus of `duration` seconds with its own seeded PRNG.
 * Returns the bus primitives, the cinematic building blocks and `writeWav`.
 */
export const createSynth = ({ duration, seed: initialSeed = 0x4d4d434c }) => {
  const N = SR * duration;
  let seed = initialSeed;
  const rand = () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const L = new Float32Array(N);
  const R = new Float32Array(N);

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

  /**
   * Master: stereo Schroeder reverb, optional post-reverb automation (gain per second,
   * e.g. to force true silence through reverb tails), soft clip, normalise to ≈ -1 dBFS,
   * 16-bit WAV.
   */
  const writeWav = (outPath, { wet = 0.32, drive = 1.2, fadeOutSeconds = 0.6, automation } = {}) => {
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

    const wetL = reverb(L, [1557, 1617, 1491, 1422], [225, 556], wet);
    const wetR = reverb(R, [1277, 1356, 1188, 1116], [341, 441], wet);
    if (automation) {
      for (let i = 0; i < N; i++) {
        const g = automation(i / SR);
        wetL[i] *= g;
        wetR[i] *= g;
      }
    }

    let peak = 0;
    for (let i = 0; i < N; i++) {
      wetL[i] = Math.tanh(wetL[i] * drive);
      wetR[i] = Math.tanh(wetR[i] * drive);
      peak = Math.max(peak, Math.abs(wetL[i]), Math.abs(wetR[i]));
    }
    const norm = 0.89 / peak; // ≈ -1 dBFS
    // Short fades to avoid clicks at the very start/end.
    const fadeIn = Math.floor(0.004 * SR);
    const fadeOut = Math.floor(fadeOutSeconds * SR);

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

    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, Buffer.concat([header, data]));
    console.log(`Soundtrack written → ${outPath} (${duration}s, ${SR} Hz stereo)`);
  };

  return { N, L, R, rand, add, subDrop, noiseHit, braam, whoosh, riser, click, bell, pluck, pad, writeWav };
};
