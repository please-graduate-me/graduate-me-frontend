import { Badge } from '@/components/ui/primitives/Badge';
import { Card } from '@/components/ui/primitives/Card';
import type { Assignment } from '@/domains/courses/model/contracts';
import { RelativeTime } from '@/components/ui/primitives/RelativeTime';
import * as styles from './AssignmentSubmission.css';

/** 배열 답안은 빈칸 순서대로 이어 한 줄로 읽게 한다. */
const joinAnswer = (answer: string | string[]) =>
  Array.isArray(answer) ? answer.join(' / ') : answer;

/** 과제 당시 버전의 제출 한 건을 답안별 자동 채점 결과와 함께 보여 준다. */
export function AssignmentSubmission({
  item,
  fresh = false,
}: {
  item: Assignment['submissions'][number];
  fresh?: boolean;
}) {
  return (
    <Card
      as='article'
      className={fresh ? `${styles.card} ${styles.fresh}` : styles.card}>
      <div className={styles.header}>
        <Badge tone={item.late ? 'warning' : 'success'}>
          {item.late ? '기한 후 제출' : '제출 완료'} · 과제 v{item.version}
        </Badge>
        <span className={styles.meta}>
          {item.studentName ?? '내 제출'} ·{' '}
          <RelativeTime value={item.createdAt} /> · 힌트 {item.hintCount ?? 0}회
        </span>
      </div>
      <ol className={styles.answers}>
        {item.answers.map((answer, index) => {
          const result = item.result.find((entry) => entry.id === answer.id);

          return (
            <li
              key={answer.id}
              className={styles.answer}>
              <h3 className={styles.number}>{index + 1}번 답안</h3>
              <span className={styles.text}>{joinAnswer(answer.answer)}</span>
              <Badge
                tone={
                  result?.correct === true
                    ? 'success'
                    : result?.correct === false
                      ? 'warning'
                      : 'neutral'
                }>
                {result?.correct === true
                  ? '정답'
                  : result?.correct === false
                    ? '다시 확인'
                    : '읽기 제출 · 자동 성적 없음'}
              </Badge>
              {result?.expected !== undefined && (
                <span className={styles.expected}>
                  당시 정답:{' '}
                  <span className={styles.expectedValue}>
                    {result.expected === null
                      ? '없음'
                      : joinAnswer(result.expected)}
                  </span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
