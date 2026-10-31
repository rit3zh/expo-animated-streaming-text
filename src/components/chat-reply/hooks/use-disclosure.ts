import { useEffect } from "react";
import type { LayoutChangeEvent, ViewStyle } from "react-native";
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  type AnimatedStyle,
  type SharedValue,
} from "react-native-reanimated";

import { CHAT_REPLY_SOURCES_SHIFT } from "@/constants/components/chat-reply.const";
import { MOTION_LAYOUT_SPRING } from "@/constants/motion.const";

import type { TDisclosure } from "../interface";

function useDisclosure(open: boolean): TDisclosure {
  const progress: SharedValue<number> = useSharedValue<number>(open ? 1 : 0);
  const height: SharedValue<number> = useSharedValue<number>(0);

  useEffect((): void => {
    progress.set(withSpring(open ? 1 : 0, MOTION_LAYOUT_SPRING));
  }, [open, progress]);

  const contentStyle: AnimatedStyle<ViewStyle> = useAnimatedStyle<ViewStyle>(
    (): ViewStyle => ({
      height: height.get() * progress.get(),
      opacity: progress.get(),
      transform: [
        { translateY: interpolate(progress.get(), [0, 1], [CHAT_REPLY_SOURCES_SHIFT, 0]) },
      ],
    }),
  );
  const chevronStyle: AnimatedStyle<ViewStyle> = useAnimatedStyle<ViewStyle>(
    (): ViewStyle => ({
      transform: [{ rotate: `${interpolate(progress.get(), [0, 1], [0, 180])}deg` }],
    }),
  );

  return {
    onContentLayout: (event: LayoutChangeEvent): void =>
      height.set(event.nativeEvent.layout.height),
    contentStyle,
    chevronStyle,
  };
}

export { useDisclosure };
