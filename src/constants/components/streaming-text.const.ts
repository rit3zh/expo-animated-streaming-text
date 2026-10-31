import type {
  TAlign,
  TContentPosition,
  TLanguageLoader,
  TOpener,
  TPalette,
  TScheduleState,
  TScheme,
  TStreamingConfig,
  TTiming,
} from "@/components/streaming-text/interface";
import type { LanguageFn } from "highlight.js";
import hljsBash from "highlight.js/lib/languages/bash";
import hljsCpp from "highlight.js/lib/languages/cpp";
import hljsCss from "highlight.js/lib/languages/css";
import hljsDiff from "highlight.js/lib/languages/diff";
import hljsGo from "highlight.js/lib/languages/go";
import hljsJava from "highlight.js/lib/languages/java";
import hljsJavascript from "highlight.js/lib/languages/javascript";
import hljsJson from "highlight.js/lib/languages/json";
import hljsKotlin from "highlight.js/lib/languages/kotlin";
import hljsPython from "highlight.js/lib/languages/python";
import hljsRuby from "highlight.js/lib/languages/ruby";
import hljsRust from "highlight.js/lib/languages/rust";
import hljsSql from "highlight.js/lib/languages/sql";
import hljsSwift from "highlight.js/lib/languages/swift";
import hljsTypescript from "highlight.js/lib/languages/typescript";
import hljsXml from "highlight.js/lib/languages/xml";
import hljsYaml from "highlight.js/lib/languages/yaml";
import { Platform, type ViewStyle } from "react-native";
import {
  css,
  cubicBezier,
  type CSSAnimationProperties,
  type CSSAnimationTimingFunction,
  type CSSKeyframesRule,
} from "react-native-reanimated";
import { RADIX_GRAY, RADIX_GRAY_ALPHA, RADIX_VIOLET } from "../radix.const";

const STREAMING_TEXT_CONFIG: Required<TStreamingConfig> = {
  fadeMs: 1500,
  trailMs: 2000,
  trailColors: {
    light: ["#8e7fd6", "#8e8e93"],
    dark: [RADIX_VIOLET[11], RADIX_GRAY[11]],
  },
  followGlideMs: 200,
  followMaxSpeed: 2000,
};

const MARKDOWN_FENCE: RegExp = /^\s{0,3}(`{3,}|~{3,})/;
const MARKDOWN_SYNTAX_ONLY_LINE: RegExp = /^\s*(?:[-*+>#=_`|~]+|\d+[.)]?)\s*$/;
const MARKDOWN_BLOCK_START: RegExp = /^\s*(?:[-*+]\s|\d+[.)]\s|#{1,6}\s|>|\|)/;
const MARKDOWN_MAX_CACHED_SECTIONS: number = 400;
const MARKDOWN_CLOSERS: Record<TOpener, string> = {
  "**": "**",
  "*": "*",
  "~~": "~~",
  "[": "](#)",
  "(": ")",
};

const REVEAL_MAX_LAG_MS: number = 500;
const REVEAL_MIN_INTERVAL_MS: number = 4;
const REVEAL_STALL_MS: number = 250;
const REVEAL_PACE_SMOOTHING_MS: number = 400;
const REVEAL_SLACK: number = 1.25;
const REVEAL_SETTLED_AFTER_MS: number = 2000;
const REVEAL_TAIL_IDLE_MS: number = 350;
const REVEAL_EMPTY_TIMING: TTiming = { runs: [] };
const REVEAL_INITIAL_SCHEDULE: TScheduleState = {
  scheduled: 0,
  end: 0,
  last: 0,
  pace: 0,
  timing: REVEAL_EMPTY_TIMING,
};

const FOLLOW_REATTACH_DISTANCE: number = 40;
const FOLLOW_SNAP_STABLE_FRAMES: number = 4;
const FOLLOW_CONTENT_POSITION: TContentPosition = { disabled: true };

const THEME_MONO_FONT: string = Platform.select<string>({
  ios: "Menlo",
  default: "monospace",
});
const THEME_PALETTES: Record<TScheme, TPalette> = {
  light: {
    text: "#1d1d1f",
    muted: "#6e6e73",
    link: "#1d1d1f",
    border: "rgba(60, 60, 67, 0.14)",
    inlineCode: "rgba(118, 118, 128, 0.14)",
    codeBlock: "#f6f6f8",
    tableHeader: "rgba(118, 118, 128, 0.08)",
    checkInk: "#ffffff",
  },
  dark: {
    text: RADIX_GRAY[12],
    muted: RADIX_GRAY[11],
    link: RADIX_GRAY[12],
    border: RADIX_GRAY[6],
    inlineCode: RADIX_GRAY_ALPHA[4],
    codeBlock: RADIX_GRAY[2],
    tableHeader: RADIX_GRAY[3],
    checkInk: RADIX_GRAY[1],
  },
};

const ANIMATION_ENTER_MS: number = 420;
const ANIMATION_FADE_IN: CSSKeyframesRule = css.keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});
const ANIMATION_TRAIL_HOLD: number = 0.45;
const ANIMATION_TRAIL_EASE: CSSAnimationTimingFunction = "ease-in-out";
const ANIMATION_SHARPEN: CSSKeyframesRule | null =
  Platform.OS === "web"
    ? css.keyframes({
        from: { filter: "blur(5px)" },
        to: { filter: "blur(0px)" },
      })
    : null;
const ANIMATION_ENTER_RULE: CSSAnimationProperties = {
  animationName: css.keyframes({
    from: { opacity: 0, transform: [{ scaleX: 0 }] },
    to: { opacity: 1, transform: [{ scaleX: 1 }] },
  }),
  animationDuration: 600,
  animationTimingFunction: cubicBezier(0.33, 1, 0.68, 1),
  animationFillMode: "both",
};

const TABLE_MIN_COLUMN_WIDTH: number = 96;
const TABLE_JUSTIFY: Record<
  NonNullable<TAlign>,
  ViewStyle["justifyContent"]
> = {
  left: "flex-start",
  center: "center",
  right: "flex-end",
};

const HIGHLIGHT_THEMES: Record<TScheme, string> = {
  light: "vitesse-light",
  dark: "vitesse-dark",
};
const HIGHLIGHT_DETECT_LINES: number = 8;
const HIGHLIGHT_MAX_CACHED_LINES: number = 5000;
const HIGHLIGHT_WARM_SAMPLE: string = 'const a = { b: "c", d: [1, 2] }; // e';
const HIGHLIGHT_WARM_LANGUAGES: readonly string[] = [
  "typescript",
  "tsx",
  "javascript",
  "json",
  "bash",
  "python",
];
const HIGHLIGHT_LANGUAGES: Record<string, TLanguageLoader> = {
  typescript: () => import("@shikijs/langs/typescript"),
  tsx: () => import("@shikijs/langs/tsx"),
  javascript: () => import("@shikijs/langs/javascript"),
  jsx: () => import("@shikijs/langs/jsx"),
  json: () => import("@shikijs/langs/json"),
  bash: () => import("@shikijs/langs/bash"),
  python: () => import("@shikijs/langs/python"),
  swift: () => import("@shikijs/langs/swift"),
  kotlin: () => import("@shikijs/langs/kotlin"),
  rust: () => import("@shikijs/langs/rust"),
  go: () => import("@shikijs/langs/go"),
  css: () => import("@shikijs/langs/css"),
  html: () => import("@shikijs/langs/html"),
  markdown: () => import("@shikijs/langs/markdown"),
  yaml: () => import("@shikijs/langs/yaml"),
  sql: () => import("@shikijs/langs/sql"),
  diff: () => import("@shikijs/langs/diff"),
  java: () => import("@shikijs/langs/java"),
  c: () => import("@shikijs/langs/c"),
  cpp: () => import("@shikijs/langs/cpp"),
  ruby: () => import("@shikijs/langs/ruby"),
};
const HIGHLIGHT_ALIASES: Record<string, string> = {
  ts: "typescript",
  js: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  console: "bash",
  py: "python",
  kt: "kotlin",
  rs: "rust",
  golang: "go",
  xml: "html",
  md: "markdown",
  yml: "yaml",
  "c++": "cpp",
  rb: "ruby",
};
const HIGHLIGHT_DETECTABLE: Record<string, LanguageFn> = {
  javascript: hljsJavascript,
  typescript: hljsTypescript,
  json: hljsJson,
  bash: hljsBash,
  python: hljsPython,
  swift: hljsSwift,
  kotlin: hljsKotlin,
  rust: hljsRust,
  go: hljsGo,
  css: hljsCss,
  xml: hljsXml,
  yaml: hljsYaml,
  sql: hljsSql,
  diff: hljsDiff,
  java: hljsJava,
  cpp: hljsCpp,
  ruby: hljsRuby,
};
const HIGHLIGHT_DETECTABLE_NAMES: string[] = Object.keys(HIGHLIGHT_DETECTABLE);

export {
  ANIMATION_ENTER_MS,
  ANIMATION_ENTER_RULE,
  ANIMATION_FADE_IN,
  ANIMATION_SHARPEN,
  ANIMATION_TRAIL_EASE,
  ANIMATION_TRAIL_HOLD,
  FOLLOW_CONTENT_POSITION,
  FOLLOW_REATTACH_DISTANCE,
  FOLLOW_SNAP_STABLE_FRAMES,
  HIGHLIGHT_ALIASES,
  HIGHLIGHT_DETECT_LINES,
  HIGHLIGHT_DETECTABLE,
  HIGHLIGHT_DETECTABLE_NAMES,
  HIGHLIGHT_LANGUAGES,
  HIGHLIGHT_MAX_CACHED_LINES,
  HIGHLIGHT_THEMES,
  HIGHLIGHT_WARM_LANGUAGES,
  HIGHLIGHT_WARM_SAMPLE,
  MARKDOWN_BLOCK_START,
  MARKDOWN_CLOSERS,
  MARKDOWN_FENCE,
  MARKDOWN_MAX_CACHED_SECTIONS,
  MARKDOWN_SYNTAX_ONLY_LINE,
  REVEAL_EMPTY_TIMING,
  REVEAL_INITIAL_SCHEDULE,
  REVEAL_MAX_LAG_MS,
  REVEAL_MIN_INTERVAL_MS,
  REVEAL_PACE_SMOOTHING_MS,
  REVEAL_SETTLED_AFTER_MS,
  REVEAL_SLACK,
  REVEAL_STALL_MS,
  REVEAL_TAIL_IDLE_MS,
  STREAMING_TEXT_CONFIG,
  TABLE_JUSTIFY,
  TABLE_MIN_COLUMN_WIDTH,
  THEME_MONO_FONT,
  THEME_PALETTES,
};
