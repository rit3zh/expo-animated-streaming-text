type TColorScheme = "light" | "dark";
type TColors = {
  background: string;
  text: string;
  muted: string;
  bubble: string;
  bar: string;
  active: string;
  border: string;
};

type TRadixStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type TRadixScale = Record<TRadixStep, string>;
type TRadixRadius = Record<1 | 2 | 3 | 4 | 5 | 6 | "full", number>;
type TRadixSize = Record<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9, number>;
type TBezier = readonly [number, number, number, number];

export {
  type TBezier,
  type TColors,
  type TColorScheme,
  type TRadixRadius,
  type TRadixScale,
  type TRadixSize,
  type TRadixStep,
};
