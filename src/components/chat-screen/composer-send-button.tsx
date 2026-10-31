import type { FC } from "react";
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

import { Icon } from "@/components/ui/icon";
import { PressableScale } from "@/components/ui/pressable-scale";
import {
  CHAT_COMPOSER_SEND_HIDDEN_SCALE,
  CHAT_COMPOSER_SEND_SIZE,
  CHAT_COMPOSER_SEND_TRANSITION,
} from "@/constants/components/chat-screen.const";
import { RADIX_GRAY } from "@/constants/radix.const";
import { registerComponent } from "@/utils/register-component.util";

import type { IComposerSendButton } from "./interface";

const ComposerSendButtonBase: FC<IComposerSendButton> = ({
  visible,
  icon,
  label,
  onPress,
}: IComposerSendButton &
  React.ComponentProps<typeof ComposerSendButtonBase>): React.ReactNode &
  React.JSX.Element => (
  <Animated.View
    pointerEvents={visible ? "auto" : "none"}
    style={[
      styles.container,
      {
        opacity: visible ? 1 : 0,
        transform: [{ scale: visible ? 1 : CHAT_COMPOSER_SEND_HIDDEN_SCALE }],
      },
      CHAT_COMPOSER_SEND_TRANSITION,
    ]}
  >
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={!visible}
      hitSlop={6}
      onPress={onPress}
      style={styles.button}
    >
      <Icon name={icon} size={15} color={RADIX_GRAY[1]} />
    </PressableScale>
  </Animated.View>
);

const styles = StyleSheet.create({
  container: { width: CHAT_COMPOSER_SEND_SIZE, height: CHAT_COMPOSER_SEND_SIZE },
  button: {
    width: CHAT_COMPOSER_SEND_SIZE,
    height: CHAT_COMPOSER_SEND_SIZE,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: CHAT_COMPOSER_SEND_SIZE / 2,
    backgroundColor: RADIX_GRAY[12],
  },
});

const ComposerSendButton = registerComponent("ComposerSendButton", ComposerSendButtonBase);

export { ComposerSendButton };
