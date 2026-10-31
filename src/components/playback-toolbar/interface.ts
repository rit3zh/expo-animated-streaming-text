import type { TColors } from "@/constants/interface";

interface IPlaybackToolbar {
  wordMs: number;
  colors: TColors;
  bottom: number;
  onWordMsChange: (ms: number) => void;
  onReplay: () => void;
}

export { type IPlaybackToolbar };
