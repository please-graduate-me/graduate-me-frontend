import { describe, expect, it } from 'vitest';
import { expectedXp, nextStepSize } from './expectedXp';

describe('expectedXp', () => {
  it('묶음 XP를 오늘 남은 기본 한도로 자른다', () => {
    expect(expectedXp({ dailyLimit: 100, todayXp: 0 }, 10, nextStepSize)).toBe(
      50
    );

    expect(expectedXp({ dailyLimit: 100, todayXp: 80 }, 10, nextStepSize)).toBe(
      20
    );
  });

  it('한도를 다 쓰면 0을 돌려준다', () => {
    expect(expectedXp({ dailyLimit: 100, todayXp: 100 }, 10)).toBe(0);
    expect(expectedXp({ dailyLimit: 100, todayXp: 130 }, 10)).toBe(0);
  });
});
