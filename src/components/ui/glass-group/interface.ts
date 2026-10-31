import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

interface IGlassGroup {
  children: ReactNode;
  spacing?: number;
  style?: StyleProp<ViewStyle>;
}

export { type IGlassGroup };
