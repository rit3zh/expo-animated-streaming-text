import type { MenuAction } from "@expo/ui/community/menu";
import type { DrawerNavigationOptions } from "expo-router/drawer";
import { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";

import type {
  TConversationGroup,
  TConversationGroupMap,
  TSidebarActionMap,
} from "@/components/sidebar-drawer/interface";

import { RADIX_GRAY } from "../radix.const";

const SIDEBAR_WIDTH: number = 304;
const SIDEBAR_PADDING: number = 12;
const SIDEBAR_ROW_WIDTH: number = SIDEBAR_WIDTH - SIDEBAR_PADDING * 2;
const SIDEBAR_ROW_HEIGHT: number = 44;
const SIDEBAR_CONTROL_HEIGHT: number = 40;
const SIDEBAR_PROFILE_HEIGHT: number = 52;
const SIDEBAR_AVATAR_SIZE: number = 32;
const SIDEBAR_OVERLAY_COLOR: string = "rgba(0, 0, 0, 0.55)";
const SIDEBAR_CHAT_PATH_PREFIX: string = "/chat/";
const SIDEBAR_SCREEN_OPTIONS: DrawerNavigationOptions = {
  headerShown: false,
  drawerType: "slide",
  overlayColor: SIDEBAR_OVERLAY_COLOR,
  swipeEdgeWidth: 64,
  drawerStyle: { width: SIDEBAR_WIDTH, backgroundColor: RADIX_GRAY[2] },
  sceneStyle: { backgroundColor: RADIX_GRAY[1] },
};

const SIDEBAR_LAYOUT_TRANSITION: LinearTransition = LinearTransition.springify(380).dampingRatio(0.9);
const SIDEBAR_ENTERING: FadeIn = FadeIn.duration(220);
const SIDEBAR_EXITING: FadeOut = FadeOut.duration(160);

const SIDEBAR_SEARCH_PLACEHOLDER: string = "Search";
const SIDEBAR_NEW_CHAT_LABEL: string = "New chat";
const SIDEBAR_EMPTY_LABEL: string = "No chats found";

const SIDEBAR_GROUP: TConversationGroupMap = {
  TODAY: "today",
  YESTERDAY: "yesterday",
  WEEK: "week",
  MONTH: "month",
  OLDER: "older",
};
const SIDEBAR_GROUP_ORDER: readonly TConversationGroup[] = [
  SIDEBAR_GROUP.TODAY,
  SIDEBAR_GROUP.YESTERDAY,
  SIDEBAR_GROUP.WEEK,
  SIDEBAR_GROUP.MONTH,
  SIDEBAR_GROUP.OLDER,
];
const SIDEBAR_GROUP_LABELS: Record<TConversationGroup, string> = {
  today: "Today",
  yesterday: "Yesterday",
  week: "Previous 7 days",
  month: "Previous 30 days",
  older: "Older",
};
const SIDEBAR_GROUP_MAX_AGE_DAYS: Record<TConversationGroup, number> = {
  today: 0,
  yesterday: 1,
  week: 7,
  month: 30,
  older: Number.POSITIVE_INFINITY,
};
const SIDEBAR_DAY_MS: number = 86_400_000;
const SIDEBAR_PINNED_LABEL: string = "Pinned";

const SIDEBAR_ACTION: TSidebarActionMap = {
  PIN: "pin",
  SHARE: "share",
  DELETE: "delete",
};
const SIDEBAR_ACTION_PIN: MenuAction = {
  id: SIDEBAR_ACTION.PIN,
  title: "Pin",
  image: "pin",
};
const SIDEBAR_ACTION_UNPIN: MenuAction = {
  id: SIDEBAR_ACTION.PIN,
  title: "Unpin",
  image: "pin.slash",
};
const SIDEBAR_ACTION_SHARE: MenuAction = {
  id: SIDEBAR_ACTION.SHARE,
  title: "Share",
  image: "square.and.arrow.up",
};
const SIDEBAR_ACTION_DELETE: MenuAction = {
  id: SIDEBAR_ACTION.DELETE,
  title: "Delete",
  image: "trash",
  attributes: { destructive: true },
};

const SIDEBAR_DELETE_TITLE: string = "Delete chat?";
const SIDEBAR_DELETE_MESSAGE: string =
  "This will permanently delete the chat and its replies. This can't be undone.";
const SIDEBAR_DELETE_CONFIRM: string = "Delete";
const SIDEBAR_DELETE_CANCEL: string = "Cancel";

const SIDEBAR_PROFILE_NAME: string = "Guest";
const SIDEBAR_PROFILE_INITIALS: string = "G";
const SIDEBAR_PROFILE_ACTIONS: MenuAction[] = [
  { id: "settings", title: "Settings", image: "gearshape" },
  {
    id: "logout",
    title: "Log out",
    image: "rectangle.portrait.and.arrow.right",
    attributes: { destructive: true },
  },
];

export {
  SIDEBAR_ACTION,
  SIDEBAR_ACTION_DELETE,
  SIDEBAR_ACTION_PIN,
  SIDEBAR_ACTION_SHARE,
  SIDEBAR_ACTION_UNPIN,
  SIDEBAR_AVATAR_SIZE,
  SIDEBAR_CHAT_PATH_PREFIX,
  SIDEBAR_CONTROL_HEIGHT,
  SIDEBAR_DAY_MS,
  SIDEBAR_DELETE_CANCEL,
  SIDEBAR_DELETE_CONFIRM,
  SIDEBAR_DELETE_MESSAGE,
  SIDEBAR_DELETE_TITLE,
  SIDEBAR_EMPTY_LABEL,
  SIDEBAR_ENTERING,
  SIDEBAR_EXITING,
  SIDEBAR_GROUP,
  SIDEBAR_GROUP_LABELS,
  SIDEBAR_GROUP_MAX_AGE_DAYS,
  SIDEBAR_GROUP_ORDER,
  SIDEBAR_LAYOUT_TRANSITION,
  SIDEBAR_NEW_CHAT_LABEL,
  SIDEBAR_OVERLAY_COLOR,
  SIDEBAR_PADDING,
  SIDEBAR_PINNED_LABEL,
  SIDEBAR_PROFILE_ACTIONS,
  SIDEBAR_PROFILE_HEIGHT,
  SIDEBAR_PROFILE_INITIALS,
  SIDEBAR_PROFILE_NAME,
  SIDEBAR_ROW_HEIGHT,
  SIDEBAR_ROW_WIDTH,
  SIDEBAR_SCREEN_OPTIONS,
  SIDEBAR_SEARCH_PLACEHOLDER,
  SIDEBAR_WIDTH,
};
