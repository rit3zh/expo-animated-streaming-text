import { THEME_MONO_FONT } from "@/constants/components/streaming-text.const";
import { registerComponent } from "@/utils/register-component.util";
import { memo, useState, type FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import type {
  IAnimatedWord,
  TDelayedAnimation,
  TSegment,
  TWordAnimation,
} from "./interface";
import { SegmentText } from "./segment-text";
import { delayed } from "./utils/animation.util";
import { isSameAnimatedWord } from "./utils/memo-compare.util";
import { revealDelay } from "./utils/reveal-schedule.util";
import { segmentStyle } from "./utils/style.util";

const AnimatedWordBase: FC<IAnimatedWord> = ({
  word,
  timing,
  variant,
  theme,
  onLinkPress,
}: IAnimatedWord &
  React.ComponentProps<typeof AnimatedWordBase>): React.ReactNode &
  React.JSX.Element => {
  const [{ fade, trail }] = useState<TWordAnimation>((): TWordAnimation => {
    const delay: number | null = revealDelay(timing, word.id);
    const wordFade: TDelayedAnimation | undefined = delayed(theme.fade, delay);
    return {
      fade: wordFade,
      trail:
        delay === null || !variant.trail
          ? undefined
          : { ...variant.trail, animationDelay: delay },
    };
  });
  const hasCode: boolean = word.segments.some((seg: TSegment): boolean =>
    Boolean(seg.code),
  );
  const single: TSegment | undefined =
    word.segments.length === 1 && !word.segments[0].href
      ? word.segments[0]
      : undefined;

  return (
    <Animated.View style={[hasCode && styles.mixed, fade]}>
      {hasCode ? (
        word.segments.map(
          (seg: TSegment, i: number): React.JSX.Element =>
            seg.code ? (
              <View
                key={i}
                style={[styles.chip, { backgroundColor: theme.inlineCode }]}
              >
                <Text style={[styles.chipText, { color: theme.text }]}>
                  {seg.text}
                </Text>
              </View>
            ) : (
              <SegmentText
                key={i}
                segment={seg}
                style={[variant.still, segmentStyle(seg, theme)]}
                onLinkPress={onLinkPress}
              />
            ),
        )
      ) : single ? (
        <Animated.Text style={[variant.still, segmentStyle(single, theme), trail]}>
          {single.text}{" "}
        </Animated.Text>
      ) : (
        <Animated.Text style={[variant.still, trail]}>
          {word.segments.map(
            (seg: TSegment, i: number): React.JSX.Element => (
              <SegmentText
                key={i}
                segment={seg}
                style={segmentStyle(seg, theme)}
                onLinkPress={onLinkPress}
              />
            ),
          )}{" "}
        </Animated.Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  mixed: { flexDirection: "row", alignItems: "center", marginRight: 4.5 },
  chip: {
    borderRadius: 6,
    borderCurve: "continuous",
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginHorizontal: 1,
  },
  chipText: { fontFamily: THEME_MONO_FONT, fontSize: 14, lineHeight: 20 },
});

const AnimatedWord = registerComponent(
  "AnimatedWord",
  memo(AnimatedWordBase, isSameAnimatedWord),
);

export { AnimatedWord };
