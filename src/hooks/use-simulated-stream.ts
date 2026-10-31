import { useEffect, useState } from "react";

import type { TSimulatedStream } from "./interface";

function useSimulatedStream(source: string, enabled: boolean = true): TSimulatedStream {
  const [text, setText] = useState<string>("");
  const [done, setDone] = useState<boolean>(false);

  useEffect((): (() => void) | undefined => {
    if (!enabled) return;
    let i: number = 0;
    let timer: ReturnType<typeof setTimeout>;

    const push = (): void => {
      i = Math.min(source.length, i + 2 + Math.floor(Math.random() * 14));
      setText(source.slice(0, i));
      if (i >= source.length) {
        setDone(true);
        return;
      }
      const stall: boolean = Math.random() < 0.06;
      timer = setTimeout(
        push,
        stall ? 300 + Math.random() * 500 : 20 + Math.random() * 90,
      );
    };

    timer = setTimeout(push, 650);
    return (): void => clearTimeout(timer);
  }, [source, enabled]);

  if (!enabled) return { text: source, done: true };
  return { text, done };
}

export { useSimulatedStream };
