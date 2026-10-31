import type { FC } from "react";
import { StyleSheet, Text } from "react-native";

import { registerComponent } from "@/utils/register-component.util";

import type { IReplyNotice } from "./interface";

const ReplyNoticeBase: FC<IReplyNotice> = ({
  text,
  colors,
}: IReplyNotice & React.ComponentProps<typeof ReplyNoticeBase>): React.ReactNode &
  React.JSX.Element => (
  <Text selectable style={[styles.notice, { color: colors.muted }]}>
    {text}
  </Text>
);

const styles = StyleSheet.create({
  notice: { marginTop: 6, fontSize: 15, lineHeight: 21 },
});

const ReplyNotice = registerComponent("ReplyNotice", ReplyNoticeBase);

export { ReplyNotice };
