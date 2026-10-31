import { registerComponent } from "@/utils/register-component.util";
import type { FC } from "react";
import { StyleSheet, View } from "react-native";
import { AnimatedWord } from "./animated-word";
import type { IWords, TWord } from "./interface";

const WordsBase: FC<IWords> = ({
  words,
  variant,
  timing,
  theme,
  onLinkPress,
  style,
}: IWords & React.ComponentProps<typeof WordsBase>): React.ReactNode &
  React.JSX.Element => (
  <View style={[styles.row, style]}>
    {words.map(
      (word: TWord): React.JSX.Element => (
        <AnimatedWord
          key={word.id}
          word={word}
          timing={timing}
          variant={variant}
          theme={theme}
          onLinkPress={onLinkPress}
        />
      ),
    )}
  </View>
);

const styles = StyleSheet.create({
  row: { flexDirection: "row", flexWrap: "wrap" },
});

const Words = registerComponent("Words", WordsBase);

export { Words };
