import {
  DUMMY_FINISH_REASON,
  DUMMY_RESPONSE_CITATIONS,
  DUMMY_RESPONSE_CONTENT,
  DUMMY_TICK_MS,
  DUMMY_TOKEN_PATTERN,
  DUMMY_TOKENS_PER_TICK,
} from "@/constants/services/dummy.const";

import type { TCitation, TCompletionResult, TDummyCompletionRequest } from "../interface";

const tokenEnds: readonly number[] = Array.from(
  DUMMY_RESPONSE_CONTENT.matchAll(DUMMY_TOKEN_PATTERN),
  (match: RegExpMatchArray): number => (match.index ?? 0) + match[0].length,
);

const sleep = (ms: number, signal: AbortSignal): Promise<void> =>
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

async function streamDummyCompletion({
  signal,
  onUpdate,
}: TDummyCompletionRequest): Promise<TCompletionResult> {
  const citations: TCitation[] = [...DUMMY_RESPONSE_CITATIONS];

  for (let index: number = 0; index < tokenEnds.length; index += DUMMY_TOKENS_PER_TICK) {
    signal.throwIfAborted();
    const end: number =
      tokenEnds[Math.min(index + DUMMY_TOKENS_PER_TICK, tokenEnds.length) - 1] ?? 0;
    onUpdate({ content: DUMMY_RESPONSE_CONTENT.slice(0, end), reasoning: "", citations: [] });
    await sleep(DUMMY_TICK_MS, signal);
  }
  signal.throwIfAborted();
  onUpdate({ content: DUMMY_RESPONSE_CONTENT, reasoning: "", citations });

  return {
    content: DUMMY_RESPONSE_CONTENT,
    reasoning: "",
    reasoningDetails: [],
    citations,
    finishReason: DUMMY_FINISH_REASON,
  };
}

export { streamDummyCompletion };
