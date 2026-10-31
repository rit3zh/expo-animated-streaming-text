import type { FC } from "react";
import { StyleSheet, Text } from "react-native";
import Animated from "react-native-reanimated";

import {
  CHAT_REPLY_PROMPT_PADDING_X,
  CHAT_REPLY_PROMPT_PADDING_Y,
  CHAT_REPLY_PROMPT_RADIUS,
  CHAT_REPLY_PROMPT_TEXT,
} from "@/constants/components/chat-reply.const";
import { CHAT_COMPOSER_TEXT } from "@/constants/components/chat-screen.const";
import { registerComponent } from "@/utils/register-component.util";

import { useFlightMotion } from "./hooks/use-flight-motion";
import type { IFlightGhost, TFlightMotion } from "./interface";

const FlightGhostBase: FC<IFlightGhost> = ({
  flight,
  colors,
}: IFlightGhost & React.ComponentProps<typeof FlightGhostBase>): React.ReactNode &
  React.JSX.Element => {
  const motion: TFlightMotion = useFlightMotion(flight);

  return (
    <Animated.View style={[styles.ghost, motion.size, motion.ghost]}>
      <Animated.View style={[styles.fill, { backgroundColor: colors.bubble }, motion.fill]} />
      <Animated.View
        style={[
          styles.source,
          { width: flight.source.width, height: flight.source.height },
          motion.source,
        ]}
      >
        <Text style={[CHAT_COMPOSER_TEXT, { color: colors.text }]}>{flight.text}</Text>
      </Animated.View>
      <Animated.Text
        style={[
          styles.target,
          CHAT_REPLY_PROMPT_TEXT,
          { color: colors.text },
          motion.targetWidth,
          motion.target,
        ]}
      >
        {flight.text}
      </Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  ghost: {
    position: "absolute",
    left: 0,
    top: 0,
    borderRadius: CHAT_REPLY_PROMPT_RADIUS,
    borderCurve: "continuous",
  },
  fill: {
    ...StyleSheet.absoluteFill,
    borderRadius: CHAT_REPLY_PROMPT_RADIUS,
    borderCurve: "continuous",
  },
  source: {
    position: "absolute",
    left: CHAT_REPLY_PROMPT_PADDING_X,
    top: CHAT_REPLY_PROMPT_PADDING_Y,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  target: {
    position: "absolute",
    left: CHAT_REPLY_PROMPT_PADDING_X,
    top: CHAT_REPLY_PROMPT_PADDING_Y,
  },
});

const FlightGhost = registerComponent("FlightGhost", FlightGhostBase);

export { FlightGhost };
