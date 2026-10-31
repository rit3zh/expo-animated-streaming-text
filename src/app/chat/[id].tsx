import { useLocalSearchParams } from "expo-router";
import type { FC } from "react";

import { ChatScreen, type TChatRouteParams } from "@/components/chat-screen";

const Chat: FC = (): React.ReactNode & React.JSX.Element => {
  const { id }: TChatRouteParams = useLocalSearchParams<TChatRouteParams>();

  return <ChatScreen conversationId={id} />;
};

export default Chat;
