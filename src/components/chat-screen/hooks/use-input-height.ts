import { useState } from "react";
import type { TextInputContentSizeChangeEvent } from "react-native";

import {
  CHAT_COMPOSER_MAX_INPUT_HEIGHT,
  CHAT_COMPOSER_SEND_SIZE,
} from "@/constants/components/chat-screen.const";

import type { TInputHeight } from "../interface";

function useInputHeight(): TInputHeight {
  const [height, setHeight] = useState<number>(CHAT_COMPOSER_SEND_SIZE);

  return {
    height,
    onContentSizeChange: (event: TextInputContentSizeChangeEvent): void => {
      const next: number = Math.min(
        CHAT_COMPOSER_MAX_INPUT_HEIGHT,
        Math.max(CHAT_COMPOSER_SEND_SIZE, Math.ceil(event.nativeEvent.contentSize.height)),
      );
      if (next !== height) setHeight(next);
    },
  };
}

export { useInputHeight };
