# MM CodeLab — cinematic promo videos

Cinematic sci-fi vertical videos (1080×1920, 30 fps, 750 frames / 25 s) for
**C# No Complications** by **MM CodeLab**, built with React + Remotion + TypeScript.
Both share one visual system (components, fonts, lighting, HUD, particles, synth).

| Composition | Title | Render command | Output |
| --- | --- | --- | --- |
| `LastLineOfCode` | The Last Line of Code | `npm run render` | `out/last-line-of-code.mp4` |
| `DoNotTouchTheCode` | DO NOT TOUCH THE CODE | `npm run render:dntc` | `out/do-not-touch-the-code.mp4` |

## Commands

```bash
cd video
npm install                 # install dependencies
npm run dev                 # preview both compositions in Remotion Studio (http://localhost:3000)
npm run render              # "The Last Line of Code"   → out/last-line-of-code.mp4
npm run render:dntc         # "DO NOT TOUCH THE CODE"   → out/do-not-touch-the-code.mp4
```

Optional:

```bash
npm run render:still        # final frame of LastLineOfCode      → out/thumbnail.png
npm run render:still:dntc   # final frame of DoNotTouchTheCode   → out/do-not-touch-the-code-thumbnail.png
npm run soundtrack          # regenerate public/audio/soundtrack.wav
npm run soundtrack:dntc     # regenerate public/audio/do-not-touch-the-code.wav
npm run typecheck
```

Requires Node.js 18+. Remotion downloads its own headless Chrome on first render.

---

## 1 · The Last Line of Code (`LastLineOfCode`)

| Time | Scene | Beat |
| --- | --- | --- |
| 0:00–0:03 | `Scene1Failure` | Black → impact → emergency lights → **SYSTEM FAILURE** / **10 SECONDS REMAIN** |
| 0:03–0:07 | `Scene2Flythrough` | 3D camera rush through holographic C# panels, broken modules glitch red → **FIND THE BUG.** |
| 0:07–0:14 | `Scene3FindBug` | Camera lands on `PowerCore.cs`, spotlight on the bug → **CAN YOU SEE IT?** + hint |
| 0:14–0:18 | `Scene4Fix` | Cursor types `(double)` → **BUILDING...** → **BUILD SUCCESSFUL**, output `Power: 75%` |
| 0:18–0:21 | `Scene5Wave` | Red → electric blue, shockwave + light wave, particles burst, music climax |
| 0:21–0:25 | `Scene6Reveal` | **MASTER C#. / ONE LINE AT A TIME.** → cover, title, logo, subtle CTA |

The bug (real, compilable C#):

```csharp
// Core power: 3 of 4 cores online
int online = 3;
int total  = 4;

double power =
    online / total * 100;          // int / int → 0, so power == 0

Console.WriteLine($"Power: {power}%");   // Power: 0%
```

Fix: `(double)online / total * 100` → `Power: 75%`.

---

## 2 · DO NOT TOUCH THE CODE (`DoNotTouchTheCode`)

A programming meme disguised as a serious sci-fi thriller:
curiosity → suspense → tension → false relief → disaster → punchline.

| Time | Scene | Beat |
| --- | --- | --- |
| 0:00–0:04 | `S1Warning` | Near-black, server-room hum, one red lamp pulsing → **DO NOT TOUCH THIS CODE.** → **PRODUCTION · ONLINE** |
| 0:04–0:08 | `S2Legacy` | Slow dolly onto `Production.cs`, gutter warnings → **LAST MODIFIED: 847 DAYS AGO** |
| 0:08–0:13.2 | `S3Cleanup` | Types `// Let's clean this up.`, selects `Thread.Sleep(7);`, deletes it, `dotnet build`, ENTER → dead silence → **BUILD SUCCESSFUL** (false relief, blue) |
| 0:13.2–0:17 | `S4Outage` | **PRODUCTION: ONLINE → OFFLINE**, then DATABASE / AUTHENTICATION / API / **EVERYTHING — OFFLINE** with accelerating hits, shake and signal loss |
| 0:17–0:21 | `S5ToldYou` | Back in the editor. The pointer moves by itself to the deleted line and types `// I TOLD YOU.` |
| 0:21–0:25 | `S6Reveal` | Hard cut to black → *Every developer has seen this code.* → cover, **C# No Complications**, *Learn what the code actually does.*, logo |

The file (real, compilable C# with .NET 6+ implicit usings; `Database`, `Auth` and `Api`
are the project's own classes):

```csharp
public static class Production
{
    public static void Start()
    {
        // DO NOT DELETE
        // Nobody knows why this works.
        Thread.Sleep(7);

        Database.Connect();
        Auth.Initialize();
        Api.Listen();
    }
}
```

The build still succeeds after the line is deleted, because the code stays valid. Production
fails because it depended on that timing. The punchline is itself a valid C# comment.

Soundtrack arc: subtle ambience → slow tension → true silence after ENTER (≈ −69 dB) →
false-relief chime → near-silence (≈ −53 dB) → outage hits → empty room → punchline sting →
clean A-major resolution. Silence windows are enforced with master automation, so reverb tails
cannot leak into them.

---

## Structure

```
video/
├── public/
│   ├── brand/mm-codelab-logo.png          ← real logo (from ../assets)
│   ├── brand/ebook-cover.png              ← real English cover (from ../assets)
│   ├── audio/soundtrack.wav               ← "The Last Line of Code" score (generated)
│   ├── audio/do-not-touch-the-code.wav    ← "DO NOT TOUCH THE CODE" score (generated)
│   └── fonts/                             ← Rajdhani, Manrope, JetBrains Mono (OFL 1.1) + licences
├── scripts/
│   ├── lib/synth.mjs                      ← shared deterministic synth (voices, reverb, master, WAV)
│   ├── generate-soundtrack.mjs            ← score for LastLineOfCode
│   └── generate-soundtrack-do-not-touch.mjs ← score for DoNotTouchTheCode
├── src/
│   ├── index.ts / Root.tsx                ← Remotion entry, registers both compositions
│   ├── Video.tsx, scenes/, code/, config/timeline.ts   ← "The Last Line of Code"
│   ├── donottouch/                        ← "DO NOT TOUCH THE CODE"
│   │   ├── DoNotTouchTheCode.tsx          ← layer stack, flashes, shake, audio
│   │   ├── timeline.ts                    ← scenes + every beat (absolute frames)
│   │   ├── look.ts                        ← lighting design: backdrop/grid/HUD/particle looks, lamp, impacts
│   │   ├── code.ts                        ← the legacy C# file, comment, punchline
│   │   ├── components/                    ← LegacyEditor, StatusPlate, PulseLamp, MousePointer,
│   │   │                                     KeyCap, MetaCard, SignalLoss
│   │   └── scenes/                        ← S1Warning … S6Reveal
│   ├── config/                            ← video size + safe area, theme, asset paths, CTA copy
│   ├── lib/                               ← animation helpers, red→blue system state, font loader
│   └── components/                        ← shared visuals (GlitchText, Headline, CodeLine, Backdrop,
│                                             GridTunnel, Particles, HudOverlay, EmergencyLights,
│                                             BookCover, BrandPlate, CameraShake, Flash, LensOverlay, …)
└── remotion.config.ts                     ← H.264, CRF 16, yuv420p
```

Shared background layers (`Backdrop`, `GridTunnel`, `DataStreams`, `Particles`, `HudOverlay`,
`EmergencyLights`) take an optional `look` / `intensityAt` prop. Without it they render exactly
as in "The Last Line of Code". `src/donottouch/look.ts` supplies the second film's lighting.

## Swapping assets

Replace the files, keep the filenames:

- `public/brand/mm-codelab-logo.png`: logo (transparent PNG). If the aspect ratio
  changes, update `ASSET_SIZES.logo` in `src/config/assets.ts`.
- `public/brand/ebook-cover.png`: cover. Update `ASSET_SIZES.cover` if its size changes.
- `public/audio/*.wav`: optional, replace with licensed music (25 s each).
- CTA text (first video): `CTA.primary` in `src/config/assets.ts`.

## Notes

- All animation is frame-driven (`useCurrentFrame`, seeded `random()`), with no `Math.random` and no timers.
- All important content stays in the social safe area (260 px top, 440 px bottom,
  150 px right). Set `SHOW_SAFE_AREA_GUIDE = true` in `src/config/video.ts` to see it.
- Retiming: edit the composition's timeline (`src/config/timeline.ts` or
  `src/donottouch/timeline.ts`), mirror the change in its soundtrack script, then
  run `npm run soundtrack` / `npm run soundtrack:dntc`.
- Licensing: fonts are SIL OFL 1.1, the soundtracks are original and synthesised
  in code, and all other visuals are generated in code. No stock assets.
