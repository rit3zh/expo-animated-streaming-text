import {
  STORAGE_CHAT_CONVERSATION_SUFFIX,
  STORAGE_CHAT_INDEX_SUFFIX,
} from "@/constants/services/storage.const";

const toIndexKey = (name: string): string => `${name}.${STORAGE_CHAT_INDEX_SUFFIX}`;

const toConversationKey = (name: string, id: string): string =>
  `${name}.${STORAGE_CHAT_CONVERSATION_SUFFIX}.${id}`;

export { toConversationKey, toIndexKey };
