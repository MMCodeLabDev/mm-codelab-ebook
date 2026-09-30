# The Last Line of Code — MM CodeLab promo video

A cinematic sci-fi vertical video (1080×1920, 30 fps, 750 frames / 25 s) for
**C# No Complications** by **MM CodeLab**, built with React + Remotion + TypeScript.

| Time | Scene | Beat |
| --- | --- | --- |
| 0:00–0:03 | `Scene1Failure` | Black → impact → emergency lights → **SYSTEM FAILURE** / **10 SECONDS REMAIN** |
| 0:03–0:07 | `Scene2Flythrough` | 3D camera rush through holographic C# panels, broken modules glitch red → **FIND THE BUG.** |
| 0:07–0:14 | `Scene3FindBug` | Camera lands on `PowerCore.cs`, spotlight on the bug → **CAN YOU SEE IT?** + hint |
| 0:14–0:18 | `Scene4Fix` | Cursor types `(double)` → **BUILDING...** → **BUILD SUCCESSFUL**, output `Power: 75%` |
| 0:18–0:21 | `Scene5Wave` | Red → electric blue, shockwave + light wave, particles burst, music climax |
| 0:21–0:25 | `Scene6Reveal` | **MASTER C#. / ONE LINE AT A TIME.** → cover, title, logo, subtle CTA |

## The bug (real, compilable C#)

```csharp
// Core power: 3 of 4 cores online
int online = 3;
int total  = 4;

double power =
    online / total * 100;          // int / int → 0, so power == 0

Console.WriteLine($"Power: {power}%");   // Power: 0%
```

Fix: `(double)online / total * 100` → `Power: 75%`.

## Commands

```bash
cd video
npm install                 # install dependencies
npm run dev                 # preview in Remotion Studio (http://localhost:3000)
npm run render              # render → out/last-line-of-code.mp4
```

Optional:

```bash
npm run render:still        # final-frame PNG (thumbnail/cover) → out/thumbnail.png
npm run soundtrack          # regenerate public/audio/soundtrack.wav
npm run typecheck
```

Requires Node.js 18+. Remotion downloads its own headless Chrome on first render.

## Structure

```
video/
├── public/
│   ├── brand/mm-codelab-logo.png    ← real logo (from ../assets)
│   ├── brand/ebook-cover.png        ← real English cover (from ../assets)
│   ├── audio/soundtrack.wav         ← original procedural score (generated)
│   └── fonts/                       ← Rajdhani, Manrope, JetBrains Mono (OFL 1.1) + licences
├── scripts/generate-soundtrack.mjs  ← deterministic synth score, synced to the timeline
├── src/
│   ├── index.ts / Root.tsx          ← Remotion entry + <Composition>
│   ├── Video.tsx                    ← layer stack, scene sequencing, flashes, camera shake, audio
│   ├── config/                      ← video size + safe area, timeline, theme, asset paths, CTA copy
│   ├── code/                        ← C# snippet, fix, hint text, tokenizer for syntax colours
│   ├── lib/                         ← animation helpers, red→blue system state, font loader
│   ├── components/                  ← reusable visuals (GlitchText, Headline, CodeTerminal,
│   │                                   HoloPanel, Particles, GridTunnel, HudRings, Countdown, …)
│   └── scenes/                      ← one file per scene
└── remotion.config.ts               ← H.264, CRF 16, yuv420p
```

## Swapping assets

Replace the files, keep the filenames:

- `public/brand/mm-codelab-logo.png` — logo (transparent PNG). If the aspect ratio
  changes, update `ASSET_SIZES.logo` in `src/config/assets.ts`.
- `public/brand/ebook-cover.png` — cover. Update `ASSET_SIZES.cover` if its size changes.
- `public/audio/soundtrack.wav` — optional: replace with licensed music (25 s).
- CTA text: `CTA.primary` in `src/config/assets.ts`.

## Notes

- All animation is frame-driven (`useCurrentFrame`, seeded `random()`); no `Math.random`, no timers.
- All important content stays in the social safe area (260 px top, 440 px bottom,
  150 px right). Set `SHOW_SAFE_AREA_GUIDE = true` in `src/config/video.ts` to see it.
- Retiming a scene: edit `src/config/timeline.ts`, then mirror the change in
  `scripts/generate-soundtrack.mjs` and run `npm run soundtrack`.
- Licensing: fonts are SIL OFL 1.1, the soundtrack is original and synthesised
  in code, and all other visuals are generated in code. No stock assets.
