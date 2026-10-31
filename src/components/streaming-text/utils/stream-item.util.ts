import type { TBlockKind, TStreamItem } from "../interface";

function getStreamItemKey(item: TStreamItem): string {
  return item.block.key;
}

function getStreamItemType(item: TStreamItem): TBlockKind {
  return item.block.kind;
}

export { getStreamItemKey, getStreamItemType };
