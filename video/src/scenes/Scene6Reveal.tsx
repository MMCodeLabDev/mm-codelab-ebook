import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { ASSETS, ASSET_SIZES, CTA } from "../config/assets";
import { COLORS, FONTS } from "../config/theme";
import { BEATS } from "../config/timeline";
import { EASE, lerpFrames, mix, withAlpha } from "../lib/anim";
import { Icon } from "../components/Icon";

const COVER_H = 560;
const COVER_W = (COVER_H * ASSET_SIZES.cover.width) / ASSET_SIZES.cover.height;
const LOGO_H = 64;
const LOGO_W = (LOGO_H * ASSET_SIZES.logo.width) / ASSET_SIZES.logo.height;

/** 0:21–0:25 — dark, clean. MASTER C#. ONE LINE AT A TIME. Product + brand + subtle CTA. */
export const Scene6Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const b = BEATS.reveal;

  const master = lerpFrames(frame, [b.master, b.master + 16], [0, 1], EASE.outExpo);
  const oneLine = lerpFrames(frame, [b.oneLine, b.oneLine + 16], [0, 1], EASE.outExpo);
  // Tagline travels from centre to the top of the safe area when the product arrives.
  const lift = lerpFrames(frame, [b.productIn - 6, b.productIn + 18], [0, 1], EASE.inOutCubic);
  const taglineY = mix(760, 300, lift);
  const taglineScale = mix(1, 0.72, lift);

  const cover = lerpFrames(frame, [b.productIn, b.productIn + 26], [0, 1], EASE.outExpo);
  const coverTilt = mix(28, 0, cover) + Math.sin(frame * 0.05) * 3 * cover;
  const title = lerpFrames(frame, [b.title, b.title + 14], [0, 1], EASE.outExpo);
  const brand = lerpFrames(frame, [b.brand, b.brand + 14], [0, 1], EASE.outExpo);
  const cta = lerpFrames(frame, [b.cta, b.cta + 14], [0, 1], EASE.outExpo);
  // Light sheen travelling across the cover.
  const sheen = lerpFrames(frame, [b.productIn + 16, b.productIn + 50], [-0.6, 1.6], EASE.inOutCubic);

  return (
    <AbsoluteFill>
      {/* Tagline */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: taglineY,
          textAlign: "center",
          transform: `scale(${taglineScale})`,
          transformOrigin: "50% 0%",
        }}
      >
        <div
          style={{
            fontFamily: FONTS.brand,
            fontWeight: 800,
            fontSize: 132,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            color: COLORS.white,
            opacity: master,
            transform: `translateY(${(1 - master) * 30}px)`,
            filter: `blur(${(1 - master) * 10}px)`,
            textShadow: `0 0 40px ${withAlpha(COLORS.blue, 0.55)}`,
          }}
        >
          MASTER C<span style={{ color: COLORS.blueHot }}>#</span>.
        </div>
        <div
          style={{
            marginTop: 22,
            fontFamily: FONTS.display,
            fontWeight: 600,
            fontSize: 58,
            letterSpacing: `${0.2 + (1 - oneLine) * 0.2}em`,
            marginRight: "-0.2em",
            color: COLORS.blueHot,
            opacity: oneLine,
            textShadow: `0 0 24px ${withAlpha(COLORS.blue, 0.7)}`,
          }}
        >
          ONE LINE AT A TIME.
        </div>
      </div>

      {/* Ebook cover */}
      <div
        style={{
          position: "absolute",
          left: 540 - COVER_W / 2,
          top: 560,
          width: COVER_W,
          height: COVER_H,
          perspective: 1400,
          opacity: cover,
          transform: `translateY(${(1 - cover) * 120}px) scale(${0.9 + cover * 0.1})`,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            transform: `rotateY(${-coverTilt}deg) rotateX(${coverTilt * 0.15}deg)`,
            borderRadius: 8,
            overflow: "hidden",
            boxShadow: `0 50px 100px rgba(0,0,0,0.8), 0 0 90px ${withAlpha(COLORS.blue, 0.45)}, -6px 0 0 ${withAlpha(COLORS.blueIce, 0.25)}`,
          }}
        >
          {/* ► Replace public/brand/ebook-cover.png with the final cover if it changes */}
          <Img src={ASSETS.cover} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(105deg, transparent ${sheen * 100 - 20}%, rgba(255,255,255,0.28) ${sheen * 100}%, transparent ${sheen * 100 + 20}%)`,
              mixBlendMode: "screen",
            }}
          />
        </div>
        {/* Floor glow */}
        <div
          style={{
            position: "absolute",
            left: -120,
            right: -120,
            bottom: -70,
            height: 90,
            background: `radial-gradient(ellipse at 50% 50%, ${withAlpha(COLORS.blue, 0.55)}, transparent 70%)`,
            filter: "blur(10px)",
          }}
        />
      </div>

      {/* Product title */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1170,
          textAlign: "center",
          fontFamily: FONTS.brand,
          fontWeight: 800,
          fontSize: 60,
          letterSpacing: "-0.01em",
          color: COLORS.white,
          opacity: title,
          transform: `translateY(${(1 - title) * 20}px)`,
        }}
      >
        C# No Complications
      </div>

      {/* Brand plate — the logo's navy needs a light plate to read on a dark background */}
      <div
        style={{
          position: "absolute",
          left: 540 - (LOGO_W + 56) / 2,
          top: 1262,
          width: LOGO_W + 56,
          height: LOGO_H + 30,
          borderRadius: 16,
          background: "rgba(255,255,255,0.96)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 40px ${withAlpha(COLORS.blue, 0.35)}`,
          opacity: brand,
          transform: `scale(${0.9 + brand * 0.1})`,
        }}
      >
        {/* ► Replace public/brand/mm-codelab-logo.png to update the logo */}
        <Img src={ASSETS.logo} style={{ width: LOGO_W, height: LOGO_H }} />
      </div>

      {/* Subtle CTA */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1400,
          display: "flex",
          justifyContent: "center",
          opacity: cta * 0.95,
          transform: `translateY(${(1 - cta) * 16}px)`,
        }}
      >
        <div
          style={{
            padding: "12px 30px",
            borderRadius: 999,
            border: `1.5px solid ${withAlpha(COLORS.blueHot, 0.6)}`,
            background: withAlpha(COLORS.blue, 0.1),
            fontFamily: FONTS.brand,
            fontWeight: 700,
            fontSize: 30,
            letterSpacing: "0.02em",
            color: COLORS.blueIce,
          }}
        >
          {CTA.primary}
          <Icon name="arrow" size={28} color={COLORS.blueHot} style={{ marginLeft: 12 }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
