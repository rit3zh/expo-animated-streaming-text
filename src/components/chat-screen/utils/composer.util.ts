import type { TFlightRect } from "@/components/bubble-flight";
import { CHAT_COMPOSER_INPUT_PADDING_Y } from "@/constants/components/chat-screen.const";

const toComposerTextFrame = (
  pageX: number,
  pageY: number,
  width: number,
  height: number,
): TFlightRect => ({
  x: pageX,
  y: pageY + CHAT_COMPOSER_INPUT_PADDING_Y,
  width,
  height: height - CHAT_COMPOSER_INPUT_PADDING_Y * 2,
});

export { toComposerTextFrame };
