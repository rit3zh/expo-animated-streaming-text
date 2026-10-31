import {
  MenuView,
  type MenuComponentRef,
  type NativeActionEvent,
} from "@expo/ui/community/menu";
import { useRef, type FC, type RefObject } from "react";
import { Platform, StyleSheet, Text, View, type ViewInstance } from "react-native";

import { Icon } from "@/components/ui/icon";
import { PressableScale } from "@/components/ui/pressable-scale";
import {
  SIDEBAR_ROW_HEIGHT,
  SIDEBAR_ROW_WIDTH,
} from "@/constants/components/sidebar-drawer.const";
import { RADIX_GRAY, RADIX_GRAY_ALPHA, RADIX_SPACE } from "@/constants/radix.const";
import { registerComponent } from "@/utils/register-component.util";

import type { ISidebarItem } from "./interface";
import { buildSidebarItemActions } from "./utils/sidebar-menu.util";

const SidebarItemBase: FC<ISidebarItem> = ({
  conversation,
  active,
  onPress,
  onAction,
}: ISidebarItem & React.ComponentProps<typeof SidebarItemBase>): React.ReactNode &
  React.JSX.Element => {
  const menuRef: RefObject<MenuComponentRef | null> = useRef<MenuComponentRef>(null);
  const rowRef: RefObject<ViewInstance | null> = useRef<ViewInstance>(null);

  const handleAction = (event: NativeActionEvent): void => {
    const action: string = event.nativeEvent.event;
    const row: ViewInstance | null = rowRef.current;
    if (!row) {
      onAction(action, null);
      return;
    }
    row.measureInWindow((x: number, y: number, width: number, height: number): void =>
      onAction(action, { x, y, width, height }),
    );
  };

  return (
    <View ref={rowRef} collapsable={false} style={styles.menu}>
      <MenuView
        ref={menuRef}
        title={conversation.title}
        colorScheme="dark"
        shouldOpenOnLongPress
        actions={buildSidebarItemActions(conversation.pinned)}
        onPressAction={handleAction}
        style={styles.menu}
      >
        <PressableScale
          accessibilityRole="button"
          accessibilityState={{ selected: active }}
          scale={0.98}
          onPress={onPress}
          onLongPress={
            Platform.OS === "android" ? (): void => menuRef.current?.show() : undefined
          }
          style={[styles.row, active && styles.active]}
        >
          <Text numberOfLines={1} style={styles.label}>
            {conversation.title}
          </Text>
          {conversation.pinned ? <Icon name="pin" size={11} color={RADIX_GRAY[9]} /> : null}
        </PressableScale>
      </MenuView>
    </View>
  );
};

const styles = StyleSheet.create({
  menu: { width: SIDEBAR_ROW_WIDTH, height: SIDEBAR_ROW_HEIGHT },
  row: {
    width: SIDEBAR_ROW_WIDTH,
    height: SIDEBAR_ROW_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    gap: RADIX_SPACE[2],
    paddingHorizontal: RADIX_SPACE[3],
    borderRadius: 12,
    borderCurve: "continuous",
  },
  active: { backgroundColor: RADIX_GRAY_ALPHA[4] },
  label: {
    flex: 1,
    color: RADIX_GRAY[12],
    fontSize: 16,
    letterSpacing: -0.2,
  },
});

const SidebarItem = registerComponent("SidebarItem", SidebarItemBase);

export { SidebarItem };
