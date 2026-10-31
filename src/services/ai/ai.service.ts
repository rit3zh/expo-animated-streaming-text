import { fetch } from "expo/fetch";

import {
  AI_ERROR_EMPTY_BODY,
  AI_ERROR_MISSING_KEY,
  AI_ERROR_UNKNOWN,
  AI_PROVIDERS,
} from "@/constants/services/ai.const";

import type {
  TAnnotation,
  TCitation,
  TCompletionChoice,
  TCompletionChunk,
  TCompletionDelta,
  TCompletionRequest,
  TCompletionResult,
  TFetchResponse,
  TProvider,
  TReasoningDetail,
} from "../interface";
import { appendCitations } from "./utils/citation.util";
import {
  appendReasoningDetails,
  readReasoningText,
} from "./utils/reasoning.util";
import {
  buildCompletionInit,
  readErrorMessage,
  toErrorText,
} from "./utils/request.util";
import { readServerSentEvents } from "./utils/sse.util";

async function streamCompletion({
  model,
  messages,
  signal,
  onUpdate,
}: TCompletionRequest): Promise<TCompletionResult> {
  const provider: TProvider = AI_PROVIDERS[model.provider];
  if (!provider.apiKey)
    throw new Error(`${AI_ERROR_MISSING_KEY} ${provider.apiKeyName}`);

  const response: TFetchResponse = await fetch(
    provider.url,
    buildCompletionInit(model, provider, messages, signal),
  );
  if (!response.ok) {
    throw new Error(
      readErrorMessage(await response.text(), `HTTP ${response.status}`),
    );
  }
  if (!response.body) throw new Error(AI_ERROR_EMPTY_BODY);

  const reasoningDetails: TReasoningDetail[] = [];
  const citations: TCitation[] = [];
  let content: string = "";
  let reasoning: string = "";
  let finishReason: string | null = null;

  for await (const data of readServerSentEvents(response.body)) {
    const chunk: TCompletionChunk = JSON.parse(data) as TCompletionChunk;
    if (chunk.error)
      throw new Error(toErrorText(chunk.error, AI_ERROR_UNKNOWN));

    const choice: TCompletionChoice | undefined = chunk.choices?.[0];
    if (!choice) continue;
    finishReason = choice.finish_reason ?? finishReason;

    const delta: TCompletionDelta | undefined = choice.delta;
    const annotations: TAnnotation[] = [
      ...(delta?.annotations ?? []),
      ...(choice.message?.annotations ?? []),
    ];
    const cited: boolean = appendCitations(citations, annotations);
    if (!delta) {
      if (cited) onUpdate({ content, reasoning, citations: [...citations] });
      continue;
    }
    const details: TReasoningDetail[] = delta.reasoning_details ?? [];
    const reasoningPart: string =
      delta.reasoning ?? delta.reasoning_content ?? readReasoningText(details);
    const contentPart: string = delta.content ?? "";
    appendReasoningDetails(reasoningDetails, details);
    if (!reasoningPart && !contentPart && !cited) continue;
    reasoning += reasoningPart;
    content += contentPart;
    onUpdate({ content, reasoning, citations: [...citations] });
  }

  return { content, reasoning, citations, reasoningDetails, finishReason };
}

export { streamCompletion };
