import {
  ANIMATION_ENTER_MS,
  ANIMATION_FADE_IN,
  ANIMATION_SHARPEN,
  ANIMATION_TRAIL_EASE,
  ANIMATION_TRAIL_HOLD,
} from "@/constants/components/streaming-text.const";
import { css, type CSSAnimationProperties } from "react-native-reanimated";
import type { TDelayedAnimation } from "../interface";

function fade<T extends number>(durationMs: T): CSSAnimationProperties {
  const timing: Pick<
    CSSAnimationProperties,
    "animationDuration" | "animationTimingFunction"
  > = {
    animationDuration: durationMs,
    animationTimingFunction: "ease-in-out",
  };
  return ANIMATION_SHARPEN
    ? {
        ...timing,
        animationName: [ANIMATION_FADE_IN, ANIMATION_SHARPEN],
        animationFillMode: ["both", "backwards"],
      }
    : {
        ...timing,
        animationName: ANIMATION_FADE_IN,
        animationFillMode: "both",
      };
}

const enter: CSSAnimationProperties = fade(ANIMATION_ENTER_MS);

function delayed(
  animation: CSSAnimationProperties,
  delay: number | null,
): TDelayedAnimation | undefined {
  return delay === null
    ? undefined
    : { opacity: 0, ...animation, animationDelay: delay };
}

function trailAnimation(
  trail: readonly string[],
  color: string,
  trailMs: number,
): CSSAnimationProperties | undefined {
  if (!trail.length) return undefined;
  const hold: number = ANIMATION_TRAIL_HOLD * 100;
  const steps: Record<string, { color: string }> = {
    "0%": { color: trail[0] },
    [`${Math.round(hold)}%`]: { color: trail[0] },
    "100%": { color },
  };
  trail.slice(1).forEach((c: string, i: number): void => {
    steps[`${Math.round(hold + ((i + 1) / trail.length) * (100 - hold))}%`] = {
      color: c,
    };
  });
  return {
    animationName: css.keyframes(steps),
    animationDuration: trailMs,
    animationTimingFunction: ANIMATION_TRAIL_EASE,
    animationFillMode: "backwards",
  };
}

export { delayed, enter, fade, trailAnimation };
