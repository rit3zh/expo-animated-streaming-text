import type { MenuAction, NativeActionEvent } from "@expo/ui/community/menu";
import type { ReactNode } from "react";
import type { LayoutChangeEvent, StyleProp, ViewStyle } from "react-native";
import type { AnimatedStyle, DerivedValue } from "react-native-reanimated";

import type { TColors } from "@/constants/interface";
import type { TAssistantMessage, TChatMessage, TCitation, TConversation } from "@/services";

type TKeyboardInset = DerivedValue<number>;

type TReplyActionIcon = "thumbs-up" | "thumbs-down" | "copy" | "share" | "more";

type TReplyReaction = Extract<TReplyActionIcon, "thumbs-up" | "thumbs-down">;

type TReplyActionGlyph = {
  d: string;
  fillRule: "evenodd" | "nonzero";
};

type TReplyFeedback = "up" | "down" | null;

type TReplyMenuHandler = (event: NativeActionEvent) => void;

type TPromptActionMap = {
  readonly COPY: "copy";
  readonly SHARE: "share";
  readonly EDIT: "edit";
  readonly RESEND: "resend";
  readonly DELETE: "delete";
};

type TPromptActions = {
  actions: MenuAction[];
  onAction: TReplyMenuHandler;
};

type TCopyFeedback = {
  copied: boolean;
  copy: (text: string) => void;
};

type TDisclosure = {
  onContentLayout: (event: LayoutChangeEvent) => void;
  contentStyle: AnimatedStyle<ViewStyle>;
  chevronStyle: AnimatedStyle<ViewStyle>;
};

type TReactionMotion = {
  frameStyle: AnimatedStyle<ViewStyle>;
  restStyle: AnimatedStyle<ViewStyle>;
  activeStyle: AnimatedStyle<ViewStyle>;
};

type TTurn = {
  history: TChatMessage[];
  reply: TAssistantMessage | null;
};

type TReplyText = {
  text: string;
  streaming: boolean;
  animate: boolean;
  thinking: boolean;
  citations: readonly TCitation[];
};

interface IChatReply {
  conversation: TConversation;
  replay: boolean;
  wordMs: number;
  colors: TColors;
  topInset: number;
  bottomInset: number;
  keyboardOffset: number;
  menuActions: MenuAction[];
  onMenuAction: TReplyMenuHandler;
}

interface IReplyActions {
  content: string;
  animate: boolean;
  leadMs: number;
  colors: TColors;
  menuActions: MenuAction[];
  onMenuAction: TReplyMenuHandler;
}

interface IReplyActionButton {
  delay: number | null;
  label: string;
  selected?: boolean;
  onPress?: () => void;
  menuActions?: MenuAction[];
  onMenuAction?: TReplyMenuHandler;
  children: ReactNode;
}

interface IReplyActionIcon {
  name: TReplyActionIcon;
  color: string;
  delay: number | null;
}

interface IReplyReactionIcon {
  name: TReplyReaction;
  selected: boolean;
  colors: TColors;
  delay: number | null;
}

interface IChatHistory {
  conversationId: string;
  messages: TChatMessage[];
  colors: TColors;
}

interface IChatMessage {
  conversationId: string;
  message: TChatMessage;
  colors: TColors;
}

interface IChatPrompt {
  conversationId: string;
  messageId: string;
  text: string;
  colors: TColors;
}

interface IReplyNotice {
  text: string;
  colors: TColors;
}

interface IReplySources {
  citations: readonly TCitation[];
  colors: TColors;
}

interface ISourceRow {
  citation: TCitation;
  index: number;
  colors: TColors;
}

interface ISourceStack {
  citations: readonly TCitation[];
  colors: TColors;
}

interface ISourceFavicon {
  url: string;
  colors: TColors;
  style?: StyleProp<ViewStyle>;
}

export {
  type IChatHistory,
  type IChatMessage,
  type IChatPrompt,
  type IChatReply,
  type IReplyActionButton,
  type IReplyActionIcon,
  type IReplyActions,
  type IReplyNotice,
  type IReplyReactionIcon,
  type IReplySources,
  type ISourceFavicon,
  type ISourceRow,
  type ISourceStack,
  type TCopyFeedback,
  type TDisclosure,
  type TKeyboardInset,
  type TPromptActionMap,
  type TPromptActions,
  type TReactionMotion,
  type TReplyActionGlyph,
  type TReplyActionIcon,
  type TReplyFeedback,
  type TReplyMenuHandler,
  type TReplyReaction,
  type TReplyText,
  type TTurn,
};
