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
