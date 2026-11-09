import { describe, expect, it } from 'vitest';
import { materialPaths } from './paths';

describe('원문 출처 복귀', () => {
  it('영상의 선택 구절과 원문 버전을 유지한다', () => {
    const path = materialPaths.source({
      kind: 'video',
      videoId: 'video-1',
      segmentId: 'segment-3',
      quote: 'a meaningful phrase',
      version: 2,
    });

    const url = new URL(path, 'https://graduate-me.test');

    expect(url.pathname).toBe('/learn/video-1');
    expect(url.searchParams.get('segment')).toBe('segment-3');
    expect(url.searchParams.get('quote')).toBe('a meaningful phrase');
    expect(url.searchParams.get('version')).toBe('2');
  });

  it('PDF 보관본의 페이지와 선택 좌표를 유지한다', () => {
    const rect = { x: 0.1, y: 0.2, width: 0.3, height: 0.05 };

    const url = new URL(
      materialPaths.source({
        kind: 'pdf',
        materialId: 'pdf-1',
        page: 4,
        quote: '문법 개념',
        version: 3,
        rects: [rect],
      }),
      'https://graduate-me.test'
    );

    expect(url.searchParams.get('page')).toBe('4');
    expect(url.searchParams.get('version')).toBe('3');
    expect(JSON.parse(url.searchParams.get('rect')!)).toEqual(rect);
  });
});
