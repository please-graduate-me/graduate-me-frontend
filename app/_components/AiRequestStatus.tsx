import { Button } from '@/components/ui/primitives/Button';
import * as styles from '@/lib/styles/workspace.css';

/** 저장 결과 조회 실패와 확정된 생성 실패를 나누어 비용 없는 복구와 새 요청을 안내한다. */
export function AiRequestStatus({
  loadError,
  error,
  recovery,
  disabled,
  allowGeneration,
  onReload,
  onNewRequest,
}: {
  loadError: string;
  error: string;
  recovery?: 'explanation' | 'practice';
  disabled: boolean;
  allowGeneration: boolean;
  onReload: () => void;
  onNewRequest: () => void;
}) {
  return (
    <>
      {loadError && (
        <div className={styles.stack}>
          <p
            role='alert'
            className={styles.error}>
            저장 결과를 불러오지 못했습니다. {loadError}
          </p>
          <Button
            variant='ghost'
            size='small'
            disabled={disabled}
            onClick={onReload}>
            저장 결과 다시 조회
          </Button>
          <p className={styles.meta}>
            저장 결과 조회에는 새 AI 호출이 없습니다.
          </p>
        </div>
      )}
      {error && (
        <p
          role='alert'
          className={styles.error}>
          {error}
        </p>
      )}
      {error && recovery && (
        <div className={styles.stack}>
          <p className={styles.meta}>
            이 생성 요청은 실패로 종료됐습니다. 아래 버튼은 새로 생성하며 AI
            사용량에 포함됩니다.
          </p>
          <Button
            size='small'
            variant='secondary'
            disabled={disabled || !allowGeneration}
            onClick={onNewRequest}>
            {recovery === 'explanation' ? '새 설명 요청' : '새 연습 요청'}
          </Button>
        </div>
      )}
    </>
  );
}
