import type { MenuAction } from "@expo/ui/community/menu";

import {
  CHAT_MORE_ACTION,
  CHAT_MORE_ACTION_PIN,
  CHAT_MORE_ACTION_REPLAY,
  CHAT_MORE_ACTION_SHARE,
  CHAT_MORE_ACTION_UNPIN,
  CHAT_MORE_DUMMY_TITLE,
  CHAT_MORE_SPEED_PREFIX,
  CHAT_MORE_SPEED_TITLE,
  CHAT_REVEAL_SPEEDS,
} from "@/constants/components/chat-screen.const";
import { AI_MODELS } from "@/constants/services/ai.const";
import { getChatModel, type TChatModel, type TChatModelId } from "@/services";

import type { TRevealSpeed } from "../interface";

const getModelLabel = (modelId: TChatModelId): string => getChatModel(modelId).label;

const toModelId = (event: string): TChatModelId | null =>
  AI_MODELS.find((model: TChatModel): boolean => model.id === event)?.id ?? null;

const buildModelActions = (modelId: TChatModelId): MenuAction[] =>
  AI_MODELS.map(
    (model: TChatModel): MenuAction => ({
      id: model.id,
      title: model.label,
      state: model.id === modelId ? "on" : "off",
    }),
  );

const buildMoreActions = (
  pinned: boolean,
  wordMs: number,
  dummyResponse: boolean,
): MenuAction[] => [
  CHAT_MORE_ACTION_SHARE,
  pinned ? CHAT_MORE_ACTION_UNPIN : CHAT_MORE_ACTION_PIN,
  CHAT_MORE_ACTION_REPLAY,
  {
    id: CHAT_MORE_SPEED_PREFIX,
    title: CHAT_MORE_SPEED_TITLE,
    image: "gauge.with.dots.needle.67percent",
    subactions: CHAT_REVEAL_SPEEDS.map(
      (speed: TRevealSpeed): MenuAction => ({
        id: `${CHAT_MORE_SPEED_PREFIX}${speed.ms}`,
        title: `${speed.label} · ${speed.ms}ms`,
        state: speed.ms === wordMs ? "on" : "off",
      }),
    ),
  },
  {
    id: CHAT_MORE_ACTION.DUMMY,
    title: CHAT_MORE_DUMMY_TITLE,
    image: "doc.text",
    state: dummyResponse ? "on" : "off",
  },
];

const parseSpeedAction = (event: string): number | null => {
  if (!event.startsWith(CHAT_MORE_SPEED_PREFIX)) return null;
  const ms: number = Number(event.slice(CHAT_MORE_SPEED_PREFIX.length));
  return Number.isFinite(ms) && ms > 0 ? ms : null;
};

export {
  buildModelActions,
  buildMoreActions,
  getModelLabel,
  parseSpeedAction,
  toModelId,
};
