import { THEME_MONO_FONT } from "@/constants/components/streaming-text.const";
import { registerComponent } from "@/utils/register-component.util";
import { memo, useState, type FC } from "react";
import { StyleSheet, Text } from "react-native";
import Animated from "react-native-reanimated";
import type {
  ICodeLine,
  TDelayedAnimation,
  TThemedToken,
  TTiming,
} from "./interface";
import { delayed, enter } from "./utils/animation.util";
import { isSameCodeLine } from "./utils/memo-compare.util";
import { revealDelay } from "./utils/reveal-schedule.util";
import { tokenStyle } from "./utils/style.util";

const CodeLineBase: FC<ICodeLine> = ({
  line,
  tokens,
  timing,
  color,
}: ICodeLine & React.ComponentProps<typeof CodeLineBase>): React.ReactNode &
  React.JSX.Element => {
  const [animation] = useState<TDelayedAnimation | undefined>(
    (): TDelayedAnimation | undefined =>
      delayed(enter, revealDelay<TTiming>(timing, line.id)),
  );

  return (
    <Animated.View style={animation}>
      <Text style={[styles.line, { color }]}>
        {tokens?.length
          ? tokens.map(
              (token: TThemedToken, j: number): React.JSX.Element => (
                <Text key={j} style={tokenStyle(token)}>
                  {token.content}
                </Text>
              ),
            )
          : line.segments[0].text || " "}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  line: { fontFamily: THEME_MONO_FONT, fontSize: 13.5, lineHeight: 20 },
});

const CodeLine = registerComponent(
  "CodeLine",
  memo(CodeLineBase, isSameCodeLine),
);

export { CodeLine };
