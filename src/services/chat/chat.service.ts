import {
  AI_ERROR_NO_ANSWER,
  AI_ERROR_TRUNCATED,
  AI_ERROR_UNKNOWN,
  AI_FINISH_LENGTH,
  AI_STREAM_FLUSH_MS,
  AI_THINKING_DELAY_MS,
} from "@/constants/services/ai.const";

import { streamCompletion } from "../ai/ai.service";
import { streamDummyCompletion } from "../ai/dummy.service";
import { getChatModel, toApiMessages } from "../ai/utils/request.util";
import type {
  TAssistantMessage,
  TChatMessage,
  TChatModel,
  TChatStore,
  TCompletionResult,
  TCompletionSnapshot,
  TConversation,
  TReplyStatus,
} from "../interface";
import { useChatStore } from "./chat.store";
import { useStreamStore } from "./stream.store";
import { createId, createUserMessage, findConversation } from "./utils/conversation.util";

const controllers: Map<string, AbortController> = new Map<string, AbortController>();

const toErrorMessage = (error: unknown): string =>
  error instanceof Error && error.message ? error.message : AI_ERROR_UNKNOWN;

const wait = (ms: number, signal: AbortSignal): Promise<void> =>
  new Promise<void>((resolve: () => void): void => {
    const timer: ReturnType<typeof setTimeout> = setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      (): void => {
        clearTimeout(timer);
        resolve();
      },
      { once: true },
    );
  });

const runReply = async (
  conversationId: string,
  history: readonly TChatMessage[],
  model: TChatModel,
): Promise<void> => {
  const controller: AbortController = new AbortController();
  const messageId: string = createId();
  let latest: TCompletionSnapshot = { content: "", reasoning: "", citations: [] };
  let timer: ReturnType<typeof setTimeout> | null = null;
  let result: TCompletionResult | null = null;
  let error: string | null = null;

  controllers.set(conversationId, controller);
  useStreamStore.getState().begin(conversationId, { messageId, modelId: model.id, ...latest });

  try {
    await wait(AI_THINKING_DELAY_MS, controller.signal);
    controller.signal.throwIfAborted();
    const onUpdate = (snapshot: TCompletionSnapshot): void => {
      latest = snapshot;
      timer ??= setTimeout((): void => {
        timer = null;
        useStreamStore.getState().update(conversationId, latest);
      }, AI_STREAM_FLUSH_MS);
    };
    result = useChatStore.getState().dummyResponse
      ? await streamDummyCompletion({ signal: controller.signal, onUpdate })
      : await streamCompletion({
          model,
          messages: toApiMessages(history, model),
          signal: controller.signal,
          onUpdate,
        });
    if (!result.content) error = AI_ERROR_NO_ANSWER;
    else if (result.finishReason === AI_FINISH_LENGTH) error = AI_ERROR_TRUNCATED;
  } catch (caught: unknown) {
    if (!controller.signal.aborted) error = toErrorMessage(caught);
  } finally {
    if (timer) clearTimeout(timer);
    controllers.delete(conversationId);
  }

  const status: TReplyStatus = controller.signal.aborted
    ? "stopped"
    : error
      ? "error"
      : "complete";
  const reply: TAssistantMessage = {
    id: messageId,
    role: "assistant",
    content: result?.content ?? latest.content,
    reasoning: result?.reasoning ?? latest.reasoning,
    reasoningDetails: result?.reasoningDetails ?? [],
    citations: result?.citations ?? latest.citations,
    modelId: model.id,
    status,
    error,
    createdAt: Date.now(),
  };

  useChatStore.getState().appendMessage(conversationId, reply);
  useStreamStore.getState().end(conversationId);
};

const sendMessage = (conversationId: string, prompt: string): void => {
  const content: string = prompt.trim();
  if (!content || controllers.has(conversationId)) return;

  const chat: TChatStore = useChatStore.getState();
  chat.appendMessage(conversationId, createUserMessage(content));

  const conversation: TConversation | undefined = findConversation(
    useChatStore.getState().conversations,
    conversationId,
  );
  if (!conversation) return;
  runReply(conversationId, conversation.messages, getChatModel(chat.modelId)).catch(
    (): void => undefined,
  );
};

const startConversation = (prompt: string): string => {
  const id: string = useChatStore.getState().createConversation(prompt);
  sendMessage(id, prompt);
  return id;
};

const editMessage = (conversationId: string, messageId: string, prompt: string): void => {
  if (!prompt.trim() || controllers.has(conversationId)) return;
  useChatStore.getState().truncateConversation(conversationId, messageId);
  sendMessage(conversationId, prompt);
};

const resendMessage = (conversationId: string, messageId: string): void => {
  const message: TChatMessage | undefined = findConversation(
    useChatStore.getState().conversations,
    conversationId,
  )?.messages.find((candidate: TChatMessage): boolean => candidate.id === messageId);
  if (message) editMessage(conversationId, messageId, message.content);
};

const deleteMessage = (conversationId: string, messageId: string): void => {
  if (controllers.has(conversationId)) return;
  useChatStore.getState().removeTurn(conversationId, messageId);
};

const stopReply = (conversationId: string): void => {
  controllers.get(conversationId)?.abort();
};

const deleteConversation = (conversationId: string): void => {
  stopReply(conversationId);
  useChatStore.getState().deleteConversation(conversationId);
};

export {
  deleteConversation,
  deleteMessage,
  editMessage,
  resendMessage,
  sendMessage,
  startConversation,
  stopReply,
};
