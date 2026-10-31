import { ANIMATION_ENTER_RULE } from "@/constants/components/streaming-text.const";
import { registerComponent } from "@/utils/register-component.util";
import { memo, useState, type FC } from "react";
import { StyleSheet, Text, View, type ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { CodeBlock } from "./code-block";
import type { IBlockView, TDelayedAnimation } from "./interface";
import { TableBlock } from "./table-block";
import { delayed, enter } from "./utils/animation.util";
import { isSameBlockView } from "./utils/memo-compare.util";
import { revealDelay } from "./utils/reveal-schedule.util";
import { Words } from "./words";

const BlockViewBase: FC<IBlockView> = ({
  block,
  scheduled,
  timing,
  marginTop,
  theme,
  onLinkPress,
}: IBlockView & React.ComponentProps<typeof BlockViewBase>): React.ReactNode &
  React.JSX.Element => {
  const [delay] = useState<number | null>((): number | null =>
    revealDelay(timing, block.start),
  );
  const [markerEnter] = useState<TDelayedAnimation | undefined>(
    (): TDelayedAnimation | undefined => delayed(enter, delay),
  );
  const [ruleEnter] = useState<TDelayedAnimation | undefined>(
    (): TDelayedAnimation | undefined => delayed(ANIMATION_ENTER_RULE, delay),
  );
  const shown: number = scheduled - block.start;
  const style: ViewStyle = { marginTop };
  const words = { timing, theme, onLinkPress } satisfies Pick<
    IBlockView,
    "timing" | "theme" | "onLinkPress"
  >;

  switch (block.kind) {
    case "rule":
      return (
        <Animated.View
          style={[
            style,
            styles.rule,
            { backgroundColor: theme.border },
            ruleEnter,
          ]}
        />
      );

    case "code":
      return (
        <CodeBlock
          block={block}
          shown={shown}
          timing={timing}
          delay={delay}
          theme={theme}
          style={style}
        />
      );

    case "table":
      return (
        <TableBlock
          block={block}
          scheduled={scheduled}
          timing={timing}
          delay={delay}
          theme={theme}
          onLinkPress={onLinkPress}
          style={style}
        />
      );

    case "list-item":
      return (
        <View
          style={[style, styles.listItem, { paddingLeft: block.depth * 20 }]}
        >
          <View style={styles.markerBox}>
            {block.checked !== null ? (
              <Animated.View
                style={[
                  styles.checkbox,
                  block.checked
                    ? { backgroundColor: theme.text, borderColor: theme.text }
                    : { borderColor: theme.muted },
                  markerEnter,
                ]}
              >
                {block.checked && (
                  <Text style={[styles.check, { color: theme.checkInk }]}>
                    ✓
                  </Text>
                )}
              </Animated.View>
            ) : block.marker === "•" ? (
              <Animated.View
                style={[
                  styles.bullet,
                  { backgroundColor: theme.muted },
                  markerEnter,
                ]}
              />
            ) : (
              !!block.marker && (
                <Animated.View style={markerEnter}>
                  <Text style={[theme.mutedBody.still, styles.ordinal]}>
                    {block.marker}
                  </Text>
                </Animated.View>
              )
            )}
          </View>
          <Words
            {...words}
            words={block.words.slice(0, shown)}
            variant={theme.body}
            style={styles.flex}
          />
        </View>
      );

    case "quote":
      return (
        <View style={[style, styles.quote, { borderLeftColor: theme.border }]}>
          <Words
            {...words}
            words={block.words.slice(0, shown)}
            variant={theme.mutedBody}
          />
        </View>
      );

    case "heading":
      return (
        <Words
          {...words}
          words={block.words.slice(0, shown)}
          variant={theme.headings[Math.min(block.level, 4) - 1]}
          style={style}
        />
      );

    case "paragraph":
      return (
        <Words
          {...words}
          words={block.words.slice(0, shown)}
          variant={theme.body}
          style={style}
        />
      );
  }
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  listItem: { flexDirection: "row" },
  markerBox: { width: 24, height: 25, justifyContent: "center" },
  bullet: { width: 5, height: 5, borderRadius: 2.5, marginLeft: 4 },
  ordinal: { fontVariant: ["tabular-nums"] },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 5,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  check: { fontSize: 11, lineHeight: 13, fontWeight: "800" },
  quote: { borderLeftWidth: 3, paddingLeft: 12 },
  rule: { height: StyleSheet.hairlineWidth * 2, transformOrigin: "left" },
});

const BlockView = registerComponent(
  "BlockView",
  memo(BlockViewBase, isSameBlockView),
);

export { BlockView };
