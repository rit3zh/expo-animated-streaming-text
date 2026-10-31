import { memo, type FC } from "react";
import { StyleSheet, View } from "react-native";

import { StreamingText } from "@/components/streaming-text";
import { registerComponent } from "@/utils/register-component.util";

import { ChatPrompt } from "./chat-prompt";
import type { IChatMessage } from "./interface";
import { ReplyNotice } from "./reply-notice";
import { ReplySources } from "./reply-sources";

const ChatMessageBase: FC<IChatMessage> = ({
  conversationId,
  message,
  colors,
}: IChatMessage & React.ComponentProps<typeof ChatMessageBase>): React.ReactNode &
  React.JSX.Element =>
  message.role === "user" ? (
    <ChatPrompt
      conversationId={conversationId}
      messageId={message.id}
      text={message.content}
      colors={colors}
    />
  ) : (
    <View style={styles.answer}>
      {message.content ? <StreamingText animate={false}>{message.content}</StreamingText> : null}
      {message.citations?.length ? (
        <ReplySources citations={message.citations} colors={colors} />
      ) : null}
      {message.error ? <ReplyNotice text={message.error} colors={colors} /> : null}
    </View>
  );

const styles = StyleSheet.create({
  answer: { marginBottom: 28 },
});

const ChatMessage = registerComponent("ChatMessage", memo(ChatMessageBase));

export { ChatMessage };
