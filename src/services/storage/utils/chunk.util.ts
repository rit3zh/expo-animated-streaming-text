import { STORAGE_CHUNK_SIZE, STORAGE_NON_ASCII } from "@/constants/services/storage.const";

const escapeNonAscii = (json: string): string =>
  json.replace(
    STORAGE_NON_ASCII,
    (char: string): string => `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`,
  );

const splitChunks = (value: string): string[] => {
  const chunks: string[] = [];
  for (let i: number = 0; i < value.length; i += STORAGE_CHUNK_SIZE) {
    chunks.push(value.slice(i, i + STORAGE_CHUNK_SIZE));
  }
  return chunks;
};

const toChunkKey = (key: string, index: number): string => `${key}.${index}`;

export { escapeNonAscii, splitChunks, toChunkKey };
