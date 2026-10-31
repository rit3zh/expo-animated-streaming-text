import type { TColors, TColorScheme } from "./interface";
import { RADIX_GRAY, RADIX_GRAY_ALPHA } from "./radix.const";

const PALETTE: Record<TColorScheme, TColors> = {
  light: {
    background: "#ffffff",
    text: "#1d1d1f",
    muted: "#8e8e93",
    bubble: "#f2f2f7",
    bar: "rgba(250, 250, 252, 0.96)",
    active: "#ffffff",
    border: "rgba(60, 60, 67, 0.12)",
  },
  dark: {
    background: RADIX_GRAY[1],
    text: RADIX_GRAY[12],
    muted: RADIX_GRAY[10],
    bubble: RADIX_GRAY[4],
    bar: RADIX_GRAY[2],
    active: RADIX_GRAY[5],
    border: RADIX_GRAY_ALPHA[4],
  },
};

export { PALETTE };
