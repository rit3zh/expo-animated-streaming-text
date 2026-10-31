import { memo, type FC } from "react";
import { View } from "react-native";

import type { TChatMessage } from "@/services";
import { registerComponent } from "@/utils/register-component.util";

import { ChatMessage } from "./chat-message";
import type { IChatHistory } from "./interface";

const ChatHistoryBase: FC<IChatHistory> = ({
  conversationId,
  messages,
  colors,
}: IChatHistory & React.ComponentProps<typeof ChatHistoryBase>): React.ReactNode &
  React.JSX.Element => (
  <View>
    {messages.map(
      (message: TChatMessage): React.JSX.Element => (
        <ChatMessage
          key={message.id}
          conversationId={conversationId}
          message={message}
          colors={colors}
        />
      ),
    )}
  </View>
);

const ChatHistory = registerComponent("ChatHistory", memo(ChatHistoryBase));

export { ChatHistory };
