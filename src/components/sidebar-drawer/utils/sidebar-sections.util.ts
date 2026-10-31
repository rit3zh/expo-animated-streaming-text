import {
  SIDEBAR_CHAT_PATH_PREFIX,
  SIDEBAR_DAY_MS,
  SIDEBAR_GROUP_LABELS,
  SIDEBAR_GROUP_MAX_AGE_DAYS,
  SIDEBAR_GROUP_ORDER,
  SIDEBAR_PINNED_LABEL,
} from "@/constants/components/sidebar-drawer.const";
import type { TConversation } from "@/services";

import type { TConversationGroup, TSidebarSection } from "../interface";

const toConversationGroup = (updatedAt: number, startOfToday: number): TConversationGroup =>
  SIDEBAR_GROUP_ORDER.find(
    (group: TConversationGroup): boolean =>
      updatedAt >= startOfToday - SIDEBAR_GROUP_MAX_AGE_DAYS[group] * SIDEBAR_DAY_MS,
  ) ?? "older";

const buildSidebarSections = (
  conversations: TConversation[],
  query: string,
): TSidebarSection[] => {
  const needle: string = query.trim().toLowerCase();
  const startOfToday: number = new Date().setHours(0, 0, 0, 0);
  const visible: TConversation[] = needle
    ? conversations.filter((conversation: TConversation): boolean =>
        conversation.title.toLowerCase().includes(needle),
      )
    : conversations;
  const pinned: TSidebarSection = {
    key: "pinned",
    title: SIDEBAR_PINNED_LABEL,
    data: visible.filter((conversation: TConversation): boolean => conversation.pinned),
  };
  const grouped: Map<TConversationGroup, TConversation[]> = new Map<
    TConversationGroup,
    TConversation[]
  >();
  for (const conversation of visible) {
    if (conversation.pinned) continue;
    const group: TConversationGroup = toConversationGroup(conversation.updatedAt, startOfToday);
    const bucket: TConversation[] | undefined = grouped.get(group);
    if (bucket) bucket.push(conversation);
    else grouped.set(group, [conversation]);
  }

  return [
    pinned,
    ...SIDEBAR_GROUP_ORDER.map(
      (group: TConversationGroup): TSidebarSection => ({
        key: group,
        title: SIDEBAR_GROUP_LABELS[group],
        data: grouped.get(group) ?? [],
      }),
    ),
  ].filter((section: TSidebarSection): boolean => section.data.length > 0);
};

const getActiveConversationId = <T extends string>(pathname: T): string | null =>
  pathname.startsWith(SIDEBAR_CHAT_PATH_PREFIX)
    ? decodeURIComponent(pathname.slice(SIDEBAR_CHAT_PATH_PREFIX.length))
    : null;

export { buildSidebarSections, getActiveConversationId };
