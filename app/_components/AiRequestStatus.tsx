import { Banner } from '@/components/ui/composites/Banner';
import { Text } from '@/components/ui/primitives/Text';
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
          <Banner
            status='error'
            role='alert'
            title={<>저장 결과를 불러오지 못했습니다. {loadError}</>}
          />
          <Button
            variant='ghost'
            size='small'
            disabled={disabled}
            onClick={onReload}>
            저장 결과 다시 조회
          </Button>
          <Text
            as='p'
            className={styles.meta}>
            저장 결과 조회에는 새 AI 호출이 없습니다.
          </Text>
        </div>
      )}
      {error && (
        <Banner
          status='error'
          role='alert'
          title={<>{error}</>}
        />
      )}
      {error && recovery && (
        <div className={styles.stack}>
          <Text
            as='p'
            className={styles.meta}>
            이 생성 요청은 실패로 종료됐습니다. 아래 버튼은 새로 생성하며 AI
            사용량에 포함됩니다.
          </Text>
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
