import { useEffect, useState } from "react";

import {
  REVEAL_EMPTY_TIMING,
  REVEAL_INITIAL_SCHEDULE,
} from "@/constants/components/streaming-text.const";

import type { TRevealSchedule, TScheduleState } from "../interface";
import { schedule } from "../utils/reveal-schedule.util";

function useRevealSchedule<T extends number>(
  available: T,
  unitMs: T,
  enabled: boolean,
): TRevealSchedule {
  const [state, setState] = useState<TScheduleState>(REVEAL_INITIAL_SCHEDULE);

  useEffect((): (() => void) | undefined => {
    if (!enabled) return;
    let cancelled: boolean = false;

    queueMicrotask((): void => {
      if (cancelled) return;
      setState(
        (s: TScheduleState): TScheduleState =>
          schedule(s, available, unitMs, performance.now()),
      );
    });

    return (): void => {
      cancelled = true;
    };
  }, [available, unitMs, enabled]);

  if (!enabled) return { scheduled: available, end: 0, timing: REVEAL_EMPTY_TIMING };
  return {
    scheduled: Math.min(state.scheduled, available),
    end: state.end,
    timing: state.timing,
  };
}

export { useRevealSchedule };
