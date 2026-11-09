'use client';
import { Button } from '@/components/ui/primitives/Button';
import * as styles from './AuthButton.css';
import { getCsrfToken, signIn, signOut } from '@/domains/auth/api/auth';
import { videoPaths } from '@/domains/videos/config/paths';
import { useState, type ComponentProps } from 'react';

/** 인증 대기와 실패가 다른 화면의 상태에 영향을 주지 않게 한다. */
export function AuthButton({
  action,
  disabled = false,
  label,
  variant,
}: {
  action: 'signin' | 'signout';
  disabled?: boolean;
  label?: string;
  variant?: ComponentProps<typeof Button>['variant'];
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function authenticate() {
    if (busy) return;
    setBusy(true);
    setError('');

    try {
      const { csrfToken } = await getCsrfToken();

      const callbackUrl = new URL(
        action === 'signin' ? videoPaths.library : videoPaths.home,
        window.location.origin
      ).href;

      const result = await (action === 'signin' ? signIn : signOut)(
        csrfToken,
        callbackUrl
      );

      window.location.assign(result.url);
    } catch (error) {
      setError((error as Error).message);
      setBusy(false);
    }
  }

  return (
    <>
      <Button
        variant={variant ?? (action === 'signout' ? 'secondary' : 'primary')}
        disabled={disabled}
        loading={busy}
        onClick={() => void authenticate()}>
        {busy
          ? '처리 중…'
          : (label ?? (action === 'signin' ? 'Google로 시작하기' : '로그아웃'))}
      </Button>
      {error && (
        <p
          className={styles.error}
          role='alert'>
          {error}
        </p>
      )}
    </>
  );
}
