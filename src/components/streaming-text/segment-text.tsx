import { registerComponent } from "@/utils/register-component.util";
import type { FC } from "react";
import { Text } from "react-native";
import type { ISegmentText } from "./interface";
const SegmentTextBase: FC<ISegmentText> = ({
  segment: { text, href },
  style,
  onLinkPress,
}: ISegmentText &
  React.ComponentProps<typeof SegmentTextBase>): React.ReactNode &
  React.JSX.Element => (
  <Text style={style} onPress={href ? () => onLinkPress(href) : undefined}>
    {text}
  </Text>
);

const SegmentText = registerComponent("SegmentText", SegmentTextBase);

export { SegmentText };
