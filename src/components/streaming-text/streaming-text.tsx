import { registerComponent } from "@/utils/register-component.util";
import type { FC } from "react";
import { View } from "react-native";
import { BlockView } from "./block-view";
import { useStreamingMarkdown } from "./hooks/use-streaming-markdown";
import type {
  IStreamingText,
  TStreamingMarkdown,
  TStreamItem,
} from "./interface";
import { openLink } from "./utils/open-link.util";

const StreamingTextBase: FC<IStreamingText> = ({
  children,
  style,
  onLinkPress = openLink,
  ...options
}: IStreamingText &
  React.ComponentProps<typeof StreamingTextBase>): React.ReactNode &
  React.JSX.Element => {
  const { items, theme, timing }: TStreamingMarkdown = useStreamingMarkdown(
    children,
    options,
  );

  return (
    <View style={style}>
      {items.map(
        (item: TStreamItem): React.JSX.Element => (
          <BlockView
            key={item.block.key}
            {...item}
            timing={timing}
            theme={theme}
            onLinkPress={onLinkPress}
          />
        ),
      )}
    </View>
  );
};

const StreamingText = registerComponent("StreamingText", StreamingTextBase);

export { StreamingText };
