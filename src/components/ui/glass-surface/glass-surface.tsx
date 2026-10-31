import { GlassView } from "expo-glass-effect";
import type { FC } from "react";
import { StyleSheet, View } from "react-native";

import { GLASS_SURFACE_TINT } from "@/constants/components/glass-surface.const";
import { RADIX_GRAY, RADIX_GRAY_ALPHA } from "@/constants/radix.const";
import { isGlassSupported } from "@/utils/glass.util";
import { registerComponent } from "@/utils/register-component.util";

import type { IGlassSurface } from "./interface";

const GlassSurfaceBase: FC<IGlassSurface> = ({
  radius,
  children,
  interactive = true,
  style,
}: IGlassSurface &
  React.ComponentProps<typeof GlassSurfaceBase>): React.ReactNode &
  React.JSX.Element =>
  isGlassSupported() ? (
    <GlassView
      glassEffectStyle={{
        style: "regular",
      }}
      colorScheme="dark"
      tintColor={GLASS_SURFACE_TINT}
      isInteractive={interactive}
      style={[styles.glass, { borderRadius: radius }, style]}
    >
      {children}
    </GlassView>
  ) : (
    <View
      style={[styles.fallback, { borderRadius: radius }, style]}
    >
      {children}
    </View>
  );

const styles = StyleSheet.create({
  glass: { borderCurve: "continuous" },
  fallback: {
    borderCurve: "continuous",
    overflow: "hidden",
    backgroundColor: RADIX_GRAY[2],
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: RADIX_GRAY_ALPHA[5],
  },
});

const GlassSurface = registerComponent("GlassSurface", GlassSurfaceBase);

export { GlassSurface };
