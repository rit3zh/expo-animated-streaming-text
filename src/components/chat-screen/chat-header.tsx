import { LinearGradient } from "expo-linear-gradient";
import type { FC } from "react";
import { StyleSheet, View } from "react-native";

import { GlassGroup } from "@/components/ui/glass-group";
import {
  CHAT_HEADER_FADE,
  CHAT_HEADER_HEIGHT,
  CHAT_HEADER_NEW_CHAT_LABEL,
  CHAT_HEADER_OPEN_SIDEBAR_LABEL,
  CHAT_HEADER_SIDE_WIDTH,
} from "@/constants/components/chat-screen.const";
import { RADIX_SPACE } from "@/constants/radix.const";
import { registerComponent } from "@/utils/register-component.util";

import { ChatMoreMenu } from "./chat-more-menu";
import { HeaderButton } from "./header-button";
import type { IChatHeader } from "./interface";
import { ModelMenu } from "./model-menu";

const ChatHeaderBase: FC<IChatHeader> = ({
  topInset,
  modelId,
  showMore,
  pinned,
  wordMs,
  dummyResponse,
  onModelChange,
  onOpenSidebar,
  onNewChat,
  onMoreAction,
}: IChatHeader & React.ComponentProps<typeof ChatHeaderBase>): React.ReactNode &
  React.JSX.Element => (
  <View
    pointerEvents="box-none"
    style={[styles.header, { paddingTop: topInset }]}
  >
    <LinearGradient
      pointerEvents="none"
      colors={CHAT_HEADER_FADE}
      style={StyleSheet.absoluteFill}
    />
    <View style={[styles.side, styles.leading]}>
      <HeaderButton
        icon="sidebar"
        label={CHAT_HEADER_OPEN_SIDEBAR_LABEL}
        onPress={onOpenSidebar}
      />
    </View>
    <ModelMenu modelId={modelId} onChange={onModelChange} />
    <GlassGroup style={[styles.side, styles.trailing]}>
      {showMore ? (
        <ChatMoreMenu
          pinned={pinned}
          wordMs={wordMs}
          dummyResponse={dummyResponse}
          onAction={onMoreAction}
        />
      ) : null}
      <HeaderButton
        icon="compose"
        label={CHAT_HEADER_NEW_CHAT_LABEL}
        onPress={onNewChat}
      />
    </GlassGroup>
  </View>
);

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    minHeight: CHAT_HEADER_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: RADIX_SPACE[3],
    paddingBottom: RADIX_SPACE[4],
  },
  side: {
    width: CHAT_HEADER_SIDE_WIDTH,
    flexDirection: "row",
    alignItems: "center",
    gap: RADIX_SPACE[2],
  },
  leading: { justifyContent: "flex-start" },
  trailing: { justifyContent: "flex-end" },
});

const ChatHeader = registerComponent("ChatHeader", ChatHeaderBase);

export { ChatHeader };
