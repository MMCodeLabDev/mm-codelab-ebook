import React from "react";
import { Img } from "remotion";
import { ASSETS, ASSET_SIZES } from "../config/assets";
import { COLORS } from "../config/theme";
import { withAlpha } from "../lib/anim";

/**
 * The real MM CodeLab logo on a light plate — the logo's navy needs a light
 * ground to read on dark backgrounds.
 */
export const BrandPlate: React.FC<{ top: number; logoHeight?: number; enter: number }> = ({ top, logoHeight = 64, enter }) => {
  const logoWidth = (logoHeight * ASSET_SIZES.logo.width) / ASSET_SIZES.logo.height;
  return (
    <div
      style={{
        position: "absolute",
        left: 540 - (logoWidth + 56) / 2,
        top,
        width: logoWidth + 56,
        height: logoHeight + 30,
        borderRadius: 16,
        background: "rgba(255,255,255,0.96)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 0 40px ${withAlpha(COLORS.blue, 0.35)}`,
        opacity: enter,
        transform: `scale(${0.9 + enter * 0.1})`,
      }}
    >
      {/* ► Replace public/brand/mm-codelab-logo.png to update the logo */}
      <Img src={ASSETS.logo} style={{ width: logoWidth, height: logoHeight }} />
    </div>
  );
};
