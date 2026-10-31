import { THEME_PALETTES } from "@/constants/components/streaming-text.const";
import { StyleSheet, type TextStyle } from "react-native";
import type { TPalette, TScheme, TTextVariant, TTheme } from "../interface";
import { fade, trailAnimation } from "./animation.util";

function createTheme<T extends TScheme>(
  scheme: T,
  trailMs: number,
  fadeMs: number,
  trail: readonly string[],
): TTheme {
  const p: TPalette = THEME_PALETTES[scheme];
  const variant = (color: string, ...base: TextStyle[]): TTextVariant => ({
    still: [...base, { color }],
    trail: trailAnimation(trail, color, trailMs),
  });
  return {
    ...p,
    scheme,
    fade: fade(fadeMs),
    body: variant(p.text, styles.body),
    mutedBody: variant(p.muted, styles.body),
    cell: variant(p.text, styles.cell),
    headerCell: variant(p.text, styles.cell, styles.strong),
    headings: [styles.h1, styles.h2, styles.h3, styles.h4].map(
      (h: TextStyle): TTextVariant => variant(p.text, h),
    ),
  };
}

const cache: Map<string, TTheme> = new Map<string, TTheme>();

function getTheme(
  scheme: TScheme,
  trailMs: number,
  fadeMs: number,
  trail: readonly string[],
): TTheme {
  const key: string = `${scheme}:${trailMs}:${fadeMs}:${trail.join(",")}`;
  let theme: TTheme | undefined = cache.get(key);
  if (!theme)
    cache.set(key, (theme = createTheme(scheme, trailMs, fadeMs, trail)));
  return theme;
}

const styles = StyleSheet.create({
  body: { fontSize: 16.5, lineHeight: 25, letterSpacing: -0.15 },
  cell: { fontSize: 15, lineHeight: 21 },
  strong: { fontWeight: "600" },
  h1: { fontSize: 27, lineHeight: 34, fontWeight: "700", letterSpacing: -0.6 },
  h2: { fontSize: 22, lineHeight: 29, fontWeight: "700", letterSpacing: -0.4 },
  h3: { fontSize: 19, lineHeight: 26, fontWeight: "600", letterSpacing: -0.3 },
  h4: { fontSize: 17, lineHeight: 24, fontWeight: "600", letterSpacing: -0.2 },
});

export { getTheme };
