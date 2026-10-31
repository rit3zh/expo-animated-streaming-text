import type { SFSymbol, SymbolViewProps } from "expo-symbols";
import type { ColorValue, StyleProp, ViewStyle } from "react-native";

import type { ValueOf } from "@/global-ts/value-of";

type TSymbolName = ValueOf<SymbolViewProps, "name">;

type TIconGlyph = Required<
  Pick<Exclude<TSymbolName, SFSymbol>, "ios" | "android">
>;

type TIconName =
  | "book"
  | "check"
  | "chevron-down"
  | "chevron-right"
  | "close"
  | "compose"
  | "ellipsis"
  | "external"
  | "globe"
  | "pin"
  | "plus"
  | "search"
  | "send"
  | "sidebar"
  | "stop";

interface IIcon {
  name: TIconName;
  color: ColorValue;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export { type IIcon, type TIconGlyph, type TIconName, type TSymbolName };
