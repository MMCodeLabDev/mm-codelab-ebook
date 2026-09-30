import React from "react";
import { Img } from "remotion";
import { ASSETS, ASSET_SIZES } from "../config/assets";
import { COLORS } from "../config/theme";
import { withAlpha } from "../lib/anim";

type Props = {
  /** Centre X / top Y in px. */
  cx: number;
  top: number;
  height: number;
  /** 0..1 entrance progress. */
  enter: number;
  /** Y-rotation in degrees (perspective tilt). */
  tilt: number;
  /** -0.6..1.6 — position of the light sheen across the cover. */
  sheen: number;
};

/** The real "C# No Complications" cover, lit like a product hero shot (3D tilt, sheen, floor glow). */
export const BookCover: React.FC<Props> = ({ cx, top, height, enter, tilt, sheen }) => {
  const width = (height * ASSET_SIZES.cover.width) / ASSET_SIZES.cover.height;
  return (
    <div
      style={{
        position: "absolute",
        left: cx - width / 2,
        top,
        width,
        height,
        perspective: 1400,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 100}px) scale(${0.92 + enter * 0.08})`,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transform: `rotateY(${-tilt}deg) rotateX(${tilt * 0.15}deg)`,
          borderRadius: 8,
          overflow: "hidden",
          boxShadow: `0 50px 100px rgba(0,0,0,0.8), 0 0 90px ${withAlpha(COLORS.blue, 0.4)}, -6px 0 0 ${withAlpha(COLORS.blueIce, 0.25)}`,
        }}
      >
        {/* ► Replace public/brand/ebook-cover.png to update the cover */}
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
      <div
        style={{
          position: "absolute",
          left: -120,
          right: -120,
          bottom: -70,
          height: 90,
          background: `radial-gradient(ellipse at 50% 50%, ${withAlpha(COLORS.blue, 0.5)}, transparent 70%)`,
          filter: "blur(10px)",
        }}
      />
    </div>
  );
};
