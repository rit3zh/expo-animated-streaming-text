import { useEffect } from "react";
import type { TextStyle, ViewStyle } from "react-native";
import {
  Extrapolation,
  interpolate,
  measure,
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
  withTiming,
  type FrameInfo,
  type SharedValue,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import {
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
} from "@/constants/components/bubble-flight.const";
import { CHAT_REPLY_PROMPT_PADDING_X } from "@/constants/components/chat-reply.const";

import { useFlightStore } from "../bubble-flight.store";
import type {
  TFlight,
  TFlightMotion,
  TFlightRect,
  TFlightStore,
  TFlightTextStyle,
  TFlightViewStyle,
} from "../interface";
import {
  approachFrame,
  stretch,
  toBubbleFrame,
  toMeasuredFrame,
} from "../utils/flight.util";

function useFlightMotion(flight: TFlight): TFlightMotion {
  const { id, source, target }: TFlight = flight;
  const { depart, end }: TFlightStore = useFlightStore.getState();
  const origin: TFlightRect = toBubbleFrame(source);
  const progress: SharedValue<number> = useSharedValue<number>(0);
  const frame: SharedValue<TFlightRect> = useSharedValue<TFlightRect>(origin);
  const width: SharedValue<number> = useSharedValue<number>(origin.width);
  const height: SharedValue<number> = useSharedValue<number>(origin.height);
  const launched: SharedValue<boolean> = useSharedValue<boolean>(false);
  const departed: SharedValue<boolean> = useSharedValue<boolean>(false);
  const landed: SharedValue<boolean> = useSharedValue<boolean>(false);

  useEffect((): (() => void) => {
    const timer: ReturnType<typeof setTimeout> = setTimeout(
      (): void => end(id),
      BUBBLE_FLIGHT_TIMEOUT_MS,
    );
    return (): void => clearTimeout(timer);
  }, [id, end]);

  useFrameCallback(({ timeSincePreviousFrame }: FrameInfo): void => {
    if (!target || landed.get()) return;
    const measured: TFlightRect | null = toMeasuredFrame(measure(target.ref));
    if (!measured && launched.get()) {
      landed.set(true);
      scheduleOnRN(end, id);
      return;
    }
    if (!measured) return;
    if (Math.abs(measured.width - width.get()) >= 0.5) width.set(measured.width);
    if (Math.abs(measured.height - height.get()) >= 0.5) height.set(measured.height);
    const k: number = Math.max(
      1 - Math.exp(-(timeSincePreviousFrame ?? 16) / BUBBLE_FLIGHT_TRACK_MS),
      progress.get() ** BUBBLE_FLIGHT_LOCK_POWER,
    );
    frame.set(launched.get() ? approachFrame(frame.get(), measured, k) : measured);
    if (!launched.get()) {
      launched.set(true);
      progress.set(
        withTiming(1, BUBBLE_FLIGHT_TIMING, (finished?: boolean): void => {
          if (!finished) return;
          target.visible.set(1);
          landed.set(true);
          scheduleOnRN(end, id);
        }),
      );
    }
    if (!departed.get() && progress.get() >= BUBBLE_FLIGHT_DEPART_AT) {
      departed.set(true);
      scheduleOnRN(depart, id);
    }
  });

  const size: TFlightViewStyle = useAnimatedStyle<ViewStyle>(
    (): ViewStyle => ({ width: width.get(), height: height.get() }),
  );
  const ghost: TFlightViewStyle = useAnimatedStyle<ViewStyle>((): ViewStyle => {
    const value: number = progress.get();
    const to: TFlightRect = frame.get();
    const centerX: number = interpolate(
      value,
      [0, 1],
      [origin.x + origin.width / 2, to.x + to.width / 2],
    );
    const centerY: number = interpolate(
      value,
      [0, 1],
      [origin.y + origin.height / 2, to.y + to.height / 2],
    );

    return {
      opacity: landed.get() ? 0 : 1,
      transform: [
        { translateX: centerX - width.get() / 2 },
        { translateY: centerY - height.get() / 2 },
      ],
    };
  });
  const fill: TFlightViewStyle = useAnimatedStyle<ViewStyle>((): ViewStyle => {
    const value: number = progress.get();
    const scaleX: number = stretch(origin.width / width.get(), BUBBLE_FLIGHT_MAX_STRETCH);
    const scaleY: number = stretch(origin.height / height.get(), BUBBLE_FLIGHT_MAX_STRETCH);

    return {
      opacity: interpolate(value, BUBBLE_FLIGHT_FILL_RANGE, [0, 1], Extrapolation.CLAMP),
      transform: [
        { scaleX: interpolate(value, [0, 1], [scaleX, 1]) },
        { scaleY: interpolate(value, [0, 1], [scaleY, 1]) },
      ],
    };
  });
  const sourceText: TFlightViewStyle = useAnimatedStyle<ViewStyle>(
    (): ViewStyle => ({
      opacity: interpolate(progress.get(), BUBBLE_FLIGHT_SOURCE_FADE, [1, 0], Extrapolation.CLAMP),
      transform: [
        { translateX: (width.get() - origin.width) / 2 },
        { translateY: (height.get() - origin.height) / 2 },
      ],
    }),
  );
  const targetText: TFlightTextStyle = useAnimatedStyle<TextStyle>(
    (): TextStyle => ({
      opacity: interpolate(progress.get(), BUBBLE_FLIGHT_TARGET_FADE, [0, 1], Extrapolation.CLAMP),
    }),
  );
  const targetWidth: TFlightTextStyle = useAnimatedStyle<TextStyle>(
    (): TextStyle => ({
      width: width.get() - CHAT_REPLY_PROMPT_PADDING_X * 2 + BUBBLE_FLIGHT_TEXT_SLACK,
    }),
  );

  return { size, ghost, fill, source: sourceText, target: targetText, targetWidth };
}

export { useFlightMotion };
