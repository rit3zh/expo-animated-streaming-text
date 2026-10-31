import {
  REVEAL_MAX_LAG_MS,
  REVEAL_MIN_INTERVAL_MS,
  REVEAL_PACE_SMOOTHING_MS,
  REVEAL_SETTLED_AFTER_MS,
  REVEAL_SLACK,
  REVEAL_STALL_MS,
} from "@/constants/components/streaming-text.const";

import type { TRun, TScheduleState, TTiming } from "../interface";

function schedule(
  s: TScheduleState,
  available: number,
  unitMs: number,
  now: number,
): TScheduleState {
  if (available === s.scheduled) return s;
  if (available < s.scheduled) {
    const runs: TRun[] = s.timing.runs.filter(
      (run: TRun): boolean => run.from < available,
    );
    return { ...s, scheduled: available, timing: { runs } };
  }

  const count: number = available - s.scheduled;
  const pace: number = nextPace(s, count, now);
  const start: number = Math.max(now, s.end);
  const backlog: number = start - now;
  const interval: number = Math.max(
    unitMs,
    pace * REVEAL_SLACK * (1 - backlog / REVEAL_MAX_LAG_MS),
  );
  const end: number = Math.max(
    start + count * REVEAL_MIN_INTERVAL_MS,
    Math.min(start + count * interval, now + REVEAL_MAX_LAG_MS),
  );
  return {
    scheduled: available,
    end,
    last: now,
    pace,
    timing: {
      runs: [
        ...s.timing.runs,
        { from: s.scheduled, start, interval: (end - start) / count },
      ],
    },
  };
}

function nextPace(s: TScheduleState, count: number, now: number): number {
  const gap: number = now - s.last;
  if (!s.last || gap > REVEAL_STALL_MS) return s.pace;
  const sample: number = gap / count;
  if (!s.pace) return sample;
  return (
    s.pace + (sample - s.pace) * (1 - Math.exp(-gap / REVEAL_PACE_SMOOTHING_MS))
  );
}

function revealDelay<T extends TTiming>(
  { runs }: T,
  id: number,
): number | null {
  let run: TRun | undefined;
  let lo: number = 0;
  let hi: number = runs.length - 1;
  while (lo <= hi) {
    const mid: number = (lo + hi) >> 1;
    if (runs[mid].from <= id) {
      run = runs[mid];
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  if (!run) return null;
  const delay: number =
    run.start + (id - run.from) * run.interval - performance.now();
  return delay < -REVEAL_SETTLED_AFTER_MS ? null : delay;
}

export { revealDelay, schedule };
