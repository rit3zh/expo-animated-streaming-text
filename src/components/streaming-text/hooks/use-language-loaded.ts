import { useEffect, useSyncExternalStore } from "react";

import {
  ensureLanguage,
  isLanguageLoaded,
  subscribeToHighlighter,
} from "../utils/highlighter.util";

function useLanguageLoaded<T extends string>(lang: T | null): boolean {
  const loaded: boolean = useSyncExternalStore<boolean>(
    subscribeToHighlighter,
    (): boolean => isLanguageLoaded(lang),
  );

  useEffect((): void => {
    if (lang && !loaded) ensureLanguage(lang);
  }, [lang, loaded]);

  return loaded;
}

export { useLanguageLoaded };
