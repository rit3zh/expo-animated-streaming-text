import { Platform } from "react-native";

const STORAGE_ENABLED: boolean = Platform.OS !== "web";
const STORAGE_CHUNK_SIZE: number = 2000;
const STORAGE_NON_ASCII: RegExp = /[\u0080-\uffff]/g;
const STORAGE_WRITE_DEBOUNCE_MS: number = 300;
const STORAGE_CHAT_NAME: string = "chat";
const STORAGE_CHAT_VERSION: number = 1;
const STORAGE_CHAT_INDEX_SUFFIX: string = "index";
const STORAGE_CHAT_CONVERSATION_SUFFIX: string = "c";

export {
  STORAGE_CHAT_CONVERSATION_SUFFIX,
  STORAGE_CHAT_INDEX_SUFFIX,
  STORAGE_CHAT_NAME,
  STORAGE_CHAT_VERSION,
  STORAGE_CHUNK_SIZE,
  STORAGE_ENABLED,
  STORAGE_NON_ASCII,
  STORAGE_WRITE_DEBOUNCE_MS,
};
