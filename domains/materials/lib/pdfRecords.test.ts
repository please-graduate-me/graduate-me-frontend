import { describe, expect, it } from 'vitest';
import { samePdfRecord } from './pdfRecords';
import { pdfSelectionToolbarPosition } from './pdfSelection';

const source = {
  kind: 'pdf' as const,
  materialId: 'material-1',
  page: 3,
  version: 2,
  quote: 'Learning opens doors.',
};

describe('PDF 원문에 연결한 개인 기록', () => {
  it('공백 차이는 허용하되 원본 버전·OCR 근거·페이지는 섞지 않는다', () => {
    expect(
      samePdfRecord({ ...source, quote: 'Learning  opens\ndoors.' }, source)
    ).toBe(true);

    expect(samePdfRecord({ ...source, version: 1 }, source)).toBe(false);
    expect(samePdfRecord({ ...source, ocrId: 'ocr-1' }, source)).toBe(false);
    expect(samePdfRecord({ ...source, page: 4 }, source)).toBe(false);
    expect(samePdfRecord(source, { ...source, quote: '' })).toBe(true);

    expect(samePdfRecord({ ...source, materialId: 'other' }, source)).toBe(
      false
    );
  });
});

describe('PDF 선택 도구의 위치', () => {
  it('상단 선택은 아래로 피하고 오른쪽 가장자리에서 페이지 폭을 넘지 않는다', () => {
    const top = pdfSelectionToolbarPosition(
      { x: 0.9, y: 0, width: 0.1, height: 0.03 },
      730,
      930
    );

    expect(top.top).toBeGreaterThan(0.03 * 930);
    expect(top.left + top.width).toBeLessThanOrEqual(730 - 8);

    const bottom = pdfSelectionToolbarPosition(
      { x: 0, y: 0.99, width: 0.1, height: 0.01 },
      200,
      400
    );

    expect(bottom.left).toBeGreaterThanOrEqual(8);
    expect(bottom.left + bottom.width).toBeLessThanOrEqual(192);
    expect(bottom.top + 44).toBeLessThanOrEqual(400);
  });
});
