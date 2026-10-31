import type { ReactNode } from "react";
import type { PressableProps, StyleProp, ViewStyle } from "react-native";
import type { useAnimatedStyle, WithSpringConfig } from "react-native-reanimated";

type TPressScaleStyle = ReturnType<typeof useAnimatedStyle<ViewStyle>>;

interface IPressableScale extends Omit<PressableProps, "style" | "children"> {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  scale?: number;
  spring?: WithSpringConfig;
}

export { type IPressableScale, type TPressScaleStyle };
