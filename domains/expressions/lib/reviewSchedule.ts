import type { Expression } from '../model/contracts';

/** 복습 간격 단계의 최댓값이며 서버의 1·3·7·14·30일 간격과 같다. */
export const reviewStepMax = 5;

/** 서버가 준 한국 날짜 YYYY-MM-DD를 시간대 변환 없이 M월 D일로 표시한다. */
export function formatReviewDay(day: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(day);

  // 형식이 깨진 값은 Date로 해석하면 하루 밀릴 수 있어 원문 그대로 둔다.
  if (!match) return day;

  return `${Number(match[2])}월 ${Number(match[3])}일`;
}

/** 표현의 복습 일정을 제외·오늘 복습·다음 복습 날짜 중 하나로 요약한다. */
export function reviewStatusLabel(
  expression: Pick<Expression, 'reviewIncluded' | 'reviewDue' | 'nextReviewOn'>
) {
  if (!expression.reviewIncluded) return '복습 제외';
  if (expression.reviewDue || !expression.nextReviewOn) return '오늘 복습';

  return `다음 복습 ${formatReviewDay(expression.nextReviewOn)}`;
}
