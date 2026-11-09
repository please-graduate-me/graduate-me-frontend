'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { request, jsonBody } from '@/lib/api/request';
import { okSchema } from '@/lib/api/contracts';
import { Button } from '@/components/ui/primitives/Button';
import { Input } from '@/components/ui/primitives/Input';
import * as styles from '@/lib/styles/workspace.css';

/** 명시적인 삭제 확인 후 계정과 개인 학습 기록을 삭제한다. */
export function AccountDeletion() {
  const router = useRouter();
  const [confirmation, setConfirmation] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function remove(event: React.FormEvent) {
    event.preventDefault();
    if (confirmation !== 'DELETE' || busy) return;
    setBusy(true);
    setError('');

    try {
      await request('/api/me/account', okSchema, {
        ...jsonBody({ confirmation }),
        method: 'DELETE',
      });

      router.replace('/');
      router.refresh();
    } catch (error) {
      setError((error as Error).message);
      setBusy(false);
    }
  }

  return (
    <div className={styles.page}>
      <Link
        href='/settings'
        className={styles.link}>
        ← 학습 설정
      </Link>
      <h1>계정 탈퇴와 기록 삭제</h1>
      <section className={styles.panel}>
        <h2>삭제되는 개인 기록</h2>
        <p className={styles.prose}>
          내 PDF 원본, 개인 표현집, 비공개 AI 대화, 개인 답안과 진도·연습 기록을
          삭제합니다. 계정의 로그인 세션도 종료됩니다.
        </p>
        <h2>다른 사람의 기록에 남을 수 있는 내용</h2>
        <p className={styles.prose}>
          이미 다른 사람의 질문에 공개한 답변과 당시 작성자 이름, 운영 변경
          이력은 대화와 근거 기록의 연속성을 위해 보존됩니다. 다른 사람의 개인
          학습 기록은 삭제하지 않습니다.
        </p>
        <p className={styles.notice}>
          탈퇴는 되돌릴 수 없습니다. 로그아웃만 하면 계정과 학습 기록은 그대로
          유지됩니다.
        </p>
        <form
          className={styles.stack}
          onSubmit={(event) => void remove(event)}>
          <label className={styles.field}>
            위 내용을 확인했다면 DELETE를 입력해 주세요.
            <Input
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              autoComplete='off'
              disabled={busy}
            />
          </label>
          {error && (
            <p
              role='alert'
              className={styles.error}>
              {error}
            </p>
          )}
          <div>
            <Button
              variant='danger'
              disabled={busy || confirmation !== 'DELETE'}
              loading={busy}>
              계정과 개인 기록 삭제
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
