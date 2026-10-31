import type { NativeActionEvent } from "@expo/ui/community/menu";

import { CHAT_MORE_ACTION } from "@/constants/components/chat-screen.const";
import { useChatStore, type TChatStore, type TConversation } from "@/services";
import { shareConversation } from "@/utils/share-conversation.util";

import type { TMenuActionHandler } from "../interface";
import { parseSpeedAction } from "../utils/chat-menu.util";

function useMoreActions(
  conversation: TConversation | undefined,
  onReplay: () => void,
): TMenuActionHandler {
  return (event: NativeActionEvent): void => {
    const action: string = event.nativeEvent.event;
    const speed: number | null = parseSpeedAction(action);
    const chat: TChatStore = useChatStore.getState();

    if (speed !== null) chat.setWordMs(speed);
    if (action === CHAT_MORE_ACTION.REPLAY) onReplay();
    if (action === CHAT_MORE_ACTION.DUMMY) chat.toggleDummyResponse();
    if (!conversation) return;
    if (action === CHAT_MORE_ACTION.PIN) chat.togglePin(conversation.id);
    if (action === CHAT_MORE_ACTION.SHARE) shareConversation(conversation);
  };
}

export { useMoreActions };
