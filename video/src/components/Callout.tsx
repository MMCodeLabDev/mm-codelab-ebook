import React from "react";
import { COLORS, FONTS } from "../config/theme";
import { withAlpha } from "../lib/anim";

type Props = {
  top: number;
  color: string;
  opacity: number;
  children: React.ReactNode;
};

/** Glass callout box centred inside the safe area, used for hints and build status. */
export const Callout: React.FC<Props> = ({ top, color, opacity, children }) => (
  <div
    style={{
      position: "absolute",
      left: 140,
      right: 140,
      top,
      padding: "22px 30px",
      borderRadius: 18,
      border: `2px solid ${withAlpha(color, 0.7)}`,
      background: `linear-gradient(160deg, ${withAlpha(color, 0.16)}, ${withAlpha(COLORS.black, 0.7)})`,
      boxShadow: `0 0 50px ${withAlpha(color, 0.35)}`,
      opacity,
      fontFamily: FONTS.display,
      color: COLORS.white,
      textAlign: "center",
    }}
  >
    {children}
  </div>
);
