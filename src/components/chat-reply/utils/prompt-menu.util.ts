import type { MenuAction } from "@expo/ui/community/menu";

import {
  CHAT_REPLY_PROMPT_ACTION_COPY,
  CHAT_REPLY_PROMPT_ACTION_DELETE,
  CHAT_REPLY_PROMPT_ACTION_EDIT,
  CHAT_REPLY_PROMPT_ACTION_RESEND,
  CHAT_REPLY_PROMPT_ACTION_SHARE,
} from "@/constants/components/chat-reply.const";

const withDisabled = (action: MenuAction, disabled: boolean): MenuAction =>
  disabled ? { ...action, attributes: { ...action.attributes, disabled } } : action;

const buildPromptActions = (busy: boolean): MenuAction[] => [
  {
    id: "clipboard",
    title: "",
    displayInline: true,
    subactions: [CHAT_REPLY_PROMPT_ACTION_COPY, CHAT_REPLY_PROMPT_ACTION_SHARE],
  },
  {
    id: "revise",
    title: "",
    displayInline: true,
    subactions: [
      withDisabled(CHAT_REPLY_PROMPT_ACTION_EDIT, busy),
      withDisabled(CHAT_REPLY_PROMPT_ACTION_RESEND, busy),
    ],
  },
  withDisabled(CHAT_REPLY_PROMPT_ACTION_DELETE, busy),
];

export { buildPromptActions };
