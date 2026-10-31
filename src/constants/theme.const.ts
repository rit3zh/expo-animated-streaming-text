import { DarkTheme, type Theme } from "expo-router";

import { RADIX_GRAY } from "./radix.const";

const THEME_NAVIGATION: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: RADIX_GRAY[12],
    background: RADIX_GRAY[1],
    card: RADIX_GRAY[2],
    text: RADIX_GRAY[12],
    border: RADIX_GRAY[6],
  },
};

export { THEME_NAVIGATION };
