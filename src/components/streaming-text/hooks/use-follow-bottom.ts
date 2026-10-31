import type { FlashListRef } from "@shopify/flash-list";
import { useEffect } from "react";
import type {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import {
  scrollTo,
  useAnimatedRef,
  useFrameCallback,
  useScrollOffset,
  useSharedValue,
  type AnimatedRef,
  type DerivedValue,
  type FrameInfo,
  type SharedValue,
} from "react-native-reanimated";

import {
  FOLLOW_REATTACH_DISTANCE,
  FOLLOW_SNAP_STABLE_FRAMES,
  STREAMING_TEXT_CONFIG,
} from "@/constants/components/streaming-text.const";

import type { TFollowBottom, TScrollHandlers } from "../interface";

function useFollowBottom<T>(
  enabled: boolean,
  handlers: TScrollHandlers = {},
  inset?: DerivedValue<number>,
  active: boolean = false,
  glideMs: number = STREAMING_TEXT_CONFIG.followGlideMs,
  maxSpeed: number = STREAMING_TEXT_CONFIG.followMaxSpeed,
): TFollowBottom<T> {
  const ref: AnimatedRef<FlashListRef<T>> = useAnimatedRef<FlashListRef<T>>();
  const offset: SharedValue<number> = useScrollOffset(ref);
  const contentHeight: SharedValue<number> = useSharedValue<number>(0);
  const viewportHeight: SharedValue<number> = useSharedValue<number>(0);
  const following: SharedValue<boolean> = useSharedValue<boolean>(enabled);
  const interacting: SharedValue<boolean> = useSharedValue<boolean>(false);
  const y: SharedValue<number> = useSharedValue<number>(0);
  const anchor: SharedValue<number> = useSharedValue<number>(0);
  const snapping: SharedValue<boolean> = useSharedValue<boolean>(enabled);
  const stableFrames: SharedValue<number> = useSharedValue<number>(0);
  const lastMax: SharedValue<number> = useSharedValue<number>(-1);

  const bottom = (): number => {
    "worklet";
    return Math.max(
      0,
      contentHeight.get() - viewportHeight.get() + (inset?.get() ?? 0),
    );
  };

  useFrameCallback(({ timeSincePreviousFrame }: FrameInfo) => {
    if (!following.get() || interacting.get()) return;
    if (snapping.get()) {
      if (contentHeight.get() === 0 || viewportHeight.get() === 0) return;
      const target: number = bottom();
      stableFrames.set(target === lastMax.get() ? stableFrames.get() + 1 : 0);
      lastMax.set(target);
      y.set(target);
      scrollTo(ref, 0, target, false);
      if (stableFrames.get() >= FOLLOW_SNAP_STABLE_FRAMES) snapping.set(false);
      return;
    }
    if (offset.get() > y.get()) y.set(offset.get());
    const max: number = bottom();
    const diff: number = max - y.get();
    if (Math.abs(diff) < 0.5) return;
    const dt: number = timeSincePreviousFrame ?? 16;
    const k: number = 1 - Math.exp(-dt / glideMs);
    y.set(
      diff < 0
        ? max
        : y.get() +
            Math.min(
              Math.max(diff * k, Math.min(diff, 0.5)),
              (maxSpeed * dt) / 1000,
            ),
    );
    scrollTo(ref, 0, y.get(), false);
  });

  useEffect((): void => {
    if (!enabled || !active) return;
    interacting.set(false);
    following.set(true);
    y.set(offset.get());
  }, [enabled, active, interacting, following, y, offset]);

  const settle = (): void => {
    interacting.set(false);
    const distance: number = bottom() - offset.get();
    const pulledUp: number = anchor.get() - offset.get();
    following.set(
      enabled &&
        (distance < FOLLOW_REATTACH_DISTANCE ||
          pulledUp < FOLLOW_REATTACH_DISTANCE),
    );
    y.set(offset.get());
  };

  const props: TScrollHandlers = {
    onLayout: (e: LayoutChangeEvent): void => {
      viewportHeight.set(e.nativeEvent.layout.height);
      handlers.onLayout?.(e);
    },
    onContentSizeChange: (w: number, h: number): void => {
      contentHeight.set(h);
      handlers.onContentSizeChange?.(w, h);
    },
    onScrollBeginDrag: (e: NativeSyntheticEvent<NativeScrollEvent>): void => {
      interacting.set(true);
      snapping.set(false);
      anchor.set(following.get() ? y.get() : Number.POSITIVE_INFINITY);
      handlers.onScrollBeginDrag?.(e);
    },
    onScrollEndDrag: (e: NativeSyntheticEvent<NativeScrollEvent>): void => {
      settle();
      handlers.onScrollEndDrag?.(e);
    },
    onMomentumScrollBegin: (
      e: NativeSyntheticEvent<NativeScrollEvent>,
    ): void => {
      interacting.set(true);
      handlers.onMomentumScrollBegin?.(e);
    },
    onMomentumScrollEnd: (e: NativeSyntheticEvent<NativeScrollEvent>): void => {
      settle();
      handlers.onMomentumScrollEnd?.(e);
    },
  };

  return { ref, props };
}

export { useFollowBottom };
