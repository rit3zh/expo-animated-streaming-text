import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import type { SharedValue, useAnimatedStyle } from "react-native-reanimated";

type TShimmerGlyphStyle = ReturnType<typeof useAnimatedStyle<TextStyle>>;

type TShimmerWord = {
  key: string;
  glyphs: readonly TShimmerGlyph[];
};

type TShimmerGlyph = {
  key: string;
  char: string;
  position: number;
};

interface IShimmerText {
  children: string;
  color: string;
  highlightColor: string;
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  duration?: number;
  spread?: number;
  paused?: boolean;
}

interface IShimmerGlyph {
  char: string;
  position: number;
  progress: SharedValue<number>;
  color: string;
  highlightColor: string;
  spread: number;
  style?: StyleProp<TextStyle>;
}

export {
  type IShimmerGlyph,
  type IShimmerText,
  type TShimmerGlyph,
  type TShimmerGlyphStyle,
  type TShimmerWord,
};
