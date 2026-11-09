import { describe, expect, it } from 'vitest';
import { safeReturnPath } from './returnPath';

describe('로그인 후 학습 위치 복귀', () => {
  it('공유 위치와 선택 구절을 그대로 복원한다', () => {
    expect(safeReturnPath('/shared/123?version=2')).toBe(
      '/shared/123?version=2'
    );
  });

  it('외부 주소와 경로 해석을 바꾸는 입력을 거부한다', () => {
    for (const value of [
      'https://example.com',
      '//example.com',
      '/\\example.com',
      '/\nexample',
      null,
    ])
      expect(safeReturnPath(value)).toBe('/library');
  });
});
