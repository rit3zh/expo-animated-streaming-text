import type { fetch } from "expo/fetch";
import type { PersistStorage, StorageValue } from "zustand/middleware";

import type { ValueOf } from "@/global-ts/value-of";

type TProviderIdMap = {
  readonly OPENROUTER: "openrouter";
  readonly GROQ: "groq";
  readonly DEEPSEEK: "deepseek";
  readonly GEMINI: "gemini";
};

type TProviderId = ValueOf<TProviderIdMap, keyof TProviderIdMap>;
type TProvider = {
  url: string;
  apiKey: string;
  apiKeyName: string;
  keepsReasoning: boolean;
};

type TReasoningDetail = {
  type: string;
  id?: string | null;
  index?: number;
  format?: string;
  text?: string;
  summary?: string;
  data?: string;
  signature?: string | null;
};

type TCompletionParams = {
  temperature?: number;
  top_p?: number;
  max_completion_tokens?: number;
  max_tokens?: number;
  reasoning?: { enabled: boolean };
  reasoning_effort?: string;
  reasoning_format?: "raw" | "parsed" | "hidden";
  thinking?: { type: "enabled" | "disabled" };
  plugins?: TWebPlugin[];
};

type TWebPlugin = {
  id: "web";
  max_results?: number;
};

type TChatModelId =
  | "gemma-4-31b"
  | "gemma-4-31b-web"
  | "qwen-3.8-27b"
  | "gpt-oss-120b"
  | "deepseek-flash"
  | "gemini-flash"
  | "flint-v1";

type TChatModel = {
  id: TChatModelId;
  label: string;
  provider: TProviderId;
  model: string;
  params: TCompletionParams;
};

type TApiRole = "system" | "user" | "assistant";

type TApiMessage = {
  role: TApiRole;
  content: string;
  reasoning_details?: TReasoningDetail[];
};

type TCompletionBody = TCompletionParams & {
  model: string;
  messages: TApiMessage[];
  stream: true;
};

type TCitation = {
  url: string;
  title: string;
};

type TUrlCitation = {
  url: string;
  title?: string;
  content?: string;
  start_index?: number;
  end_index?: number;
};

type TAnnotation = {
  type: string;
  url_citation?: TUrlCitation;
};

type TCompletionDelta = {
  content?: string | null;
  reasoning?: string | null;
  reasoning_content?: string | null;
  reasoning_details?: TReasoningDetail[];
  annotations?: TAnnotation[];
};

type TCompletionChoice = {
  delta?: TCompletionDelta;
  message?: { annotations?: TAnnotation[] };
  finish_reason?: string | null;
};

type TCompletionError = {
  message?: string;
  code?: number | string;
  metadata?: { raw?: string };
};

type TCompletionChunk = {
  choices?: TCompletionChoice[];
  error?: TCompletionError;
};

type TFetchResponse = Awaited<ReturnType<typeof fetch>>;

type TCompletionSnapshot = {
  content: string;
  reasoning: string;
  citations: TCitation[];
};

type TCompletionResult = TCompletionSnapshot & {
  reasoningDetails: TReasoningDetail[];
  finishReason: string | null;
};

type TDummyCompletionRequest = Pick<TCompletionRequest, "signal" | "onUpdate">;

type TCompletionRequest = {
  model: TChatModel;
  messages: TApiMessage[];
  signal: AbortSignal;
  onUpdate: (snapshot: TCompletionSnapshot) => void;
};

type TReplyStatus = "complete" | "stopped" | "error";

type TUserMessage = {
  id: string;
  role: "user";
  content: string;
  createdAt: number;
};

type TAssistantMessage = {
  id: string;
  role: "assistant";
  content: string;
  reasoning: string;
  reasoningDetails: TReasoningDetail[];
  citations?: TCitation[];
  modelId: TChatModelId;
  status: TReplyStatus;
  error: string | null;
  createdAt: number;
};

type TChatMessage = TUserMessage | TAssistantMessage;

type TConversation = {
  id: string;
  title: string;
  pinned: boolean;
  createdAt: number;
  updatedAt: number;
  messages: TChatMessage[];
};

type TChatPersisted = {
  conversations: TConversation[];
  modelId: TChatModelId;
  wordMs: number;
  dummyResponse: boolean;
};

type TChatStore = TChatPersisted & {
  hydrated: boolean;
  createConversation: (prompt: string) => string;
  appendMessage: (conversationId: string, message: TChatMessage) => void;
  deleteConversation: (id: string) => void;
  togglePin: (id: string) => void;
  truncateConversation: (conversationId: string, messageId: string) => void;
  removeTurn: (conversationId: string, messageId: string) => void;
  setModel: (modelId: TChatModelId) => void;
  setWordMs: (wordMs: number) => void;
  toggleDummyResponse: () => void;
};

type TEditDraft = {
  conversationId: string;
  messageId: string;
  content: string;
};

type TEditStore = {
  draft: TEditDraft | null;
  begin: (draft: TEditDraft) => void;
  cancel: () => void;
};

type TStream = TCompletionSnapshot & {
  messageId: string;
  modelId: TChatModelId;
};

type TStreamStore = {
  streams: Record<string, TStream>;
  begin: (conversationId: string, stream: TStream) => void;
  update: (conversationId: string, snapshot: TCompletionSnapshot) => void;
  end: (conversationId: string) => void;
};

type TChatIndex = {
  version: number;
  ids: string[];
  modelId: TChatModelId;
  wordMs: number;
  dummyResponse?: boolean;
};

type TChatStorage = PersistStorage<TChatPersisted, void>;

type TPendingWrite = {
  name: string;
  value: StorageValue<TChatPersisted>;
};

type TChunkedStorage = {
  read: (key: string) => Promise<string | null>;
  write: (key: string, value: string) => Promise<void>;
  remove: (key: string) => Promise<void>;
};

export {
  type TAnnotation,
  type TApiMessage,
  type TApiRole,
  type TAssistantMessage,
  type TChatIndex,
  type TCitation,
  type TChatMessage,
  type TChatModel,
  type TChatModelId,
  type TChatPersisted,
  type TChatStorage,
  type TChatStore,
  type TChunkedStorage,
  type TCompletionBody,
  type TCompletionChoice,
  type TCompletionChunk,
  type TCompletionDelta,
  type TCompletionError,
  type TCompletionParams,
  type TCompletionRequest,
  type TCompletionResult,
  type TCompletionSnapshot,
  type TConversation,
  type TDummyCompletionRequest,
  type TEditDraft,
  type TEditStore,
  type TFetchResponse,
  type TProvider,
  type TProviderId,
  type TPendingWrite,
  type TProviderIdMap,
  type TReasoningDetail,
  type TReplyStatus,
  type TStream,
  type TStreamStore,
  type TUrlCitation,
  type TUserMessage,
  type TWebPlugin,
};
