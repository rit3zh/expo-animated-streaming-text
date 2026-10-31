import type { DrawerContentComponentProps } from "expo-router/drawer";

import type { TConversation } from "@/services";
import type { ValueOf } from "@/global-ts/value-of";

type TDrawerNavigation = ValueOf<DrawerContentComponentProps, "navigation">;

type TConversationGroupMap = {
  readonly TODAY: "today";
  readonly YESTERDAY: "yesterday";
  readonly WEEK: "week";
  readonly MONTH: "month";
  readonly OLDER: "older";
};

type TConversationGroup = ValueOf<TConversationGroupMap, keyof TConversationGroupMap>;

type TSidebarActionMap = {
  readonly PIN: "pin";
  readonly SHARE: "share";
  readonly DELETE: "delete";
};

type TSidebarAction = ValueOf<TSidebarActionMap, keyof TSidebarActionMap>;

type TSidebarSection = {
  key: string;
  title: string;
  data: TConversation[];
};

type TSidebarAnchor = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type TSidebarNavigation = {
  openChat: (id: string) => void;
  openNewChat: () => void;
};

type TSidebarActions = {
  pending: TConversation | null;
  anchor: TSidebarAnchor | null;
  handleAction: (conversation: TConversation, action: string, anchor: TSidebarAnchor | null) => void;
  confirmDelete: () => void;
  dismissDelete: () => void;
};

interface ISidebarDrawer {
  navigation: TDrawerNavigation;
}

interface ISidebarSearch {
  value: string;
  onChangeText: (value: string) => void;
  onNewChat: () => void;
}

interface ISidebarSectionHeader {
  title: string;
}

interface ISidebarSectionGroup {
  section: TSidebarSection;
  activeId: string | null;
  onOpen: (id: string) => void;
  onAction: (conversation: TConversation, action: string, anchor: TSidebarAnchor | null) => void;
}

interface ISidebarItem {
  conversation: TConversation;
  active: boolean;
  onPress: () => void;
  onAction: (action: string, anchor: TSidebarAnchor | null) => void;
}

interface ISidebarFooter {
  bottomInset: number;
}

interface IDeleteDialog {
  conversation: TConversation | null;
  anchor: TSidebarAnchor | null;
  onConfirm: () => void;
  onDismiss: () => void;
}

export {
  type IDeleteDialog,
  type ISidebarDrawer,
  type ISidebarFooter,
  type ISidebarItem,
  type ISidebarSearch,
  type ISidebarSectionGroup,
  type ISidebarSectionHeader,
  type TConversationGroup,
  type TConversationGroupMap,
  type TDrawerNavigation,
  type TSidebarAction,
  type TSidebarActionMap,
  type TSidebarActions,
  type TSidebarAnchor,
  type TSidebarNavigation,
  type TSidebarSection,
};
