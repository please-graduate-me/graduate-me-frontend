import { describe, expect, it } from 'vitest';
import { formatReviewDay, reviewStatusLabel } from './reviewSchedule';

describe('표현 복습 일정 표시', () => {
  it('한국 날짜 문자열을 시간대 변환 없이 월·일로 바꾼다', () => {
    expect(formatReviewDay('2026-11-01')).toBe('11월 1일');
    expect(formatReviewDay('2026-01-18')).toBe('1월 18일');
  });

  it('제외, 오늘 복습, 다음 복습 날짜 순서로 상태를 고른다', () => {
    expect(
      reviewStatusLabel({
        reviewIncluded: false,
        reviewDue: true,
        nextReviewOn: '2026-11-15',
      })
    ).toBe('복습 제외');

    expect(
      reviewStatusLabel({
        reviewIncluded: true,
        reviewDue: true,
        nextReviewOn: '2026-11-15',
      })
    ).toBe('오늘 복습');

    expect(
      reviewStatusLabel({
        reviewIncluded: true,
        reviewDue: false,
        nextReviewOn: '2026-11-18',
      })
    ).toBe('다음 복습 11월 18일');
  });
});
