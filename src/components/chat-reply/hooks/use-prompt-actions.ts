import type { NativeActionEvent } from "@expo/ui/community/menu";
import { setStringAsync } from "expo-clipboard";
import { Share } from "react-native";

import { CHAT_REPLY_PROMPT_ACTION } from "@/constants/components/chat-reply.const";
import {
  deleteMessage,
  resendMessage,
  useEditStore,
  useStreamStore,
  type TStreamStore,
} from "@/services";

import type { TPromptActions } from "../interface";
import { buildPromptActions } from "../utils/prompt-menu.util";

function usePromptActions(conversationId: string, messageId: string, text: string): TPromptActions {
  const busy: boolean = useStreamStore(
    (state: TStreamStore): boolean => state.streams[conversationId] !== undefined,
  );

  return {
    actions: buildPromptActions(busy),
    onAction: (event: NativeActionEvent): void => {
      const action: string = event.nativeEvent.event;
      if (action === CHAT_REPLY_PROMPT_ACTION.COPY) setStringAsync(text).catch((): void => undefined);
      if (action === CHAT_REPLY_PROMPT_ACTION.SHARE)
        Share.share({ message: text }).catch((): void => undefined);
      if (action === CHAT_REPLY_PROMPT_ACTION.EDIT)
        useEditStore.getState().begin({ conversationId, messageId, content: text });
      if (action === CHAT_REPLY_PROMPT_ACTION.RESEND) resendMessage(conversationId, messageId);
      if (action === CHAT_REPLY_PROMPT_ACTION.DELETE) deleteMessage(conversationId, messageId);
    },
  };
}

export { usePromptActions };
