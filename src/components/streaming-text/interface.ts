import type { ThemedToken, TokensResult } from "@shikijs/core";
import type { LanguageRegistration } from "@shikijs/types";
import type { FlashListProps, FlashListRef } from "@shopify/flash-list";
import {
  type ColorSchemeName,
  type ScrollViewProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import type {
  AnimatedRef,
  CSSAnimationProperties,
  DerivedValue,
} from "react-native-reanimated";

type TSegment = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  strike?: boolean;
  code?: boolean;
  href?: string;
};

type TWord = {
  id: number;
  segments: TSegment[];
};
type TTableRow = { start: number; cells: TWord[][] };
type TAlign = "left" | "right" | "center" | null;
type TBlockBase = { key: string; start: number; end: number };
type TBlock =
  | (TBlockBase & { kind: "paragraph"; words: TWord[] })
  | (TBlockBase & { kind: "heading"; level: number; words: TWord[] })
  | (TBlockBase & { kind: "quote"; words: TWord[] })
  | (TBlockBase & {
      kind: "list-item";
      marker: string;
      checked: boolean | null;
      depth: number;
      words: TWord[];
    })
  | (TBlockBase & { kind: "code"; lang: string; code: string; lines: TWord[] })
  | (TBlockBase & {
      kind: "table";
      align: TAlign[];
      widths: number[];
      rows: TTableRow[];
    })
  | (TBlockBase & { kind: "rule" });
type TBlockKind = TBlock["kind"];
type TCodeBlock = Extract<TBlock, { kind: "code" }>;
type TTableBlock = Extract<TBlock, { kind: "table" }>;
type TParsedMarkdown = {
  blocks: TBlock[];
  total: number;
};
type TParseOptions = { streaming?: boolean };
type TSection = { blocks: TBlock[]; end: number };
type TVisitContext = { depth: number; quote: boolean };
type TSegmentStyle = Omit<TSegment, "text">;

type TDistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;

type TOpener = "**" | "*" | "~~" | "[" | "(";

type TRun = { from: number; start: number; interval: number };

type TTiming = { runs: TRun[] };

type TScheduleState = {
  scheduled: number;
  end: number;
  last: number;
  pace: number;
  timing: TTiming;
};

type TRevealSchedule = { scheduled: number; end: number; timing: TTiming };
type TScheme = ColorSchemeName;
type TPalette = {
  text: string;
  muted: string;
  link: string;
  border: string;
  inlineCode: string;
  codeBlock: string;
  tableHeader: string;
  checkInk: string;
};

type TTextVariant = {
  still: StyleProp<TextStyle>;
  trail: CSSAnimationProperties | undefined;
};
type TTheme = TPalette & {
  scheme: TScheme;
  fade: CSSAnimationProperties;
  body: TTextVariant;
  mutedBody: TTextVariant;
  cell: TTextVariant;
  headerCell: TTextVariant;
  headings: TTextVariant[];
};
type TDelayedAnimation = CSSAnimationProperties & { opacity: number };
type TWordAnimation = {
  fade: TDelayedAnimation | undefined;
  trail: CSSAnimationProperties | undefined;
};
type TThemedToken = ThemedToken;
type TLanguageLoader = () => Promise<{ default: LanguageRegistration[] }>;
type TGrammarState = NonNullable<TokensResult["grammarState"]>;
type TLineEntry = { tokens: TThemedToken[]; state: object };

type TStreamingOptions = {
  wordMs?: number;
  fadeMs?: number;
  trailMs?: number;
  trailColors?: readonly string[] | false;
  streaming?: boolean;
  animate?: boolean;
};

type TStreamingConfig = {
  fadeMs: number;
  trailMs: number;
  trailColors: Record<"light" | "dark", readonly string[]>;
  followGlideMs: number;
  followMaxSpeed: number;
};

type TStreamItem = {
  block: TBlock;
  scheduled: number;
  marginTop: number;
};

type TStreamingMarkdown = {
  items: TStreamItem[];
  theme: TTheme;
  timing: TTiming;
  revealEnd: number;
};

type TScrollHandlers = Pick<
  ScrollViewProps,
  | "onLayout"
  | "onContentSizeChange"
  | "onScrollBeginDrag"
  | "onScrollEndDrag"
  | "onMomentumScrollBegin"
  | "onMomentumScrollEnd"
>;

type TContentPosition = NonNullable<
  FlashListProps<TStreamItem>["maintainVisibleContentPosition"]
>;

type TFollowBottom<T> = {
  ref: AnimatedRef<FlashListRef<T>>;
  props: TScrollHandlers;
};

type TLinkPressHandler = (href: string) => void;

interface IStreamingText extends TStreamingOptions {
  children: string;
  style?: StyleProp<ViewStyle>;
  onLinkPress?: TLinkPressHandler;
}

interface IStreamingTextList
  extends
    TStreamingOptions,
    Omit<FlashListProps<TStreamItem>, "data" | "renderItem" | "children"> {
  children: string;
  follow?: boolean;
  followGlideMs?: number;
  followInset?: DerivedValue<number>;
  onLinkPress?: TLinkPressHandler;
  onRevealEnd?: () => void;
}

interface IBlockView extends TStreamItem {
  timing: TTiming;
  theme: TTheme;
  onLinkPress: TLinkPressHandler;
}

interface ICodeBlock {
  block: TCodeBlock;
  shown: number;
  timing: TTiming;
  delay: number | null;
  theme: TTheme;
  style: ViewStyle;
}

interface ICodeLine {
  line: TWord;
  tokens: TThemedToken[] | undefined;
  timing: TTiming;
  color: string;
}

interface ITableBlock {
  block: TTableBlock;
  scheduled: number;
  timing: TTiming;
  delay: number | null;
  theme: TTheme;
  onLinkPress: TLinkPressHandler;
  style: ViewStyle;
}

interface IWords {
  words: TWord[];
  variant: TTextVariant;
  timing: TTiming;
  theme: TTheme;
  onLinkPress: TLinkPressHandler;
  style?: StyleProp<ViewStyle>;
}

interface IAnimatedWord extends Omit<IWords, "words" | "style"> {
  word: TWord;
}

interface ISegmentText {
  segment: TSegment;
  style: StyleProp<TextStyle>;
  onLinkPress: TLinkPressHandler;
}

export {
  type IAnimatedWord,
  type IBlockView,
  type ICodeBlock,
  type ICodeLine,
  type ISegmentText,
  type IStreamingText,
  type IStreamingTextList,
  type ITableBlock,
  type IWords,
  type TAlign,
  type TBlock,
  type TBlockKind,
  type TCodeBlock,
  type TContentPosition,
  type TDelayedAnimation,
  type TDistributiveOmit,
  type TFollowBottom,
  type TGrammarState,
  type TLanguageLoader,
  type TLineEntry,
  type TLinkPressHandler,
  type TOpener,
  type TPalette,
  type TParsedMarkdown,
  type TParseOptions,
  type TRevealSchedule,
  type TRun,
  type TScheduleState,
  type TScheme,
  type TScrollHandlers,
  type TSection,
  type TSegment,
  type TSegmentStyle,
  type TStreamingMarkdown,
  type TStreamingConfig,
  type TStreamingOptions,
  type TStreamItem,
  type TTableBlock,
  type TTableRow,
  type TTextVariant,
  type TTheme,
  type TThemedToken,
  type TTiming,
  type TVisitContext,
  type TWord,
  type TWordAnimation,
};
