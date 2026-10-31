import type { Nodes, PhrasingContent, Root, RootContent } from "mdast";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";

import {
  MARKDOWN_FENCE,
  MARKDOWN_MAX_CACHED_SECTIONS,
} from "@/constants/components/streaming-text.const";

import type {
  TBlock,
  TDistributiveOmit,
  TParsedMarkdown,
  TParseOptions,
  TSection,
  TSegment,
  TSegmentStyle,
  TTableRow,
  TVisitContext,
  TWord,
} from "../interface";
import { repairMarkdown } from "./repair-markdown.util";

const processor = unified().use(remarkParse).use(remarkGfm).freeze();
const sectionCache: Map<string, TSection> = new Map<string, TSection>();

function parseMarkdown<T extends string>(
  src: T,
  { streaming = false }: TParseOptions = {},
): TParsedMarkdown {
  const sections: string[] = splitSections(src);
  const blocks: TBlock[] = [];
  let id: number = 0;

  sections.forEach((text: string, i: number): void => {
    const tail: boolean = streaming && i === sections.length - 1;
    const key: string = `${id}:${blocks.length}:${text}`;
    let section: TSection | undefined = tail
      ? undefined
      : sectionCache.get(key);
    if (!section) {
      section = parseSection(
        tail ? repairMarkdown(text) : text,
        id,
        blocks.length,
      );
      if (!tail) {
        if (sectionCache.size >= MARKDOWN_MAX_CACHED_SECTIONS)
          sectionCache.clear();
        sectionCache.set(key, section);
      }
    }
    blocks.push(...section.blocks);
    id = section.end;
  });

  return { blocks, total: id };
}

function splitSections(src: string): string[] {
  const sections: string[] = [];
  let start: number = 0;
  let pos: number = 0;
  let fence: string | null = null;
  let afterBlank: boolean = false;

  for (const line of src.split("\n")) {
    const lineStart: number = pos;
    pos += line.length + 1;
    const marker: string | undefined = MARKDOWN_FENCE.exec(line)?.[1];

    if (fence) {
      if (marker && marker[0] === fence[0] && marker.length >= fence.length)
        fence = null;
      afterBlank = false;
      continue;
    }
    if (afterBlank && lineStart > start && /^\S/.test(line)) {
      sections.push(src.slice(start, lineStart));
      start = lineStart;
    }
    if (marker) fence = marker;
    afterBlank = line.trim() === "";
  }

  sections.push(src.slice(start));
  return sections;
}

function parseSection(
  src: string,
  firstId: number,
  firstBlock: number,
): TSection {
  const tree: Root = processor.parse(src);
  const blocks: TBlock[] = [];
  let id: number = firstId;
  const nextId = (): number => id++;

  const push = (block: TDistributiveOmit<TBlock, "key" | "end">): void => {
    if (id === block.start && block.kind !== "rule") return;
    blocks.push({
      ...block,
      key: `b${firstBlock + blocks.length}`,
      end: id,
    } as TBlock);
  };

  const words = (nodes: PhrasingContent[]): TWord[] =>
    toWords(inline(nodes), nextId);

  const visit = (node: RootContent, ctx: TVisitContext): void => {
    const start: number = id;
    switch (node.type) {
      case "paragraph":
        push({
          kind: ctx.quote ? "quote" : "paragraph",
          start,
          words: words(node.children),
        });
        break;

      case "heading":
        push({
          kind: "heading",
          start,
          level: node.depth,
          words: words(node.children),
        });
        break;

      case "thematicBreak":
        nextId();
        push({ kind: "rule", start });
        break;

      case "blockquote":
        for (const child of node.children)
          visit(child, { ...ctx, quote: true });
        break;

      case "list":
        node.children.forEach((item, i: number): void => {
          const marker: string = node.ordered
            ? `${(node.start ?? 1) + i}.`
            : "•";
          item.children.forEach((child, j: number): void => {
            if (child.type === "paragraph") {
              push({
                kind: "list-item",
                start: id,
                marker: j === 0 ? marker : "",
                checked: j === 0 ? (item.checked ?? null) : null,
                depth: ctx.depth,
                words: words(child.children),
              });
            } else {
              visit(child, {
                ...ctx,
                depth: ctx.depth + (child.type === "list" ? 1 : 0),
              });
            }
          });
        });
        break;

      case "code": {
        if (!node.value) break;
        const lines: TWord[] = node.value.split("\n").map(
          (text: string): TWord => ({
            id: nextId(),
            segments: [{ text, code: true }],
          }),
        );
        push({
          kind: "code",
          start,
          lang: node.lang ?? "",
          code: node.value,
          lines,
        });
        break;
      }

      case "table": {
        const rows: TTableRow[] = node.children.map(
          (row): TTableRow => ({
            start: id,
            cells: row.children.map((cell): TWord[] => words(cell.children)),
          }),
        );
        push({
          kind: "table",
          start,
          align: node.align ?? [],
          widths: columnWidths(node),
          rows,
        });
        break;
      }

      case "html":
        push({
          kind: "paragraph",
          start,
          words: toWords([{ text: node.value }], nextId),
        });
        break;
    }
  };

  for (const node of tree.children) visit(node, { depth: 0, quote: false });

  return { blocks, end: id };
}

function inline(
  nodes: PhrasingContent[],
  style: TSegmentStyle = {},
  out: TSegment[] = [],
): TSegment[] {
  for (const node of nodes) {
    switch (node.type) {
      case "text":
      case "html":
        out.push({ ...style, text: node.value });
        break;
      case "break":
        out.push({ ...style, text: "\n" });
        break;
      case "inlineCode":
        out.push({ ...style, code: true, text: node.value });
        break;
      case "strong":
        inline(node.children, { ...style, bold: true }, out);
        break;
      case "emphasis":
        inline(node.children, { ...style, italic: true }, out);
        break;
      case "delete":
        inline(node.children, { ...style, strike: true }, out);
        break;
      case "link":
        inline(node.children, { ...style, href: node.url }, out);
        break;
      case "linkReference":
        inline(node.children, style, out);
        break;
      case "image":
        out.push({ ...style, text: node.alt ?? "" });
        break;
      case "footnoteReference":
        out.push({ ...style, text: `[${node.label ?? node.identifier}]` });
        break;
    }
  }
  return out;
}

function toWords(segments: TSegment[], nextId: () => number): TWord[] {
  const words: TWord[] = [];
  let current: TSegment[] = [];

  const end = (): void => {
    if (current.length) words.push({ id: nextId(), segments: current });
    current = [];
  };

  for (const seg of segments) {
    if (seg.code) {
      current.push(seg);
      continue;
    }
    for (const part of seg.text.split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s+$/.test(part)) end();
      else current.push({ ...seg, text: part });
    }
  }
  end();
  return words;
}

function columnWidths(table: Extract<Nodes, { type: "table" }>): number[] {
  const widths: number[] = [];
  for (const row of table.children) {
    row.children.forEach((cell, i: number): void => {
      const chars: number = plainText(cell).length;
      widths[i] = Math.max(
        widths[i] ?? 0,
        Math.min(260, Math.max(72, chars * 8.6 + 40)),
      );
    });
  }
  return widths;
}

function plainText(node: Nodes): string {
  if ("value" in node) return node.value;
  if ("children" in node) return node.children.map(plainText).join("");
  return "";
}

export { parseMarkdown };
