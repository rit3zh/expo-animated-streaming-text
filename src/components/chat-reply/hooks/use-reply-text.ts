import { useState } from "react";

import { CHAT_REPLY_NO_CITATIONS } from "@/constants/components/chat-reply.const";
import type { TSimulatedStream } from "@/hooks/interface";
import { useSimulatedStream } from "@/hooks/use-simulated-stream";
import {
  useStreamStore,
  type TAssistantMessage,
  type TStream,
  type TStreamStore,
} from "@/services";

import type { TReplyText } from "../interface";

function useReplyText(
  conversationId: string,
  reply: TAssistantMessage | null,
  replay: boolean,
): TReplyText {
  const stream: TStream | undefined = useStreamStore(
    (state: TStreamStore): TStream | undefined => state.streams[conversationId],
  );
  const [replayId] = useState<string | null>(replay ? (reply?.id ?? null) : null);
  const [live, setLive] = useState<boolean>(stream !== undefined || replayId !== null);
  const replaying: boolean = !stream && replayId !== null && reply?.id === replayId;
  const simulated: TSimulatedStream = useSimulatedStream(reply?.content ?? "", replaying);

  if (stream && !live) setLive(true);

  if (stream) {
    return {
      text: stream.content,
      streaming: true,
      animate: true,
      thinking: !stream.content,
      citations: stream.citations,
    };
  }
  if (replaying) {
    return {
      text: simulated.text,
      streaming: !simulated.done,
      animate: true,
      thinking: !simulated.text,
      citations: simulated.done ? (reply?.citations ?? CHAT_REPLY_NO_CITATIONS) : CHAT_REPLY_NO_CITATIONS,
    };
  }
  return {
    text: reply?.content ?? "",
    streaming: false,
    animate: live,
    thinking: false,
    citations: reply?.citations ?? CHAT_REPLY_NO_CITATIONS,
  };
}

export { useReplyText };
