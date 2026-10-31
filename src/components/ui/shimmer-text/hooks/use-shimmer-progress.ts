import { useEffect } from "react";
import {
  cancelAnimation,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";

import {
  SHIMMER_EASING,
  SHIMMER_EDGE_FACTOR,
} from "@/constants/components/shimmer-text.const";

function useShimmerProgress(duration: number, spread: number, paused: boolean): SharedValue<number> {
  const edge: number = spread * SHIMMER_EDGE_FACTOR;
  const progress: SharedValue<number> = useSharedValue<number>(-edge);

  useEffect((): (() => void) => {
    progress.set(-edge);
    if (!paused) {
      progress.set(
        withRepeat(withTiming(1 + edge, { duration, easing: SHIMMER_EASING }), -1, false),
      );
    }
    return (): void => cancelAnimation(progress);
  }, [progress, duration, edge, paused]);

  return progress;
}

export { useShimmerProgress };
