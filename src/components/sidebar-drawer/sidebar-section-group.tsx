import type { FC } from "react";
import Animated from "react-native-reanimated";

import type { TConversation } from "@/services";
import {
  SIDEBAR_ENTERING,
  SIDEBAR_EXITING,
  SIDEBAR_LAYOUT_TRANSITION,
} from "@/constants/components/sidebar-drawer.const";
import { registerComponent } from "@/utils/register-component.util";

import type { ISidebarSectionGroup, TSidebarAnchor } from "./interface";
import { SidebarItem } from "./sidebar-item";
import { SidebarSectionHeader } from "./sidebar-section-header";

const SidebarSectionGroupBase: FC<ISidebarSectionGroup> = ({
  section,
  activeId,
  onOpen,
  onAction,
}: ISidebarSectionGroup &
  React.ComponentProps<typeof SidebarSectionGroupBase>): React.ReactNode &
  React.JSX.Element => (
  <Animated.View
    layout={SIDEBAR_LAYOUT_TRANSITION}
    entering={SIDEBAR_ENTERING}
    exiting={SIDEBAR_EXITING}
  >
    <SidebarSectionHeader title={section.title} />
    {section.data.map(
      (conversation: TConversation): React.JSX.Element => (
        <Animated.View
          key={conversation.id}
          layout={SIDEBAR_LAYOUT_TRANSITION}
          entering={SIDEBAR_ENTERING}
          exiting={SIDEBAR_EXITING}
        >
          <SidebarItem
            conversation={conversation}
            active={conversation.id === activeId}
            onPress={(): void => onOpen(conversation.id)}
            onAction={(action: string, anchor: TSidebarAnchor | null): void =>
              onAction(conversation, action, anchor)
            }
          />
        </Animated.View>
      ),
    )}
  </Animated.View>
);

const SidebarSectionGroup = registerComponent(
  "SidebarSectionGroup",
  SidebarSectionGroupBase,
);

export { SidebarSectionGroup };
