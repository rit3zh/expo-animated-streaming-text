import {
  Button,
  ConfirmationDialog,
  Host,
  Spacer,
  Text,
} from "@expo/ui/swift-ui";
import { frame } from "@expo/ui/swift-ui/modifiers";
import type { FC } from "react";
import { StyleSheet, type ViewStyle } from "react-native";

import {
  SIDEBAR_DELETE_CANCEL,
  SIDEBAR_DELETE_CONFIRM,
  SIDEBAR_DELETE_MESSAGE,
  SIDEBAR_DELETE_TITLE,
} from "@/constants/components/sidebar-drawer.const";
import { registerComponent } from "@/utils/register-component.util";

import type { IDeleteDialog } from "./interface";

const DeleteDialogBase: FC<IDeleteDialog> = ({
  conversation,
  anchor,
  onConfirm,
  onDismiss,
}: IDeleteDialog & React.ComponentProps<typeof DeleteDialogBase>): React.ReactNode &
  React.JSX.Element => {
  const width: number = anchor?.width ?? 1;
  const height: number = anchor?.height ?? 1;
  const position: ViewStyle = anchor
    ? { left: anchor.x, top: anchor.y, width, height }
    : styles.fallback;

  return (
    <Host colorScheme="dark" pointerEvents="none" style={[styles.anchor, position]}>
      <ConfirmationDialog
        title={SIDEBAR_DELETE_TITLE}
        titleVisibility="visible"
        isPresented={conversation !== null}
        onIsPresentedChange={(presented: boolean): void => {
          if (!presented) onDismiss();
        }}
      >
        <ConfirmationDialog.Trigger>
          <Spacer modifiers={[frame({ width, height })]} />
        </ConfirmationDialog.Trigger>
        <ConfirmationDialog.Actions>
          <Button label={SIDEBAR_DELETE_CONFIRM} role="destructive" onPress={onConfirm} />
          <Button label={SIDEBAR_DELETE_CANCEL} role="cancel" onPress={onDismiss} />
        </ConfirmationDialog.Actions>
        <ConfirmationDialog.Message>
          <Text>{`“${conversation?.title ?? ""}” — ${SIDEBAR_DELETE_MESSAGE}`}</Text>
        </ConfirmationDialog.Message>
      </ConfirmationDialog>
    </Host>
  );
};

const styles = StyleSheet.create({
  anchor: { position: "absolute" },
  fallback: { left: 0, bottom: 0, width: 1, height: 1 },
});

const DeleteDialog = registerComponent("DeleteDialog", DeleteDialogBase);

export { DeleteDialog };
