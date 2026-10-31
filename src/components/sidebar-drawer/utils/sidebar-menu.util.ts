import type { MenuAction } from "@expo/ui/community/menu";

import {
  SIDEBAR_ACTION_DELETE,
  SIDEBAR_ACTION_PIN,
  SIDEBAR_ACTION_SHARE,
  SIDEBAR_ACTION_UNPIN,
} from "@/constants/components/sidebar-drawer.const";

const buildSidebarItemActions = <T extends boolean>(
  pinned: T,
): MenuAction[] => [
  pinned ? SIDEBAR_ACTION_UNPIN : SIDEBAR_ACTION_PIN,
  SIDEBAR_ACTION_SHARE,
  SIDEBAR_ACTION_DELETE,
];

export { buildSidebarItemActions };
