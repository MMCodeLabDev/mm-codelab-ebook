import { SYSTEM_RESTORE } from "../config/timeline";
import { COLORS } from "../config/theme";
import { lerpFrames, mixColor, EASE } from "./anim";

/** 0 = emergency (red) … 1 = restored (electric blue). Driven by absolute frame. */
export const restoreAmount = (absoluteFrame: number) =>
  lerpFrames(absoluteFrame, [SYSTEM_RESTORE.from, SYSTEM_RESTORE.to], [0, 1], EASE.inOutCubic);

/** Accent colour of the whole environment at a given absolute frame. */
export const accentAt = (absoluteFrame: number, alpha = 1) =>
  mixColor(COLORS.red, COLORS.blue, restoreAmount(absoluteFrame), alpha);
