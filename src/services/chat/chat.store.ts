import { create, type StoreApi, type UseBoundStore } from "zustand";
import { persist } from "zustand/middleware";

import { CHAT_INITIAL_STATE } from "@/constants/services/chat.const";
import { STORAGE_CHAT_NAME, STORAGE_CHAT_VERSION } from "@/constants/services/storage.const";

import type {
  TChatMessage,
  TChatModelId,
  TChatPersisted,
  TChatStore,
  TConversation,
} from "../interface";
import { chatStorage } from "../storage/chat-storage.service";
import {
  appendToConversation,
  createConversation,
  mergeChatState,
  removeTurnMessages,
  truncateMessages,
  updateConversation,
} from "./utils/conversation.util";

const useChatStore: UseBoundStore<StoreApi<TChatStore>> = create<TChatStore>()(
  persist<TChatStore, [], [], TChatPersisted>(
    (set: StoreApi<TChatStore>["setState"]): TChatStore => ({
      ...CHAT_INITIAL_STATE,
      hydrated: false,
      createConversation: (prompt: string): string => {
        const conversation: TConversation = createConversation(prompt);
        set((state: TChatStore): Partial<TChatStore> => ({
          conversations: [conversation, ...state.conversations],
        }));
        return conversation.id;
      },
      appendMessage: (conversationId: string, message: TChatMessage): void =>
        set((state: TChatStore): Partial<TChatStore> => ({
          conversations: appendToConversation(state.conversations, conversationId, message),
        })),
      deleteConversation: (id: string): void =>
        set((state: TChatStore): Partial<TChatStore> => ({
          conversations: state.conversations.filter(
            (conversation: TConversation): boolean => conversation.id !== id,
          ),
        })),
      togglePin: (id: string): void =>
        set((state: TChatStore): Partial<TChatStore> => ({
          conversations: updateConversation(
            state.conversations,
            id,
            (conversation: TConversation): TConversation => ({
              ...conversation,
              pinned: !conversation.pinned,
            }),
          ),
        })),
      truncateConversation: (conversationId: string, messageId: string): void =>
        set((state: TChatStore): Partial<TChatStore> => ({
          conversations: updateConversation(
            state.conversations,
            conversationId,
            (conversation: TConversation): TConversation => ({
              ...conversation,
              messages: truncateMessages(conversation.messages, messageId),
            }),
          ),
        })),
      removeTurn: (conversationId: string, messageId: string): void =>
        set((state: TChatStore): Partial<TChatStore> => ({
          conversations: updateConversation(
            state.conversations,
            conversationId,
            (conversation: TConversation): TConversation => ({
              ...conversation,
              messages: removeTurnMessages(conversation.messages, messageId),
            }),
          ),
        })),
      setModel: (modelId: TChatModelId): void => set({ modelId }),
      setWordMs: (wordMs: number): void => set({ wordMs }),
      toggleDummyResponse: (): void =>
        set((state: TChatStore): Partial<TChatStore> => ({
          dummyResponse: !state.dummyResponse,
        })),
    }),
    {
      name: STORAGE_CHAT_NAME,
      version: STORAGE_CHAT_VERSION,
      storage: chatStorage,
      partialize: ({
        conversations,
        modelId,
        wordMs,
        dummyResponse,
      }: TChatStore): TChatPersisted => ({
        conversations,
        modelId,
        wordMs,
        dummyResponse,
      }),
      merge: mergeChatState,
      onRehydrateStorage: (): (() => void) => (): void =>
        useChatStore.setState({ hydrated: true }),
    },
  ),
);

export { useChatStore };
