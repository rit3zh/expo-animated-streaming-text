import { useMemo, useState, type FC } from "react";
import { StyleSheet, View } from "react-native";
import { KeyboardChatScrollView } from "react-native-keyboard-controller";

import { StreamingTextList } from "@/components/streaming-text";
import { ThinkingIndicator } from "@/components/ui/thinking-indicator";
import {
  CHAT_REPLY_CONTENT_PADDING_X,
  CHAT_REPLY_KEYBOARD_LIFT,
  CHAT_REPLY_SOURCES_LEAD_MS,
} from "@/constants/components/chat-reply.const";
import { registerComponent } from "@/utils/register-component.util";

import { ChatHistory } from "./chat-history";
import { useKeyboardInset } from "./hooks/use-keyboard-inset";
import { useReplyText } from "./hooks/use-reply-text";
import type {
  IChatReply,
  TKeyboardInset,
  TReplyText,
  TTurn,
} from "./interface";
import { ReplyActions } from "./reply-actions";
import { ReplyNotice } from "./reply-notice";
import { ReplySources } from "./reply-sources";
import { splitTurn } from "./utils/turn.util";

const ChatReplyBase: FC<IChatReply> = ({
  conversation,
  replay,
  wordMs,
  colors,
  topInset,
  bottomInset,
  keyboardOffset,
  menuActions,
  onMenuAction,
}: IChatReply & React.ComponentProps<typeof ChatReplyBase>): React.ReactNode &
  React.JSX.Element => {
  const { history, reply }: TTurn = useMemo<TTurn>(
    (): TTurn => splitTurn(conversation.messages),
    [conversation.messages],
  );
  const { text, streaming, animate, thinking, citations }: TReplyText =
    useReplyText(conversation.id, reply, replay);
  const keyboardInset: TKeyboardInset = useKeyboardInset(keyboardOffset);
  const notice: string | null = streaming ? null : (reply?.error ?? null);
  const [revealedId, setRevealedId] = useState<string | null>(null);
  const revealed: boolean = !streaming && reply !== null && revealedId === reply.id;
  const sourced: boolean = revealed && citations.length > 0;
  const actionable: boolean = revealed && (reply?.content.length ?? 0) > 0;

  return (
    <StreamingTextList
      wordMs={wordMs}
      streaming={streaming}
      animate={animate}
      followInset={keyboardInset}
      onRevealEnd={(): void => setRevealedId(reply?.id ?? null)}
      keyboardDismissMode="interactive"
      keyboardShouldPersistTaps="handled"
      renderScrollComponent={KeyboardChatScrollView}
      overrideProps={{
        offset: keyboardOffset,
        keyboardLiftBehavior: CHAT_REPLY_KEYBOARD_LIFT,
      }}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topInset, paddingBottom: bottomInset },
      ]}
      ListHeaderComponent={
        <ChatHistory
          conversationId={conversation.id}
          messages={history}
          colors={colors}
        />
      }
      ListFooterComponent={
        thinking ? (
          <ThinkingIndicator
            color={colors.muted}
            highlightColor={colors.text}
          />
        ) : (
          <View>
            {sourced ? (
              <ReplySources citations={citations} colors={colors} />
            ) : null}
            {notice ? <ReplyNotice text={notice} colors={colors} /> : null}
            {actionable && reply ? (
              <ReplyActions
                key={reply.id}
                content={reply.content}
                animate={animate}
                leadMs={sourced ? CHAT_REPLY_SOURCES_LEAD_MS : 0}
                colors={colors}
                menuActions={menuActions}
                onMenuAction={onMenuAction}
              />
            ) : null}
          </View>
        )
      }
    >
      {text}
    </StreamingTextList>
  );
};

const styles = StyleSheet.create({
  content: { paddingHorizontal: CHAT_REPLY_CONTENT_PADDING_X },
});

const ChatReply = registerComponent("ChatReply", ChatReplyBase);

export { ChatReply };
