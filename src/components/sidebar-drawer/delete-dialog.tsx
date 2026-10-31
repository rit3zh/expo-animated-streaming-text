import type { FC } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableStateCallbackType,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import {
  SIDEBAR_DELETE_CANCEL,
  SIDEBAR_DELETE_CONFIRM,
  SIDEBAR_DELETE_MESSAGE,
  SIDEBAR_DELETE_TITLE,
  SIDEBAR_OVERLAY_COLOR,
} from "@/constants/components/sidebar-drawer.const";
import {
  RADIX_FONT_SIZE,
  RADIX_LINE_HEIGHT,
  RADIX_RADIUS,
  RADIX_RED,
  RADIX_GRAY,
  RADIX_GRAY_ALPHA,
  RADIX_SPACE,
  RADIX_WHITE,
} from "@/constants/radix.const";
import { registerComponent } from "@/utils/register-component.util";

import type { IDeleteDialog } from "./interface";

const DeleteDialogBase: FC<IDeleteDialog> = ({
  conversation,
  onConfirm,
  onDismiss,
}: IDeleteDialog & React.ComponentProps<typeof DeleteDialogBase>): React.ReactNode &
  React.JSX.Element => (
  <Modal
    transparent
    animationType="fade"
    visible={conversation !== null}
    onRequestClose={onDismiss}
  >
    <View style={styles.overlay}>
      <View style={styles.content}>
        <Text style={styles.title}>{SIDEBAR_DELETE_TITLE}</Text>
        <Text style={styles.description}>
          {`“${conversation?.title ?? ""}” — ${SIDEBAR_DELETE_MESSAGE}`}
        </Text>
        <View style={styles.actions}>
          <Pressable
            onPress={onDismiss}
            style={({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => [
              styles.button,
              styles.cancel,
              pressed && styles.cancelPressed,
            ]}
          >
            <Text style={styles.cancelText}>{SIDEBAR_DELETE_CANCEL}</Text>
          </Pressable>
          <Pressable
            onPress={onConfirm}
            style={({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => [
              styles.button,
              styles.destructive,
              pressed && styles.destructivePressed,
            ]}
          >
            <Text style={styles.destructiveText}>{SIDEBAR_DELETE_CONFIRM}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: RADIX_SPACE[4],
    backgroundColor: SIDEBAR_OVERLAY_COLOR,
  },
  content: {
    width: "100%",
    maxWidth: 420,
    gap: RADIX_SPACE[3],
    padding: RADIX_SPACE[5],
    borderRadius: RADIX_RADIUS[6],
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: RADIX_GRAY[6],
    backgroundColor: RADIX_GRAY[2],
  },
  title: {
    color: RADIX_GRAY[12],
    fontSize: RADIX_FONT_SIZE[5],
    lineHeight: RADIX_LINE_HEIGHT[5],
    fontWeight: "700",
  },
  description: {
    color: RADIX_GRAY[11],
    fontSize: RADIX_FONT_SIZE[3],
    lineHeight: RADIX_LINE_HEIGHT[3],
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: RADIX_SPACE[3],
    marginTop: RADIX_SPACE[2],
  },
  button: {
    height: 40,
    justifyContent: "center",
    paddingHorizontal: RADIX_SPACE[4],
    borderRadius: RADIX_RADIUS[4],
    borderCurve: "continuous",
  },
  cancel: { backgroundColor: RADIX_GRAY_ALPHA[3] },
  cancelPressed: { backgroundColor: RADIX_GRAY_ALPHA[5] },
  cancelText: { color: RADIX_GRAY[11], fontSize: RADIX_FONT_SIZE[2], fontWeight: "500" },
  destructive: { backgroundColor: RADIX_RED[9] },
  destructivePressed: { backgroundColor: RADIX_RED[10] },
  destructiveText: { color: RADIX_WHITE, fontSize: RADIX_FONT_SIZE[2], fontWeight: "500" },
});

const DeleteDialog = registerComponent("DeleteDialog", DeleteDialogBase);

export { DeleteDialog };
