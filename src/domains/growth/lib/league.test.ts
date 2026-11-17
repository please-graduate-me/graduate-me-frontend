import { describe, expect, it } from 'vitest';
import {
  lastResultLabel,
  membersAroundMe,
  nextTier,
  promotionRule,
  remainingLabel,
  tierState,
} from './league';

const member = (position: number, isMe = false) => ({
  nickname: `n${position}`,
  xp: 100 - position,
  rank: position,
  position,
  isMe,
  zone: 'stay' as const,
});

describe('리그 표시 계산', () => {
  it('다음 등급은 한 단계 위이며 골드에서 멈춘다', () => {
    expect(nextTier('bronze')).toBe('silver');
    expect(nextTier('silver')).toBe('gold');
    expect(nextTier('gold')).toBeNull();
  });

  it('현재 등급 기준으로 방패 상태를 나눈다', () => {
    expect(tierState('bronze', 'silver')).toBe('achieved');
    expect(tierState('silver', 'silver')).toBe('current');
    expect(tierState('gold', 'silver')).toBe('locked');
  });

  it('하루 미만이면 시간으로, 그 외에는 일로 남은 기간을 쓴다', () => {
    expect(remainingLabel(3, 70)).toBe('3일 남음');
    expect(remainingLabel(1, 5)).toBe('5시간 남음');
    expect(remainingLabel(0, 0)).toBe('1시간 남음');
  });

  it('승급 인원이 없으면 최고 리그로 안내한다', () => {
    expect(promotionRule(10)).toBe('상위 10명 승급');
    expect(promotionRule(0)).toBe('최고 리그');
  });

  it('내 앞뒤 한 명씩, 끝이면 같은 쪽 두 명을 고른다', () => {
    const list = [1, 2, 3, 4, 5].map((n) => member(n, n === 3));

    expect(membersAroundMe(list).map((m) => m.position)).toEqual([2, 3, 4]);

    expect(
      membersAroundMe([1, 2, 3].map((n) => member(n, n === 1))).map(
        (m) => m.position
      )
    ).toEqual([1, 2, 3]);

    expect(
      membersAroundMe([1, 2, 3, 4].map((n) => member(n, n === 4))).map(
        (m) => m.position
      )
    ).toEqual([2, 3, 4]);

    expect(membersAroundMe([member(1)])).toEqual([]);
  });

  it('지난주 결과를 등급과 순위로 설명한다', () => {
    expect(
      lastResultLabel({
        weekStart: '2026-11-02',
        tier: 'bronze',
        position: 4,
        result: 'promoted',
      })
    ).toBe('지난주 브론즈 리그 4위로 승급했어요');
  });
});
