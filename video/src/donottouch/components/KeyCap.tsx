import React from "react";
import { COLORS, FONTS } from "../../config/theme";
import { Icon } from "../../components/Icon";
import { withAlpha } from "../../lib/anim";

/** Physical ENTER key, `press` 0..1. */
export const KeyCap: React.FC<{ press: number; color: string }> = ({ press, color }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      padding: "14px 26px",
      borderRadius: 14,
      fontFamily: FONTS.display,
      fontWeight: 700,
      fontSize: 34,
      letterSpacing: "0.18em",
      color: COLORS.white,
      background: `linear-gradient(to bottom, ${withAlpha(COLORS.navyLight, 1)}, ${withAlpha(COLORS.navy, 1)})`,
      border: `2px solid ${withAlpha(color, 0.5 + press * 0.5)}`,
      boxShadow: `0 ${10 - press * 8}px 0 ${withAlpha(COLORS.black, 0.9)}, 0 0 ${30 * press}px ${color}`,
      transform: `translateY(${press * 8}px)`,
    }}
  >
    ENTER
    <Icon name="arrow" size={28} color={color} style={{ transform: "scaleX(-1)" }} />
  </div>
);
