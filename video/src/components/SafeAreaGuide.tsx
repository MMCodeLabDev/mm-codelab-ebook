import React from "react";
import { AbsoluteFill } from "remotion";
import { SAFE_BOX } from "../config/video";

/** Dev overlay showing the Reels/TikTok/Shorts safe area. Enable via SHOW_SAFE_AREA_GUIDE. */
export const SafeAreaGuide: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div
      style={{
        position: "absolute",
        left: SAFE_BOX.x,
        top: SAFE_BOX.y,
        width: SAFE_BOX.width,
        height: SAFE_BOX.height,
        outline: "3px dashed rgba(0,255,170,0.8)",
        background: "rgba(0,255,170,0.05)",
      }}
    />
  </AbsoluteFill>
);
