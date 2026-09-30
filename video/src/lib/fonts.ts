import { continueRender, delayRender, staticFile } from "remotion";

type FontSpec = { family: string; file: string; weight: string };

/**
 * Fonts are bundled in public/fonts (SIL Open Font License 1.1 — commercial use OK,
 * licence texts alongside). Loading them locally keeps renders offline and deterministic.
 */
const FONT_FILES: FontSpec[] = [
  { family: "Rajdhani", file: "fonts/Rajdhani-Medium.woff2", weight: "500" },
  { family: "Rajdhani", file: "fonts/Rajdhani-SemiBold.woff2", weight: "600" },
  { family: "Rajdhani", file: "fonts/Rajdhani-Bold.woff2", weight: "700" },
  { family: "Manrope", file: "fonts/Manrope-Variable.woff2", weight: "500 800" },
  { family: "JetBrains Mono", file: "fonts/JetBrainsMono-Variable.woff2", weight: "400 700" },
];

let loaded = false;

export const loadLocalFonts = () => {
  if (loaded || typeof document === "undefined") return;
  loaded = true;
  const handle = delayRender("Loading bundled fonts");
  Promise.all(
    FONT_FILES.map(async ({ family, file, weight }) => {
      const face = new FontFace(family, `url('${staticFile(file)}') format('woff2')`, { weight });
      await face.load();
      document.fonts.add(face);
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
};
