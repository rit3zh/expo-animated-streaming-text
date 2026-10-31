import type { FC } from "react";
import { StyleSheet, View } from "react-native";

import { registerComponent } from "@/utils/register-component.util";

import { useFlightStore } from "./bubble-flight.store";
import { FlightGhost } from "./flight-ghost";
import type { IBubbleFlight, TFlight, TFlightStore } from "./interface";

const BubbleFlightBase: FC<IBubbleFlight> = ({
  colors,
}: IBubbleFlight & React.ComponentProps<typeof BubbleFlightBase>): React.ReactNode &
  React.JSX.Element => {
  const flight: TFlight | null = useFlightStore(
    (state: TFlightStore): TFlight | null => state.flight,
  );

  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={StyleSheet.absoluteFill}
    >
      {flight ? <FlightGhost key={flight.id} flight={flight} colors={colors} /> : null}
    </View>
  );
};

const BubbleFlight = registerComponent("BubbleFlight", BubbleFlightBase);

export { BubbleFlight };
