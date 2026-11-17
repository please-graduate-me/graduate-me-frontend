import { describe, expect, it } from 'vitest';
import type { RewardReceipt } from '@/domains/growth/model/contracts';
import { rewardReaction } from './rewardReaction';

const receipt: RewardReceipt = {
  id: '62a083d8-b559-4bfb-bb21-ff1eabf46d17',
  xp: 10,
  dailyBonus: 0,
  totalXp: 10,
  previousLevel: 1,
  level: 1,
  levelXp: 10,
  levelTarget: 100,
  dailyCompleted: 1,
  dailyGoal: 3,
};

describe('부의 보상 반응', () => {
  it('학습 보상은 정답 반응을 선택한다', () => {
    expect(rewardReaction(receipt)).toBe('correct');
  });

  it('일일 목표를 달성하면 목표 반응을 선택한다', () => {
    expect(rewardReaction({ ...receipt, dailyBonus: 20 })).toBe('goal');
  });

  it('목표와 레벨을 함께 달성하면 레벨 반응이 우선한다', () => {
    expect(rewardReaction({ ...receipt, dailyBonus: 20, level: 2 })).toBe(
      'levelUp'
    );
  });
});
