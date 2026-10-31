import { AI_SSE_DATA_PREFIX, AI_SSE_DONE } from "@/constants/services/ai.const";

async function* readServerSentEvents(
  body: ReadableStream<Uint8Array>,
): AsyncGenerator<string, void, undefined> {
  const reader: ReadableStreamDefaultReader<Uint8Array> = body.getReader();
  const decoder: TextDecoder = new TextDecoder();
  let buffer: string = "";

  try {
    while (true) {
      const { done, value }: ReadableStreamReadResult<Uint8Array> = await reader.read();
      if (done) {
        const line: string = (buffer + decoder.decode()).trim();
        if (!line.startsWith(AI_SSE_DATA_PREFIX)) return;
        const data: string = line.slice(AI_SSE_DATA_PREFIX.length).trimStart();
        if (data && data !== AI_SSE_DONE) yield data;
        return;
      }
      buffer += decoder.decode(value, { stream: true });

      let start: number = 0;
      let newline: number = buffer.indexOf("\n", start);
      while (newline !== -1) {
        const line: string = buffer.slice(start, newline).trimEnd();
        start = newline + 1;
        newline = buffer.indexOf("\n", start);
        if (!line.startsWith(AI_SSE_DATA_PREFIX)) continue;
        const data: string = line.slice(AI_SSE_DATA_PREFIX.length).trimStart();
        if (data === AI_SSE_DONE) return;
        if (data) yield data;
      }
      buffer = buffer.slice(start);
    }
  } finally {
    reader.cancel().catch((): void => undefined);
  }
}

export { readServerSentEvents };
