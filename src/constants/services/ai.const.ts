import type {
  TChatModel,
  TChatModelId,
  TProvider,
  TProviderId,
  TProviderIdMap,
} from "@/services/interface";

const AI_PROVIDER_ID: TProviderIdMap = {
  OPENROUTER: "openrouter",
  GROQ: "groq",
  DEEPSEEK: "deepseek",
  GEMINI: "gemini",
};

const AI_PROVIDERS: Record<TProviderId, TProvider> = {
  openrouter: {
    url: "https://openrouter.ai/api/v1/chat/completions",
    apiKey: process.env.EXPO_PUBLIC_OPENROUTER_API_KEY ?? "",
    apiKeyName: "EXPO_PUBLIC_OPENROUTER_API_KEY",
    keepsReasoning: true,
  },
  groq: {
    url: "https://api.groq.com/openai/v1/chat/completions",
    apiKey: process.env.EXPO_PUBLIC_GROQ_API_KEY ?? "",
    apiKeyName: "EXPO_PUBLIC_GROQ_API_KEY",
    keepsReasoning: false,
  },
  deepseek: {
    url: "https://api.deepseek.com/chat/completions",
    apiKey: process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY ?? "",
    apiKeyName: "EXPO_PUBLIC_DEEPSEEK_API_KEY",
    keepsReasoning: false,
  },
  gemini: {
    url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    apiKey: process.env.EXPO_PUBLIC_GOOGLE_GEMINI_API_KEY ?? "",
    apiKeyName: "EXPO_PUBLIC_GOOGLE_GEMINI_API_KEY",
    keepsReasoning: false,
  },
};

const AI_WEB_MAX_RESULTS: number = 5;
const AI_MAX_OUTPUT_TOKENS: number = 16384;

const AI_MODELS: readonly TChatModel[] = [
  {
    id: "gemma-4-31b",
    label: "Gemma 4",
    provider: AI_PROVIDER_ID.OPENROUTER,
    model: "google/gemma-4-31b-it:free",
    params: { reasoning: { enabled: true }, max_tokens: AI_MAX_OUTPUT_TOKENS },
  },
  {
    id: "gemma-4-31b-web",
    label: "Gemma 4 · Web",
    provider: AI_PROVIDER_ID.OPENROUTER,
    model: "google/gemma-4-31b-it:free",
    params: {
      reasoning: { enabled: true },
      max_tokens: AI_MAX_OUTPUT_TOKENS,
      plugins: [{ id: "web", max_results: AI_WEB_MAX_RESULTS }],
    },
  },
  {
    id: "qwen-3.8-27b",
    label: "Qwen 3.8",
    provider: AI_PROVIDER_ID.GROQ,
    model: "qwen/qwen3.8-27b",
    params: {
      temperature: 0.6,
      top_p: 0.95,
      max_completion_tokens: AI_MAX_OUTPUT_TOKENS,
      reasoning_effort: "default",
      reasoning_format: "parsed",
    },
  },
  {
    id: "gpt-oss-120b",
    label: "GPT-OSS 120B",
    provider: AI_PROVIDER_ID.GROQ,
    model: "openai/gpt-oss-120b",
    params: {
      temperature: 1,
      top_p: 1,
      max_completion_tokens: AI_MAX_OUTPUT_TOKENS,
      reasoning_effort: "medium",
    },
  },
  {
    id: "deepseek-flash",
    label: "DeepSeek Flash",
    provider: AI_PROVIDER_ID.DEEPSEEK,
    model: "deepseek-flash",
    params: { thinking: { type: "disabled" } },
  },
  {
    id: "gemini-flash",
    label: "Gemini Flash",
    provider: AI_PROVIDER_ID.GEMINI,
    model: "gemini-flash-latest",
    params: {},
  },
  {
    id: "flint-v1",
    label: "Flint",
    provider: AI_PROVIDER_ID.OPENROUTER,
    model: "recursive/flint-v1.0:free",
    params: {},
  },
];
const AI_DEFAULT_MODEL_ID: TChatModelId = "gemma-4-31b";
const AI_CITATION_TYPE: string = "url_citation";
const AI_SSE_DATA_PREFIX: string = "data:";
const AI_SSE_DONE: string = "[DONE]";
const AI_FINISH_LENGTH: string = "length";
const AI_STREAM_FLUSH_MS: number = 48;
const AI_THINKING_DELAY_MS: number = 2000;
const AI_ERROR_MISSING_KEY: string =
  "Missing API key. Add it to .env and restart Expo:";
const AI_ERROR_EMPTY_BODY: string = "The provider returned an empty stream.";
const AI_ERROR_NO_ANSWER: string =
  "The model finished without an answer. Try again.";
const AI_ERROR_TRUNCATED: string =
  "The reply was cut off because it hit the model's length limit.";
const AI_ERROR_UNKNOWN: string =
  "Something went wrong while generating a reply.";
export {
  AI_CITATION_TYPE,
  AI_DEFAULT_MODEL_ID,
  AI_ERROR_EMPTY_BODY,
  AI_ERROR_MISSING_KEY,
  AI_ERROR_NO_ANSWER,
  AI_ERROR_TRUNCATED,
  AI_ERROR_UNKNOWN,
  AI_FINISH_LENGTH,
  AI_MAX_OUTPUT_TOKENS,
  AI_MODELS,
  AI_PROVIDER_ID,
  AI_PROVIDERS,
  AI_SSE_DATA_PREFIX,
  AI_SSE_DONE,
  AI_STREAM_FLUSH_MS,
  AI_THINKING_DELAY_MS,
  AI_WEB_MAX_RESULTS,
};
