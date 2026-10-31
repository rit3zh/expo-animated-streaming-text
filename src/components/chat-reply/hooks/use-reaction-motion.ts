import { useEffect, useRef } from "react";
import type { ViewStyle } from "react-native";
import {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
  type AnimatedStyle,
  type SharedValue,
} from "react-native-reanimated";

import {
  REPLY_REACTION_DIP_SCALE,
  REPLY_REACTION_FADE_SPRING,
  REPLY_REACTION_POP_SCALE,
  REPLY_REACTION_RISE_MS,
  REPLY_REACTION_SETTLE_SPRING,
} from "@/constants/components/reply-actions.const";

import type { TReactionMotion } from "../interface";

function useReactionMotion(selected: boolean, tilt: number): TReactionMotion {
  const progress: SharedValue<number> = useSharedValue<number>(selected ? 1 : 0);
  const pop: SharedValue<number> = useSharedValue<number>(0);
  const previous = useRef<boolean>(selected);

  useEffect((): void => {
    if (previous.current === selected) return;
    previous.current = selected;
    progress.set(withSpring(selected ? 1 : 0, REPLY_REACTION_FADE_SPRING));
    pop.set(
      withSequence(
        withTiming(selected ? 1 : -1, {
          duration: REPLY_REACTION_RISE_MS,
          easing: Easing.out(Easing.cubic),
        }),
        withSpring(0, REPLY_REACTION_SETTLE_SPRING),
      ),
    );
  }, [selected, progress, pop]);

  const frameStyle: AnimatedStyle<ViewStyle> = useAnimatedStyle<ViewStyle>(
    (): ViewStyle => ({
      transform: [
        {
          scale: interpolate(
            pop.get(),
            [-1, 0, 1],
            [REPLY_REACTION_DIP_SCALE, 1, REPLY_REACTION_POP_SCALE],
          ),
        },
        { rotate: `${interpolate(pop.get(), [-1, 0, 1], [0, 0, tilt])}deg` },
      ],
    }),
  );
  const restStyle: AnimatedStyle<ViewStyle> = useAnimatedStyle<ViewStyle>(
    (): ViewStyle => ({ opacity: 1 - progress.get() }),
  );
  const activeStyle: AnimatedStyle<ViewStyle> = useAnimatedStyle<ViewStyle>(
    (): ViewStyle => ({ opacity: progress.get() }),
  );

  return { frameStyle, restStyle, activeStyle };
}

export { useReactionMotion };
