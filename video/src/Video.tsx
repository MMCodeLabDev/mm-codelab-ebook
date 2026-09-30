import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, useVideoConfig, interpolate } from "remotion";
import { ASSETS } from "./config/assets";
import { COLORS } from "./config/theme";
import { SCENES } from "./config/timeline";
import { SHOW_SAFE_AREA_GUIDE } from "./config/video";
import { Backdrop } from "./components/Backdrop";
import { GridTunnel } from "./components/GridTunnel";
import { DataStreams } from "./components/DataStreams";
import { EmergencyLights } from "./components/EmergencyLights";
import { Particles } from "./components/Particles";
import { CameraShake, Impact } from "./components/CameraShake";
import { HudOverlay } from "./components/HudOverlay";
import { Countdown } from "./components/Countdown";
import { Flash } from "./components/Flash";
import { LensOverlay } from "./components/LensOverlay";
import { SafeAreaGuide } from "./components/SafeAreaGuide";
import { Scene1Failure } from "./scenes/Scene1Failure";
import { Scene2Flythrough } from "./scenes/Scene2Flythrough";
import { Scene3FindBug } from "./scenes/Scene3FindBug";
import { Scene4Fix } from "./scenes/Scene4Fix";
import { Scene5Wave } from "./scenes/Scene5Wave";
import { Scene6Reveal } from "./scenes/Scene6Reveal";

/** Camera impacts (absolute frames) — mirrored by hits in the soundtrack. */
const IMPACTS: readonly Impact[] = [
  { at: 0, strength: 10, decay: 10 },
  { at: 12, strength: 26, decay: 12 },
  { at: 44, strength: 14 },
  { at: SCENES.flythrough.from, strength: 12, decay: 8 },
  { at: SCENES.findBug.from, strength: 16, decay: 8 },
  { at: SCENES.fix.from + 84, strength: 10 },
  { at: SCENES.wave.from, strength: 30, decay: 16 },
];

const scenes = [
  { key: "failure", ...SCENES.failure, Component: Scene1Failure },
  { key: "flythrough", ...SCENES.flythrough, Component: Scene2Flythrough },
  { key: "findBug", ...SCENES.findBug, Component: Scene3FindBug },
  { key: "fix", ...SCENES.fix, Component: Scene4Fix },
  { key: "wave", ...SCENES.wave, Component: Scene5Wave },
  { key: "reveal", ...SCENES.reveal, Component: Scene6Reveal },
] as const;

/** "The Last Line of Code" — MM CodeLab · C# No Complications. */
export const LastLineOfCode: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black }}>
      <Html5Audio
        src={ASSETS.soundtrack}
        volume={(f) => interpolate(f, [durationInFrames - 20, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />

      <CameraShake impacts={IMPACTS}>
        <Backdrop />
        <GridTunnel />
        <DataStreams />
        <EmergencyLights />
        <Particles />
        {scenes.map(({ key, from, duration, Component }) => (
          <Sequence key={key} name={key} from={from} durationInFrames={duration}>
            <Component />
          </Sequence>
        ))}
      </CameraShake>

      <HudOverlay />
      <Countdown />

      <Flash at={12} duration={6} color={COLORS.red} peak={0.5} />
      <Flash at={SCENES.flythrough.from} duration={8} peak={0.55} />
      <Flash at={SCENES.findBug.from} duration={12} peak={0.75} />
      <Flash at={SCENES.fix.from + 84} duration={12} color={COLORS.blueHot} peak={0.45} />
      <Flash at={SCENES.wave.from} duration={14} color={COLORS.blueHot} peak={0.85} />

      <LensOverlay />
      {SHOW_SAFE_AREA_GUIDE && <SafeAreaGuide />}
    </AbsoluteFill>
  );
};
