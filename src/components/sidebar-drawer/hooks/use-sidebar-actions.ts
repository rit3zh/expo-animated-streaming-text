import { router } from "expo-router";
import { useState, type RefObject } from "react";
import type { ViewInstance } from "react-native";

import { SIDEBAR_ACTION } from "@/constants/components/sidebar-drawer.const";
import { deleteConversation, useChatStore, type TConversation } from "@/services";
import { shareConversation } from "@/utils/share-conversation.util";

import type { TSidebarActions, TSidebarAnchor } from "../interface";

function useSidebarActions(
  activeId: string | null,
  containerRef: RefObject<ViewInstance | null>,
): TSidebarActions {
  const [pending, setPending] = useState<TConversation | null>(null);
  const [anchor, setAnchor] = useState<TSidebarAnchor | null>(null);

  const requestDelete = (conversation: TConversation, row: TSidebarAnchor | null): void => {
    const container: ViewInstance | null = containerRef.current;
    if (!row || !container) {
      setAnchor(null);
      setPending(conversation);
      return;
    }
    container.measureInWindow((x: number, y: number): void => {
      setAnchor({ ...row, x: row.x - x, y: row.y - y });
      setPending(conversation);
    });
  };

  return {
    pending,
    anchor,
    handleAction: (
      conversation: TConversation,
      action: string,
      row: TSidebarAnchor | null,
    ): void => {
      if (action === SIDEBAR_ACTION.PIN) useChatStore.getState().togglePin(conversation.id);
      if (action === SIDEBAR_ACTION.SHARE) shareConversation(conversation);
      if (action === SIDEBAR_ACTION.DELETE) requestDelete(conversation, row);
    },
    confirmDelete: (): void => {
      if (!pending) return;
      deleteConversation(pending.id);
      if (pending.id === activeId) router.navigate("/");
      setPending(null);
    },
    dismissDelete: (): void => setPending(null),
  };
}

export { useSidebarActions };
