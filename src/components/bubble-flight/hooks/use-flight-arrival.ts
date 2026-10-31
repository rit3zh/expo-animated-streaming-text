import { useEffect, useState } from "react";
import type { ViewStyle } from "react-native";
import type Animated from "react-native-reanimated";
import {
  useAnimatedStyle,
  useSharedValue,
  type AnimatedRef,
  type SharedValue,
} from "react-native-reanimated";

import { useFlightStore } from "../bubble-flight.store";
import type { TFlightArrival, TFlightStore, TFlightViewStyle } from "../interface";
import { matchFlight } from "../utils/flight.util";

function useFlightArrival(ref: AnimatedRef<Animated.View>, text: string): TFlightArrival {
  const [flightId] = useState<number | null>((): number | null =>
    matchFlight(useFlightStore.getState().flight, text),
  );
  const flying: boolean = useFlightStore(
    (state: TFlightStore): boolean => flightId !== null && state.flight?.id === flightId,
  );
  const visible: SharedValue<number> = useSharedValue<number>(flightId === null ? 1 : 0);
  const style: TFlightViewStyle = useAnimatedStyle<ViewStyle>(
    (): ViewStyle => ({ opacity: visible.get() }),
  );

  useEffect((): void => {
    if (flightId !== null) useFlightStore.getState().claim(flightId, { ref, visible });
  }, [flightId, ref, visible]);

  useEffect((): void => {
    if (flightId !== null && !flying) visible.set(1);
  }, [flightId, flying, visible]);

  return { style, arriving: flightId !== null };
}

export { useFlightArrival };
