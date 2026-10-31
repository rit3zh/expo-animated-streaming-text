import {
  cubicBezier,
  Easing,
  type CSSAnimationTimingFunction,
  type EasingFunctionFactory,
  type WithSpringConfig,
} from "react-native-reanimated";

import type { TBezier } from "./interface";

const MOTION_EASE_OUT: CSSAnimationTimingFunction = cubicBezier(0.22, 1, 0.36, 1);
const MOTION_SMOOTH_BEZIER: TBezier = [0.1, 0.75, 0.29, 0.89];
const MOTION_EASE_SMOOTH: CSSAnimationTimingFunction = cubicBezier(...MOTION_SMOOTH_BEZIER);
const MOTION_EASING_SMOOTH: EasingFunctionFactory = Easing.bezier(...MOTION_SMOOTH_BEZIER);
const MOTION_ENTER_MS: number = 520;
const MOTION_TRANSITION_MS: number = 260;
const MOTION_PRESS_SCALE: number = 0.96;
const MOTION_PRESS_OPACITY: number = 0.82;
const MOTION_PRESS_SPRING: WithSpringConfig = {
  damping: 22,
  stiffness: 380,
  mass: 0.6,
};

const MOTION_LAYOUT_SPRING: WithSpringConfig = {
  stiffness: 360,
  damping: 32,
  mass: 0.6,
};
const MOTION_SWAP_SPRING: WithSpringConfig = {
  stiffness: 460,
  damping: 30,
  mass: 0.55,
};

export {
  MOTION_EASE_OUT,
  MOTION_EASE_SMOOTH,
  MOTION_EASING_SMOOTH,
  MOTION_LAYOUT_SPRING,
  MOTION_SMOOTH_BEZIER,
  MOTION_SWAP_SPRING,
  MOTION_ENTER_MS,
  MOTION_PRESS_OPACITY,
  MOTION_PRESS_SCALE,
  MOTION_PRESS_SPRING,
  MOTION_TRANSITION_MS,
};
