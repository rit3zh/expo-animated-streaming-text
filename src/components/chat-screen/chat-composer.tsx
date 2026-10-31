import { useRef, type FC, type RefObject } from "react";
import { StyleSheet, TextInput, type TextInputInstance } from "react-native";
import Animated from "react-native-reanimated";

import { useFlightCover } from "@/components/bubble-flight";
import { GlassGroup } from "@/components/ui/glass-group";
import { GlassSurface } from "@/components/ui/glass-surface";
import {
  CHAT_COMPOSER_EDIT_PLACEHOLDER,
  CHAT_COMPOSER_HEIGHT,
  CHAT_COMPOSER_INPUT_PADDING_Y,
  CHAT_COMPOSER_INPUT_SNAP,
  CHAT_COMPOSER_INPUT_TRANSITION,
  CHAT_COMPOSER_PLACEHOLDER,
  CHAT_COMPOSER_PLACEHOLDER_HIDDEN,
  CHAT_COMPOSER_RADIUS,
  CHAT_COMPOSER_SEND_LABEL,
  CHAT_COMPOSER_SEND_SIZE,
  CHAT_COMPOSER_STOP_LABEL,
  CHAT_COMPOSER_TEXT,
} from "@/constants/components/chat-screen.const";
import { RADIX_GRAY, RADIX_SPACE } from "@/constants/radix.const";
import { registerComponent } from "@/utils/register-component.util";

import { ComposerAttachMenu } from "./composer-attach-menu";
import { ComposerSendButton } from "./composer-send-button";
import { useComposer } from "./hooks/use-composer";
import { useInputHeight } from "./hooks/use-input-height";
import type { IChatComposer, TComposer, TInputHeight } from "./interface";

const ChatComposerBase: FC<IChatComposer> = ({
  conversationId,
  streaming,
  onSubmit,
  onStop,
}: IChatComposer &
  React.ComponentProps<typeof ChatComposerBase>): React.ReactNode &
  React.JSX.Element => {
  const inputRef: RefObject<TextInputInstance | null> =
    useRef<TextInputInstance>(null);
  const composer: TComposer = useComposer(inputRef, onSubmit, conversationId);
  const covered: boolean = useFlightCover();
  const input: TInputHeight = useInputHeight();

  return (
    <GlassGroup style={styles.row}>
      <ComposerAttachMenu />
      <GlassSurface radius={CHAT_COMPOSER_RADIUS} style={styles.field}>
        <Animated.View
          style={[
            styles.frame,
            { height: input.height },
            composer.text
              ? CHAT_COMPOSER_INPUT_TRANSITION
              : CHAT_COMPOSER_INPUT_SNAP,
          ]}
        >
          <TextInput
            ref={inputRef}
            multiline
            value={composer.text}
            onChangeText={composer.setText}
            onContentSizeChange={input.onContentSizeChange}
            placeholder={
              composer.editing
                ? CHAT_COMPOSER_EDIT_PLACEHOLDER
                : CHAT_COMPOSER_PLACEHOLDER
            }
            placeholderTextColor={
              covered ? CHAT_COMPOSER_PLACEHOLDER_HIDDEN : RADIX_GRAY[10]
            }
            selectionColor={RADIX_GRAY[12]}
            cursorColor={RADIX_GRAY[12]}
            keyboardAppearance="dark"
            style={styles.input}
          />
        </Animated.View>
        <ComposerSendButton
          visible={streaming || composer.canSend}
          icon={streaming ? "stop" : "send"}
          label={
            streaming ? CHAT_COMPOSER_STOP_LABEL : CHAT_COMPOSER_SEND_LABEL
          }
          onPress={streaming ? onStop : composer.submit}
        />
      </GlassSurface>
    </GlassGroup>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-end", gap: RADIX_SPACE[2] },
  field: {
    flex: 1,
    minHeight: CHAT_COMPOSER_HEIGHT,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: RADIX_SPACE[2],
    paddingLeft: RADIX_SPACE[4],
    paddingRight: (CHAT_COMPOSER_HEIGHT - CHAT_COMPOSER_SEND_SIZE) / 2,
    paddingVertical: (CHAT_COMPOSER_HEIGHT - CHAT_COMPOSER_SEND_SIZE) / 2,
  },
  frame: { flex: 1, overflow: "hidden" },
  input: {
    flex: 1,
    paddingVertical: CHAT_COMPOSER_INPUT_PADDING_Y,
    paddingHorizontal: 0,
    color: RADIX_GRAY[12],
    ...CHAT_COMPOSER_TEXT,
    textAlignVertical: "center",
  },
});

const ChatComposer = registerComponent("ChatComposer", ChatComposerBase);

export { ChatComposer };
