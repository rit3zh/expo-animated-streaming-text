import type { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";

import { openLink } from "@/components/streaming-text";
import { Icon } from "@/components/ui/icon";
import { PressableScale } from "@/components/ui/pressable-scale";
import {
  CHAT_REPLY_SOURCE_ROW_ANIMATION,
  CHAT_REPLY_SOURCE_ROW_STAGGER_MS,
} from "@/constants/components/chat-reply.const";
import { RADIX_FONT_SIZE, RADIX_GRAY, RADIX_GRAY_ALPHA, RADIX_SPACE } from "@/constants/radix.const";
import { registerComponent } from "@/utils/register-component.util";

import type { ISourceRow } from "./interface";
import { SourceFavicon } from "./source-favicon";
import { toSourceHost } from "./utils/source.util";

const SourceRowBase: FC<ISourceRow> = ({
  citation,
  index,
  colors,
}: ISourceRow & React.ComponentProps<typeof SourceRowBase>): React.ReactNode &
  React.JSX.Element => {
  const host: string = toSourceHost(citation.url);

  return (
    <Animated.View
      style={{
        ...CHAT_REPLY_SOURCE_ROW_ANIMATION,
        animationDelay: index * CHAT_REPLY_SOURCE_ROW_STAGGER_MS,
      }}
    >
      <PressableScale
        accessibilityRole="link"
        accessibilityLabel={`${index + 1}. ${citation.title}`}
        accessibilityHint={host}
        scale={0.98}
        onPress={(): void => openLink(citation.url)}
        style={styles.row}
      >
        <SourceFavicon url={citation.url} colors={colors} />
        <View style={styles.body}>
          <Text numberOfLines={1} style={[styles.title, { color: colors.text }]}>
            {citation.title}
          </Text>
          <Text numberOfLines={1} style={[styles.host, { color: colors.muted }]}>
            {host}
          </Text>
        </View>
        <View style={styles.badge}>
          <Text style={[styles.badgeText, { color: colors.muted }]}>{index + 1}</Text>
        </View>
        <Icon name="external" size={11} color={RADIX_GRAY[8]} />
      </PressableScale>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: RADIX_SPACE[3] - 2,
    paddingVertical: RADIX_SPACE[2],
    paddingHorizontal: RADIX_SPACE[3] - 2,
  },
  body: { flex: 1, gap: 1 },
  title: { fontSize: RADIX_FONT_SIZE[2], fontWeight: "500", letterSpacing: -0.15 },
  host: { fontSize: RADIX_FONT_SIZE[1] - 1 },
  badge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    borderCurve: "continuous",
    backgroundColor: RADIX_GRAY_ALPHA[3],
  },
  badgeText: { fontSize: 11, fontWeight: "600", fontVariant: ["tabular-nums"] },
});

const SourceRow = registerComponent("SourceRow", SourceRowBase);

export { SourceRow };
