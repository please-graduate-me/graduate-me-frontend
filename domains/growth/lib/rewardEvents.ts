import { rewardReceiptSchema, type RewardReceipt } from '../model/contracts';

/** 전용 학습 화면과 홈이 같은 서버 보상 영수증을 받아 갱신한다. */
export const rewardEventName = 'graduate-me:learning-reward';

/** 재조회와 과거 결과를 제외하고 새 제출 응답의 보상만 알린다. */
export function notifyLearningReward(receipt?: RewardReceipt | null) {
  if (!receipt || typeof window === 'undefined') return;
  const value = rewardReceiptSchema.parse(receipt);

  window.dispatchEvent(new CustomEvent(rewardEventName, { detail: value }));
}
