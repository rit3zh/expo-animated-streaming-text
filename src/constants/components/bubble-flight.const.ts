import { Easing, type WithTimingConfig } from "react-native-reanimated";

import type { TFlightRange } from "@/components/bubble-flight/interface";

const BUBBLE_FLIGHT_TIMING: WithTimingConfig = {
  duration: 540,
  easing: Easing.bezier(0.32, 0.72, 0, 1),
};
const BUBBLE_FLIGHT_TRACK_MS: number = 80;
const BUBBLE_FLIGHT_LOCK_POWER: number = 3;
const BUBBLE_FLIGHT_MAX_STRETCH: number = 1.25;
const BUBBLE_FLIGHT_FILL_RANGE: TFlightRange = [0, 0.5];
const BUBBLE_FLIGHT_SOURCE_FADE: TFlightRange = [0.05, 0.5];
const BUBBLE_FLIGHT_TARGET_FADE: TFlightRange = [0.2, 0.7];
const BUBBLE_FLIGHT_DEPART_AT: number = 0.3;
const BUBBLE_FLIGHT_TEXT_SLACK: number = 1;
const BUBBLE_FLIGHT_TIMEOUT_MS: number = 2000;

export {
  BUBBLE_FLIGHT_DEPART_AT,
  BUBBLE_FLIGHT_FILL_RANGE,
  BUBBLE_FLIGHT_LOCK_POWER,
  BUBBLE_FLIGHT_MAX_STRETCH,
  BUBBLE_FLIGHT_SOURCE_FADE,
  BUBBLE_FLIGHT_TARGET_FADE,
  BUBBLE_FLIGHT_TEXT_SLACK,
  BUBBLE_FLIGHT_TIMEOUT_MS,
  BUBBLE_FLIGHT_TIMING,
  BUBBLE_FLIGHT_TRACK_MS,
};
