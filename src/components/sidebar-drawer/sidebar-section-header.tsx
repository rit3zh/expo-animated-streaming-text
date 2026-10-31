import type { FC } from "react";
import { StyleSheet, Text } from "react-native";

import { RADIX_GRAY, RADIX_SPACE } from "@/constants/radix.const";
import { registerComponent } from "@/utils/register-component.util";

import type { ISidebarSectionHeader } from "./interface";

const SidebarSectionHeaderBase: FC<ISidebarSectionHeader> = ({
  title,
}: ISidebarSectionHeader &
  React.ComponentProps<typeof SidebarSectionHeaderBase>): React.ReactNode &
  React.JSX.Element => <Text style={styles.title}>{title}</Text>;

const styles = StyleSheet.create({
  title: {
    paddingHorizontal: RADIX_SPACE[3],
    paddingTop: RADIX_SPACE[4],
    paddingBottom: RADIX_SPACE[1],
    color: RADIX_GRAY[10],
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
  },
});

const SidebarSectionHeader = registerComponent(
  "SidebarSectionHeader",
  SidebarSectionHeaderBase,
);

export { SidebarSectionHeader };
