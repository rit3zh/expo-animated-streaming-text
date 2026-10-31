import { Easing, type EasingFunction } from "react-native-reanimated";

const SHIMMER_DURATION_MS: number = 2200;
const SHIMMER_SPREAD: number = 0.16;
const SHIMMER_EDGE_FACTOR: number = 3;
const SHIMMER_EASING: EasingFunction = Easing.inOut(Easing.quad);

export { SHIMMER_DURATION_MS, SHIMMER_EASING, SHIMMER_EDGE_FACTOR, SHIMMER_SPREAD };
