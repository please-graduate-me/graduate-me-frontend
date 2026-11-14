import type { Grade } from '@/domains/videos/model/contracts';
import { GraduationStamp } from './GraduationStamp';
import * as styles from './StudyFeedbackSheet.css';

/** 구절 채점 결과를 정답은 청록, 오답은 주황 시트로 알린다. */
export function StudyFeedbackSheet({ grade }: { grade: Grade }) {
  return (
    <div
      role='status'
      className={[
        styles.sheet,
        grade.correct ? styles.correct : styles.wrong,
      ].join(' ')}>
      {grade.correct ? (
        <>
          <GraduationStamp size={56} />
          <p className={[styles.body, styles.message].join(' ')}>
            <strong className={[styles.title, styles.correctTitle].join(' ')}>
              정답이에요.
            </strong>{' '}
            다음 구절로 이동했어요.
          </p>
        </>
      ) : (
        <>
          <span
            aria-hidden='true'
            className={styles.alertMark}>
            !
          </span>
          <div className={styles.body}>
            <p className={styles.title}>
              다른 부분을 확인하고 다시 들어보세요.
            </p>
            <div className={styles.differences}>
              {grade.differences.map((diff, i) => (
                <span
                  key={i}
                  className={[styles.diff, styles[diff.kind]].join(' ')}>
                  {diff.kind === 'match'
                    ? diff.expected
                    : diff.kind === 'missing'
                      ? `누락: ${diff.expected}`
                      : diff.kind === 'extra'
                        ? `추가: ${diff.actual}`
                        : `${diff.actual} → ${diff.expected}`}
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
