import type { GrowthSummary } from '../model/contracts';

/** 홈 "다음 단계"는 이어서 풀 미완료 구절을 이 개수씩 한 묶음으로 본다. */
export const nextStepSize = 5;

/** 학습 개수만큼의 예상 XP를 오늘 남은 기본 한도로 잘라 실제로 받을 수 있는 값만 보여 준다. */
export function expectedXp(
  summary: Pick<GrowthSummary, 'dailyLimit' | 'todayXp'>,
  perItem: number,
  count = 1
) {
  const left = Math.max(0, summary.dailyLimit - summary.todayXp);

  return Math.max(0, Math.min(perItem * count, left));
}
