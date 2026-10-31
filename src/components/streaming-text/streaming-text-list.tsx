import { FOLLOW_CONTENT_POSITION } from "@/constants/components/streaming-text.const";
import { registerComponent } from "@/utils/register-component.util";
import { FlashList } from "@shopify/flash-list";
import { useEffect, type FC } from "react";
import { BlockView } from "./block-view";
import { useFollowBottom } from "./hooks/use-follow-bottom";
import { useStreamingMarkdown } from "./hooks/use-streaming-markdown";
import type {
  IStreamingTextList,
  TFollowBottom,
  TStreamingMarkdown,
  TStreamItem,
} from "./interface";
import { openLink } from "./utils/open-link.util";
import { getStreamItemKey, getStreamItemType } from "./utils/stream-item.util";

const StreamingTextListBase: FC<IStreamingTextList> = ({
  children,
  wordMs,
  fadeMs,
  trailMs,
  trailColors,
  streaming,
  animate,
  follow = true,
  followGlideMs,
  followInset,
  onLinkPress = openLink,
  onRevealEnd,
  ...listProps
}: IStreamingTextList &
  React.ComponentProps<typeof StreamingTextListBase>): React.ReactNode &
  React.JSX.Element => {
  const { items, theme, timing, revealEnd }: TStreamingMarkdown = useStreamingMarkdown(
    children,
    {
      wordMs,
      fadeMs,
      trailMs,
      trailColors,
      streaming,
      animate,
    },
  );
  const { ref, props }: TFollowBottom<TStreamItem> =
    useFollowBottom<TStreamItem>(
      follow,
      listProps,
      followInset,
      streaming,
      followGlideMs,
    );

  useEffect((): (() => void) | undefined => {
    if (streaming || !onRevealEnd) return;
    const timer: ReturnType<typeof setTimeout> = setTimeout(
      onRevealEnd,
      Math.max(0, revealEnd - performance.now()),
    );
    return (): void => clearTimeout(timer);
  }, [streaming, revealEnd, onRevealEnd]);

  return (
    <FlashList<TStreamItem>
      scrollEventThrottle={16}
      maintainVisibleContentPosition={FOLLOW_CONTENT_POSITION}
      {...listProps}
      {...props}
      ref={ref}
      data={items}
      extraData={theme}
      keyExtractor={getStreamItemKey}
      getItemType={getStreamItemType}
      renderItem={({ item }) => (
        <BlockView
          key={item.block.key}
          {...item}
          timing={timing}
          theme={theme}
          onLinkPress={onLinkPress}
        />
      )}
    />
  );
};

const StreamingTextList = registerComponent(
  "StreamingTextList",
  StreamingTextListBase,
);

export { StreamingTextList };
