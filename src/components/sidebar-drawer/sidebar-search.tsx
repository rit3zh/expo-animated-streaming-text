import type { FC } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { Icon } from "@/components/ui/icon";
import { PressableScale } from "@/components/ui/pressable-scale";
import {
  SIDEBAR_CONTROL_HEIGHT,
  SIDEBAR_NEW_CHAT_LABEL,
  SIDEBAR_SEARCH_PLACEHOLDER,
} from "@/constants/components/sidebar-drawer.const";
import { RADIX_GRAY, RADIX_RADIUS, RADIX_SPACE } from "@/constants/radix.const";
import { registerComponent } from "@/utils/register-component.util";

import type { ISidebarSearch } from "./interface";

const SidebarSearchBase: FC<ISidebarSearch> = ({
  value,
  onChangeText,
  onNewChat,
}: ISidebarSearch & React.ComponentProps<typeof SidebarSearchBase>): React.ReactNode &
  React.JSX.Element => (
  <View style={styles.row}>
    <View style={styles.field}>
      <Icon name="search" size={15} color={RADIX_GRAY[10]} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={SIDEBAR_SEARCH_PLACEHOLDER}
        placeholderTextColor={RADIX_GRAY[10]}
        selectionColor={RADIX_GRAY[12]}
        cursorColor={RADIX_GRAY[12]}
        keyboardAppearance="dark"
        returnKeyType="search"
        autoCorrect={false}
        style={styles.input}
      />
      {value ? (
        <Pressable hitSlop={8} onPress={(): void => onChangeText("")}>
          <Icon name="close" size={15} color={RADIX_GRAY[9]} />
        </Pressable>
      ) : null}
    </View>
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={SIDEBAR_NEW_CHAT_LABEL}
      hitSlop={4}
      onPress={onNewChat}
      style={styles.iconButton}
    >
      <Icon name="compose" size={19} color={RADIX_GRAY[12]} />
    </PressableScale>
  </View>
);

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: RADIX_SPACE[2] },
  field: {
    flex: 1,
    height: SIDEBAR_CONTROL_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    gap: RADIX_SPACE[2],
    paddingHorizontal: RADIX_SPACE[3],
    borderRadius: RADIX_RADIUS.full,
    backgroundColor: RADIX_GRAY[4],
  },
  input: {
    flex: 1,
    height: "100%",
    padding: 0,
    color: RADIX_GRAY[12],
    fontSize: 16,
  },
  iconButton: {
    width: SIDEBAR_CONTROL_HEIGHT,
    height: SIDEBAR_CONTROL_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
});

const SidebarSearch = registerComponent("SidebarSearch", SidebarSearchBase);

export { SidebarSearch };
