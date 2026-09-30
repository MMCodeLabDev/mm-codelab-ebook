import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../../config/theme";
import { EASE, lerpFrames, withAlpha } from "../../lib/anim";
import { BEAT, SCENES } from "../timeline";
import { lampPulse } from "../look";
import { Caret, LegacyEditor, colX, lineY } from "../components/LegacyEditor";
import { MousePointer, pointerAt } from "../components/MousePointer";
import { SignalLoss } from "../components/SignalLoss";
import { DEV_COMMENT, INDENT, PUNCHLINE, SACRED_LINE, WARNING_LINES } from "../code";
import { POINTER_REST } from "./S3Cleanup";

const typeEnd = BEAT.ghostTypeStart + PUNCHLINE.length * BEAT.ghostFramesPerChar;

/** 0:17–0:21 — back in the editor. Nobody is touching the mouse. */
export const S5ToldYou: React.FC = () => {
  const frame = useCurrentFrame();
  const f = frame + SCENES.toldYou.from;

  const ghostChars = lerpFrames(f, [BEAT.ghostTypeStart, typeEnd], [0, PUNCHLINE.length]);
  let caret: Caret | null = null;
  if (f >= BEAT.ghostMoveEnd + 2) caret = { line: SACRED_LINE, col: INDENT + Math.floor(ghostChars), blink: f < BEAT.ghostTypeStart || f >= typeEnd };

  // The pointer drifts back by itself — slow, patient, slightly curved.
  const target = { x: colX(INDENT) + 2, y: lineY(SACRED_LINE) - 6 };
  const base = pointerAt(f, [
    [BEAT.ghostMoveStart, POINTER_REST.x, POINTER_REST.y],
    [BEAT.ghostMoveEnd, target.x, target.y],
    [BEAT.ghostMoveEnd + 16, colX(INDENT + 19), target.y + 46],
  ]);
  const arc = Math.sin(lerpFrames(f, [BEAT.ghostMoveStart, BEAT.ghostMoveEnd], [0, Math.PI])) * 40;
  const pressed = lerpFrames(f, [BEAT.ghostMoveEnd - 1, BEAT.ghostMoveEnd, BEAT.ghostMoveEnd + 5], [0, 1, 0]);

  const land = lerpFrames(f, [BEAT.punchline, BEAT.punchline + 6], [0, 1]);
  // Slow creep, then a decisive push-in on the punchline.
  const push = 1 + lerpFrames(f, [SCENES.toldYou.from, BEAT.punchline], [0, 0.015]) + lerpFrames(f, [BEAT.punchline, SCENES.reveal.from], [0, 0.045], EASE.outExpo);
  const residue = lerpFrames(f, [SCENES.toldYou.from, SCENES.toldYou.from + 8], [0.6, 0]);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transformOrigin: `540px ${lineY(SACRED_LINE)}px`, transform: `scale(${push})` }}>
        <LegacyEditor
          commentChars={DEV_COMMENT.length}
          selection={0}
          deleted
          ghostChars={ghostChars}
          caret={caret}
          focus={lerpFrames(f, [BEAT.ghostMoveStart + 10, BEAT.ghostMoveEnd, BEAT.punchline, BEAT.punchline + 8], [0.2, 0.55, 0.55, 0.8])}
          focusLines={[...WARNING_LINES, SACRED_LINE]}
          warningPulse={f >= BEAT.punchline ? 1 : lampPulse(f, 30)}
          border={withAlpha(COLORS.red, 0.45)}
          status={{ label: "OFFLINE", icon: "alert", color: COLORS.red }}
          brightness={0.9}
          punchGlow={land}
        />
        <MousePointer x={base.x - arc * 0.4} y={base.y + arc} opacity={1} pressed={pressed} />
      </AbsoluteFill>
      <SignalLoss intensity={residue} seed="residue" />
    </AbsoluteFill>
  );
};
