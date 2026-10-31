import {
  createHighlighterCore,
  type HighlighterCore,
  type TokensResult,
} from "@shikijs/core";
import { createJavaScriptRegexEngine } from "@shikijs/engine-javascript";
import type { AutoHighlightResult } from "highlight.js";
import hljs from "highlight.js/lib/core";
import { Platform } from "react-native";
import {
  createNativeEngine,
  isNativeEngineAvailable,
} from "react-native-shiki-engine";

import {
  HIGHLIGHT_ALIASES,
  HIGHLIGHT_DETECTABLE,
  HIGHLIGHT_DETECTABLE_NAMES,
  HIGHLIGHT_LANGUAGES,
  HIGHLIGHT_MAX_CACHED_LINES,
  HIGHLIGHT_THEMES,
  HIGHLIGHT_WARM_LANGUAGES,
  HIGHLIGHT_WARM_SAMPLE,
} from "@/constants/components/streaming-text.const";

import type {
  TGrammarState,
  TLineEntry,
  TScheme,
  TThemedToken,
} from "../interface";

for (const [name, lang] of Object.entries(HIGHLIGHT_DETECTABLE))
  hljs.registerLanguage(name, lang);

let highlighter: Promise<HighlighterCore> | null = null;
let instance: HighlighterCore | null = null;
let warmed: boolean = false;
const loaded: Set<string> = new Set<string>();
const loading: Map<string, Promise<void>> = new Map<string, Promise<void>>();
const listeners: Set<() => void> = new Set<() => void>();

let roots: Map<string, object> = new Map<string, object>();
let lineCache: WeakMap<object, Map<string, TLineEntry>> = new WeakMap<
  object,
  Map<string, TLineEntry>
>();
let cachedLines: number = 0;

function resolveLanguage(lang: string | undefined): string | null {
  if (!lang) return null;
  const key: string = lang.toLowerCase();
  const id: string = HIGHLIGHT_ALIASES[key] ?? key;
  return id in HIGHLIGHT_LANGUAGES ? id : null;
}

function detectLanguage(code: string): string | null {
  if (code.trim().length < 16) return null;
  const result: AutoHighlightResult = hljs.highlightAuto(
    code,
    HIGHLIGHT_DETECTABLE_NAMES,
  );
  if (!result.language || result.relevance < 3) return null;
  return resolveLanguage(result.language);
}

function getHighlighter(): Promise<HighlighterCore> {
  highlighter ??= createHighlighterCore({
    themes: [
      import("@shikijs/themes/vitesse-light"),
      import("@shikijs/themes/vitesse-dark"),
    ],
    langs: [],
    engine:
      Platform.OS !== "web" && isNativeEngineAvailable()
        ? createNativeEngine()
        : createJavaScriptRegexEngine({ forgiving: true }),
  }).then((h: HighlighterCore): HighlighterCore => (instance = h));
  return highlighter;
}

function ensureLanguage<T extends string>(id: T): Promise<void> {
  const existing: Promise<void> | undefined = loading.get(id);
  if (existing) return existing;
  const promise: Promise<void> = (async (): Promise<void> => {
    const [h, grammar] = await Promise.all([
      getHighlighter(),
      HIGHLIGHT_LANGUAGES[id](),
    ]);
    await h.loadLanguage(grammar.default);
    h.codeToTokensBase(HIGHLIGHT_WARM_SAMPLE, {
      lang: id,
      theme: HIGHLIGHT_THEMES.dark,
    });
    loaded.add(id);
    listeners.forEach((listener: () => void): void => listener());
  })().catch((error: unknown): void => {
    if (__DEV__)
      console.warn(`[streaming-text] failed to load "${id}" grammar`, error);
  });
  loading.set(id, promise);
  return promise;
}

function isLanguageLoaded(lang: string | null): boolean {
  return lang !== null && instance !== null && loaded.has(lang);
}

function warmUpHighlighter() {
  if (warmed) return;
  warmed = true;
  HIGHLIGHT_WARM_LANGUAGES.reduce<Promise<unknown>>(
    (chain: Promise<unknown>, id: string): Promise<unknown> =>
      chain
        .then((): Promise<void> => ensureLanguage(id))
        .then((): Promise<void> => new Promise<void>((r) => setTimeout(r, 32))),
    new Promise<void>((r) => setTimeout(r, 100)),
  );
}

function tokenize(
  code: string,
  lang: string | null,
  scheme: TScheme,
): TThemedToken[][] | null {
  if (!lang || !instance || !loaded.has(lang)) return null;

  if (cachedLines > HIGHLIGHT_MAX_CACHED_LINES) {
    roots = new Map<string, object>();
    lineCache = new WeakMap<object, Map<string, TLineEntry>>();
    cachedLines = 0;
  }

  const theme: string = HIGHLIGHT_THEMES[scheme];
  const rootKey: string = `${lang}:${theme}`;
  let root: object | undefined = roots.get(rootKey);
  if (!root) roots.set(rootKey, (root = {}));

  const out: TThemedToken[][] = [];
  let state: object = root;
  try {
    for (const line of code.split("\n")) {
      let byLine: Map<string, TLineEntry> | undefined = lineCache.get(state);
      if (!byLine)
        lineCache.set(state, (byLine = new Map<string, TLineEntry>()));
      let entry: TLineEntry | undefined = byLine.get(line);
      if (!entry) {
        const result: TokensResult = instance.codeToTokens(line, {
          lang,
          theme,
          grammarState: state === root ? undefined : (state as TGrammarState),
        });
        entry = {
          tokens: result.tokens[0] ?? [],
          state: result.grammarState ?? state,
        };
        byLine.set(line, entry);
        cachedLines++;
      }
      out.push(entry.tokens);
      state = entry.state;
    }
  } catch {
    return null;
  }
  return out;
}

function subscribeToHighlighter(listener: () => void): () => void {
  listeners.add(listener);
  return (): void => {
    listeners.delete(listener);
  };
}

export {
  detectLanguage,
  ensureLanguage,
  isLanguageLoaded,
  resolveLanguage,
  subscribeToHighlighter,
  tokenize,
  warmUpHighlighter,
};
