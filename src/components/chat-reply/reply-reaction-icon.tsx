import type { FC } from "react";
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

import { REPLY_REACTION_TILT } from "@/constants/components/reply-actions.const";
import { registerComponent } from "@/utils/register-component.util";

import { useReactionMotion } from "./hooks/use-reaction-motion";
import type { IReplyReactionIcon, TReactionMotion } from "./interface";
import { ReplyActionIcon } from "./reply-action-icon";

const ReplyReactionIconBase: FC<IReplyReactionIcon> = ({
  name,
  selected,
  colors,
  delay,
}: IReplyReactionIcon & React.ComponentProps<typeof ReplyReactionIconBase>): React.ReactNode &
  React.JSX.Element => {
  const motion: TReactionMotion = useReactionMotion(selected, REPLY_REACTION_TILT[name]);

  return (
    <Animated.View style={motion.frameStyle}>
      <Animated.View style={motion.restStyle}>
        <ReplyActionIcon name={name} color={colors.muted} delay={delay} />
      </Animated.View>
      <Animated.View pointerEvents="none" style={[styles.active, motion.activeStyle]}>
        <ReplyActionIcon name={name} color={colors.text} delay={null} />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  active: { ...StyleSheet.absoluteFill },
});

const ReplyReactionIcon = registerComponent("ReplyReactionIcon", ReplyReactionIconBase);

export { ReplyReactionIcon };
