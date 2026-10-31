import * as WebBrowser from "expo-web-browser";

function openLink<T extends string>(href: T): void {
  if (/^https?:\/\//i.test(href)) WebBrowser.openBrowserAsync(href);
}

export { openLink };
