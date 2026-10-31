import { MenuView } from "@expo/ui/community/menu";
import type { FC } from "react";
import { StyleSheet, View } from "react-native";

import { GlassSurface } from "@/components/ui/glass-surface";
import { Icon } from "@/components/ui/icon";
import {
  CHAT_HEADER_BUTTON_ICON_SIZE,
  CHAT_HEADER_BUTTON_SIZE,
} from "@/constants/components/chat-screen.const";
import { RADIX_RADIUS, RADIX_GRAY } from "@/constants/radix.const";
import { registerComponent } from "@/utils/register-component.util";

import type { IChatMoreMenu } from "./interface";
import { buildMoreActions } from "./utils/chat-menu.util";

const ChatMoreMenuBase: FC<IChatMoreMenu> = ({
  pinned,
  wordMs,
  dummyResponse,
  onAction,
}: IChatMoreMenu & React.ComponentProps<typeof ChatMoreMenuBase>): React.ReactNode &
  React.JSX.Element => (
  <GlassSurface radius={RADIX_RADIUS.full} style={styles.trigger}>
    <MenuView
      colorScheme="dark"
      actions={buildMoreActions(pinned, wordMs, dummyResponse)}
      onPressAction={onAction}
      style={styles.menu}
    >
      <View style={styles.content}>
        <Icon name="ellipsis" size={CHAT_HEADER_BUTTON_ICON_SIZE} color={RADIX_GRAY[12]} />
      </View>
    </MenuView>
  </GlassSurface>
);

const styles = StyleSheet.create({
  content: {
    width: CHAT_HEADER_BUTTON_SIZE,
    height: CHAT_HEADER_BUTTON_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  menu: {
    width: CHAT_HEADER_BUTTON_SIZE,
    height: CHAT_HEADER_BUTTON_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  trigger: {
    width: CHAT_HEADER_BUTTON_SIZE,
    height: CHAT_HEADER_BUTTON_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
});

const ChatMoreMenu = registerComponent("ChatMoreMenu", ChatMoreMenuBase);

export { ChatMoreMenu };
