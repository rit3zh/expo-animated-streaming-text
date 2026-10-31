import type { TPromptActionMap } from "@/components/chat-reply/interface";
import type { ValueOf } from "@/global-ts/value-of";
import type { TCitation } from "@/services";
import type { MenuAction } from "@expo/ui/community/menu";
import type { TextStyle } from "react-native";
import type { KeyboardChatScrollViewProps } from "react-native-keyboard-controller";
import { css, type CSSAnimationProperties } from "react-native-reanimated";

import { MOTION_EASE_OUT, MOTION_ENTER_MS } from "../motion.const";

const CHAT_REPLY_KEYBOARD_LIFT: ValueOf<
  KeyboardChatScrollViewProps,
  "keyboardLiftBehavior"
> = "whenAtEnd";
const CHAT_REPLY_CONTENT_PADDING_X: number = 20;
const CHAT_REPLY_PROMPT_MAX_WIDTH_RATIO: number = 0.82;
const CHAT_REPLY_PROMPT_RADIUS: number = 22;
const CHAT_REPLY_PROMPT_PADDING_X: number = 16;
const CHAT_REPLY_PROMPT_PADDING_Y: number = 10;
const CHAT_REPLY_PROMPT_TEXT: TextStyle = { fontSize: 17, lineHeight: 23 };
const CHAT_REPLY_PROMPT_ANIMATION: CSSAnimationProperties = {
  animationName: css.keyframes({
    from: { opacity: 0, transform: [{ translateY: 14 }, { scale: 0.96 }] },
    to: { opacity: 1, transform: [{ translateY: 0 }, { scale: 1 }] },
  }),
  animationDuration: MOTION_ENTER_MS,
  animationTimingFunction: MOTION_EASE_OUT,
  animationFillMode: "both",
};

const CHAT_REPLY_PROMPT_ACTION: TPromptActionMap = {
  COPY: "copy",
  SHARE: "share",
  EDIT: "edit",
  RESEND: "resend",
  DELETE: "delete",
};
const CHAT_REPLY_PROMPT_ACTION_COPY: MenuAction = {
  id: CHAT_REPLY_PROMPT_ACTION.COPY,
  title: "Copy",
  image: "doc.on.doc",
};
const CHAT_REPLY_PROMPT_ACTION_SHARE: MenuAction = {
  id: CHAT_REPLY_PROMPT_ACTION.SHARE,
  title: "Share",
  image: "square.and.arrow.up",
};
const CHAT_REPLY_PROMPT_ACTION_EDIT: MenuAction = {
  id: CHAT_REPLY_PROMPT_ACTION.EDIT,
  title: "Edit message",
  image: "pencil",
};
const CHAT_REPLY_PROMPT_ACTION_RESEND: MenuAction = {
  id: CHAT_REPLY_PROMPT_ACTION.RESEND,
  title: "Resend",
  image: "arrow.clockwise",
};
const CHAT_REPLY_PROMPT_ACTION_DELETE: MenuAction = {
  id: CHAT_REPLY_PROMPT_ACTION.DELETE,
  title: "Delete",
  image: "trash",
  attributes: { destructive: true },
};

const CHAT_REPLY_NO_CITATIONS: readonly TCitation[] = [];
const CHAT_REPLY_SOURCES_TITLE: string = "Sources";
const CHAT_REPLY_SOURCE_HOST_PREFIX: RegExp = /^www\./i;
const CHAT_REPLY_SOURCE_ORIGIN: RegExp = /^([a-z][a-z\d+.-]*:\/\/[^/?#]+)/i;
const CHAT_REPLY_SOURCE_FAVICON_PATH: string = "/favicon.ico";
const CHAT_REPLY_SOURCE_FAVICON_SIZE: number = 16;
const CHAT_REPLY_SOURCE_STACK_LIMIT: number = 3;
const CHAT_REPLY_SOURCES_HINT: string =
  "Shows or hides the sources for this answer";
const CHAT_REPLY_SOURCES_SHIFT: number = -4;
const CHAT_REPLY_SOURCE_ROW_STAGGER_MS: number = 40;
const CHAT_REPLY_SOURCE_ROW_ANIMATION: CSSAnimationProperties = {
  animationName: css.keyframes({
    from: { opacity: 0, transform: [{ translateY: 6 }] },
    to: { opacity: 1, transform: [{ translateY: 0 }] },
  }),
  animationDuration: 360,
  animationTimingFunction: MOTION_EASE_OUT,
  animationFillMode: "both",
};
const CHAT_REPLY_SOURCES_LEAD_MS: number = 280;
const CHAT_REPLY_SOURCES_ANIMATION: CSSAnimationProperties = {
  animationName: css.keyframes({
    from: { opacity: 0, transform: [{ translateY: 8 }] },
    to: { opacity: 1, transform: [{ translateY: 0 }] },
  }),
  animationDuration: MOTION_ENTER_MS,
  animationTimingFunction: MOTION_EASE_OUT,
  animationFillMode: "both",
};

export {
  CHAT_REPLY_CONTENT_PADDING_X,
  CHAT_REPLY_KEYBOARD_LIFT,
  CHAT_REPLY_NO_CITATIONS,
  CHAT_REPLY_PROMPT_ACTION,
  CHAT_REPLY_PROMPT_ACTION_COPY,
  CHAT_REPLY_PROMPT_ACTION_DELETE,
  CHAT_REPLY_PROMPT_ACTION_EDIT,
  CHAT_REPLY_PROMPT_ACTION_RESEND,
  CHAT_REPLY_PROMPT_ACTION_SHARE,
  CHAT_REPLY_PROMPT_ANIMATION,
  CHAT_REPLY_PROMPT_MAX_WIDTH_RATIO,
  CHAT_REPLY_PROMPT_PADDING_X,
  CHAT_REPLY_PROMPT_PADDING_Y,
  CHAT_REPLY_PROMPT_RADIUS,
  CHAT_REPLY_PROMPT_TEXT,
  CHAT_REPLY_SOURCE_FAVICON_PATH,
  CHAT_REPLY_SOURCE_FAVICON_SIZE,
  CHAT_REPLY_SOURCE_HOST_PREFIX,
  CHAT_REPLY_SOURCE_ORIGIN,
  CHAT_REPLY_SOURCE_ROW_ANIMATION,
  CHAT_REPLY_SOURCE_ROW_STAGGER_MS,
  CHAT_REPLY_SOURCE_STACK_LIMIT,
  CHAT_REPLY_SOURCES_ANIMATION,
  CHAT_REPLY_SOURCES_HINT,
  CHAT_REPLY_SOURCES_LEAD_MS,
  CHAT_REPLY_SOURCES_SHIFT,
  CHAT_REPLY_SOURCES_TITLE,
};
