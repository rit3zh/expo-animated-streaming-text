import { useFlightStore } from "../bubble-flight.store";
import type { TFlightStore } from "../interface";

function useFlightCover(): boolean {
  return useFlightStore((state: TFlightStore): boolean => state.covering);
}

export { useFlightCover };
