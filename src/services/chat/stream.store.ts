import { create, type StoreApi, type UseBoundStore } from "zustand";

import type { TCompletionSnapshot, TStream, TStreamStore } from "../interface";

const useStreamStore: UseBoundStore<StoreApi<TStreamStore>> = create<TStreamStore>()(
  (set: StoreApi<TStreamStore>["setState"]): TStreamStore => ({
    streams: {},
    begin: (conversationId: string, stream: TStream): void =>
      set((state: TStreamStore): Partial<TStreamStore> => ({
        streams: { ...state.streams, [conversationId]: stream },
      })),
    update: (conversationId: string, snapshot: TCompletionSnapshot): void =>
      set((state: TStreamStore): Partial<TStreamStore> => {
        const stream: TStream | undefined = state.streams[conversationId];
        if (!stream) return state;
        return { streams: { ...state.streams, [conversationId]: { ...stream, ...snapshot } } };
      }),
    end: (conversationId: string): void =>
      set((state: TStreamStore): Partial<TStreamStore> => {
        if (!(conversationId in state.streams)) return state;
        const streams: Record<string, TStream> = { ...state.streams };
        delete streams[conversationId];
        return { streams };
      }),
  }),
);

export { useStreamStore };
