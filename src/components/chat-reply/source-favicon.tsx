import { Image } from "expo-image";
import { useState, type FC } from "react";
import { StyleSheet, View } from "react-native";

import { Icon } from "@/components/ui/icon";
import { CHAT_REPLY_SOURCE_FAVICON_SIZE } from "@/constants/components/chat-reply.const";
import { registerComponent } from "@/utils/register-component.util";

import type { ISourceFavicon } from "./interface";
import { toFaviconUrl } from "./utils/source.util";

const SourceFaviconBase: FC<ISourceFavicon> = ({
  url,
  colors,
  style,
}: ISourceFavicon & React.ComponentProps<typeof SourceFaviconBase>): React.ReactNode &
  React.JSX.Element => {
  const [failed, setFailed] = useState<boolean>(false);
  const uri: string | null = toFaviconUrl(url);

  return (
    <View style={[styles.frame, { backgroundColor: colors.active }, style]}>
      {uri && !failed ? (
        <Image
          source={{ uri }}
          contentFit="contain"
          onError={(): void => setFailed(true)}
          style={styles.image}
        />
      ) : (
        <Icon name="globe" size={11} color={colors.muted} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  frame: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 7,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  image: {
    width: CHAT_REPLY_SOURCE_FAVICON_SIZE,
    height: CHAT_REPLY_SOURCE_FAVICON_SIZE,
    borderRadius: 3,
  },
});

const SourceFavicon = registerComponent("SourceFavicon", SourceFaviconBase);

export { SourceFavicon };
