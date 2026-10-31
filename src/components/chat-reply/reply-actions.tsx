import { useState, type FC } from "react";
import { Share, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

import { Icon } from "@/components/ui/icon";
import {
  REPLY_ACTION_ICON_SIZE,
  REPLY_ACTION_LABELS,
  REPLY_ACTION_SWAP,
  REPLY_ACTIONS_DELAY_MS,
  REPLY_ACTIONS_STAGGER_MS,
} from "@/constants/components/reply-actions.const";
import { registerComponent } from "@/utils/register-component.util";

import { useCopyFeedback } from "./hooks/use-copy-feedback";
import type { IReplyActions, TCopyFeedback, TReplyFeedback } from "./interface";
import { ReplyActionButton } from "./reply-action-button";
import { ReplyActionIcon } from "./reply-action-icon";
import { ReplyReactionIcon } from "./reply-reaction-icon";

const ReplyActionsBase: FC<IReplyActions> = ({
  content,
  animate,
  leadMs,
  colors,
  menuActions,
  onMenuAction,
}: IReplyActions & React.ComponentProps<typeof ReplyActionsBase>): React.ReactNode &
  React.JSX.Element => {
  const [entering] = useState<boolean>(animate);
  const [feedback, setFeedback] = useState<TReplyFeedback>(null);
  const clipboard: TCopyFeedback = useCopyFeedback();
  const delay = (index: number): number | null =>
    entering ? leadMs + REPLY_ACTIONS_DELAY_MS + index * REPLY_ACTIONS_STAGGER_MS : null;
  const toggle = (value: Exclude<TReplyFeedback, null>): void =>
    setFeedback((previous: TReplyFeedback): TReplyFeedback => (previous === value ? null : value));

  return (
    <View accessibilityRole="toolbar" style={styles.row}>
      <ReplyActionButton
        delay={delay(0)}
        label={REPLY_ACTION_LABELS["thumbs-up"]}
        selected={feedback === "up"}
        onPress={(): void => toggle("up")}
      >
        <ReplyReactionIcon
          name="thumbs-up"
          selected={feedback === "up"}
          colors={colors}
          delay={delay(0)}
        />
      </ReplyActionButton>
      <ReplyActionButton
        delay={delay(1)}
        label={REPLY_ACTION_LABELS["thumbs-down"]}
        selected={feedback === "down"}
        onPress={(): void => toggle("down")}
      >
        <ReplyReactionIcon
          name="thumbs-down"
          selected={feedback === "down"}
          colors={colors}
          delay={delay(1)}
        />
      </ReplyActionButton>
      <ReplyActionButton
        delay={delay(2)}
        label={clipboard.copied ? REPLY_ACTION_LABELS.copied : REPLY_ACTION_LABELS.copy}
        onPress={(): void => clipboard.copy(content)}
      >
        <Animated.View
          style={[
            { opacity: clipboard.copied ? 0 : 1, transform: [{ scale: clipboard.copied ? 0.6 : 1 }] },
            REPLY_ACTION_SWAP,
          ]}
        >
          <ReplyActionIcon name="copy" color={colors.muted} delay={delay(2)} />
        </Animated.View>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.swap,
            { opacity: clipboard.copied ? 1 : 0, transform: [{ scale: clipboard.copied ? 1 : 0.6 }] },
            REPLY_ACTION_SWAP,
          ]}
        >
          <Icon name="check" size={REPLY_ACTION_ICON_SIZE - 3} color={colors.text} />
        </Animated.View>
      </ReplyActionButton>
      <ReplyActionButton
        delay={delay(3)}
        label={REPLY_ACTION_LABELS.share}
        onPress={(): void => {
          Share.share({ message: content }).catch((): void => undefined);
        }}
      >
        <ReplyActionIcon name="share" color={colors.muted} delay={delay(3)} />
      </ReplyActionButton>
      <ReplyActionButton
        delay={delay(4)}
        label={REPLY_ACTION_LABELS.more}
        menuActions={menuActions}
        onMenuAction={onMenuAction}
      >
        <ReplyActionIcon name="more" color={colors.muted} delay={delay(4)} />
      </ReplyActionButton>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 2, marginTop: 10, marginLeft: -7 },
  swap: { ...StyleSheet.absoluteFill, alignItems: "center", justifyContent: "center" },
});

const ReplyActions = registerComponent("ReplyActions", ReplyActionsBase);

export { ReplyActions };
