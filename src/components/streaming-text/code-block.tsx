import { HIGHLIGHT_DETECT_LINES } from "@/constants/components/streaming-text.const";
import { registerComponent } from "@/utils/register-component.util";
import { memo, useMemo, useState, type FC } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { CodeLine } from "./code-line";
import { useLanguageLoaded } from "./hooks/use-language-loaded";
import type {
  ICodeBlock,
  TDelayedAnimation,
  TThemedToken,
  TWord,
} from "./interface";
import { delayed, enter } from "./utils/animation.util";
import { joinCodeLines } from "./utils/code.util";
import {
  detectLanguage,
  resolveLanguage,
  tokenize,
} from "./utils/highlighter.util";

const CodeBlockBase: FC<ICodeBlock> = ({
  block,
  shown,
  timing,
  delay,
  theme,
  style,
}: ICodeBlock & React.ComponentProps<typeof CodeBlockBase>): React.ReactNode &
  React.JSX.Element => {
  const [animation] = useState<TDelayedAnimation | undefined>(
    (): TDelayedAnimation | undefined => delayed(enter, delay),
  );
  const lines: TWord[] = block.lines.slice(0, shown);
  const code: string = joinCodeLines(block.lines, shown);

  const explicit: string | null = resolveLanguage(block.lang);
  const sample: string = block.lang
    ? ""
    : joinCodeLines(block.lines, Math.min(shown, HIGHLIGHT_DETECT_LINES));
  const detected: string | null = useMemo<string | null>(
    (): string | null => (sample ? detectLanguage(sample) : null),
    [sample],
  );
  const lang: string | null = explicit ?? detected;
  const loaded: boolean = useLanguageLoaded(lang);

  const tokens: TThemedToken[][] | null = useMemo<TThemedToken[][] | null>(
    (): TThemedToken[][] | null =>
      loaded ? tokenize(code, lang, theme.scheme) : null,
    [loaded, code, lang, theme.scheme],
  );

  return (
    <Animated.View
      style={[
        style,
        styles.container,
        { backgroundColor: theme.codeBlock, borderColor: theme.border },
        animation,
      ]}
    >
      <Text style={[styles.lang, { color: theme.muted }]}>
        {block.lang || lang || "code"}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View>
          {lines.map(
            (line: TWord, i: number): React.JSX.Element => (
              <CodeLine
                key={line.id}
                line={line}
                tokens={tokens?.[i]}
                timing={timing}
                color={theme.text}
              />
            ),
          )}
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    paddingTop: 10,
    overflow: "hidden",
  },
  lang: {
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 14,
    paddingBottom: 2,
  },
  scroll: { paddingHorizontal: 14, paddingBottom: 12, paddingTop: 4 },
});

const CodeBlock = registerComponent("CodeBlock", memo(CodeBlockBase));

export { CodeBlock };
