import type { MenuAction } from "@expo/ui/community/menu";
import type { ColorValue, TextStyle } from "react-native";
import {
  css,
  type CSSAnimationProperties,
  type CSSTransitionProperties,
} from "react-native-reanimated";

import type {
  TChatMoreActionMap,
  TChatSuggestion,
  TReplay,
  TRevealSpeed,
} from "@/components/chat-screen/interface";

import {
  MOTION_EASE_OUT,
  MOTION_EASE_SMOOTH,
  MOTION_ENTER_MS,
} from "../motion.const";
import { RADIX_GRAY } from "../radix.const";

const CHAT_GREETING: string = "What can I help with?";
const CHAT_GREETING_ANIMATION: CSSAnimationProperties = {
  animationName: css.keyframes({
    from: { opacity: 0, transform: [{ translateY: 10 }, { scale: 0.98 }] },
    to: { opacity: 1, transform: [{ translateY: 0 }, { scale: 1 }] },
  }),
  animationDuration: MOTION_ENTER_MS,
  animationTimingFunction: MOTION_EASE_OUT,
  animationFillMode: "both",
};

const CHAT_KEYBOARD_FADE_END: number = 0.6;
const CHAT_KEYBOARD_FADE_SCALE: number = 0.96;
const CHAT_GREETING_KEYBOARD_SHIFT: number = -12;
const CHAT_SUGGESTION_KEYBOARD_SHIFT: number = 12;

const CHAT_HEADER_HEIGHT: number = 56;
const CHAT_HEADER_BUTTON_SIZE: number = 44;
const CHAT_HEADER_BUTTON_ICON_SIZE: number = 17;
const CHAT_HEADER_SIDE_WIDTH: number = 100;
const CHAT_HEADER_FADE: readonly [ColorValue, ColorValue, ...ColorValue[]] = [
  `${RADIX_GRAY[1]}d9`,
  `${RADIX_GRAY[1]}59`,
  `${RADIX_GRAY[1]}00`,
];
const CHAT_HEADER_OPEN_SIDEBAR_LABEL: string = "Open sidebar";
const CHAT_HEADER_NEW_CHAT_LABEL: string = "New chat";

const CHAT_MODEL_MENU_WIDTH: number = 150;
const CHAT_MODEL_MENU_HEIGHT: number = 44;

const CHAT_MORE_ACTION: TChatMoreActionMap = {
  SHARE: "share",
  PIN: "pin",
  REPLAY: "replay",
  DUMMY: "dummy",
};
const CHAT_MORE_SPEED_PREFIX: string = "speed:";
const CHAT_REPLAY_INITIAL: TReplay = { conversationId: null, run: 0 };
const CHAT_REVEAL_SPEEDS: readonly TRevealSpeed[] = [
  { ms: 44, label: "Relaxed" },
  { ms: 28, label: "Natural" },
  { ms: 16, label: "Quick" },
  { ms: 10, label: "Instant" },
];
const CHAT_MORE_SPEED_TITLE: string = "Reveal speed";
const CHAT_MORE_ACTION_SHARE: MenuAction = {
  id: CHAT_MORE_ACTION.SHARE,
  title: "Share",
  image: "square.and.arrow.up",
};
const CHAT_MORE_ACTION_PIN: MenuAction = {
  id: CHAT_MORE_ACTION.PIN,
  title: "Pin chat",
  image: "pin",
};
const CHAT_MORE_ACTION_UNPIN: MenuAction = {
  id: CHAT_MORE_ACTION.PIN,
  title: "Unpin chat",
  image: "pin.slash",
};
const CHAT_MORE_ACTION_REPLAY: MenuAction = {
  id: CHAT_MORE_ACTION.REPLAY,
  title: "Replay response",
  image: "arrow.counterclockwise",
};

const CHAT_MORE_DUMMY_TITLE: string = "Dummy response";

const CHAT_COMPOSER_PLACEHOLDER: string = "Ask anything";
const CHAT_COMPOSER_EDIT_PLACEHOLDER: string = "Edit message";
const CHAT_COMPOSER_PLACEHOLDER_HIDDEN: string = "transparent";
const CHAT_COMPOSER_INPUT_PADDING_Y: number = 5;
const CHAT_COMPOSER_TEXT: TextStyle = { fontSize: 17, lineHeight: 22 };
const CHAT_COMPOSER_HEIGHT: number = 44;
const CHAT_COMPOSER_RADIUS: number = 22;
const CHAT_COMPOSER_MIN_BOTTOM: number = 12;
const CHAT_COMPOSER_FLOAT_GAP: number = 4;
const CHAT_COMPOSER_KEYBOARD_GAP: number = 8;
const CHAT_COMPOSER_INITIAL_HEIGHT: number = 120;
const CHAT_COMPOSER_MAX_INPUT_HEIGHT: number = 132;
const CHAT_COMPOSER_SEND_SIZE: number = 32;
const CHAT_COMPOSER_SEND_LABEL: string = "Send message";
const CHAT_COMPOSER_STOP_LABEL: string = "Stop generating";
const CHAT_COMPOSER_SEND_HIDDEN_SCALE: number = 0.5;
const CHAT_COMPOSER_SEND_TRANSITION: CSSTransitionProperties = {
  transitionProperty: ["opacity", "transform"],
  transitionDuration: 340,
  transitionTimingFunction: MOTION_EASE_SMOOTH,
};
const CHAT_COMPOSER_INPUT_TRANSITION: CSSTransitionProperties = {
  transitionProperty: "height",
  transitionDuration: 380,
  transitionTimingFunction: MOTION_EASE_SMOOTH,
};
const CHAT_COMPOSER_INPUT_SNAP: CSSTransitionProperties = {
  ...CHAT_COMPOSER_INPUT_TRANSITION,
  transitionDuration: 0,
};
const CHAT_COMPOSER_FADE: readonly [ColorValue, ColorValue, ...ColorValue[]] = [
  `${RADIX_GRAY[1]}00`,
  `${RADIX_GRAY[1]}40`,
  `${RADIX_GRAY[1]}a6`,
];
const CHAT_COMPOSER_FADE_LOCATIONS: readonly [number, number, ...number[]] = [0, 0.55, 1];
const CHAT_COMPOSER_ATTACH_ACTIONS: MenuAction[] = [
  { id: "camera", title: "Camera", image: "camera" },
  { id: "photos", title: "Photos", image: "photo" },
  { id: "files", title: "Files", image: "folder" },
];

const CHAT_SUGGESTIONS: readonly TChatSuggestion[] = [
  { title: "Animate streaming text", subtitle: "in React Native" },
  { title: "Write a reducer", subtitle: "for a chat store" },
  { title: "Compare FlashList", subtitle: "with FlatList" },
  { title: "Explain CSS keyframes", subtitle: "in Reanimated 4" },
];
const CHAT_SUGGESTION_STAGGER_MS: number = 50;
const CHAT_SUGGESTION_ANIMATION: CSSAnimationProperties = {
  animationName: css.keyframes({
    from: { opacity: 0, transform: [{ translateX: 24 }] },
    to: { opacity: 1, transform: [{ translateX: 0 }] },
  }),
  animationDuration: MOTION_ENTER_MS,
  animationTimingFunction: MOTION_EASE_OUT,
  animationFillMode: "both",
};

export {
  CHAT_COMPOSER_ATTACH_ACTIONS,
  CHAT_COMPOSER_FADE,
  CHAT_COMPOSER_FADE_LOCATIONS,
  CHAT_COMPOSER_FLOAT_GAP,
  CHAT_COMPOSER_HEIGHT,
  CHAT_COMPOSER_INITIAL_HEIGHT,
  CHAT_COMPOSER_INPUT_PADDING_Y,
  CHAT_COMPOSER_INPUT_SNAP,
  CHAT_COMPOSER_INPUT_TRANSITION,
  CHAT_COMPOSER_KEYBOARD_GAP,
  CHAT_COMPOSER_MAX_INPUT_HEIGHT,
  CHAT_COMPOSER_MIN_BOTTOM,
  CHAT_COMPOSER_EDIT_PLACEHOLDER,
  CHAT_COMPOSER_PLACEHOLDER,
  CHAT_COMPOSER_PLACEHOLDER_HIDDEN,
  CHAT_COMPOSER_RADIUS,
  CHAT_COMPOSER_SEND_HIDDEN_SCALE,
  CHAT_COMPOSER_SEND_LABEL,
  CHAT_COMPOSER_SEND_SIZE,
  CHAT_COMPOSER_SEND_TRANSITION,
  CHAT_COMPOSER_STOP_LABEL,
  CHAT_COMPOSER_TEXT,
  CHAT_GREETING,
  CHAT_GREETING_ANIMATION,
  CHAT_GREETING_KEYBOARD_SHIFT,
  CHAT_HEADER_BUTTON_ICON_SIZE,
  CHAT_HEADER_BUTTON_SIZE,
  CHAT_HEADER_FADE,
  CHAT_HEADER_HEIGHT,
  CHAT_KEYBOARD_FADE_END,
  CHAT_KEYBOARD_FADE_SCALE,
  CHAT_HEADER_NEW_CHAT_LABEL,
  CHAT_HEADER_OPEN_SIDEBAR_LABEL,
  CHAT_HEADER_SIDE_WIDTH,
  CHAT_MODEL_MENU_HEIGHT,
  CHAT_MODEL_MENU_WIDTH,
  CHAT_MORE_ACTION,
  CHAT_MORE_ACTION_PIN,
  CHAT_MORE_ACTION_REPLAY,
  CHAT_MORE_ACTION_SHARE,
  CHAT_MORE_ACTION_UNPIN,
  CHAT_MORE_DUMMY_TITLE,
  CHAT_MORE_SPEED_PREFIX,
  CHAT_MORE_SPEED_TITLE,
  CHAT_REPLAY_INITIAL,
  CHAT_REVEAL_SPEEDS,
  CHAT_SUGGESTION_ANIMATION,
  CHAT_SUGGESTION_KEYBOARD_SHIFT,
  CHAT_SUGGESTION_STAGGER_MS,
  CHAT_SUGGESTIONS,
};
