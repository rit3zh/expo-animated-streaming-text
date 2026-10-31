import {
  MARKDOWN_BLOCK_START,
  MARKDOWN_CLOSERS,
  MARKDOWN_FENCE,
  MARKDOWN_SYNTAX_ONLY_LINE,
} from "@/constants/components/streaming-text.const";

import type { TOpener } from "../interface";

function repairMarkdown(src: string): string {
  let text: string = src;

  const lastBreak: number = text.lastIndexOf("\n");
  if (MARKDOWN_SYNTAX_ONLY_LINE.test(text.slice(lastBreak + 1))) {
    text = text.slice(0, lastBreak + 1);
  }

  let openFence: string | null = null;
  for (const line of text.split("\n")) {
    const m: RegExpExecArray | null = MARKDOWN_FENCE.exec(line);
    if (!m) continue;
    if (!openFence) openFence = m[1];
    else if (m[1][0] === openFence[0] && m[1].length >= openFence.length) openFence = null;
  }
  if (openFence) return `${text}${text.endsWith("\n") ? "" : "\n"}${openFence}`;

  text = holdBackTable(text);
  text = text.replace(/(^|\s)(?:\*{1,3}|~{1,2}|`{1,2}|\[)$/, "$1");
  return closeInline(text);
}

function holdBackTable(text: string): string {
  const lines: string[] = text.split("\n");
  const endsWithBreak: boolean = lines.at(-1) === "";
  if (endsWithBreak) lines.pop();

  let k: number = lines.length;
  while (k > 0 && lines[k - 1].trimStart().startsWith("|")) k--;
  const run: number = lines.length - k;
  const complete: number = endsWithBreak ? run : run - 1;
  if (run === 0 || complete >= 2) return text;
  return lines.slice(0, k).join("\n") + (k > 0 ? "\n" : "");
}

function closeInline(text: string): string {
  const start: number = Math.max(
    text.search(/\n\s*\n(?![\s\S]*\n\s*\n)/) + 1,
    lastLineMatching(text, MARKDOWN_BLOCK_START),
  );
  const tail: string = text
    .slice(start)
    .replace(/^\s*(?:[-*+]|\d+[.)])\s+(?:\[[ xX]\]\s+)?/, "");

  const stack: TOpener[] = [];
  let inCode: boolean = false;

  for (let i = 0; i < tail.length; i++) {
    const c: string = tail[i];
    const next: string | undefined = tail[i + 1];
    const prev: string | undefined = tail[i - 1];

    if (c === "`") {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    if (c === "\\") {
      i++;
      continue;
    }

    if ((c === "*" && next === "*") || (c === "~" && next === "~")) {
      toggle(stack, c === "*" ? "**" : "~~");
      i++;
    } else if (c === "*") {
      const top: TOpener | undefined = stack.at(-1);
      if (top === "*" ? !/\s/.test(prev ?? " ") : !!next && !/\s/.test(next)) toggle(stack, "*");
    } else if (c === "[") {
      stack.push("[");
    } else if (c === "]" && stack.at(-1) === "[") {
      stack.pop();
      if (next === "(") {
        stack.push("(");
        i++;
      }
    } else if (c === ")" && stack.at(-1) === "(") {
      stack.pop();
    }
  }

  let closing: string = inCode ? "`" : "";
  for (let i = stack.length - 1; i >= 0; i--) closing += MARKDOWN_CLOSERS[stack[i]];

  const body: string = text.trimEnd();
  return body + closing + text.slice(body.length);
}

function toggle(stack: TOpener[], marker: TOpener): void {
  const at: number = stack.lastIndexOf(marker);
  if (at === -1) stack.push(marker);
  else stack.splice(at);
}

function lastLineMatching(text: string, re: RegExp): number {
  let pos: number = text.length;
  while (pos > 0) {
    const lineStart: number = text.lastIndexOf("\n", pos - 1) + 1;
    if (re.test(text.slice(lineStart, pos))) return lineStart;
    pos = lineStart - 1;
  }
  return 0;
}

export { repairMarkdown };
