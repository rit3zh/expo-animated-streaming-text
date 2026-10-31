import { MenuView } from "@expo/ui/community/menu";
import type { FC } from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

import { PressableScale } from "@/components/ui/pressable-scale";
import {
  REPLY_ACTION_ENTER,
  REPLY_ACTION_PRESS_SCALE,
  REPLY_ACTION_PRESS_SPRING,
  REPLY_ACTION_SIZE,
} from "@/constants/components/reply-actions.const";
import { registerComponent } from "@/utils/register-component.util";

import type { IReplyActionButton } from "./interface";

const ReplyActionButtonBase: FC<IReplyActionButton> = ({
  delay,
  label,
  selected,
  onPress,
  menuActions,
  onMenuAction,
  children,
}: IReplyActionButton &
  React.ComponentProps<typeof ReplyActionButtonBase>): React.ReactNode &
  React.JSX.Element => (
  <Animated.View
    style={delay === null ? undefined : { ...REPLY_ACTION_ENTER, animationDelay: delay }}
  >
    {menuActions ? (
      <MenuView
        colorScheme="dark"
        actions={menuActions}
        onPressAction={onMenuAction}
        style={styles.button}
      >
        <View accessible accessibilityRole="button" accessibilityLabel={label} style={styles.button}>
          {children}
        </View>
      </MenuView>
    ) : (
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={selected === undefined ? undefined : { selected }}
        hitSlop={4}
        scale={REPLY_ACTION_PRESS_SCALE}
        spring={REPLY_ACTION_PRESS_SPRING}
        onPress={onPress}
        style={styles.button}
      >
        {children}
      </PressableScale>
    )}
  </Animated.View>
);

const styles = StyleSheet.create({
  button: {
    width: REPLY_ACTION_SIZE,
    height: REPLY_ACTION_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
});

const ReplyActionButton = registerComponent("ReplyActionButton", ReplyActionButtonBase);

export { ReplyActionButton };
