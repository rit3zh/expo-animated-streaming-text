import type { FC } from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import Svg, { Defs, FeGaussianBlur, Filter, Path } from "react-native-svg";

import {
  REPLY_ACTION_BLUR,
  REPLY_ACTION_BLUR_BLEED,
  REPLY_ACTION_FILTER_ID,
  REPLY_ACTION_FOCUS,
  REPLY_ACTION_GLYPHS,
  REPLY_ACTION_ICON_SIZE,
  REPLY_ACTION_SHARPEN,
} from "@/constants/components/reply-actions.const";
import { registerComponent } from "@/utils/register-component.util";

import type { IReplyActionIcon, TReplyActionGlyph } from "./interface";

const BLUR_BOX: number = 24 + REPLY_ACTION_BLUR_BLEED * 2;
const BLUR_SIZE: number = (REPLY_ACTION_ICON_SIZE * BLUR_BOX) / 24;

const ReplyActionIconBase: FC<IReplyActionIcon> = ({
  name,
  color,
  delay,
}: IReplyActionIcon & React.ComponentProps<typeof ReplyActionIconBase>): React.ReactNode &
  React.JSX.Element => {
  const glyph: TReplyActionGlyph = REPLY_ACTION_GLYPHS[name];

  return (
    <View style={styles.frame}>
      <Animated.View
        style={delay === null ? undefined : { ...REPLY_ACTION_FOCUS, animationDelay: delay }}
      >
        <Svg width={REPLY_ACTION_ICON_SIZE} height={REPLY_ACTION_ICON_SIZE} viewBox="0 0 24 24">
          <Path d={glyph.d} fill={color} fillRule={glyph.fillRule} />
        </Svg>
      </Animated.View>
      {delay === null ? null : (
        <Animated.View
          pointerEvents="none"
          style={[styles.blurred, { ...REPLY_ACTION_SHARPEN, animationDelay: delay }]}
        >
          <Svg
            width={BLUR_SIZE}
            height={BLUR_SIZE}
            viewBox={`${-REPLY_ACTION_BLUR_BLEED} ${-REPLY_ACTION_BLUR_BLEED} ${BLUR_BOX} ${BLUR_BOX}`}
          >
            <Defs>
              <Filter id={REPLY_ACTION_FILTER_ID} x="-50%" y="-50%" width="200%" height="200%">
                <FeGaussianBlur stdDeviation={REPLY_ACTION_BLUR} />
              </Filter>
            </Defs>
            <Path
              d={glyph.d}
              fill={color}
              fillRule={glyph.fillRule}
              filter={`url(#${REPLY_ACTION_FILTER_ID})`}
            />
          </Svg>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  frame: { width: REPLY_ACTION_ICON_SIZE, height: REPLY_ACTION_ICON_SIZE },
  blurred: {
    position: "absolute",
    top: (REPLY_ACTION_ICON_SIZE - BLUR_SIZE) / 2,
    left: (REPLY_ACTION_ICON_SIZE - BLUR_SIZE) / 2,
  },
});

const ReplyActionIcon = registerComponent("ReplyActionIcon", ReplyActionIconBase);

export { ReplyActionIcon };
