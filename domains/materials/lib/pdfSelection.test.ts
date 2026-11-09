import { describe, expect, it } from 'vitest';
import { normalizePdfRects, readPdfSelection } from './pdfSelection';

describe('PDF 선택층 좌표와 인용', () => {
  it('원본 밖으로 나온 선택 상자를 잘라 유효한 비율 좌표만 보존한다', () => {
    expect(
      normalizePdfRects(
        [
          { left: 80, top: 30, width: 50, height: 10 },
          { left: 200, top: 0, width: 10, height: 10 },
        ],
        { left: 0, top: 0, width: 100, height: 100 }
      )
    ).toEqual([
      {
        x: 0.8,
        y: 0.3,
        width: 0.19999999999999996,
        height: 0.10000000000000003,
      },
    ]);
  });

  it('절대 위치 OCR 글자 사이의 실제 공백을 포함해 부분 선택을 유지한다', () => {
    const layer = {
      contains: () => true,
      getBoundingClientRect: () => ({
        left: 0,
        top: 0,
        width: 100,
        height: 100,
      }),
    } as unknown as HTMLElement;

    const selection = {
      rangeCount: 1,
      anchorNode: {},
      focusNode: {},
      toString: () => 'meaningfulphrase',
      getRangeAt: () => ({
        cloneContents: () => ({ textContent: 'meaningful\nphrase' }),
        getClientRects: () => [],
      }),
    } as unknown as Selection;

    expect(readPdfSelection(layer, selection, true)?.quote).toBe(
      'meaningful phrase'
    );
  });
});
