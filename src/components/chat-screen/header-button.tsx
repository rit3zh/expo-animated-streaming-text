import type { FC } from "react";
import { Pressable, StyleSheet } from "react-native";

import { GlassSurface } from "@/components/ui/glass-surface";
import { Icon } from "@/components/ui/icon";
import {
  CHAT_HEADER_BUTTON_ICON_SIZE,
  CHAT_HEADER_BUTTON_SIZE,
} from "@/constants/components/chat-screen.const";
import { RADIX_GRAY, RADIX_RADIUS } from "@/constants/radix.const";
import { registerComponent } from "@/utils/register-component.util";

import type { IHeaderButton } from "./interface";

const HeaderButtonBase: FC<IHeaderButton> = ({
  icon,
  label,
  onPress,
}: IHeaderButton & React.ComponentProps<typeof HeaderButtonBase>): React.ReactNode &
  React.JSX.Element => (
  <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}>
    <GlassSurface radius={RADIX_RADIUS.full} style={styles.button}>
      <Icon name={icon} size={CHAT_HEADER_BUTTON_ICON_SIZE} color={RADIX_GRAY[12]} />
    </GlassSurface>
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    width: CHAT_HEADER_BUTTON_SIZE,
    height: CHAT_HEADER_BUTTON_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
});

const HeaderButton = registerComponent("HeaderButton", HeaderButtonBase);

export { HeaderButton };
