import type { FC } from "react";
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

import {
  SIDEBAR_EMPTY_LABEL,
  SIDEBAR_ENTERING,
} from "@/constants/components/sidebar-drawer.const";
import { RADIX_GRAY, RADIX_SPACE } from "@/constants/radix.const";
import { registerComponent } from "@/utils/register-component.util";

const SidebarEmptyBase: FC = (): React.ReactNode & React.JSX.Element => (
  <Animated.Text entering={SIDEBAR_ENTERING} style={styles.label}>
    {SIDEBAR_EMPTY_LABEL}
  </Animated.Text>
);

const styles = StyleSheet.create({
  label: {
    paddingVertical: RADIX_SPACE[7],
    color: RADIX_GRAY[10],
    fontSize: 15,
    textAlign: "center",
  },
});

const SidebarEmpty = registerComponent("SidebarEmpty", SidebarEmptyBase);

export { SidebarEmpty };
