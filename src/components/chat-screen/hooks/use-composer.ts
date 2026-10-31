import { useEffect, useState, type RefObject } from "react";
import type { TextInputInstance } from "react-native";
import { KeyboardController } from "react-native-keyboard-controller";

import { launchFlight, whenFlightEnds } from "@/components/bubble-flight";
import { useEditStore, type TEditDraft, type TEditStore } from "@/services";

import type { TComposer } from "../interface";
import { toComposerTextFrame } from "../utils/composer.util";

function useComposer(
  inputRef: RefObject<TextInputInstance | null>,
  onSubmit: (prompt: string) => void,
  conversationId: string | undefined,
): TComposer {
  const [text, setText] = useState<string>("");
  const prompt: string = text.trim();
  const canSend: boolean = prompt.length > 0;
  const draft: TEditDraft | null = useEditStore((state: TEditStore): TEditDraft | null =>
    state.draft?.conversationId === conversationId ? state.draft : null,
  );

  useEffect(
    (): (() => void) =>
      useEditStore.subscribe((state: TEditStore, previous: TEditStore): void => {
        const next: TEditDraft | null = state.draft;
        if (!next || next === previous.draft || next.conversationId !== conversationId) return;
        setText(next.content);
        inputRef.current?.focus();
      }),
    [conversationId, inputRef],
  );

  const send = (): void => {
    onSubmit(prompt);
    setText("");
    whenFlightEnds((): void => {
      KeyboardController.dismiss().catch((): void => undefined);
    });
  };

  return {
    text,
    editing: draft !== null,
    setText: (next: string): void => {
      setText(next);
      if (!next.trim() && draft) useEditStore.getState().cancel();
    },
    canSend,
    submit: (): void => {
      if (!canSend) return;
      const input: TextInputInstance | null = inputRef.current;
      if (!input) {
        send();
        return;
      }
      input.measure(
        (_x: number, _y: number, width: number, height: number, pageX: number, pageY: number): void => {
          if (width > 0) launchFlight(prompt, toComposerTextFrame(pageX, pageY, width, height));
          send();
        },
      );
    },
  };
}

export { useComposer };
