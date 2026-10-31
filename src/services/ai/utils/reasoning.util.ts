import type { TReasoningDetail } from "../../interface";

const isSameReasoningBlock = (a: TReasoningDetail, b: TReasoningDetail): boolean =>
  a.type === b.type && (a.index ?? 0) === (b.index ?? 0) && (a.id ?? null) === (b.id ?? null);

const joinPart = (a: string | undefined, b: string | undefined): string | undefined =>
  a === undefined && b === undefined ? undefined : `${a ?? ""}${b ?? ""}`;

const appendReasoningDetails = (
  details: TReasoningDetail[],
  incoming: readonly TReasoningDetail[],
): void => {
  for (const next of incoming) {
    const last: TReasoningDetail | undefined = details.at(-1);
    if (!last || !isSameReasoningBlock(last, next)) {
      details.push({ ...next });
      continue;
    }
    details[details.length - 1] = {
      ...last,
      text: joinPart(last.text, next.text),
      summary: joinPart(last.summary, next.summary),
      data: joinPart(last.data, next.data),
      signature: next.signature ?? last.signature,
      format: next.format ?? last.format,
    };
  }
};

const readReasoningText = (incoming: readonly TReasoningDetail[]): string =>
  incoming
    .map((detail: TReasoningDetail): string => detail.text ?? detail.summary ?? "")
    .join("");

export { appendReasoningDetails, readReasoningText };
