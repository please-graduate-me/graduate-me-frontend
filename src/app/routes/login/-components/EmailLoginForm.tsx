import { useEffect, useState, type FormEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/primitives/Input';
import { Button } from '@/components/ui/primitives/Button';
import { Text } from '@/components/ui/primitives/Text';
import { Banner } from '@/components/ui/composites/Banner';
import { requestEmailCode, verifyEmailCode } from '@/domains/auth/api/auth';
import { schoolEmailSchema } from '@/domains/auth/model/contracts';
import { safeReturnPath } from '@/domains/auth/lib/returnPath';
import * as styles from './EmailLoginForm.css';

type Challenge = Awaited<ReturnType<typeof requestEmailCode>> & {
  email: string;
};

/** 이메일 입력과 코드 확인을 분리하고 재발송은 사용자가 누를 때만 요청한다. */
export function EmailLoginForm({
  configured,
  returnTo,
}: {
  configured: boolean;
  returnTo: string;
}) {
  const client = useQueryClient();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [now, setNow] = useState(() => Date.now());
  const [resendAt, setResendAt] = useState(0);

  useEffect(() => {
    if (!challenge) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);

    return () => clearInterval(timer);
  }, [challenge]);

  const remaining = Math.max(0, Math.ceil((resendAt - now) / 1000));

  const expired = challenge
    ? now >= new Date(challenge.expiresAt).getTime()
    : false;

  async function send() {
    if (busy || !configured || remaining > 0) return;
    const parsed = schoolEmailSchema.safeParse(email);

    if (!parsed.success) {
      setError('한국외국어대학교 이메일(@hufs.ac.kr)을 입력해 주세요.');

      return;
    }

    setBusy(true);
    setError('');

    try {
      const result = await requestEmailCode(parsed.data);

      setChallenge({ ...result, email: parsed.data });
      setCode('');
      setNow(Date.now());
      setResendAt(Date.now() + result.resendAfterSeconds * 1000);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy || !configured) return;

    if (!challenge) {
      await send();

      return;
    }

    if (expired || !/^\d{6}$/.test(code)) {
      setError(
        expired
          ? '코드가 만료되었습니다. 다시 요청해 주세요.'
          : '6자리 인증 코드를 입력해 주세요.'
      );

      return;
    }

    setBusy(true);
    setError('');

    try {
      await verifyEmailCode(challenge.email, challenge.requestId, code);
      client.clear();
      window.location.assign(safeReturnPath(returnTo));
    } catch (error) {
      setError((error as Error).message);
      setBusy(false);
    }
  }

  return (
    <form
      className={styles.form}
      onSubmit={(event) => void submit(event)}
      aria-label='학교 이메일 로그인'>
      <Input
        label='학교 이메일'
        type='email'
        autoComplete='email'
        autoCapitalize='none'
        spellCheck={false}
        placeholder='이메일@hufs.ac.kr'
        required
        value={email}
        maxLength={254}
        disabled={!configured || busy || Boolean(challenge)}
        onChange={(event) => setEmail(event.target.value)}
      />
      {challenge && (
        <>
          <Text
            as='p'
            role='status'>
            {challenge.email}로 보낸 6자리 코드를 입력해 주세요. 10분 동안
            유효합니다.
          </Text>
          <Input
            label='인증 코드'
            inputMode='numeric'
            autoComplete='one-time-code'
            required
            maxLength={6}
            value={code}
            disabled={busy || expired}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))}
          />
        </>
      )}
      {error && (
        <Banner
          status='error'
          role='alert'
          title={error}
        />
      )}
      {expired && (
        <Banner
          status='warning'
          title='인증 코드가 만료되었습니다. 다시 요청해 주세요.'
        />
      )}
      <Button
        type='submit'
        disabled={!configured || busy || (Boolean(challenge) && expired)}
        loading={busy}>
        {challenge ? '인증하고 로그인' : '인증 코드 받기'}
      </Button>
      {challenge && (
        <div className={styles.actions}>
          <Button
            type='button'
            variant='secondary'
            disabled={busy || remaining > 0}
            onClick={() => void send()}>
            {remaining > 0 ? `${remaining}초 후 재발송` : '인증 코드 다시 받기'}
          </Button>
          <Button
            type='button'
            variant='ghost'
            disabled={busy}
            onClick={() => {
              setChallenge(null);
              setResendAt(0);
              setCode('');
              setError('');
            }}>
            이메일 변경
          </Button>
        </div>
      )}
    </form>
  );
}
