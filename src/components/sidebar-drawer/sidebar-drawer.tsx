import { usePathname } from "expo-router";
import { useMemo, useRef, useState, type FC, type RefObject } from "react";
import { ScrollView, StyleSheet, View, type ViewInstance } from "react-native";
import {
  useSafeAreaInsets,
  type EdgeInsets,
} from "react-native-safe-area-context";

import { SIDEBAR_PADDING } from "@/constants/components/sidebar-drawer.const";
import { RADIX_GRAY, RADIX_SPACE } from "@/constants/radix.const";
import { useChatStore, type TChatStore, type TConversation } from "@/services";
import { registerComponent } from "@/utils/register-component.util";

import { DeleteDialog } from "./delete-dialog";
import { useSidebarActions } from "./hooks/use-sidebar-actions";
import { useSidebarNavigation } from "./hooks/use-sidebar-navigation";
import type {
  ISidebarDrawer,
  TSidebarActions,
  TSidebarNavigation,
  TSidebarSection,
} from "./interface";
import { SidebarEmpty } from "./sidebar-empty";
import { SidebarFooter } from "./sidebar-footer";
import { SidebarSearch } from "./sidebar-search";
import { SidebarSectionGroup } from "./sidebar-section-group";
import {
  buildSidebarSections,
  getActiveConversationId,
} from "./utils/sidebar-sections.util";

const SidebarDrawerBase: FC<ISidebarDrawer> = ({
  navigation,
}: ISidebarDrawer & React.ComponentProps<typeof SidebarDrawerBase>): React.ReactNode &
  React.JSX.Element => {
  const insets: EdgeInsets = useSafeAreaInsets();
  const pathname: string = usePathname();
  const conversations: TConversation[] = useChatStore(
    (state: TChatStore): TConversation[] => state.conversations,
  );
  const [query, setQuery] = useState<string>("");
  const activeId: string | null = getActiveConversationId(pathname);
  const sections: TSidebarSection[] = useMemo<TSidebarSection[]>(
    (): TSidebarSection[] => buildSidebarSections(conversations, query),
    [conversations, query],
  );
  const nav: TSidebarNavigation = useSidebarNavigation(navigation);
  const containerRef: RefObject<ViewInstance | null> = useRef<ViewInstance>(null);
  const actions: TSidebarActions = useSidebarActions(activeId, containerRef);

  return (
    <View ref={containerRef} collapsable={false} style={[styles.container, { paddingTop: insets.top + RADIX_SPACE[2] }]}>
      <SidebarSearch value={query} onChangeText={setQuery} onNewChat={nav.openNewChat} />

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        {sections.length === 0 ? <SidebarEmpty /> : null}
        {sections.map(
          (section: TSidebarSection): React.JSX.Element => (
            <SidebarSectionGroup
              key={section.key}
              section={section}
              activeId={activeId}
              onOpen={nav.openChat}
              onAction={actions.handleAction}
            />
          ),
        )}
      </ScrollView>

      <SidebarFooter bottomInset={insets.bottom} />

      <DeleteDialog
        conversation={actions.pending}
        anchor={actions.anchor}
        onConfirm={actions.confirmDelete}
        onDismiss={actions.dismissDelete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SIDEBAR_PADDING,
    backgroundColor: RADIX_GRAY[2],
  },
  list: { flex: 1 },
  listContent: { paddingTop: RADIX_SPACE[2], paddingBottom: RADIX_SPACE[4] },
});

const SidebarDrawer = registerComponent("SidebarDrawer", SidebarDrawerBase);

export { SidebarDrawer };
