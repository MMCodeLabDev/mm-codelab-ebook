import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { COLORS } from "../../config/theme";
import { lerpFrames, withAlpha } from "../../lib/anim";
import { SCENES } from "../timeline";
import { accent, lampPulse } from "../look";
import { EDITOR, LegacyEditor, lineY } from "../components/LegacyEditor";
import { MetaCard } from "../components/MetaCard";
import { SACRED_LINE, WARNING_LINES } from "../code";

const FOCUS = [...WARNING_LINES, SACRED_LINE];

/** 0:04–0:08 — a slow dolly toward a legacy file nobody dares to open. */
export const S2Legacy: React.FC = () => {
  const frame = useCurrentFrame();
  const f = frame + SCENES.legacy.from;
  const end = SCENES.cleanup.from;

  // Slow, deliberate camera: far and angled → locked-off.
  const t = lerpFrames(f, [SCENES.legacy.from, end - 4], [0, 1], Easing.bezier(0.33, 0, 0.15, 1));
  const appear = lerpFrames(f, [SCENES.legacy.from, SCENES.legacy.from + 24], [0, 1]);
  const originY = lineY(SACRED_LINE);
  const sweep = lerpFrames(f, [150, 206], [-0.4, 1.4]);

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          opacity: appear,
          transformOrigin: `540px ${originY}px`,
          transform: `perspective(1800px) translate3d(0, ${(1 - t) * 160}px, ${(1 - t) * -1200}px) rotateX(${(1 - t) * 18}deg) rotateY(${(1 - t) * -12}deg)`,
          filter: t < 0.98 ? `blur(${(1 - t) * 5}px)` : undefined,
        }}
      >
        <LegacyEditor
          commentChars={0}
          selection={0}
          deleted={false}
          ghostChars={0}
          caret={null}
          focus={lerpFrames(f, [204, 236], [0, 0.45])}
          focusLines={FOCUS}
          warningPulse={lerpFrames(f, [150, 170], [0, 1]) * lampPulse(f, 24)}
          border={accent(f, 0.5)}
          status={{ label: "LIVE", icon: "dot", color: COLORS.redHot }}
        />
        {/* Light sweep across the glass */}
        <div
          style={{
            position: "absolute",
            left: EDITOR.left,
            top: EDITOR.top,
            width: EDITOR.width,
            height: 820,
            borderRadius: 20,
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(115deg, transparent ${sweep * 100 - 14}%, ${withAlpha(COLORS.white, 0.1)} ${sweep * 100}%, transparent ${sweep * 100 + 14}%)`,
            }}
          />
        </div>
      </AbsoluteFill>

      <MetaCard f={f} opacity={1} />
    </AbsoluteFill>
  );
};
