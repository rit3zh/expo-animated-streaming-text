import { router, useNavigation } from "expo-router";

import {
  editMessage,
  sendMessage,
  startConversation,
  useEditStore,
  type TEditDraft,
} from "@/services";

import type { TChatNavigation, TDrawerScreenNavigation } from "../interface";

function useChatNavigation(conversationId: string | undefined): TChatNavigation {
  const navigation: TDrawerScreenNavigation = useNavigation<TDrawerScreenNavigation>();

  return {
    openSidebar: (): void => navigation.openDrawer(),
    startNewChat: (): void => router.navigate("/"),
    submitPrompt: (prompt: string): void => {
      const draft: TEditDraft | null = useEditStore.getState().draft;
      if (conversationId && draft?.conversationId === conversationId) {
        useEditStore.getState().cancel();
        editMessage(conversationId, draft.messageId, prompt);
        return;
      }
      if (conversationId) {
        sendMessage(conversationId, prompt);
        return;
      }
      const id: string = startConversation(prompt);
      router.navigate({ pathname: "/chat/[id]", params: { id } });
    },
  };
}

export { useChatNavigation };
