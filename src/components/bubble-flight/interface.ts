import type { TColors } from "@/constants/interface";
import type { TextStyle, ViewStyle } from "react-native";
import type Animated from "react-native-reanimated";
import type {
  AnimatedRef,
  AnimatedStyle,
  SharedValue,
} from "react-native-reanimated";

type TFlightRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};
type TFlightRange = readonly [number, number];
type TFlightTarget = {
  ref: AnimatedRef<Animated.View>;
  visible: SharedValue<number>;
};
type TFlight = {
  id: number;
  text: string;
  source: TFlightRect;
  target: TFlightTarget | null;
};
type TFlightStore = {
  launches: number;
  flight: TFlight | null;
  covering: boolean;
  launch: (text: string, source: TFlightRect) => void;
  claim: (id: number, target: TFlightTarget) => void;
  depart: (id: number) => void;
  end: (id: number) => void;
};
type TFlightViewStyle = AnimatedStyle<ViewStyle>;
type TFlightTextStyle = AnimatedStyle<TextStyle>;
type TFlightMotion = {
  size: TFlightViewStyle;
  ghost: TFlightViewStyle;
  fill: TFlightViewStyle;
  source: TFlightViewStyle;
  target: TFlightTextStyle;
  targetWidth: TFlightTextStyle;
};
type TFlightArrival = {
  style: TFlightViewStyle;
  arriving: boolean;
};

interface IBubbleFlight {
  colors: TColors;
}

interface IFlightGhost {
  flight: TFlight;
  colors: TColors;
}

export {
  type IBubbleFlight,
  type IFlightGhost,
  type TFlight,
  type TFlightArrival,
  type TFlightMotion,
  type TFlightRange,
  type TFlightRect,
  type TFlightStore,
  type TFlightTarget,
  type TFlightTextStyle,
  type TFlightViewStyle,
};
