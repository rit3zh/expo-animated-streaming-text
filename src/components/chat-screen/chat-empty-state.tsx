import type { FC } from "react";
import { Pressable, StyleSheet } from "react-native";
import { KeyboardController } from "react-native-keyboard-controller";
import Animated from "react-native-reanimated";

import {
  CHAT_GREETING,
  CHAT_GREETING_ANIMATION,
  CHAT_GREETING_KEYBOARD_SHIFT,
} from "@/constants/components/chat-screen.const";
import { RADIX_GRAY, RADIX_SPACE } from "@/constants/radix.const";
import { registerComponent } from "@/utils/register-component.util";

import { useKeyboardFade } from "./hooks/use-keyboard-fade";
import type { IChatEmptyState, TKeyboardFadeStyle } from "./interface";

const ChatEmptyStateBase: FC<IChatEmptyState> = ({
  topInset,
  bottomInset,
}: IChatEmptyState & React.ComponentProps<typeof ChatEmptyStateBase>): React.ReactNode &
  React.JSX.Element => {
  const fade: TKeyboardFadeStyle = useKeyboardFade(CHAT_GREETING_KEYBOARD_SHIFT);

  return (
    <Pressable
      accessible={false}
      onPress={(): void => {
        KeyboardController.dismiss().catch((): void => undefined);
      }}
      style={[styles.container, { paddingTop: topInset, paddingBottom: bottomInset }]}
    >
      <Animated.View style={fade}>
        <Animated.Text style={[styles.title, CHAT_GREETING_ANIMATION]}>
          {CHAT_GREETING}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: RADIX_SPACE[6],
  },
  title: {
    color: RADIX_GRAY[12],
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "600",
    letterSpacing: -0.6,
    textAlign: "center",
  },
});

const ChatEmptyState = registerComponent("ChatEmptyState", ChatEmptyStateBase);

export { ChatEmptyState };
