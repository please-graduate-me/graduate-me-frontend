import type { League, LeagueTier } from '../model/contracts';

/** 리그 등급을 낮은 순서로 나열해 방패 배지와 다음 등급 계산이 같은 순서를 쓴다. */
export const leagueTiers = ['bronze', 'silver', 'gold'] as const;

/** 화면에 보이는 리그 등급 이름이다. */
export const tierLabels: Record<LeagueTier, string> = {
  bronze: '브론즈',
  silver: '실버',
  gold: '골드',
};

/** 한 단계 위 등급이며 최고 등급이면 null이다. */
export function nextTier(tier: LeagueTier): LeagueTier | null {
  return leagueTiers[leagueTiers.indexOf(tier) + 1] ?? null;
}

/** 현재 등급과 비교해 방패를 현재·이미 거친 등급·잠긴 등급으로 나눈다. */
export function tierState(tier: LeagueTier, current: LeagueTier) {
  const diff = leagueTiers.indexOf(tier) - leagueTiers.indexOf(current);

  return diff === 0 ? 'current' : diff < 0 ? 'achieved' : 'locked';
}

/** 정산까지 하루가 안 남으면 시간 단위로 바꿔 "0일 남음" 같은 표기를 피한다. */
export function remainingLabel(daysLeft: number, hoursLeft: number) {
  return hoursLeft < 24
    ? `${Math.max(1, hoursLeft)}시간 남음`
    : `${daysLeft}일 남음`;
}

/** 리그 카드 부제의 승급 규칙이며 최고 등급은 승급 인원이 없다. */
export function promotionRule(promotionSlots: number) {
  return promotionSlots > 0 ? `상위 ${promotionSlots}명 승급` : '최고 리그';
}

/** 리그 순위에서 내 줄과 앞뒤 한 명씩, 끝에 있으면 같은 쪽 두 명을 골라 3줄로 만든다. */
export function membersAroundMe(members: League['members']) {
  const index = members.findIndex((member) => member.isMe);

  if (index < 0) return [];

  const start = Math.max(0, Math.min(index - 1, members.length - 3));

  return members.slice(start, start + 3);
}

/** 지난주 정산 결과를 한 문장으로 바꾼다. */
export function lastResultLabel(result: NonNullable<League['lastResult']>) {
  const tier = tierLabels[result.tier];

  return result.result === 'promoted'
    ? `지난주 ${tier} 리그 ${result.position}위로 승급했어요`
    : result.result === 'demoted'
      ? `지난주 ${tier} 리그 ${result.position}위로 한 단계 내려왔어요`
      : `지난주 ${tier} 리그 ${result.position}위로 등급을 유지했어요`;
}
