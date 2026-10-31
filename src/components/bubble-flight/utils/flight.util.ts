import type { MeasuredDimensions } from "react-native-reanimated";

import {
  CHAT_REPLY_PROMPT_PADDING_X,
  CHAT_REPLY_PROMPT_PADDING_Y,
} from "@/constants/components/chat-reply.const";

import type { TFlight, TFlightRect } from "../interface";

const matchFlight = (flight: TFlight | null, text: string): number | null =>
  flight && !flight.target && flight.text === text ? flight.id : null;

const toBubbleFrame = (text: TFlightRect): TFlightRect => {
  "worklet";
  return {
    x: text.x - CHAT_REPLY_PROMPT_PADDING_X,
    y: text.y - CHAT_REPLY_PROMPT_PADDING_Y,
    width: text.width + CHAT_REPLY_PROMPT_PADDING_X * 2,
    height: text.height + CHAT_REPLY_PROMPT_PADDING_Y * 2,
  };
};

const toMeasuredFrame = (measured: MeasuredDimensions | null): TFlightRect | null => {
  "worklet";
  if (!measured || measured.width <= 0 || measured.height <= 0) return null;
  return {
    x: measured.pageX,
    y: measured.pageY,
    width: measured.width,
    height: measured.height,
  };
};

const approachFrame = (from: TFlightRect, to: TFlightRect, k: number): TFlightRect => {
  "worklet";
  return {
    x: from.x + (to.x - from.x) * k,
    y: from.y + (to.y - from.y) * k,
    width: from.width + (to.width - from.width) * k,
    height: from.height + (to.height - from.height) * k,
  };
};

const stretch = (ratio: number, max: number): number => {
  "worklet";
  return Math.min(max, Math.max(1 / max, ratio));
};

export { approachFrame, matchFlight, stretch, toBubbleFrame, toMeasuredFrame };
