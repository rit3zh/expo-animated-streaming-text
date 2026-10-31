import { ThinkingOrb } from "@mhaadi/thinking-orbs-native";
import type { FC } from "react";
import { StyleSheet, View } from "react-native";

import { ShimmerText } from "@/components/ui/shimmer-text";
import {
  THINKING_LABEL,
  THINKING_ORB_SIZE,
  THINKING_ORB_STATE,
} from "@/constants/components/thinking-indicator.const";
import { registerComponent } from "@/utils/register-component.util";

import type { IThinkingIndicator } from "./interface";

const ThinkingIndicatorBase: FC<IThinkingIndicator> = ({
  color,
  highlightColor,
  label = THINKING_LABEL,
  theme = "auto",
}: IThinkingIndicator & React.ComponentProps<typeof ThinkingIndicatorBase>): React.ReactNode &
  React.JSX.Element => (
  <View style={styles.container}>
    <ThinkingOrb state={THINKING_ORB_STATE} size={THINKING_ORB_SIZE} theme={theme} />
    <ShimmerText color={color} highlightColor={highlightColor} style={styles.label}>
      {label}
    </ShimmerText>
  </View>
);

const styles = StyleSheet.create({
  container: { height: 25, flexDirection: "row", alignItems: "center", gap: 8 },
  label: { fontSize: 15, lineHeight: 20, fontWeight: "500", letterSpacing: -0.1 },
});

const ThinkingIndicator = registerComponent("ThinkingIndicator", ThinkingIndicatorBase);

export { ThinkingIndicator };
