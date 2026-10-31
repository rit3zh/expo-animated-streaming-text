import { MenuView } from "@expo/ui/community/menu";
import type { FC } from "react";
import { StyleSheet, View } from "react-native";

import { GlassSurface } from "@/components/ui/glass-surface";
import { Icon } from "@/components/ui/icon";
import {
  CHAT_COMPOSER_ATTACH_ACTIONS,
  CHAT_COMPOSER_HEIGHT,
} from "@/constants/components/chat-screen.const";
import { RADIX_GRAY, RADIX_RADIUS } from "@/constants/radix.const";
import { registerComponent } from "@/utils/register-component.util";

const ComposerAttachMenuBase: FC = (): React.ReactNode & React.JSX.Element => (
  <GlassSurface radius={RADIX_RADIUS.full} style={styles.trigger}>
    <MenuView
      colorScheme="dark"
      actions={CHAT_COMPOSER_ATTACH_ACTIONS}
      style={styles.menu}
    >
      <View style={styles.content}>
        <Icon name="plus" size={18} color={RADIX_GRAY[12]} />
      </View>
    </MenuView>
  </GlassSurface>
);

const styles = StyleSheet.create({
  content: {
    width: CHAT_COMPOSER_HEIGHT,
    height: CHAT_COMPOSER_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  menu: {
    width: CHAT_COMPOSER_HEIGHT,
    height: CHAT_COMPOSER_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  trigger: {
    width: CHAT_COMPOSER_HEIGHT,
    height: CHAT_COMPOSER_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
});

const ComposerAttachMenu = registerComponent(
  "ComposerAttachMenu",
  ComposerAttachMenuBase,
);

export { ComposerAttachMenu };
