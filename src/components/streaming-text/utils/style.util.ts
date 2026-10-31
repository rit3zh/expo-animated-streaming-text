import {
  TABLE_JUSTIFY,
  TABLE_MIN_COLUMN_WIDTH,
} from "@/constants/components/streaming-text.const";
import type { TextStyle, ViewStyle } from "react-native";
import type { TAlign, TSegment, TTheme, TThemedToken } from "../interface";

function textDecoration(
  decorations: (string | false | undefined)[],
): TextStyle["textDecorationLine"] {
  const active: string[] = decorations.filter((d): d is string => Boolean(d));
  return active.length
    ? (active.join(" ") as TextStyle["textDecorationLine"])
    : undefined;
}

function segmentStyle(seg: TSegment, theme: TTheme): TextStyle | undefined {
  if (!seg.bold && !seg.italic && !seg.strike && !seg.href) return undefined;
  const decoration: TextStyle["textDecorationLine"] = textDecoration([
    seg.href && "underline",
    seg.strike && "line-through",
  ]);
  return {
    ...(seg.bold && { fontWeight: "600" }),
    ...(seg.italic && { fontStyle: "italic" }),
    ...(decoration && { textDecorationLine: decoration }),
    ...(seg.href && { color: theme.link }),
  };
}

function tokenStyle<T extends TThemedToken>({
  color,
  fontStyle = 0,
}: T): TextStyle {
  if (fontStyle <= 0) return { color };
  return {
    color,
    fontStyle: fontStyle & 1 ? "italic" : undefined,
    fontWeight: fontStyle & 2 ? "700" : undefined,
    textDecorationLine: textDecoration([
      Boolean(fontStyle & 4) && "underline",
      Boolean(fontStyle & 8) && "line-through",
    ]),
  };
}

function justify(align: TAlign | undefined): ViewStyle["justifyContent"] {
  return TABLE_JUSTIFY[align ?? "left"];
}

function fitColumns(widths: readonly number[], available: number): number[] {
  const total: number = widths.reduce((sum: number, w: number): number => sum + w, 0);
  if (available <= 0 || total <= 0) return [...widths];
  const scale: number = available / total;
  return widths.map((w: number): number =>
    Math.floor(scale >= 1 ? w * scale : Math.max(TABLE_MIN_COLUMN_WIDTH, w * scale)),
  );
}

export { fitColumns, justify, segmentStyle, tokenStyle };
