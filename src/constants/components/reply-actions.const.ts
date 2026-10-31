import {
  css,
  type CSSAnimationProperties,
  type CSSTransitionProperties,
  type WithSpringConfig,
} from "react-native-reanimated";

import type {
  TReplyActionGlyph,
  TReplyActionIcon,
  TReplyReaction,
} from "@/components/chat-reply/interface";

import { MOTION_EASE_OUT, MOTION_TRANSITION_MS } from "../motion.const";

const REPLY_ACTION_GLYPHS: Record<TReplyActionIcon, TReplyActionGlyph> = {
  "thumbs-up": {
    fillRule: "evenodd",
    d: "M8.993 5.163c.169 1.423-.062 2.907-.576 4.239-.569 1.474-1.325 3.07-1.419 4.657-.079 1.337.224 2.919 1.032 4.002C8.915 19.247 10.368 20 11.967 20h1.512a5 5 0 0 0 4.983-4.585l.361-4.332A1 1 0 0 0 17.826 10H12.5a1.503 1.503 0 0 1-1.501-1.492c-.008-.97.053-2.167-.393-3.06-.4-.8-.774-.948-1.106-.948-.3 0-.54.393-.507.663M9.5 2.5c1.356 0 2.294.852 2.895 2.053.522 1.045.571 2.3.597 3.447h4.834a3 3 0 0 1 2.99 3.25l-.361 4.331A7 7 0 0 1 13.479 22h-1.512A6.937 6.937 0 0 1 6.9 19.822 5.54 5.54 0 0 1 5.5 20c-1.108 0-2.028-.62-2.624-1.608C2.296 17.432 2 16.107 2 14.5c0-1.606.297-2.931.876-3.891C3.472 9.62 4.392 9 5.5 9c.281 0 .579.05.877.134.458-1.2.784-2.437.63-3.735C6.835 3.954 8.016 2.5 9.5 2.5m-3.804 8.524c-.485-.1-.865.216-1.107.618C4.263 12.182 4 13.106 4 14.5c0 1.394.263 2.319.588 2.859.31.512.64.641.912.641.064 0 .127-.002.19-.005-.536-1.208-.766-2.74-.688-4.054.047-.805.361-1.918.694-2.917",
  },
  "thumbs-down": {
    fillRule: "evenodd",
    d: "M8.993 18.837c.169-1.423-.062-2.907-.576-4.239-.569-1.474-1.325-3.07-1.419-4.657-.079-1.337.224-2.919 1.032-4.002C8.915 4.753 10.368 4 11.967 4h1.512a5 5 0 0 1 4.983 4.585l.361 4.332A1 1 0 0 1 17.826 14H12.5c-.831 0-1.495.673-1.501 1.492-.008.97.053 2.167-.393 3.06-.4.8-.774.948-1.106.948-.3 0-.54-.393-.507-.663M9.5 21.5c1.356 0 2.294-.852 2.895-2.053.522-1.044.571-2.3.597-3.447h4.834a3 3 0 0 0 2.99-3.25l-.361-4.331A7 7 0 0 0 13.479 2h-1.512A6.937 6.937 0 0 0 6.9 4.179a5.538 5.538 0 0 0-1.4-.18c-1.108 0-2.028.622-2.624 1.61-.58.96-.876 2.284-.876 3.89 0 1.607.297 2.932.876 3.892C3.472 14.38 4.392 15 5.5 15c.281 0 .579-.05.877-.134.458 1.2.784 2.437.63 3.735C6.835 20.046 8.016 21.5 9.5 21.5m-3.804-8.524c-.485.1-.865-.216-1.107-.618C4.263 11.818 4 10.894 4 9.5c0-1.394.263-2.319.588-2.859.31-.512.64-.641.912-.641.064 0 .127.002.19.005-.536 1.208-.766 2.74-.688 4.054.047.805.361 1.918.694 2.917",
  },
  copy: {
    fillRule: "evenodd",
    d: "M9 2a2 2 0 0 0-2 2v2h2V4h11v11h-2v2h2a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM4 7a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zm0 2h11v11H4z",
  },
  share: {
    fillRule: "nonzero",
    d: "M10.114 4.491c.076-.795.906-1.45 1.743-.972 1.74 1.019 3.382 2.18 4.97 3.421 1.96 1.548 3.533 3.007 4.647 4.172.483.507.438 1.308-.024 1.792a42.072 42.072 0 0 1-3.495 3.228c-1.938 1.587-3.945 3.125-6.13 4.358-.741.418-1.544-.06-1.687-.801l-.017-.113-.227-3.574c-1.816.038-3.574.662-4.98 1.823l-.265.222-.128.104-.247.192c-.04.03-.08.06-.12.088l-.23.16a4.72 4.72 0 0 1-.218.135l-.206.111C2.534 19.314 2 18.892 2 17c0-4.404 3.245-8.323 7.632-8.917l.259-.031zm1.909 1.474-.192 3.472a.5.5 0 0 1-.447.47l-1.361.142c-3.065.366-5.497 2.762-5.948 5.894a9.952 9.952 0 0 1 5.135-1.912l.397-.023 1.704-.036a.5.5 0 0 1 .51.472l.197 3.596c1.603-1.021 3.131-2.196 4.664-3.45a43.717 43.717 0 0 0 2.857-2.595l-.258-.256-.556-.533a48.15 48.15 0 0 0-3.134-2.693 46.172 46.172 0 0 0-3.568-2.548",
  },
  more: {
    fillRule: "nonzero",
    d: "M12 16.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3m0-6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3m0-6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3",
  },
};

const REPLY_ACTION_SIZE: number = 32;
const REPLY_ACTION_ICON_SIZE: number = 18;
const REPLY_ACTION_BLUR: number = 2.6;
const REPLY_ACTION_BLUR_BLEED: number = 6;
const REPLY_ACTION_FILTER_ID: string = "reply-action-blur";
const REPLY_ACTIONS_DELAY_MS: number = 60;
const REPLY_ACTIONS_STAGGER_MS: number = 55;
const REPLY_ACTION_ENTER_MS: number = 560;
const REPLY_ACTION_COPIED_MS: number = 1600;
const REPLY_ACTION_PRESS_SCALE: number = 0.9;
const REPLY_ACTION_PRESS_SPRING: WithSpringConfig = {
  stiffness: 220,
  damping: 20,
  mass: 0.8,
};

const REPLY_REACTION_RISE_MS: number = 200;
const REPLY_REACTION_POP_SCALE: number = 1.22;
const REPLY_REACTION_DIP_SCALE: number = 0.88;
const REPLY_REACTION_TILT: Record<TReplyReaction, number> = {
  "thumbs-up": -14,
  "thumbs-down": 14,
};
const REPLY_REACTION_FADE_SPRING: WithSpringConfig = {
  stiffness: 140,
  damping: 22,
  mass: 1,
};
const REPLY_REACTION_SETTLE_SPRING: WithSpringConfig = {
  stiffness: 200,
  damping: 12,
  mass: 0.9,
};

const REPLY_ACTION_LABELS: Record<TReplyActionIcon | "copied", string> = {
  "thumbs-up": "Good response",
  "thumbs-down": "Bad response",
  copy: "Copy response",
  copied: "Copied",
  share: "Share response",
  more: "More actions",
};

const REPLY_ACTION_ENTER: CSSAnimationProperties = {
  animationName: css.keyframes({
    from: { opacity: 0, transform: [{ translateY: 6 }, { scale: 0.8 }] },
    to: { opacity: 1, transform: [{ translateY: 0 }, { scale: 1 }] },
  }),
  animationDuration: REPLY_ACTION_ENTER_MS,
  animationTimingFunction: MOTION_EASE_OUT,
  animationFillMode: "both",
};
const REPLY_ACTION_SHARPEN: CSSAnimationProperties = {
  animationName: css.keyframes({
    from: { opacity: 1 },
    to: { opacity: 0 },
  }),
  animationDuration: REPLY_ACTION_ENTER_MS,
  animationTimingFunction: MOTION_EASE_OUT,
  animationFillMode: "both",
};
const REPLY_ACTION_FOCUS: CSSAnimationProperties = {
  animationName: css.keyframes({
    "0%": { opacity: 0 },
    "30%": { opacity: 0 },
    "100%": { opacity: 1 },
  }),
  animationDuration: REPLY_ACTION_ENTER_MS,
  animationTimingFunction: MOTION_EASE_OUT,
  animationFillMode: "both",
};
const REPLY_ACTION_SWAP: CSSTransitionProperties = {
  transitionProperty: ["opacity", "transform"],
  transitionDuration: MOTION_TRANSITION_MS,
  transitionTimingFunction: MOTION_EASE_OUT,
};

export {
  REPLY_ACTION_BLUR,
  REPLY_ACTION_BLUR_BLEED,
  REPLY_ACTION_COPIED_MS,
  REPLY_ACTION_ENTER,
  REPLY_ACTION_FILTER_ID,
  REPLY_ACTION_FOCUS,
  REPLY_ACTION_GLYPHS,
  REPLY_ACTION_ICON_SIZE,
  REPLY_ACTION_LABELS,
  REPLY_ACTION_PRESS_SCALE,
  REPLY_ACTION_PRESS_SPRING,
  REPLY_ACTION_SHARPEN,
  REPLY_ACTION_SIZE,
  REPLY_ACTION_SWAP,
  REPLY_ACTIONS_DELAY_MS,
  REPLY_ACTIONS_STAGGER_MS,
  REPLY_REACTION_DIP_SCALE,
  REPLY_REACTION_FADE_SPRING,
  REPLY_REACTION_POP_SCALE,
  REPLY_REACTION_RISE_MS,
  REPLY_REACTION_SETTLE_SPRING,
  REPLY_REACTION_TILT,
};
