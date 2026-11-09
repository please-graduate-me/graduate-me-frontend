'use client';
import { Button } from '@/components/ui/primitives/Button';
import * as styles from '@/lib/styles/workspace.css';

/** 세션 만료 후 작성 중인 답안을 둔 채 별도 탭에서 재인증하게 한다. */
export function SessionRecovery() {
  return (
    <div
      className={styles.notice}
      role='status'>
      <p>
        로그인이 만료되었습니다. 이 화면을 유지한 채 새 탭에서 같은 계정으로
        로그인하고, 돌아와 저장이나 제출을 다시 눌러 주세요. 작성 중인 답안은 이
        화면에 남아 있습니다.
      </p>
      <Button
        variant='secondary'
        size='small'
        onClick={() =>
          window.open(
            '/?returnTo=' +
              encodeURIComponent(
                window.location.pathname + window.location.search
              ),
            '_blank',
            'noopener,noreferrer'
          )
        }>
        새 탭에서 로그인
      </Button>
    </div>
  );
}
