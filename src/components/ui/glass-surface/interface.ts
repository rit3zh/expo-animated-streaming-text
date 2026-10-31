import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

interface IGlassSurface {
  radius: number;
  children?: ReactNode;
  interactive?: boolean;
  style?: StyleProp<ViewStyle>;
}

export { type IGlassSurface };
