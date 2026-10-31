import { AppState, type AppStateStatus } from "react-native";
import type { StorageValue } from "zustand/middleware";

import {
  STORAGE_CHAT_VERSION,
  STORAGE_ENABLED,
  STORAGE_WRITE_DEBOUNCE_MS,
} from "@/constants/services/storage.const";

import type {
  TChatIndex,
  TChatPersisted,
  TChatStorage,
  TChunkedStorage,
  TConversation,
  TPendingWrite,
} from "../interface";
import { toConversationKey, toIndexKey } from "./utils/chat-key.util";
import { secureStorage } from "./secure-storage.service";

const storage: TChunkedStorage = secureStorage;
const persisted: Map<string, TConversation> = new Map<string, TConversation>();
let lastIndex: string = "";
let pending: TPendingWrite | null = null;
let ready: boolean = false;
let timer: ReturnType<typeof setTimeout> | null = null;
let queue: Promise<void> = Promise.resolve();

const reportError = (error: unknown): void => {
  if (__DEV__) console.warn("[chat-storage]", error);
};

const commit = async ({ name, value }: TPendingWrite): Promise<void> => {
  const { conversations, modelId, wordMs, dummyResponse }: TChatPersisted = value.state;
  const ids: string[] = conversations.map((conversation: TConversation): string => conversation.id);
  const live: Set<string> = new Set<string>(ids);

  await Promise.all(
    conversations
      .filter((conversation: TConversation): boolean => persisted.get(conversation.id) !== conversation)
      .map(async (conversation: TConversation): Promise<void> => {
        await storage.write(toConversationKey(name, conversation.id), JSON.stringify(conversation));
        persisted.set(conversation.id, conversation);
      }),
  );

  const index: TChatIndex = { version: STORAGE_CHAT_VERSION, ids, modelId, wordMs, dummyResponse };
  const serialized: string = JSON.stringify(index);
  if (serialized !== lastIndex) {
    await storage.write(toIndexKey(name), serialized);
    lastIndex = serialized;
  }

  await Promise.all(
    [...persisted.keys()]
      .filter((id: string): boolean => !live.has(id))
      .map(async (id: string): Promise<void> => {
        await storage.remove(toConversationKey(name, id));
        persisted.delete(id);
      }),
  );
};

const flush = (): Promise<void> => {
  if (timer) clearTimeout(timer);
  timer = null;
  if (!ready || !pending) return queue;
  const write: TPendingWrite = pending;
  pending = null;
  queue = queue.then((): Promise<void> => commit(write)).catch(reportError);
  return queue;
};

const readConversation = async (name: string, id: string): Promise<TConversation | null> => {
  try {
    const raw: string | null = await storage.read(toConversationKey(name, id));
    return raw ? (JSON.parse(raw) as TConversation) : null;
  } catch (error: unknown) {
    reportError(error);
    return null;
  }
};

const getItem = async (name: string): Promise<StorageValue<TChatPersisted> | null> => {
  if (!STORAGE_ENABLED) return null;
  try {
    const raw: string | null = await storage.read(toIndexKey(name));
    if (!raw) return null;
    const index: TChatIndex = JSON.parse(raw) as TChatIndex;
    const conversations: TConversation[] = (
      await Promise.all(index.ids.map((id: string): Promise<TConversation | null> => readConversation(name, id)))
    ).filter((conversation: TConversation | null): conversation is TConversation => conversation !== null);

    for (const conversation of conversations) persisted.set(conversation.id, conversation);
    lastIndex = JSON.stringify(index);

    return {
      version: index.version,
      state: {
        conversations,
        modelId: index.modelId,
        wordMs: index.wordMs,
        dummyResponse: index.dummyResponse ?? false,
      },
    };
  } catch (error: unknown) {
    reportError(error);
    return null;
  } finally {
    ready = true;
    if (pending) flush().catch(reportError);
  }
};

const setItem = (name: string, value: StorageValue<TChatPersisted>): void => {
  if (!STORAGE_ENABLED) return;
  pending = { name, value };
  if (!timer) timer = setTimeout(flush, STORAGE_WRITE_DEBOUNCE_MS);
};

const removeItem = (name: string): void => {
  if (!STORAGE_ENABLED) return;
  pending = null;
  const ids: string[] = [...persisted.keys()];
  persisted.clear();
  lastIndex = "";
  queue = queue
    .then(async (): Promise<void> => {
      await Promise.all(ids.map((id: string): Promise<void> => storage.remove(toConversationKey(name, id))));
      await storage.remove(toIndexKey(name));
    })
    .catch(reportError);
};

AppState.addEventListener("change", (state: AppStateStatus): void => {
  if (state !== "active") flush().catch(reportError);
});

const chatStorage: TChatStorage = { getItem, setItem, removeItem };

export { chatStorage };
