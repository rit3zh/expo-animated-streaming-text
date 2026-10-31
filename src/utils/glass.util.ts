import {
  isGlassEffectAPIAvailable,
  isLiquidGlassAvailable,
} from "expo-glass-effect";
import { Platform } from "react-native";

let glassSupported: boolean | null = null;

const isGlassSupported = (): boolean => {
  if (glassSupported === null) {
    glassSupported =
      Platform.OS === "ios" &&
      isLiquidGlassAvailable() &&
      isGlassEffectAPIAvailable();
  }
  return glassSupported;
};

export { isGlassSupported };
