import type { RewardReceipt } from '@/domains/growth/model/contracts';
import type { BooReaction } from '@/domains/growth/model/mascot';

/** 목표와 레벨을 동시에 달성하면 더 큰 성장을 한 번만 축하한다. */
export function rewardReaction(receipt: RewardReceipt): BooReaction {
  if (receipt.level > receipt.previousLevel) return 'levelUp';
  if (receipt.dailyBonus > 0) return 'goal';

  return 'correct';
}
