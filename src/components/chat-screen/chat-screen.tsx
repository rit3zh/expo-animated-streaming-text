import { LinearGradient } from "expo-linear-gradient";
import { useState, type FC } from "react";
import { StyleSheet, View, type LayoutChangeEvent } from "react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import {
  useSafeAreaInsets,
  type EdgeInsets,
} from "react-native-safe-area-context";

import { ChatReply } from "@/components/chat-reply";
import {
  CHAT_COMPOSER_FADE,
  CHAT_COMPOSER_FADE_LOCATIONS,
  CHAT_COMPOSER_FLOAT_GAP,
  CHAT_COMPOSER_HEIGHT,
  CHAT_COMPOSER_INITIAL_HEIGHT,
  CHAT_COMPOSER_KEYBOARD_GAP,
  CHAT_COMPOSER_MIN_BOTTOM,
  CHAT_HEADER_HEIGHT,
  CHAT_REPLAY_INITIAL,
} from "@/constants/components/chat-screen.const";
import { PALETTE } from "@/constants/palette.const";
import { RADIX_GRAY, RADIX_SPACE } from "@/constants/radix.const";
import {
  findConversation,
  stopReply,
  useChatStore,
  useStreamStore,
  type TChatModelId,
  type TChatStore,
  type TConversation,
  type TStreamStore,
} from "@/services";
import { registerComponent } from "@/utils/register-component.util";

import { ChatComposer } from "./chat-composer";
import { ChatEmptyState } from "./chat-empty-state";
import { ChatHeader } from "./chat-header";
import { ChatSuggestions } from "./chat-suggestions";
import { useChatNavigation } from "./hooks/use-chat-navigation";
import { useMoreActions } from "./hooks/use-more-actions";
import { buildMoreActions } from "./utils/chat-menu.util";
import type {
  IChatScreen,
  TChatNavigation,
  TMenuActionHandler,
  TReplay,
} from "./interface";

const ChatScreenBase: FC<IChatScreen> = ({
  conversationId,
}: IChatScreen & React.ComponentProps<typeof ChatScreenBase>): React.ReactNode &
  React.JSX.Element => {
  const insets: EdgeInsets = useSafeAreaInsets();
  const conversation: TConversation | undefined = useChatStore(
    (state: TChatStore): TConversation | undefined =>
      findConversation(state.conversations, conversationId),
  );
  const hydrated: boolean = useChatStore(
    (state: TChatStore): boolean => state.hydrated,
  );
  const modelId: TChatModelId = useChatStore(
    (state: TChatStore): TChatModelId => state.modelId,
  );
  const wordMs: number = useChatStore(
    (state: TChatStore): number => state.wordMs,
  );
  const dummyResponse: boolean = useChatStore(
    (state: TChatStore): boolean => state.dummyResponse,
  );
  const streaming: boolean = useStreamStore(
    (state: TStreamStore): boolean =>
      conversationId !== undefined &&
      state.streams[conversationId] !== undefined,
  );
  const [replay, setReplay] = useState<TReplay>(CHAT_REPLAY_INITIAL);
  const replaying: boolean =
    conversation !== undefined && replay.conversationId === conversation.id;
  const [composerHeight, setComposerHeight] = useState<number>(
    CHAT_COMPOSER_INITIAL_HEIGHT,
  );
  const bottomPadding: number =
    Math.max(insets.bottom, CHAT_COMPOSER_MIN_BOTTOM) + CHAT_COMPOSER_FLOAT_GAP;
  const keyboardOffset: number = bottomPadding - CHAT_COMPOSER_KEYBOARD_GAP;
  const topInset: number = insets.top + CHAT_HEADER_HEIGHT;
  const navigation: TChatNavigation = useChatNavigation(conversation?.id);
  const onMoreAction: TMenuActionHandler = useMoreActions(
    conversation,
    (): void =>
      setReplay(
        (previous: TReplay): TReplay => ({
          conversationId: conversation?.id ?? null,
          run: previous.run + 1,
        }),
      ),
  );

  return (
    <View style={styles.screen}>
      {conversation ? (
        <ChatReply
          key={`${conversation.id}:${replaying ? replay.run : 0}`}
          conversation={conversation}
          replay={replaying}
          wordMs={wordMs}
          colors={PALETTE.dark}
          topInset={topInset + RADIX_SPACE[2]}
          bottomInset={composerHeight + RADIX_SPACE[4]}
          keyboardOffset={keyboardOffset}
          menuActions={buildMoreActions(conversation.pinned, wordMs, dummyResponse)}
          onMenuAction={onMoreAction}
        />
      ) : conversationId !== undefined && !hydrated ? (
        <View style={styles.screen} />
      ) : (
        <ChatEmptyState topInset={topInset} bottomInset={composerHeight} />
      )}

      <ChatHeader
        topInset={insets.top}
        modelId={modelId}
        showMore={conversation !== undefined}
        pinned={conversation?.pinned ?? false}
        wordMs={wordMs}
        dummyResponse={dummyResponse}
        onModelChange={useChatStore.getState().setModel}
        onOpenSidebar={navigation.openSidebar}
        onNewChat={navigation.startNewChat}
        onMoreAction={onMoreAction}
      />

      <KeyboardStickyView
        pointerEvents="box-none"
        offset={{ opened: keyboardOffset }}
        style={[styles.bottom, { paddingBottom: bottomPadding }]}
        onLayout={(event: LayoutChangeEvent): void =>
          setComposerHeight(event.nativeEvent.layout.height)
        }
      >
        <LinearGradient
          pointerEvents="none"
          colors={CHAT_COMPOSER_FADE}
          locations={CHAT_COMPOSER_FADE_LOCATIONS}
          style={[
            styles.fade,
            { height: bottomPadding + CHAT_COMPOSER_HEIGHT },
          ]}
        />
        {conversation ? null : (
          <ChatSuggestions onSelect={navigation.submitPrompt} />
        )}
        <View style={styles.composer}>
          <ChatComposer
            conversationId={conversationId}
            streaming={streaming}
            onSubmit={navigation.submitPrompt}
            onStop={(): void => {
              if (conversationId) stopReply(conversationId);
            }}
          />
        </View>
      </KeyboardStickyView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: RADIX_GRAY[1] },
  bottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  fade: { position: "absolute", left: 0, right: 0, bottom: 0 },
  composer: { paddingHorizontal: RADIX_SPACE[3] },
});

const ChatScreen = registerComponent("ChatScreen", ChatScreenBase);

export { ChatScreen };
