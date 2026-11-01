'use client';
import { Button } from '@/components/ui/primitives/Button';
import * as styles from './AuthButton.css';
import { getCsrfToken, signIn, signOut } from '@/domains/auth/api/auth';
import { videoPaths } from '@/domains/videos/config/paths';
import { useState } from 'react';
/** 인증 대기와 실패가 다른 화면의 상태에 영향을 주지 않게 한다. */
export function AuthButton({
  action,
  disabled = false,
}: {
  action: 'signin' | 'signout';
  disabled?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function authenticate() {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const { csrfToken } = await getCsrfToken();
      const callbackUrl = new URL(videoPaths.home, window.location.origin).href;
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
        variant={action === 'signout' ? 'secondary' : 'primary'}
        disabled={disabled || busy}
        onClick={() => void authenticate()}>
        {busy
          ? '처리 중…'
          : action === 'signin'
            ? 'Google로 시작하기'
            : '로그아웃'}
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
