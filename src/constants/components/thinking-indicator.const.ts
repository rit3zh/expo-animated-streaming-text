import { OrbState } from "@mhaadi/thinking-orbs-native";

const THINKING_ORB_STATE: OrbState = "composing" as const;
const THINKING_ORB_SIZE = 20 as const;
const THINKING_LABEL: string = "Thinking";

export { THINKING_LABEL, THINKING_ORB_SIZE, THINKING_ORB_STATE };
