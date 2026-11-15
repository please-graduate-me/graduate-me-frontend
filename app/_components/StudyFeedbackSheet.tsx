import type { Ref } from 'react';
import { ResultSheet } from '@/components/ui/composites/ResultSheet';
import { Button } from '@/components/ui/primitives/Button';
import { Icon } from '@/components/ui/primitives/Icon';
import type { Grade } from '@/domains/videos/model/contracts';
import { pop } from '@/lib/styles/motion.css';
import { GraduationStamp } from './GraduationStamp';
import * as styles from './StudyFeedbackSheet.css';

const numberFormat = new Intl.NumberFormat('ko-KR');

/** 구절 채점 결과를 화면 아래에서 올라오는 시트로 알리고 정답이면 계속하기, 오답이면 다시 풀기로 이어 준다. */
export function StudyFeedbackSheet({
  grade,
  xp = 0,
  busy = false,
  continueRef,
  onExplain,
  onContinue,
  onReveal,
  onRetry,
}: {
  grade: Grade;
  xp?: number;
  busy?: boolean;
  continueRef?: Ref<HTMLButtonElement>;
  onExplain?: () => void;
  onContinue: () => void;
  onReveal: () => void;
  onRetry: () => void;
}) {
  if (grade.correct)
    return (
      <ResultSheet
        tone='success'
        media={<GraduationStamp size={68} />}
        title='정답이에요.'
        description={
          // 서버가 실제로 지급한 보상만 표시해 재제출이나 한도 초과 때 가짜 XP가 보이지 않게 한다.
          xp > 0 ? (
            <span className={`${styles.xp} ${pop}`}>
              +{numberFormat.format(xp)} XP
            </span>
          ) : undefined
        }
        actions={
          <>
            {onExplain && (
              <Button
                type='button'
                variant='success-outline'
                size='prominent'
                disabled={busy}
                onClick={onExplain}>
                왜 그럴까요?
              </Button>
            )}
            <Button
              ref={continueRef}
              type='button'
              size='prominent'
              className={styles.primaryAction}
              disabled={busy}
              onClick={onContinue}>
              계속하기
            </Button>
          </>
        }
      />
    );

  return (
    <ResultSheet
      tone='warning'
      media={
        <span className={styles.alertMark}>
          <Icon
            name='circle-alert'
            size={24}
          />
        </span>
      }
      title='다른 부분을 확인하고 다시 들어보세요.'
      description={
        <span className={styles.differences}>
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
        </span>
      }
      actions={
        <>
          <Button
            type='button'
            variant='secondary'
            size='prominent'
            disabled={busy}
            onClick={onReveal}>
            정답 보기
          </Button>
          <Button
            type='button'
            variant='ink'
            size='prominent'
            className={styles.primaryAction}
            disabled={busy}
            onClick={onRetry}>
            다시 풀기
          </Button>
        </>
      }
    />
  );
}
