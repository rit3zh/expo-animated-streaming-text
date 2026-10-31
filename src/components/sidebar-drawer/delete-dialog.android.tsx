import { AlertDialog, Host, Text, TextButton } from "@expo/ui/jetpack-compose";
import type { FC } from "react";

import {
  SIDEBAR_DELETE_CANCEL,
  SIDEBAR_DELETE_CONFIRM,
  SIDEBAR_DELETE_MESSAGE,
  SIDEBAR_DELETE_TITLE,
} from "@/constants/components/sidebar-drawer.const";
import { RADIX_RED, RADIX_GRAY } from "@/constants/radix.const";
import { registerComponent } from "@/utils/register-component.util";

import type { IDeleteDialog } from "./interface";

const DeleteDialogBase: FC<IDeleteDialog> = ({
  conversation,
  onConfirm,
  onDismiss,
}: IDeleteDialog & React.ComponentProps<typeof DeleteDialogBase>): React.ReactNode &
  React.JSX.Element => (
  <>
    {conversation ? (
      <Host matchContents colorScheme="dark">
        <AlertDialog
          onDismissRequest={onDismiss}
          colors={{
            containerColor: RADIX_GRAY[2],
            titleContentColor: RADIX_GRAY[12],
            textContentColor: RADIX_GRAY[11],
          }}
        >
          <AlertDialog.Title>
            <Text>{SIDEBAR_DELETE_TITLE}</Text>
          </AlertDialog.Title>
          <AlertDialog.Text>
            <Text>{`“${conversation.title}” — ${SIDEBAR_DELETE_MESSAGE}`}</Text>
          </AlertDialog.Text>
          <AlertDialog.ConfirmButton>
            <TextButton onClick={onConfirm} colors={{ contentColor: RADIX_RED[11] }}>
              <Text>{SIDEBAR_DELETE_CONFIRM}</Text>
            </TextButton>
          </AlertDialog.ConfirmButton>
          <AlertDialog.DismissButton>
            <TextButton onClick={onDismiss} colors={{ contentColor: RADIX_GRAY[12] }}>
              <Text>{SIDEBAR_DELETE_CANCEL}</Text>
            </TextButton>
          </AlertDialog.DismissButton>
        </AlertDialog>
      </Host>
    ) : null}
  </>
);

const DeleteDialog = registerComponent("DeleteDialog", DeleteDialogBase);

export { DeleteDialog };
