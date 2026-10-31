import { toTranscript, type TConversation } from "@/services";
import { Share } from "react-native";

const shareConversation = <T extends TConversation>(conversation: T): void => {
  Share.share({
    title: conversation.title,
    message: toTranscript<TConversation>(conversation),
  }).catch((): void => undefined);
};

export { shareConversation };
