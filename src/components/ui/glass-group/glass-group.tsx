import { GlassContainer } from "expo-glass-effect";
import type { FC } from "react";
import { View } from "react-native";

import { GLASS_GROUP_SPACING } from "@/constants/components/glass-group.const";
import { isGlassSupported } from "@/utils/glass.util";
import { registerComponent } from "@/utils/register-component.util";

import type { IGlassGroup } from "./interface";

const GlassGroupBase: FC<IGlassGroup> = ({
  children,
  spacing = GLASS_GROUP_SPACING,
  style,
}: IGlassGroup & React.ComponentProps<typeof GlassGroupBase>): React.ReactNode &
  React.JSX.Element =>
  isGlassSupported() ? (
    <GlassContainer spacing={spacing} style={style}>
      {children}
    </GlassContainer>
  ) : (
    <View style={style}>{children}</View>
  );

const GlassGroup = registerComponent("GlassGroup", GlassGroupBase);

export { GlassGroup };
