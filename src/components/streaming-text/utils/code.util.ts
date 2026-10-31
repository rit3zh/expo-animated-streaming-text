import type { TWord } from "../interface";

function joinCodeLines<T extends TWord>(lines: T[], limit: number): string {
  return lines
    .slice(0, limit)
    .map((line: TWord): string => line.segments[0].text)
    .join("\n");
}

export { joinCodeLines };
