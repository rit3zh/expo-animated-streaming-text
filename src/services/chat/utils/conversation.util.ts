import { CHAT_TITLE_MAX_LENGTH } from "@/constants/services/chat.const";

import type {
  TAssistantMessage,
  TChatMessage,
  TChatPersisted,
  TChatStore,
  TConversation,
  TUserMessage,
} from "../../interface";

const createId = (): string =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

const toConversationTitle = (prompt: string): string => {
  const line: string = prompt.trim().split("\n")[0] ?? "";
  return line.length > CHAT_TITLE_MAX_LENGTH
    ? `${line.slice(0, CHAT_TITLE_MAX_LENGTH).trimEnd()}…`
    : line;
};

const createConversation = (prompt: string): TConversation => {
  const now: number = Date.now();
  return {
    id: createId(),
    title: toConversationTitle(prompt),
    pinned: false,
    createdAt: now,
    updatedAt: now,
    messages: [],
  };
};

const createUserMessage = (content: string): TUserMessage => ({
  id: createId(),
  role: "user",
  content,
  createdAt: Date.now(),
});

const findConversation = (
  conversations: readonly TConversation[],
  id: string | undefined,
): TConversation | undefined =>
  id === undefined
    ? undefined
    : conversations.find(
        (conversation: TConversation): boolean => conversation.id === id,
      );

const updateConversation = (
  conversations: TConversation[],
  id: string,
  update: (conversation: TConversation) => TConversation,
): TConversation[] =>
  conversations.map(
    (conversation: TConversation): TConversation =>
      conversation.id === id ? update(conversation) : conversation,
  );

const appendToConversation = (
  conversations: TConversation[],
  id: string,
  message: TChatMessage,
): TConversation[] => {
  const target: TConversation | undefined = findConversation(conversations, id);
  if (!target) return conversations;
  const next: TConversation = {
    ...target,
    updatedAt: message.createdAt,
    messages: [...target.messages, message],
  };
  return [
    next,
    ...conversations.filter(
      (conversation: TConversation): boolean => conversation.id !== id,
    ),
  ];
};

const truncateMessages = (messages: TChatMessage[], messageId: string): TChatMessage[] => {
  const index: number = messages.findIndex(
    (message: TChatMessage): boolean => message.id === messageId,
  );
  return index < 0 ? messages : messages.slice(0, index);
};

const removeTurnMessages = (messages: TChatMessage[], messageId: string): TChatMessage[] => {
  const index: number = messages.findIndex(
    (message: TChatMessage): boolean => message.id === messageId,
  );
  if (index < 0) return messages;
  let end: number = index + 1;
  while (end < messages.length && messages[end]?.role !== "user") end += 1;
  return [...messages.slice(0, index), ...messages.slice(end)];
};

const mergeChatState = (
  persisted: unknown,
  current: TChatStore,
): TChatStore => {
  const stored: Partial<TChatPersisted> = (persisted ??
    {}) as Partial<TChatPersisted>;
  const restored: TConversation[] = stored.conversations ?? [];
  const restoredIds: Set<string> = new Set<string>(
    restored.map((conversation: TConversation): string => conversation.id),
  );
  return {
    ...current,
    ...stored,
    conversations: [
      ...current.conversations.filter(
        (conversation: TConversation): boolean =>
          !restoredIds.has(conversation.id),
      ),
      ...restored,
    ],
  };
};

const toTranscript = <T extends TConversation>(conversation: T): string =>
  conversation.messages
    .map((message: TChatMessage): string => message.content)
    .filter(Boolean)
    .join("\n\n");

const isAssistantMessage = (
  message: TChatMessage | undefined,
): message is TAssistantMessage => message?.role === "assistant";

export {
  appendToConversation,
  createConversation,
  createId,
  createUserMessage,
  findConversation,
  isAssistantMessage,
  mergeChatState,
  removeTurnMessages,
  toTranscript,
  truncateMessages,
  updateConversation,
};
