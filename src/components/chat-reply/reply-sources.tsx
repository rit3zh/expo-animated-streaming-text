import { memo, useState, type FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";

import { Icon } from "@/components/ui/icon";
import { PressableScale } from "@/components/ui/pressable-scale";
import {
  CHAT_REPLY_SOURCES_ANIMATION,
  CHAT_REPLY_SOURCES_HINT,
  CHAT_REPLY_SOURCES_TITLE,
} from "@/constants/components/chat-reply.const";
import { RADIX_RADIUS, RADIX_SPACE } from "@/constants/radix.const";
import type { TCitation } from "@/services";
import { registerComponent } from "@/utils/register-component.util";

import { useDisclosure } from "./hooks/use-disclosure";
import type { IReplySources, TDisclosure } from "./interface";
import { SourceRow } from "./source-row";
import { SourceStack } from "./source-stack";

const ReplySourcesBase: FC<IReplySources> = ({
  citations,
  colors,
}: IReplySources & React.ComponentProps<typeof ReplySourcesBase>): React.ReactNode &
  React.JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);
  const [reveal, setReveal] = useState<number>(0);
  const disclosure: TDisclosure = useDisclosure(open);

  return (
    <Animated.View style={[styles.container, CHAT_REPLY_SOURCES_ANIMATION]}>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={`${CHAT_REPLY_SOURCES_TITLE}, ${citations.length}`}
        accessibilityHint={CHAT_REPLY_SOURCES_HINT}
        accessibilityState={{ expanded: open }}
        hitSlop={6}
        scale={0.97}
        onPress={(): void => {
          if (!open) setReveal((previous: number): number => previous + 1);
          setOpen(!open);
        }}
        style={styles.header}
      >
        <Icon name="book" size={14} color={colors.muted} />
        <Text style={[styles.title, { color: colors.muted }]}>{CHAT_REPLY_SOURCES_TITLE}</Text>
        <View style={[styles.count, { backgroundColor: colors.active }]}>
          <Text style={[styles.countText, { color: colors.text }]}>{citations.length}</Text>
        </View>
        <SourceStack citations={citations} colors={colors} />
        <Animated.View style={disclosure.chevronStyle}>
          <Icon name="chevron-down" size={11} color={colors.muted} />
        </Animated.View>
      </PressableScale>

      <Animated.View
        pointerEvents={open ? "auto" : "none"}
        accessibilityElementsHidden={!open}
        importantForAccessibility={open ? "auto" : "no-hide-descendants"}
        style={[styles.disclosure, disclosure.contentStyle]}
      >
        <View onLayout={disclosure.onContentLayout} style={styles.measure}>
          <View
            key={reveal}
            style={[styles.list, { backgroundColor: colors.bar, borderColor: colors.border }]}
          >
            {citations.map(
              (citation: TCitation, index: number): React.JSX.Element => (
                <SourceRow key={citation.url} citation={citation} index={index} colors={colors} />
              ),
            )}
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: RADIX_SPACE[3] },
  header: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: RADIX_SPACE[2],
    minHeight: 32,
  },
  title: { fontSize: 14, fontWeight: "500", letterSpacing: -0.1 },
  count: {
    minWidth: 18,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: "center",
    borderRadius: RADIX_RADIUS.full,
  },
  countText: { fontSize: 11, fontWeight: "600", fontVariant: ["tabular-nums"] },
  disclosure: { overflow: "hidden" },
  measure: { position: "absolute", top: 0, left: 0, right: 0, paddingTop: RADIX_SPACE[2] },
  list: {
    paddingVertical: RADIX_SPACE[1],
    borderRadius: RADIX_RADIUS[6],
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
});

const ReplySources = registerComponent("ReplySources", memo(ReplySourcesBase));

export { ReplySources };
