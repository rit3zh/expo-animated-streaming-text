import type { TCitation } from "@/services/interface";

const DUMMY_RESPONSE_CONTENT: string = `# How React Native Works Internally

React Native allows developers to build native iOS and Android applications using React and JavaScript while rendering actual native UI components [[1]](https://reactnative.dev/docs/getting-started).

## 1. The New Architecture

React Native introduced a New Architecture to improve performance, rendering, and communication between JavaScript and native code [[2]](https://reactnative.dev/architecture/landing-page).

Its main building blocks are:

- **Fabric:** The new rendering system that manages how React components become native views.
- **JSI:** A lightweight interface that allows JavaScript and C++ to communicate directly.
- **TurboModules:** A modern system for accessing native platform functionality.
- **Hermes:** A JavaScript engine optimised for React Native applications [[3]](https://reactnative.dev/docs/hermes).

## 2. How Rendering Works

When you write a React Native component, several things happen behind the scenes:

1. React creates and reconciles the component tree.
2. The renderer calculates the required UI changes.
3. Fabric creates or updates the native view hierarchy.
4. The platform displays the updated interface.

> **Did you know?** React Native doesn't render your application inside a WebView. It uses native platform views.

## 3. Understanding JSI

JSI (JavaScript Interface) allows JavaScript to interact with C++ objects without relying on the old asynchronous bridge.

For example:

\`\`\`tsx
import { View, Text } from "react-native";

export default function App() {
  return (
    <View>
      <Text>Hello, React Native!</Text>
    </View>
  );
}
\`\`\`

Although this looks like a simple component, React Native coordinates JavaScript execution, layout calculation, and native rendering behind the scenes.

## 4. Old vs New Architecture

| Feature | Old Architecture | New Architecture |
|---|---|---|
| Renderer | Paper | Fabric |
| Native modules | Bridge | TurboModules |
| Communication | Serialized bridge | JSI |
| Layout | Yoga | Yoga |
| JS engine | Multiple options | Hermes supported |

## 5. What Should You Learn?

- [x] React components and reconciliation
- [x] Native rendering fundamentals
- [ ] Writing native modules with Swift and Kotlin
- [ ] Understanding JSI and C++ integration
- [ ] Exploring custom Fabric components

---

For deeper learning, explore the [New Architecture documentation](https://reactnative.dev/architecture/landing-page), [Fabric documentation](https://reactnative.dev/architecture/fabric-renderer), and [TurboModules documentation](https://reactnative.dev/docs/turbo-native-modules-introduction).`;

const DUMMY_RESPONSE_CITATIONS: readonly TCitation[] = [
  { url: "https://reactnative.dev/docs/getting-started", title: "Get Started with React Native" },
  { url: "https://reactnative.dev/architecture/landing-page", title: "About the New Architecture" },
  { url: "https://reactnative.dev/docs/hermes", title: "Using Hermes" },
];

const DUMMY_TOKEN_PATTERN: RegExp = /\s*\S+/g;
const DUMMY_TOKENS_PER_TICK: number = 2;
const DUMMY_TICK_MS: number = 40;
const DUMMY_FINISH_REASON: string = "stop";

export {
  DUMMY_FINISH_REASON,
  DUMMY_RESPONSE_CITATIONS,
  DUMMY_RESPONSE_CONTENT,
  DUMMY_TICK_MS,
  DUMMY_TOKEN_PATTERN,
  DUMMY_TOKENS_PER_TICK,
};
