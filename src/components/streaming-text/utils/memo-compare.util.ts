import type { IAnimatedWord, IBlockView, ICodeLine, TSegment, TWord } from "../interface";

function isSameBlockView(a: IBlockView, b: IBlockView): boolean {
  return (
    a.block === b.block &&
    a.scheduled === b.scheduled &&
    a.marginTop === b.marginTop &&
    a.theme === b.theme &&
    a.onLinkPress === b.onLinkPress
  );
}

function isSameCodeLine(a: ICodeLine, b: ICodeLine): boolean {
  return (
    a.tokens === b.tokens &&
    a.color === b.color &&
    a.line.segments[0].text === b.line.segments[0].text
  );
}

function isSameAnimatedWord(a: IAnimatedWord, b: IAnimatedWord): boolean {
  return (
    a.variant === b.variant &&
    a.theme === b.theme &&
    a.onLinkPress === b.onLinkPress &&
    isSameWord(a.word, b.word)
  );
}

function isSameWord(a: TWord, b: TWord): boolean {
  if (a === b) return true;
  if (a.id !== b.id || a.segments.length !== b.segments.length) return false;
  return a.segments.every((s: TSegment, i: number): boolean => {
    const t: TSegment = b.segments[i];
    return (
      s.text === t.text &&
      s.bold === t.bold &&
      s.italic === t.italic &&
      s.strike === t.strike &&
      s.code === t.code &&
      s.href === t.href
    );
  });
}

export { isSameAnimatedWord, isSameBlockView, isSameCodeLine };
