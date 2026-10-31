import { MenuView } from "@expo/ui/community/menu";
import type { FC } from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  SIDEBAR_AVATAR_SIZE,
  SIDEBAR_PROFILE_ACTIONS,
  SIDEBAR_PROFILE_HEIGHT,
  SIDEBAR_PROFILE_INITIALS,
  SIDEBAR_PROFILE_NAME,
  SIDEBAR_ROW_WIDTH,
} from "@/constants/components/sidebar-drawer.const";
import { RADIX_GRAY, RADIX_SPACE } from "@/constants/radix.const";
import { registerComponent } from "@/utils/register-component.util";

import type { ISidebarFooter } from "./interface";

const SidebarFooterBase: FC<ISidebarFooter> = ({
  bottomInset,
}: ISidebarFooter & React.ComponentProps<typeof SidebarFooterBase>): React.ReactNode &
  React.JSX.Element => (
  <View style={[styles.footer, { paddingBottom: bottomInset + RADIX_SPACE[1] }]}>
    <MenuView
      title={SIDEBAR_PROFILE_NAME}
      colorScheme="dark"
      actions={SIDEBAR_PROFILE_ACTIONS}
      style={styles.menu}
    >
      <View style={styles.profile}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{SIDEBAR_PROFILE_INITIALS}</Text>
        </View>
        <Text numberOfLines={1} style={styles.name}>
          {SIDEBAR_PROFILE_NAME}
        </Text>
      </View>
    </MenuView>
  </View>
);

const styles = StyleSheet.create({
  footer: { paddingTop: RADIX_SPACE[1] },
  menu: { width: SIDEBAR_ROW_WIDTH, height: SIDEBAR_PROFILE_HEIGHT },
  profile: {
    width: SIDEBAR_ROW_WIDTH,
    height: SIDEBAR_PROFILE_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    gap: RADIX_SPACE[3],
    paddingHorizontal: RADIX_SPACE[2],
  },
  avatar: {
    width: SIDEBAR_AVATAR_SIZE,
    height: SIDEBAR_AVATAR_SIZE,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: SIDEBAR_AVATAR_SIZE / 2,
    backgroundColor: RADIX_GRAY[12],
  },
  avatarText: { color: RADIX_GRAY[1], fontSize: 14, fontWeight: "600" },
  name: {
    flex: 1,
    color: RADIX_GRAY[12],
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: -0.2,
  },
});

const SidebarFooter = registerComponent("SidebarFooter", SidebarFooterBase);

export { SidebarFooter };
