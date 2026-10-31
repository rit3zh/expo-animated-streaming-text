import type { TShimmerGlyph, TShimmerWord } from "../interface";

const splitGlyphs = (text: string): readonly TShimmerWord[] => {
  const chars: string[] = Array.from(text);
  const total: number = Math.max(chars.length, 1);
  const words: TShimmerWord[] = [];
  let glyphs: TShimmerGlyph[] = [];

  chars.forEach((char: string, index: number): void => {
    glyphs.push({ key: `${index}`, char, position: (index + 0.5) / total });
    if (char === " " || index === chars.length - 1) {
      words.push({ key: `${words.length}`, glyphs });
      glyphs = [];
    }
  });

  return words;
};

export { splitGlyphs };
