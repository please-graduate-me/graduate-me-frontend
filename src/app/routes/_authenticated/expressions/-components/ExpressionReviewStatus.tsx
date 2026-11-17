import { Badge } from '@/components/ui/primitives/Badge';
import { RelativeTime } from '@/components/ui/primitives/RelativeTime';
import type { Expression } from '@/domains/expressions/model/contracts';
import {
  reviewStatusLabel,
  reviewStepMax,
} from '@/domains/expressions/lib/reviewSchedule';
import * as styles from './ExpressionReviewStatus.css';

/** 표현의 복습 간격 단계, 다음 복습일과 마지막 자가점검 결과를 한 묶음으로 보여 준다. */
export function ExpressionReviewStatus({
  expression,
}: {
  expression: Expression;
}) {
  const due = expression.reviewIncluded && expression.reviewDue;

  return (
    <div
      className={styles.root}
      aria-label='복습 일정'
      role='group'>
      <div className={styles.row}>
        <Badge tone={due ? 'warning' : 'neutral'}>
          {reviewStatusLabel(expression)}
        </Badge>
        <span className={styles.step}>
          복습 간격 {expression.reviewStep} / {reviewStepMax}단계
        </span>
        <span
          aria-hidden='true'
          className={styles.pips}>
          {Array.from({ length: reviewStepMax }, (_, index) => (
            <span
              key={index}
              className={styles.pip}
              data-filled={index < expression.reviewStep}
            />
          ))}
        </span>
      </div>
      <p className={styles.last}>
        {expression.lastPracticedAt ? (
          <>
            마지막 점검 ·{' '}
            {expression.lastPracticeCorrect ? '기억났어요' : '다시 볼래요'} ·{' '}
            <RelativeTime value={expression.lastPracticedAt} />
          </>
        ) : (
          '아직 자가점검한 기록이 없어요.'
        )}
      </p>
    </div>
  );
}
