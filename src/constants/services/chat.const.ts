import type { TChatPersisted } from "@/services/interface";
import { AI_DEFAULT_MODEL_ID } from "./ai.const";

const CHAT_TITLE_MAX_LENGTH: number = 36;
const CHAT_DEFAULT_WORD_MS: number = 16;
const CHAT_INITIAL_STATE: TChatPersisted = {
  conversations: [],
  modelId: AI_DEFAULT_MODEL_ID,
  wordMs: CHAT_DEFAULT_WORD_MS,
  dummyResponse: false,
};

export { CHAT_DEFAULT_WORD_MS, CHAT_INITIAL_STATE, CHAT_TITLE_MAX_LENGTH };
