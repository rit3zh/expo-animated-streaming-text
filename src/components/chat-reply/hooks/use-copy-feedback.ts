import { setStringAsync } from "expo-clipboard";
import { useEffect, useState } from "react";

import { REPLY_ACTION_COPIED_MS } from "@/constants/components/reply-actions.const";

import type { TCopyFeedback } from "../interface";

function useCopyFeedback(): TCopyFeedback {
  const [copies, setCopies] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect((): (() => void) | undefined => {
    if (!copies) return;
    const timer: ReturnType<typeof setTimeout> = setTimeout(
      (): void => setCopied(false),
      REPLY_ACTION_COPIED_MS,
    );
    return (): void => clearTimeout(timer);
  }, [copies]);

  return {
    copied,
    copy: (text: string): void => {
      setStringAsync(text)
        .then((): void => {
          setCopied(true);
          setCopies((previous: number): number => previous + 1);
        })
        .catch((): void => undefined);
    },
  };
}

export { useCopyFeedback };
