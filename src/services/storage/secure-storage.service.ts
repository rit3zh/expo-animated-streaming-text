import * as SecureStore from "expo-secure-store";

import type { TChunkedStorage } from "../interface";
import { escapeNonAscii, splitChunks, toChunkKey } from "./utils/chunk.util";

const written: Map<string, string[]> = new Map<string, string[]>();

const read = async (key: string): Promise<string | null> => {
  const header: string | null = await SecureStore.getItemAsync(key);
  const count: number = Number(header);
  if (header === null || !Number.isInteger(count) || count < 0) return null;

  const chunks: (string | null)[] = await Promise.all(
    Array.from(
      { length: count },
      (_: unknown, index: number): Promise<string | null> =>
        SecureStore.getItemAsync(toChunkKey(key, index)),
    ),
  );
  if (chunks.some((chunk: string | null): boolean => chunk === null)) return null;

  const complete: string[] = chunks as string[];
  written.set(key, complete);
  return complete.join("");
};

const write = async (key: string, json: string): Promise<void> => {
  const next: string[] = splitChunks(escapeNonAscii(json));
  const previous: string[] = written.get(key) ?? [];

  await Promise.all(
    next.map(
      (chunk: string, index: number): Promise<void> =>
        chunk === previous[index]
          ? Promise.resolve()
          : SecureStore.setItemAsync(toChunkKey(key, index), chunk),
    ),
  );
  if (next.length !== previous.length || !written.has(key)) {
    await SecureStore.setItemAsync(key, String(next.length));
  }
  await Promise.all(
    previous
      .slice(next.length)
      .map(
        (_: string, offset: number): Promise<void> =>
          SecureStore.deleteItemAsync(toChunkKey(key, next.length + offset)),
      ),
  );
  written.set(key, next);
};

const remove = async (key: string): Promise<void> => {
  const header: string | null = written.has(key)
    ? String(written.get(key)?.length ?? 0)
    : await SecureStore.getItemAsync(key);
  const count: number = Number(header) || 0;

  await Promise.all(
    Array.from(
      { length: count },
      (_: unknown, index: number): Promise<void> =>
        SecureStore.deleteItemAsync(toChunkKey(key, index)),
    ),
  );
  await SecureStore.deleteItemAsync(key);
  written.delete(key);
};

const secureStorage: TChunkedStorage = { read, write, remove };

export { secureStorage };
