import { router } from "expo-router";

import type { TDrawerNavigation, TSidebarNavigation } from "../interface";

function useSidebarNavigation(navigation: TDrawerNavigation): TSidebarNavigation {
  return {
    openChat: (id: string): void => {
      router.navigate({ pathname: "/chat/[id]", params: { id } });
      navigation.closeDrawer();
    },
    openNewChat: (): void => {
      router.navigate("/");
      navigation.closeDrawer();
    },
  };
}

export { useSidebarNavigation };
