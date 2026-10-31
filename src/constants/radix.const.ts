import type { TRadixRadius, TRadixScale, TRadixSize } from "./interface";

const RADIX_GRAY: TRadixScale = {
  1: "#000000",
  2: "#0a0a0a",
  3: "#131313",
  4: "#1b1b1b",
  5: "#232323",
  6: "#2c2c2c",
  7: "#393939",
  8: "#505050",
  9: "#6e6e6e",
  10: "#8e8e8e",
  11: "#b4b4b4",
  12: "#f5f5f5",
};
const RADIX_GRAY_ALPHA: TRadixScale = {
  1: "#ffffff00",
  2: "#ffffff09",
  3: "#ffffff12",
  4: "#ffffff1b",
  5: "#ffffff22",
  6: "#ffffff2c",
  7: "#ffffff3b",
  8: "#ffffff55",
  9: "#ffffff64",
  10: "#ffffff72",
  11: "#ffffffaf",
  12: "#ffffffed",
};

const RADIX_RED: TRadixScale = {
  1: "#191111",
  2: "#201314",
  3: "#3b1219",
  4: "#500f1c",
  5: "#611623",
  6: "#72232d",
  7: "#8c333a",
  8: "#b54548",
  9: "#e5484d",
  10: "#ec5d5e",
  11: "#ff9592",
  12: "#ffd1d9",
};

const RADIX_VIOLET: TRadixScale = {
  1: "#14121f",
  2: "#1b1525",
  3: "#291f43",
  4: "#33255b",
  5: "#3c2e69",
  6: "#473876",
  7: "#56468b",
  8: "#6958ad",
  9: "#6e56cf",
  10: "#7d66d9",
  11: "#baa7ff",
  12: "#e2ddfe",
};

const RADIX_RADIUS: TRadixRadius = {
  1: 3,
  2: 4,
  3: 6,
  4: 8,
  5: 12,
  6: 16,
  full: 9999,
};

const RADIX_SPACE: TRadixSize = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 24,
  6: 32,
  7: 40,
  8: 48,
  9: 64,
};

const RADIX_FONT_SIZE: TRadixSize = {
  1: 12,
  2: 14,
  3: 16,
  4: 18,
  5: 20,
  6: 24,
  7: 28,
  8: 35,
  9: 60,
};

const RADIX_LINE_HEIGHT: TRadixSize = {
  1: 16,
  2: 20,
  3: 24,
  4: 26,
  5: 28,
  6: 30,
  7: 36,
  8: 40,
  9: 60,
};

const RADIX_WHITE: string = "#ffffff";

export {
  RADIX_FONT_SIZE,
  RADIX_GRAY,
  RADIX_GRAY_ALPHA,
  RADIX_LINE_HEIGHT,
  RADIX_RADIUS,
  RADIX_RED,
  RADIX_SPACE,
  RADIX_VIOLET,
  RADIX_WHITE,
};
