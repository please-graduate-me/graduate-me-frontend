import { describe, expect, it } from 'vitest';
import { taggedCountLabel } from './taggedCount';

describe('나를 태그한 글 배지 숫자', () => {
  it('0 이하는 배지를 숨긴다', () => {
    expect(taggedCountLabel(0)).toBeNull();
    expect(taggedCountLabel(-1)).toBeNull();
  });

  it('99까지는 그대로, 그보다 많으면 99+로 표시한다', () => {
    expect(taggedCountLabel(2)).toBe('2');
    expect(taggedCountLabel(99)).toBe('99');
    expect(taggedCountLabel(100)).toBe('99+');
  });
});
