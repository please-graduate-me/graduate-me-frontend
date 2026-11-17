import { useQueryClient } from '@tanstack/react-query';
import { useState, type ComponentProps } from 'react';
import { Banner } from '@/components/ui/composites/Banner';
import { Button } from '@/components/ui/primitives/Button';
import { signOut } from '@/domains/auth/api/auth';

/** 세션 폐기와 개인 캐시 제거가 끝난 뒤 로그인 화면으로 이동한다. */
export function AuthButton({
  variant,
  size,
}: {
  variant?: ComponentProps<typeof Button>['variant'];
  size?: ComponentProps<typeof Button>['size'];
}) {
  const client = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function leave() {
    if (busy) return;
    setBusy(true);
    setError('');

    try {
      await signOut();
      client.clear();
      window.location.assign('/login');
    } catch (error) {
      setError((error as Error).message);
      setBusy(false);
    }
  }

  return (
    <>
      <Button
        variant={variant ?? 'secondary'}
        size={size}
        loading={busy}
        disabled={busy}
        onClick={() => void leave()}>
        로그아웃
      </Button>
      {error && (
        <Banner
          status='error'
          role='alert'
          title={error}
        />
      )}
    </>
  );
}
