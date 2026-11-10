import type { SourceInput } from '@/domains/materials/model/source';
import type { QuestionSummary } from '../model/contracts';

/** 이전 답변도 현재 원문 버전·발췌와 공개 철회 여부를 확인해 연결한다. */
export function relatedAnsweredQuestions(
  items: QuestionSummary[],
  source: SourceInput
) {
  const quote = source.quote.normalize('NFKC').replace(/\s+/g, '');

  return items
    .filter((item) => {
      if (
        item.revokedAt ||
        (item.status !== 'answered' && !item.resolvedAt) ||
        (item.source.version ?? 1) !== (source.version ?? 1)
      )
        return false;

      const same =
        item.source.kind === 'pdf' && source.kind === 'pdf'
          ? item.source.materialId === source.materialId &&
            item.source.page === source.page &&
            (item.source.ocrId ?? null) === (source.ocrId ?? null)
          : item.source.kind === 'video' &&
            source.kind === 'video' &&
            item.source.videoId === source.videoId &&
            item.source.segmentId === source.segmentId;

      const previous = item.source.quote.normalize('NFKC').replace(/\s+/g, '');

      return (
        same &&
        Boolean(quote) &&
        (previous.includes(quote) || quote.includes(previous))
      );
    })
    .slice(0, 5);
}
