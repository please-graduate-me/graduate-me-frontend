import { describe, expect, it } from 'vitest';
import { daysUntilDue, dueLabel } from './assignmentDue';

const now = Date.parse('2026-11-15T10:00:00+09:00');

describe('daysUntilDue', () => {
  it('한국 날짜로 같은 날 마감이면 0, 이틀 뒤면 2다', () => {
    expect(daysUntilDue('2026-11-15T23:59:00+09:00', now)).toBe(0);
    expect(daysUntilDue('2026-11-17T09:00:00+09:00', now)).toBe(2);
  });

  it('이미 지난 마감은 음수다', () => {
    expect(daysUntilDue('2026-11-15T09:00:00+09:00', now)).toBe(-1);
  });
});

describe('dueLabel', () => {
  it('남은 날을 알약 문구로 바꾼다', () => {
    expect(dueLabel(-1)).toBe('기한 지남');
    expect(dueLabel(0)).toBe('D-day');
    expect(dueLabel(5)).toBe('D-5');
  });
});
