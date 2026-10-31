import { memo, type FC } from "react";
import type { TextStyle } from "react-native";
import Animated, { interpolateColor, useAnimatedStyle } from "react-native-reanimated";

import { registerComponent } from "@/utils/register-component.util";

import type { IShimmerGlyph, TShimmerGlyphStyle } from "./interface";

const ShimmerGlyphBase: FC<IShimmerGlyph> = ({
  char,
  position,
  progress,
  color,
  highlightColor,
  spread,
  style,
}: IShimmerGlyph & React.ComponentProps<typeof ShimmerGlyphBase>): React.ReactNode &
  React.JSX.Element => {
  const animatedStyle: TShimmerGlyphStyle = useAnimatedStyle<TextStyle>((): TextStyle => {
    const distance: number = position - progress.get();
    const intensity: number = Math.exp(-(distance * distance) / (2 * spread * spread));
    return { color: interpolateColor(intensity, [0, 1], [color, highlightColor]) };
  });

  return <Animated.Text style={[style, animatedStyle]}>{char}</Animated.Text>;
};

const ShimmerGlyph = registerComponent("ShimmerGlyph", memo(ShimmerGlyphBase));

export { ShimmerGlyph };
