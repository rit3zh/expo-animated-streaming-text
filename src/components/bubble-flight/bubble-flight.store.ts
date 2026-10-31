import { create, type StoreApi, type UseBoundStore } from "zustand";

import type { TFlightRect, TFlightStore, TFlightTarget } from "./interface";

const useFlightStore: UseBoundStore<StoreApi<TFlightStore>> = create<TFlightStore>()(
  (set: StoreApi<TFlightStore>["setState"]): TFlightStore => ({
    launches: 0,
    flight: null,
    covering: false,
    launch: (text: string, source: TFlightRect): void =>
      set((state: TFlightStore): Partial<TFlightStore> => ({
        launches: state.launches + 1,
        flight: { id: state.launches + 1, text, source, target: null },
        covering: true,
      })),
    claim: (id: number, target: TFlightTarget): void =>
      set((state: TFlightStore): Partial<TFlightStore> =>
        state.flight?.id === id && !state.flight.target
          ? { flight: { ...state.flight, target } }
          : state,
      ),
    depart: (id: number): void =>
      set((state: TFlightStore): Partial<TFlightStore> =>
        state.flight?.id === id ? { covering: false } : state,
      ),
    end: (id: number): void =>
      set((state: TFlightStore): Partial<TFlightStore> =>
        state.flight?.id === id ? { flight: null, covering: false } : state,
      ),
  }),
);

const launchFlight = (text: string, source: TFlightRect): void =>
  useFlightStore.getState().launch(text, source);

const whenFlightEnds = (callback: () => void): void => {
  const id: number | undefined = useFlightStore.getState().flight?.id;
  if (id === undefined) {
    callback();
    return;
  }
  const unsubscribe: () => void = useFlightStore.subscribe((state: TFlightStore): void => {
    if (state.flight?.id === id) return;
    unsubscribe();
    callback();
  });
};

export { launchFlight, useFlightStore, whenFlightEnds };
