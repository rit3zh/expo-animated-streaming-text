import { useMemo, type FC } from "react";
import { StyleSheet, View } from "react-native";
import type { SharedValue } from "react-native-reanimated";

import {
  SHIMMER_DURATION_MS,
  SHIMMER_SPREAD,
} from "@/constants/components/shimmer-text.const";
import { registerComponent } from "@/utils/register-component.util";

import { useShimmerProgress } from "./hooks/use-shimmer-progress";
import type { IShimmerText, TShimmerGlyph, TShimmerWord } from "./interface";
import { ShimmerGlyph } from "./shimmer-glyph";
import { splitGlyphs } from "./utils/split-glyphs.util";

const ShimmerTextBase: FC<IShimmerText> = ({
  children,
  color,
  highlightColor,
  style,
  containerStyle,
  duration = SHIMMER_DURATION_MS,
  spread = SHIMMER_SPREAD,
  paused = false,
}: IShimmerText & React.ComponentProps<typeof ShimmerTextBase>): React.ReactNode &
  React.JSX.Element => {
  const words: readonly TShimmerWord[] = useMemo<readonly TShimmerWord[]>(
    (): readonly TShimmerWord[] => splitGlyphs(children),
    [children],
  );
  const progress: SharedValue<number> = useShimmerProgress(duration, spread, paused);

  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={children}
      style={[styles.container, containerStyle]}
    >
      {words.map(
        (word: TShimmerWord): React.JSX.Element => (
          <View key={word.key} style={styles.word}>
            {word.glyphs.map(
              (glyph: TShimmerGlyph): React.JSX.Element => (
                <ShimmerGlyph
                  key={glyph.key}
                  char={glyph.char}
                  position={glyph.position}
                  progress={progress}
                  color={color}
                  highlightColor={highlightColor}
                  spread={spread}
                  style={style}
                />
              ),
            )}
          </View>
        ),
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row", flexWrap: "wrap", alignItems: "baseline" },
  word: { flexDirection: "row", alignItems: "baseline" },
});

const ShimmerText = registerComponent("ShimmerText", ShimmerTextBase);

export { ShimmerText };
