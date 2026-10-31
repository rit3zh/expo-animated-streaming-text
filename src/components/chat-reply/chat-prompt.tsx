import { MenuView } from "@expo/ui/community/menu";
import type { FC } from "react";
import { StyleSheet, Text, useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedRef,
  type AnimatedRef,
} from "react-native-reanimated";

import {
  useFlightArrival,
  type TFlightArrival,
} from "@/components/bubble-flight";
import {
  CHAT_REPLY_CONTENT_PADDING_X,
  CHAT_REPLY_PROMPT_ANIMATION,
  CHAT_REPLY_PROMPT_MAX_WIDTH_RATIO,
  CHAT_REPLY_PROMPT_PADDING_X,
  CHAT_REPLY_PROMPT_PADDING_Y,
  CHAT_REPLY_PROMPT_RADIUS,
  CHAT_REPLY_PROMPT_TEXT,
} from "@/constants/components/chat-reply.const";
import { registerComponent } from "@/utils/register-component.util";

import { usePromptActions } from "./hooks/use-prompt-actions";
import type { IChatPrompt, TPromptActions } from "./interface";

const ChatPromptBase: FC<IChatPrompt> = ({
  conversationId,
  messageId,
  text,
  colors,
}: IChatPrompt & React.ComponentProps<typeof ChatPromptBase>): React.ReactNode &
  React.JSX.Element => {
  const ref: AnimatedRef<Animated.View> = useAnimatedRef<Animated.View>();
  const { width }: { width: number } = useWindowDimensions();
  const maxWidth: number =
    (width - CHAT_REPLY_CONTENT_PADDING_X * 2) *
    CHAT_REPLY_PROMPT_MAX_WIDTH_RATIO;
  const arrival: TFlightArrival = useFlightArrival(ref, text);
  const { actions, onAction }: TPromptActions = usePromptActions(
    conversationId,
    messageId,
    text,
  );

  return (
    <MenuView
      colorScheme="dark"
      shouldOpenOnLongPress
      actions={actions}
      onPressAction={onAction}
      style={styles.menu}
    >
      <Animated.View
        ref={ref}
        collapsable={false}
        style={[
          styles.prompt,
          { backgroundColor: colors.bubble, maxWidth },
          arrival.arriving ? arrival.style : CHAT_REPLY_PROMPT_ANIMATION,
        ]}
      >
        <Text style={[styles.text, { color: colors.text }]}>{text}</Text>
      </Animated.View>
    </MenuView>
  );
};

const styles = StyleSheet.create({
  menu: {
    alignSelf: "flex-end",
    marginBottom: 28,
  },
  prompt: {
    borderRadius: CHAT_REPLY_PROMPT_RADIUS,
    borderCurve: "continuous",
    paddingHorizontal: CHAT_REPLY_PROMPT_PADDING_X,
    paddingVertical: CHAT_REPLY_PROMPT_PADDING_Y,
  },
  text: CHAT_REPLY_PROMPT_TEXT,
});

const ChatPrompt = registerComponent("ChatPrompt", ChatPromptBase);

export { ChatPrompt };
