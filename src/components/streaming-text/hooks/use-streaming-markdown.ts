import { useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";

import {
  REVEAL_TAIL_IDLE_MS,
  STREAMING_TEXT_CONFIG,
} from "@/constants/components/streaming-text.const";

import type {
  TBlock,
  TParsedMarkdown,
  TRevealSchedule,
  TStreamingMarkdown,
  TStreamingOptions,
  TStreamItem,
  TTheme,
} from "../interface";
import { warmUpHighlighter } from "../utils/highlighter.util";
import { parseMarkdown } from "../utils/parse-markdown.util";
import { getTheme } from "../utils/theme.util";
import { useRevealSchedule } from "./use-reveal-schedule";

function useStreamingMarkdown<T extends string>(
  text: T,
  {
    wordMs = 16,
    fadeMs = STREAMING_TEXT_CONFIG.fadeMs,
    trailMs = STREAMING_TEXT_CONFIG.trailMs,
    trailColors,
    streaming = false,
    animate = true,
  }: TStreamingOptions,
): TStreamingMarkdown {
  const scheme: "light" | "dark" =
    useColorScheme() === "dark" ? "dark" : "light";
  const theme: TTheme = getTheme(
    scheme,
    trailMs,
    fadeMs,
    trailColors === false
      ? []
      : (trailColors ?? STREAMING_TEXT_CONFIG.trailColors[scheme]),
  );
  const { blocks, total } = useMemo<TParsedMarkdown>(
    (): TParsedMarkdown => parseMarkdown(text, { streaming }),
    [text, streaming],
  );

  useEffect(warmUpHighlighter, []);

  const [released, setReleased] = useState<number>(-1);
  useEffect((): (() => void) | undefined => {
    if (!streaming) return;
    const timer: ReturnType<typeof setTimeout> = setTimeout(
      (): void => setReleased(total),
      REVEAL_TAIL_IDLE_MS,
    );
    return (): void => clearTimeout(timer);
  }, [text, total, streaming]);

  const tailOpen: boolean =
    streaming && released !== total && !/\s$/.test(text);
  const available: number = Math.max(0, total - (tailOpen ? 1 : 0));
  const { scheduled, end, timing }: TRevealSchedule = useRevealSchedule<number>(
    available,
    wordMs,
    animate,
  );

  const items: TStreamItem[] = [];
  for (const block of blocks) {
    if (block.start >= scheduled) break;
    const prev: TBlock | undefined = items.at(-1)?.block;
    items.push({
      block,
      scheduled: Math.min(scheduled, block.end),
      marginTop: prev ? spacing(prev, block) : 0,
    });
  }

  return { items, theme, timing, revealEnd: end };
}

function spacing(prev: TBlock, block: TBlock): number {
  if (block.kind === "heading") return 24;
  if (prev.kind === "heading") return 8;
  if (prev.kind === "list-item" && block.kind === "list-item")
    return block.marker ? 7 : 4;
  return 14;
}

export { useStreamingMarkdown };
