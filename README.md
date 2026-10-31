# expo-animated-streaming-text

Animated Streaming markdown for React Native, with word-by-word fades, a color trail and syntax-highlighted code.

<!-- demo video -->

---

## ⚙️ Installation

```bash
git clone https://github.com/rit3zh/expo-animated-streaming-text
cd expo-animated-streaming-text
bun install
bun start-c
```

Peer dependencies (already set up in this template):

```bash
bunx expo install react-native-reanimated react-native-worklets @shopify/flash-list react-native-keyboard-controller expo-clipboard
bun add unified remark-parse remark-gfm @shikijs/core @shikijs/engine-javascript @shikijs/langs @shikijs/themes highlight.js
```

The component lives in [`src/components/streaming-text`](src/components/streaming-text). Optionally, to let the demo chat app talk to real models, copy `.env.example` to `.env` and add any keys you want. This isn't required:

```bash
EXPO_PUBLIC_OPENROUTER_API_KEY=
EXPO_PUBLIC_GROQ_API_KEY=
EXPO_PUBLIC_DEEPSEEK_API_KEY=
EXPO_PUBLIC_GOOGLE_GEMINI_API_KEY=
```

---

## 🚀 Usage

Pass the markdown as `children`. While `streaming` is `true`, keep appending text and new words fade in as they arrive.

```tsx
import { StreamingText } from "@/components/streaming-text";

export function Reply({
  text,
  streaming,
}: {
  text: string;
  streaming: boolean;
}) {
  return <StreamingText streaming={streaming}>{text}</StreamingText>;
}
```

For a full chat screen, use `StreamingTextList`. It's a `FlashList` that renders each block lazily and follows the bottom while text streams in:

```tsx
import { StreamingTextList } from "@/components/streaming-text";

export function Chat({
  text,
  streaming,
}: {
  text: string;
  streaming: boolean;
}) {
  return (
    <StreamingTextList
      streaming={streaming}
      contentContainerStyle={{ padding: 16 }}
      onRevealEnd={() => console.log("done")}
    >
      {text}
    </StreamingTextList>
  );
}
```

Render already finished messages without the animation:

```tsx
<StreamingText animate={false}>{message.content}</StreamingText>
```

Supports headings, bold, italic, strikethrough, links, inline code, quotes, ordered/unordered/task lists, tables, rules and fenced code blocks (highlighted with Shiki, language auto-detected when the fence has none).

---

## 🧩 API

### `<StreamingText>`

| Prop          | Type                         | Default          | Description                                        |
| ------------- | ---------------------------- | ---------------- | -------------------------------------------------- |
| `children`    | `string`                     | none             | Markdown to render.                                |
| `streaming`   | `boolean`                    | `false`          | Whether more text is still coming.                 |
| `animate`     | `boolean`                    | `true`           | Fade words in. Turn off for history.               |
| `wordMs`      | `number`                     | `16`             | Minimum delay between words (ms).                  |
| `fadeMs`      | `number`                     | `1500`           | Fade-in duration per word (ms).                    |
| `trailMs`     | `number`                     | `2000`           | Duration of the color trail behind new words (ms). |
| `trailColors` | `readonly string[] \| false` | violet → gray    | Trail colors. `false` disables the trail.          |
| `onLinkPress` | `(href: string) => void`     | opens in browser | Called when a link is tapped.                      |
| `style`       | `StyleProp<ViewStyle>`       | none             | Style for the container.                           |

### `<StreamingTextList>`

Accepts every `FlashList` prop (except `data`, `renderItem`, `children`), every `StreamingText` option, plus:

| Prop            | Type                   | Default | Description                                             |
| --------------- | ---------------------- | ------- | ------------------------------------------------------- |
| `follow`        | `boolean`              | `true`  | Auto-scroll to the bottom while streaming.              |
| `followGlideMs` | `number`               | `200`   | How smoothly it glides to the bottom (ms).              |
| `followInset`   | `DerivedValue<number>` | none    | Extra bottom inset to follow, e.g. the keyboard height. |
| `onRevealEnd`   | `() => void`           | none    | Called once the last word has finished revealing.       |

Dragging the list detaches follow mode. Scrolling back near the bottom reattaches it.

### `parseMarkdown(text, options?)`

Parses markdown into the blocks used by the renderer. Pass `{ streaming: true }` to close unfinished syntax (`**`, `` ` ``, `[`) so partial text never flashes raw markers.

### Config

Defaults live in [`streaming-text.const.ts`](src/constants/components/streaming-text.const.ts): fade and trail timing, light/dark palettes, Shiki themes (`vitesse-light` / `vitesse-dark`) and the supported languages.

---

## 🧱 Stack

[Expo SDK 58](https://expo.dev/changelog) · [React Native 0.88](https://reactnative.dev/) · [Reanimated 4](https://docs.swmansion.com/react-native-reanimated/) · [Worklets](https://docs.swmansion.com/react-native-worklets/) · [FlashList](https://shopify.github.io/flash-list/) · [Shiki](https://shiki.style/) · [unified](https://unifiedjs.com/) / [remark-gfm](https://github.com/remarkjs/remark-gfm) · [Keyboard Controller](https://kirillzyusko.github.io/react-native-keyboard-controller/) · [@expo/ui](https://docs.expo.dev/versions/latest/sdk/ui/) · [Zustand](https://zustand.docs.pmnd.rs/) · [Expo Router](https://docs.expo.dev/router/introduction/)

---
