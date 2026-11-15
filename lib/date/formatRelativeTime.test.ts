import { describe, expect, it } from 'vitest';
import { formatRelativeTime } from './formatRelativeTime';

const now = new Date(2026, 10, 15, 14, 0);
const ago = (ms: number) => new Date(now.getTime() - ms);

describe('지난 활동 시각의 상대 표기', () => {
  it('1분 미만과 미래 시각은 방금 전으로 표시한다', () => {
    expect(formatRelativeTime(ago(30_000), now)).toBe('방금 전');
    expect(formatRelativeTime(ago(-60_000), now)).toBe('방금 전');
  });

  it('1시간 미만은 분, 24시간 미만은 시간 단위로 표시한다', () => {
    expect(formatRelativeTime(ago(12 * 60_000), now)).toBe('12분 전');
    expect(formatRelativeTime(ago(5 * 3_600_000), now)).toBe('5시간 전');
  });

  it('24시간이 지난 전날은 어제, 그보다 이전은 절대 날짜로 표시한다', () => {
    expect(formatRelativeTime(new Date(2026, 10, 14, 9, 0), now)).toBe('어제');

    expect(formatRelativeTime(new Date(2026, 10, 12, 9, 0), now)).toContain(
      '11월 12일'
    );
  });
});
