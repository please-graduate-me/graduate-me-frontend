import type { SourceInput } from '../model/source';

/** 다른 원본 버전과 OCR 근거를 현재 선택의 기록에 섞지 않는다. */
export function samePdfRecord(value: SourceInput, selected: SourceInput) {
  return (
    value.kind === 'pdf' &&
    selected.kind === 'pdf' &&
    value.materialId === selected.materialId &&
    value.page === selected.page &&
    (value.version ?? 1) === (selected.version ?? 1) &&
    (value.ocrId ?? null) === (selected.ocrId ?? null) &&
    (!selected.quote.trim() ||
      value.quote.normalize('NFKC').replace(/\s+/g, '') ===
        selected.quote.normalize('NFKC').replace(/\s+/g, ''))
  );
}

/** 포인터 이동에는 같은 원본 위치에 이미 저장된 뜻만 사용한다. */
export function pdfMeaningsAt(
  items: { text: string; meaning: string; source: SourceInput }[],
  source: SourceInput,
  x: number,
  y: number
) {
  const matched = items.filter(
    (item) =>
      samePdfRecord(item.source, { ...source, quote: '' }) &&
      item.meaning.trim() &&
      item.source.kind === 'pdf' &&
      item.source.rects?.some(
        (rect) =>
          x >= rect.x &&
          x <= rect.x + rect.width &&
          y >= rect.y &&
          y <= rect.y + rect.height
      )
  );

  return matched
    .filter(
      (item, index) =>
        matched.findIndex(
          (other) => other.text === item.text && other.meaning === item.meaning
        ) === index
    )
    .slice(0, 3)
    .map(({ text, meaning }) => ({ text, meaning }));
}
