import type { FC } from "react";
import { StyleSheet, View } from "react-native";

import { CHAT_REPLY_SOURCE_STACK_LIMIT } from "@/constants/components/chat-reply.const";
import type { TCitation } from "@/services";
import { registerComponent } from "@/utils/register-component.util";

import type { ISourceStack } from "./interface";
import { SourceFavicon } from "./source-favicon";

const SourceStackBase: FC<ISourceStack> = ({
  citations,
  colors,
}: ISourceStack & React.ComponentProps<typeof SourceStackBase>): React.ReactNode &
  React.JSX.Element => (
  <View style={styles.stack}>
    {citations.slice(0, CHAT_REPLY_SOURCE_STACK_LIMIT).map(
      (citation: TCitation, index: number): React.JSX.Element => (
        <SourceFavicon
          key={citation.url}
          url={citation.url}
          colors={colors}
          style={[
            styles.item,
            { borderColor: colors.background, marginLeft: index === 0 ? 0 : -7 },
          ]}
        />
      ),
    )}
  </View>
);

const styles = StyleSheet.create({
  stack: { flexDirection: "row", alignItems: "center" },
  item: { width: 22, height: 22, borderRadius: 11, borderWidth: 2 },
});

const SourceStack = registerComponent("SourceStack", SourceStackBase);

export { SourceStack };
