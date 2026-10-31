import type { FC } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { useKeyboardState } from "react-native-keyboard-controller";
import Animated from "react-native-reanimated";

import { PressableScale } from "@/components/ui/pressable-scale";
import {
  CHAT_SUGGESTION_ANIMATION,
  CHAT_SUGGESTION_KEYBOARD_SHIFT,
  CHAT_SUGGESTION_STAGGER_MS,
  CHAT_SUGGESTIONS,
} from "@/constants/components/chat-screen.const";
import { RADIX_FONT_SIZE, RADIX_GRAY, RADIX_SPACE } from "@/constants/radix.const";
import { registerComponent } from "@/utils/register-component.util";

import { useKeyboardFade } from "./hooks/use-keyboard-fade";
import type { IChatSuggestions, TChatSuggestion, TKeyboardFadeStyle } from "./interface";

const ChatSuggestionsBase: FC<IChatSuggestions> = ({
  onSelect,
}: IChatSuggestions & React.ComponentProps<typeof ChatSuggestionsBase>): React.ReactNode &
  React.JSX.Element => {
  const fade: TKeyboardFadeStyle = useKeyboardFade(CHAT_SUGGESTION_KEYBOARD_SHIFT);
  const keyboardVisible: boolean = useKeyboardState(
    (state): boolean => state.isVisible,
  );

  return (
    <Animated.View pointerEvents={keyboardVisible ? "none" : "auto"} style={fade}>
      <ScrollView
        horizontal
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {CHAT_SUGGESTIONS.map(
          (suggestion: TChatSuggestion, index: number): React.JSX.Element => (
            <Animated.View
              key={suggestion.title}
              style={[
                CHAT_SUGGESTION_ANIMATION,
                { animationDelay: index * CHAT_SUGGESTION_STAGGER_MS },
              ]}
            >
              <PressableScale
                accessibilityRole="button"
                onPress={(): void => onSelect(`${suggestion.title} ${suggestion.subtitle}`)}
                style={styles.card}
              >
                <Text style={styles.title}>{suggestion.title}</Text>
                <Text style={styles.subtitle}>{suggestion.subtitle}</Text>
              </PressableScale>
            </Animated.View>
          ),
        )}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: RADIX_SPACE[2],
    paddingHorizontal: RADIX_SPACE[3],
    paddingBottom: RADIX_SPACE[3],
  },
  card: {
    gap: 2,
    paddingHorizontal: RADIX_SPACE[4],
    paddingVertical: RADIX_SPACE[3],
    borderRadius: 18,
    borderCurve: "continuous",
    backgroundColor: RADIX_GRAY[3],
  },
  title: {
    color: RADIX_GRAY[12],
    fontSize: RADIX_FONT_SIZE[2] + 1,
    fontWeight: "600",
  },
  subtitle: { color: RADIX_GRAY[10], fontSize: RADIX_FONT_SIZE[2] + 1 },
});

const ChatSuggestions = registerComponent("ChatSuggestions", ChatSuggestionsBase);

export { ChatSuggestions };
