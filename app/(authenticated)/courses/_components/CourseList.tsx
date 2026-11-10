'use client';
import { ApiError } from '@/lib/api/request';
import { SessionRecovery } from '../../../_components/SessionRecovery';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { joinCourse } from '@/domains/courses/api/courses';
import type { Courses } from '@/domains/courses/model/contracts';
import { Button } from '@/components/ui/primitives/Button';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';
import { Input } from '@/components/ui/primitives/Input';
import { EmptyState } from '@/components/ui/composites/EmptyState';
import * as styles from '@/lib/styles/workspace.css';

/** 초대 코드 가입과 내 수업 탐색을 개인 학습에서 분리한다. */
export function CourseList({ initial }: { initial: Courses }) {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);

  async function join(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');

    try {
      const { id } = await joinCourse(code.trim());

      router.push(`/courses/${encodeURIComponent(id)}`);
      router.refresh();
    } catch (error) {
      setSessionExpired(error instanceof ApiError && error.status === 401);
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <div>
          <h1>내 수업과 과제</h1>
          <p className={styles.description}>
            개인 학습과 과제 제출 기록을 따로 보관합니다.
          </p>
        </div>
      </div>
      <form
        className={styles.filters}
        onSubmit={(event) => void join(event)}>
        <label className={styles.field}>
          수업 초대 코드
          <Input
            value={code}
            required
            maxLength={36}
            placeholder='담당자가 공유한 초대 코드'
            onChange={(event) => setCode(event.target.value)}
          />
        </label>
        <Button loading={busy}>수업 참여</Button>
      </form>
      {sessionExpired && <SessionRecovery />}
      {error && (
        <p
          className={styles.error}
          role='alert'>
          {error}
        </p>
      )}
      {!initial.items.length ? (
        <EmptyState
          title='아직 참여한 수업이 없어요'
          description='담당자의 초대 코드로 참여하거나 자료 보관함에서 개인 학습을 시작하세요.'
          icon='users'
        />
      ) : (
        initial.items.map((item) => (
          <article
            className={styles.message}
            key={item.id}>
            <h2>{item.title}</h2>
            <p>
              {item.language === 'en' ? '영어' : '태국어'} ·{' '}
              {item.role === 'teacher'
                ? '교수·담당자'
                : item.role === 'assistant'
                  ? '조교'
                  : '수강생'}
            </p>
            <ButtonLink
              href={`/courses/${encodeURIComponent(item.id)}`}
              variant='secondary'>
              과제 확인
            </ButtonLink>
          </article>
        ))
      )}
      <ButtonLink
        href='/materials'
        variant='ghost'>
        개인 자료로 학습하기
      </ButtonLink>
    </div>
  );
}
