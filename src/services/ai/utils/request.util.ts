import type { FetchRequestInit } from "expo/fetch";

import { AI_MODELS, AI_PROVIDERS } from "@/constants/services/ai.const";

import type {
  TApiMessage,
  TChatMessage,
  TChatModel,
  TChatModelId,
  TCompletionBody,
  TCompletionChunk,
  TCompletionError,
  TProvider,
} from "../../interface";

const findChatModel = (id: string): TChatModel | undefined =>
  AI_MODELS.find((model: TChatModel): boolean => model.id === id);

const getChatModel = (id: TChatModelId): TChatModel => findChatModel(id) ?? AI_MODELS[0];

const toApiMessages = (messages: readonly TChatMessage[], model: TChatModel): TApiMessage[] => {
  const keepsReasoning: boolean = AI_PROVIDERS[model.provider].keepsReasoning;
  const result: TApiMessage[] = [];

  for (const message of messages) {
    if (message.role === "user") {
      result.push({ role: "user", content: message.content });
      continue;
    }
    if (!message.content) continue;
    const reuseReasoning: boolean =
      keepsReasoning && message.modelId === model.id && message.reasoningDetails.length > 0;
    result.push(
      reuseReasoning
        ? {
            role: "assistant",
            content: message.content,
            reasoning_details: message.reasoningDetails,
          }
        : { role: "assistant", content: message.content },
    );
  }

  return result;
};

const buildCompletionInit = (
  model: TChatModel,
  provider: TProvider,
  messages: TApiMessage[],
  signal: AbortSignal,
): FetchRequestInit => {
  const body: TCompletionBody = {
    ...model.params,
    model: model.model,
    messages,
    stream: true,
  };

  return {
    method: "POST",
    headers: {
      Authorization: `Bearer ${provider.apiKey}`,
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify(body),
    signal,
  };
};

const toErrorText = (error: TCompletionError | undefined, fallback: string): string =>
  error?.metadata?.raw || error?.message || fallback;

const readErrorMessage = (raw: string, fallback: string): string => {
  try {
    const parsed: TCompletionChunk | TCompletionChunk[] = JSON.parse(raw) as
      | TCompletionChunk
      | TCompletionChunk[];
    return toErrorText((Array.isArray(parsed) ? parsed[0] : parsed)?.error, fallback);
  } catch {
    return raw.trim() || fallback;
  }
};

export {
  buildCompletionInit,
  findChatModel,
  getChatModel,
  readErrorMessage,
  toApiMessages,
  toErrorText,
};
