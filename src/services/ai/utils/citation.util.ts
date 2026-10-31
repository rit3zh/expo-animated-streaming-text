import { AI_CITATION_TYPE } from "@/constants/services/ai.const";

import type { TAnnotation, TCitation, TUrlCitation } from "../../interface";

const toCitation = <T extends TAnnotation>(annotation: T): TCitation | null => {
  const source: TUrlCitation | undefined = annotation.url_citation;
  if (annotation.type !== AI_CITATION_TYPE || !source?.url) return null;
  return { url: source.url, title: source.title?.trim() || source.url };
};

const appendCitations = <T extends TCitation>(
  citations: T[],
  incoming: readonly TAnnotation[],
): boolean => {
  let changed: boolean = false;
  for (const annotation of incoming) {
    const citation: TCitation | null = toCitation(annotation);
    if (!citation) continue;
    if (
      citations.some(
        (existing: TCitation): boolean => existing.url === citation.url,
      )
    )
      continue;
    citations.push(citation as T);
    changed = true;
  }
  return changed;
};

export { appendCitations };
