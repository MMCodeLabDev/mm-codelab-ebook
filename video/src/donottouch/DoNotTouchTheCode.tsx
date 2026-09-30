import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ASSETS } from "../config/assets";
import { COLORS } from "../config/theme";
import { SHOW_SAFE_AREA_GUIDE } from "../config/video";
import { Backdrop } from "../components/Backdrop";
import { GridTunnel } from "../components/GridTunnel";
import { DataStreams } from "../components/DataStreams";
import { EmergencyLights } from "../components/EmergencyLights";
import { Particles } from "../components/Particles";
import { CameraShake } from "../components/CameraShake";
import { HudOverlay } from "../components/HudOverlay";
import { Flash } from "../components/Flash";
import { LensOverlay } from "../components/LensOverlay";
import { SafeAreaGuide } from "../components/SafeAreaGuide";
import { PulseLamp } from "./components/PulseLamp";
import { StatusPlate } from "./components/StatusPlate";
import { BACKDROP, GRID, HUD, IMPACTS, PARTICLES, STREAMS, beaconIntensity, lampIntensity } from "./look";
import { BEAT, SCENES } from "./timeline";
import { S1Warning } from "./scenes/S1Warning";
import { S2Legacy } from "./scenes/S2Legacy";
import { S3Cleanup } from "./scenes/S3Cleanup";
import { S4Outage } from "./scenes/S4Outage";
import { S5ToldYou } from "./scenes/S5ToldYou";
import { S6Reveal } from "./scenes/S6Reveal";

const scenes = [
  { key: "1 warning", ...SCENES.warning, Component: S1Warning },
  { key: "2 legacy", ...SCENES.legacy, Component: S2Legacy },
  { key: "3 cleanup", ...SCENES.cleanup, Component: S3Cleanup },
  { key: "4 outage", ...SCENES.outage, Component: S4Outage },
  { key: "5 told you", ...SCENES.toldYou, Component: S5ToldYou },
  { key: "6 reveal", ...SCENES.reveal, Component: S6Reveal },
] as const;

const Lamp: React.FC = () => <PulseLamp intensity={lampIntensity(useCurrentFrame())} />;

/** "DO NOT TOUCH THE CODE" — a programming meme disguised as a sci-fi thriller. */
export const DoNotTouchTheCode: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black }}>
      <Html5Audio
        src={ASSETS.soundtrackDoNotTouch}
        volume={(f) => interpolate(f, [durationInFrames - 20, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />

      <CameraShake impacts={IMPACTS}>
        <Backdrop look={BACKDROP} />
        <GridTunnel look={GRID} />
        <DataStreams look={STREAMS} />
        <EmergencyLights intensityAt={beaconIntensity} speed={7} />
        <Lamp />
        <Particles look={PARTICLES} />
        {scenes.map(({ key, from, duration, Component }) => (
          <Sequence key={key} name={key} from={from} durationInFrames={duration}>
            <Component />
          </Sequence>
        ))}
        <StatusPlate />
      </CameraShake>

      <HudOverlay look={HUD} />

      <Flash at={BEAT.silenceEnd} duration={16} color={COLORS.blueHot} peak={0.22} />
      <Flash at={BEAT.offline} duration={10} color={COLORS.red} peak={0.7} />
      <Flash at={BEAT.database} duration={8} color={COLORS.red} peak={0.4} />
      <Flash at={BEAT.auth} duration={8} color={COLORS.red} peak={0.45} />
      <Flash at={BEAT.api} duration={8} color={COLORS.red} peak={0.5} />
      <Flash at={BEAT.everything} duration={14} color={COLORS.redHot} peak={0.8} />
      <Flash at={BEAT.signalLoss} duration={6} peak={0.35} />
      <Flash at={BEAT.punchline} duration={10} color={COLORS.red} peak={0.18} />

      <LensOverlay />
      {SHOW_SAFE_AREA_GUIDE && <SafeAreaGuide />}
    </AbsoluteFill>
  );
};
