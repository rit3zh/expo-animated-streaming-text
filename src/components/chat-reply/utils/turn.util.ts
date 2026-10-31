import { isAssistantMessage, type TAssistantMessage, type TChatMessage } from "@/services";

import type { TTurn } from "../interface";

const splitTurn = (messages: TChatMessage[]): TTurn => {
  const last: TChatMessage | undefined = messages.at(-1);
  if (!isAssistantMessage(last)) return { history: messages, reply: null };
  const reply: TAssistantMessage = last;
  return { history: messages.slice(0, -1), reply };
};

export { splitTurn };
