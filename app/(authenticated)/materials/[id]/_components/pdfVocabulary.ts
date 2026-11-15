import type { MaterialAnalysisResponse } from '@/domains/materials/model/analysis';

/** 문서 정리가 뽑은 핵심 단어·표현 한 개다. */
export type PdfVocabularyItem = NonNullable<
  NonNullable<MaterialAnalysisResponse['analysis']>['overview']
>['vocabulary'][number];

/** 대소문자와 공백 차이 없이 표현을 비교하는 키다. */
export const expressionKey = (text: string) =>
  text.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim();

/** 현재 쪽 단어 중 선택 구절에 들어 있는 것을 고르고, 선택이 없거나 겹치지 않으면 쪽 전체를 쓴다. */
export function passageVocabulary(
  vocabulary: PdfVocabularyItem[],
  page: number,
  quote: string
) {
  const onPage = vocabulary.filter((word) => word.page === page);
  const text = expressionKey(quote);

  if (!text) return onPage;

  const inQuote = onPage.filter(
    (word) =>
      text.includes(expressionKey(word.term)) ||
      text.includes(expressionKey(word.lemma))
  );

  return inQuote.length ? inQuote : onPage;
}
