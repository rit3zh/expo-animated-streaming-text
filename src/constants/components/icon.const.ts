import type { TIconGlyph, TIconName } from "@/components/ui/icon/interface";

const ICON_DEFAULT_SIZE: number = 20;

const ICON_GLYPHS: Record<TIconName, TIconGlyph> = {
  book: { ios: "book.pages", android: "menu_book" },
  check: { ios: "checkmark", android: "check" },
  "chevron-down": { ios: "chevron.down", android: "expand_more" },
  "chevron-right": { ios: "chevron.right", android: "chevron_right" },
  close: { ios: "xmark.circle.fill", android: "close" },
  compose: { ios: "square.and.pencil", android: "edit_square" },
  ellipsis: { ios: "ellipsis", android: "more_horiz" },
  external: { ios: "arrow.up.right", android: "open_in_new" },
  globe: { ios: "globe", android: "public" },
  pin: { ios: "pin.fill", android: "push_pin" },
  plus: { ios: "plus", android: "add" },
  search: { ios: "magnifyingglass", android: "search" },
  send: { ios: "arrow.up", android: "arrow_upward" },
  sidebar: { ios: "line.3.horizontal", android: "menu" },
  stop: { ios: "stop.fill", android: "stop" },
};

export { ICON_DEFAULT_SIZE, ICON_GLYPHS };
