import type { NativeActionEvent } from "@expo/ui/community/menu";
import type { TextInputContentSizeChangeEvent, ViewStyle } from "react-native";
import type { AnimatedStyle } from "react-native-reanimated";
import type { DrawerNavigationProp } from "expo-router/drawer";
import type { ParamListBase } from "expo-router/react-navigation";

import type { TIconName } from "@/components/ui/icon/interface";
import type { ValueOf } from "@/global-ts/value-of";
import type { TChatModelId } from "@/services";

type TChatMoreActionMap = {
  readonly SHARE: "share";
  readonly PIN: "pin";
  readonly REPLAY: "replay";
  readonly DUMMY: "dummy";
};

type TChatMoreAction = ValueOf<TChatMoreActionMap, keyof TChatMoreActionMap>;

type TReplay = {
  conversationId: string | null;
  run: number;
};

type TRevealSpeed = {
  ms: number;
  label: string;
};

type TChatSuggestion = {
  title: string;
  subtitle: string;
};

type TChatRouteParams = {
  id: string;
};

type TDrawerScreenNavigation = DrawerNavigationProp<ParamListBase>;

type TMenuActionHandler = (event: NativeActionEvent) => void;

type TChatNavigation = {
  openSidebar: () => void;
  startNewChat: () => void;
  submitPrompt: (prompt: string) => void;
};

type TComposer = {
  text: string;
  editing: boolean;
  setText: (text: string) => void;
  canSend: boolean;
  submit: () => void;
};

type TInputHeight = {
  height: number;
  onContentSizeChange: (event: TextInputContentSizeChangeEvent) => void;
};

type TKeyboardFadeStyle = AnimatedStyle<ViewStyle>;

interface IChatScreen {
  conversationId?: string;
}

interface IChatHeader {
  topInset: number;
  modelId: TChatModelId;
  showMore: boolean;
  pinned: boolean;
  wordMs: number;
  dummyResponse: boolean;
  onModelChange: (modelId: TChatModelId) => void;
  onOpenSidebar: () => void;
  onNewChat: () => void;
  onMoreAction: TMenuActionHandler;
}

interface IModelMenu {
  modelId: TChatModelId;
  onChange: (modelId: TChatModelId) => void;
}

interface IChatMoreMenu {
  pinned: boolean;
  wordMs: number;
  dummyResponse: boolean;
  onAction: TMenuActionHandler;
}

interface IChatEmptyState {
  topInset: number;
  bottomInset: number;
}

interface IChatSuggestions {
  onSelect: (prompt: string) => void;
}

interface IChatComposer {
  conversationId?: string;
  streaming: boolean;
  onSubmit: (prompt: string) => void;
  onStop: () => void;
}

interface IHeaderButton {
  icon: TIconName;
  label: string;
  onPress: () => void;
}

interface IComposerSendButton {
  visible: boolean;
  icon: TIconName;
  label: string;
  onPress: () => void;
}

export {
  type IChatComposer,
  type IChatEmptyState,
  type IChatHeader,
  type IChatMoreMenu,
  type IChatScreen,
  type IChatSuggestions,
  type IComposerSendButton,
  type IHeaderButton,
  type IModelMenu,
  type TChatMoreAction,
  type TChatMoreActionMap,
  type TChatNavigation,
  type TChatRouteParams,
  type TChatSuggestion,
  type TComposer,
  type TDrawerScreenNavigation,
  type TInputHeight,
  type TKeyboardFadeStyle,
  type TMenuActionHandler,
  type TReplay,
  type TRevealSpeed,
};
