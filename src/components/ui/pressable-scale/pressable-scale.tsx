import type { FC } from "react";
import { Pressable, type GestureResponderEvent, type ViewStyle } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  type SharedValue,
} from "react-native-reanimated";

import {
  MOTION_PRESS_OPACITY,
  MOTION_PRESS_SCALE,
  MOTION_PRESS_SPRING,
} from "@/constants/motion.const";
import { registerComponent } from "@/utils/register-component.util";

import type { IPressableScale, TPressScaleStyle } from "./interface";

const PressableScaleBase: FC<IPressableScale> = ({
  children,
  style,
  scale = MOTION_PRESS_SCALE,
  spring = MOTION_PRESS_SPRING,
  onPressIn,
  onPressOut,
  ...pressableProps
}: IPressableScale & React.ComponentProps<typeof PressableScaleBase>): React.ReactNode &
  React.JSX.Element => {
  const pressed: SharedValue<number> = useSharedValue<number>(0);
  const animatedStyle: TPressScaleStyle = useAnimatedStyle<ViewStyle>(
    (): ViewStyle => ({
      opacity: interpolate(pressed.get(), [0, 1], [1, MOTION_PRESS_OPACITY]),
      transform: [{ scale: interpolate(pressed.get(), [0, 1], [1, scale]) }],
    }),
  );

  return (
    <Pressable
      {...pressableProps}
      onPressIn={(event: GestureResponderEvent): void => {
        pressed.set(withSpring(1, spring));
        onPressIn?.(event);
      }}
      onPressOut={(event: GestureResponderEvent): void => {
        pressed.set(withSpring(0, spring));
        onPressOut?.(event);
      }}
    >
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    </Pressable>
  );
};

const PressableScale = registerComponent("PressableScale", PressableScaleBase);

export { PressableScale };
