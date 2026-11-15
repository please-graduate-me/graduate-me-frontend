import { describe, expect, it } from 'vitest';
import { daysLeftInWeek } from './week';

describe('daysLeftInWeek', () => {
  it('월요일에는 7일, 목요일에는 4일, 일요일에는 1일이 남는다', () => {
    expect(daysLeftInWeek('2026-11-09', '2026-11-09')).toBe(7);
    expect(daysLeftInWeek('2026-11-09', '2026-11-12')).toBe(4);
    expect(daysLeftInWeek('2026-11-09', '2026-11-15')).toBe(1);
  });

  it('형식이 잘못되었거나 다른 주면 null을 돌려준다', () => {
    expect(daysLeftInWeek('bad', '2026-11-09')).toBeNull();
    expect(daysLeftInWeek('2026-11-09', '2026-11-16')).toBeNull();
  });
});
