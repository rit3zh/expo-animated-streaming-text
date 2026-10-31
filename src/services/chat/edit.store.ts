import { create, type StoreApi, type UseBoundStore } from "zustand";

import type { TEditDraft, TEditStore } from "../interface";

const useEditStore: UseBoundStore<StoreApi<TEditStore>> = create<TEditStore>()(
  (set: StoreApi<TEditStore>["setState"]): TEditStore => ({
    draft: null,
    begin: (draft: TEditDraft): void => set({ draft }),
    cancel: (): void => set({ draft: null }),
  }),
);

export { useEditStore };
