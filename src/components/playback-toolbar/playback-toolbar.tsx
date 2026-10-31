import type { FC } from "react";
import { Pressable, StyleSheet, Text, View, type PressableStateCallbackType } from "react-native";

import { PLAYBACK_SPEEDS } from "@/constants/components/playback-toolbar.const";
import { registerComponent } from "@/utils/register-component.util";

import type { IPlaybackToolbar } from "./interface";

const PlaybackToolbarBase: FC<IPlaybackToolbar> = ({
  wordMs,
  colors,
  bottom,
  onWordMsChange,
  onReplay,
}: IPlaybackToolbar & React.ComponentProps<typeof PlaybackToolbarBase>): React.ReactNode &
  React.JSX.Element => (
  <View
    style={[styles.toolbar, { bottom, backgroundColor: colors.bar, borderColor: colors.border }]}
  >
    <View style={styles.speeds}>
      {PLAYBACK_SPEEDS.map(
        (ms: number): React.JSX.Element => (
          <Pressable
            key={ms}
            onPress={(): void => onWordMsChange(ms)}
            style={[styles.speed, ms === wordMs && { backgroundColor: colors.active }]}
          >
            <Text
              style={[styles.speedText, { color: ms === wordMs ? colors.text : colors.muted }]}
            >
              {ms}ms
            </Text>
          </Pressable>
        ),
      )}
    </View>
    <Pressable
      onPress={onReplay}
      style={({ pressed }: PressableStateCallbackType) => [
        styles.replay,
        { backgroundColor: colors.text, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <Text style={[styles.replayText, { color: colors.background }]}>Replay</Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  toolbar: {
    position: "absolute",
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 6,
    borderRadius: 22,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
  },
  speeds: { flexDirection: "row", gap: 2 },
  speed: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 16, borderCurve: "continuous" },
  speedText: { fontSize: 13, fontWeight: "600", fontVariant: ["tabular-nums"] },
  replay: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 16, borderCurve: "continuous" },
  replayText: { fontSize: 14, fontWeight: "600" },
});

const PlaybackToolbar = registerComponent("PlaybackToolbar", PlaybackToolbarBase);

export { PlaybackToolbar };
