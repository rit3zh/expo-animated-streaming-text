import {
  useReanimatedKeyboardAnimation,
  type ReanimatedContext,
} from "react-native-keyboard-controller";
import { useDerivedValue } from "react-native-reanimated";

import type { TKeyboardInset } from "../interface";

function useKeyboardInset(offset: number): TKeyboardInset {
  const { height }: ReanimatedContext = useReanimatedKeyboardAnimation();

  return useDerivedValue<number>((): number => Math.max(0, -height.get() - offset));
}

export { useKeyboardInset };
