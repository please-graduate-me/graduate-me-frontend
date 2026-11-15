import { Text } from '@/components/ui/primitives/Text';
import {
  formatReviewDay,
  reviewStepMax,
} from '@/domains/expressions/lib/reviewSchedule';
import * as styles from './PracticeReviewResult.css';

/** 방금 점검한 표현이 오른 복습 단계와 다음 복습일을 알린다. */
export function PracticeReviewResult({
  text,
  step,
  nextReviewOn,
}: {
  text: string;
  step: number;
  nextReviewOn: string | null;
}) {
  return (
    <Text
      as='p'
      display='block'
      role='status'
      className={styles.root}>
      <span className={styles.text}>‘{text}’</span> 복습 간격 {step}/
      {reviewStepMax}단계
      {nextReviewOn && ` · 다음 복습 ${formatReviewDay(nextReviewOn)}`}
    </Text>
  );
}
