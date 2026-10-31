import { MenuView, type NativeActionEvent } from "@expo/ui/community/menu";
import type { FC } from "react";
import { StyleSheet, Text, View } from "react-native";

import { GlassSurface } from "@/components/ui/glass-surface";
import { Icon } from "@/components/ui/icon";
import {
  CHAT_MODEL_MENU_HEIGHT,
  CHAT_MODEL_MENU_WIDTH,
} from "@/constants/components/chat-screen.const";
import { RADIX_GRAY, RADIX_RADIUS, RADIX_SPACE } from "@/constants/radix.const";
import type { TChatModelId } from "@/services";
import { registerComponent } from "@/utils/register-component.util";

import type { IModelMenu } from "./interface";
import {
  buildModelActions,
  getModelLabel,
  toModelId,
} from "./utils/chat-menu.util";

const ModelMenuBase: FC<IModelMenu> = ({
  modelId,
  onChange,
}: IModelMenu & React.ComponentProps<typeof ModelMenuBase>): React.ReactNode &
  React.JSX.Element => (
  <GlassSurface radius={RADIX_RADIUS.full} style={styles.trigger}>
    <MenuView
      colorScheme="dark"
      actions={buildModelActions(modelId)}
      onPressAction={(event: NativeActionEvent): void => {
        const next: TChatModelId | null = toModelId(event.nativeEvent.event);
        if (next) onChange(next);
      }}
      style={styles.menu}
    >
      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.label}>
          {getModelLabel(modelId)}
        </Text>
        <Icon name="chevron-right" size={11} color={RADIX_GRAY[10]} />
      </View>
    </MenuView>
  </GlassSurface>
);

const styles = StyleSheet.create({
  menu: {
    width: CHAT_MODEL_MENU_WIDTH,
    height: CHAT_MODEL_MENU_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  trigger: {
    width: CHAT_MODEL_MENU_WIDTH,
    height: CHAT_MODEL_MENU_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    width: CHAT_MODEL_MENU_WIDTH,
    height: CHAT_MODEL_MENU_HEIGHT,
    paddingHorizontal: RADIX_SPACE[4],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: RADIX_SPACE[1] + 1,
  },
  label: {
    flexShrink: 1,
    color: RADIX_GRAY[12],
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
});

const ModelMenu = registerComponent("ModelMenu", ModelMenuBase);

export { ModelMenu };
