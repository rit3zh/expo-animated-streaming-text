import {
  CHAT_REPLY_SOURCE_FAVICON_PATH,
  CHAT_REPLY_SOURCE_HOST_PREFIX,
  CHAT_REPLY_SOURCE_ORIGIN,
} from "@/constants/components/chat-reply.const";

const toSourceHost = (url: string): string => {
  const match: RegExpMatchArray | null = url.match(/^[a-z][a-z\d+.-]*:\/\/([^/?#:]+)/i);
  const host: string = match?.[1] ?? url;
  return host.replace(CHAT_REPLY_SOURCE_HOST_PREFIX, "");
};

const toFaviconUrl = (url: string): string | null => {
  const origin: string | undefined = url.match(CHAT_REPLY_SOURCE_ORIGIN)?.[1];
  return origin ? `${origin}${CHAT_REPLY_SOURCE_FAVICON_PATH}` : null;
};

export { toFaviconUrl, toSourceHost };
