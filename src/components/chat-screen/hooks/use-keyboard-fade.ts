import {
  useReanimatedKeyboardAnimation,
  type ReanimatedContext,
} from "react-native-keyboard-controller";
import { Extrapolation, interpolate, useAnimatedStyle } from "react-native-reanimated";

import {
  CHAT_KEYBOARD_FADE_END,
  CHAT_KEYBOARD_FADE_SCALE,
} from "@/constants/components/chat-screen.const";

import type { TKeyboardFadeStyle } from "../interface";

function useKeyboardFade(shift: number): TKeyboardFadeStyle {
  const { progress }: ReanimatedContext = useReanimatedKeyboardAnimation();

  return useAnimatedStyle(() => {
    const value: number = progress.get();

    return {
      opacity: interpolate(
        value,
        [0, CHAT_KEYBOARD_FADE_END],
        [1, 0],
        Extrapolation.CLAMP,
      ),
      transform: [
        { translateY: interpolate(value, [0, 1], [0, shift], Extrapolation.CLAMP) },
        {
          scale: interpolate(
            value,
            [0, 1],
            [1, CHAT_KEYBOARD_FADE_SCALE],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });
}

export { useKeyboardFade };
