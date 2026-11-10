'use client';
import { ApiError } from '@/lib/api/request';
import { SessionRecovery } from '../../../_components/SessionRecovery';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveLearningProfile } from '@/domains/users/api/profile';
import type { LearningProfile } from '@/domains/users/model/profile';
import { Button } from '@/components/ui/primitives/Button';
import { Input } from '@/components/ui/primitives/Input';
import { Select } from '@/components/ui/primitives/Select';
import * as styles from '@/lib/styles/workspace.css';

/** 설명 언어와 관심 주제를 실제 계정 프로필에 저장한다. */
export function ProfileEditor({ initial }: { initial: LearningProfile }) {
  const router = useRouter();
  const [profile, setProfile] = useState(initial);
  const [interests, setInterests] = useState(initial.interests.join(', '));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);
  const [saved, setSaved] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setSaved(false);

    try {
      const value = await saveLearningProfile({
        ...profile,
        interests: [
          ...new Set(
            interests
              .split(',')
              .map((value) => value.trim())
              .filter(Boolean)
          ),
        ],
      });

      setProfile(value);
      setInterests(value.interests.join(', '));
      setSaved(true);
      router.refresh();
    } catch (error) {
      setSessionExpired(error instanceof ApiError && error.status === 401);
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={(event) => void submit(event)}
      className={styles.stack}>
      <fieldset
        className={styles.stack}
        disabled={busy}>
        <label className={styles.field}>
          목표 언어
          <Select
            value={profile.targetLanguage}
            onChange={(event) =>
              setProfile((value) => ({
                ...value,
                targetLanguage: event.target
                  .value as LearningProfile['targetLanguage'],
              }))
            }>
            <option value='en'>영어</option>
            <option value='th'>태국어</option>
          </Select>
        </label>
        <label className={styles.field}>
          설명 언어
          <Select
            value={profile.explanationLanguage}
            onChange={(event) =>
              setProfile((value) => ({
                ...value,
                explanationLanguage: event.target
                  .value as LearningProfile['explanationLanguage'],
              }))
            }>
            <option value='ko'>한국어</option>
            <option value='en'>영어</option>
            <option value='th'>태국어</option>
          </Select>
        </label>
        <label className={styles.field}>
          현재 수준 · 자기평가
          <Select
            value={profile.level}
            onChange={(event) =>
              setProfile((value) => ({
                ...value,
                level: event.target.value as LearningProfile['level'],
              }))
            }>
            <option value='beginner'>초급</option>
            <option value='intermediate'>중급</option>
            <option value='advanced'>고급</option>
          </Select>
        </label>
        <label className={styles.field}>
          관심 주제
          <Input
            value={interests}
            maxLength={2039}
            onChange={(event) => setInterests(event.target.value)}
            placeholder='회화, 언어학, 경제 · 쉼표로 구분해 최대 20개'
          />
        </label>
        <p className={styles.meta}>
          언어를 바꾸어도 이전 언어의 자료와 답안·표현·질문 기록은 유지됩니다.
          자기평가 수준은 연습 난이도의 참고값으로 사용합니다.
        </p>
        <div>
          <Button
            loading={busy}
            disabled={busy}>
            학습 프로필 저장
          </Button>
        </div>
      </fieldset>
      {sessionExpired && <SessionRecovery />}
      {error && (
        <p
          className={styles.error}
          role='alert'>
          {error}
        </p>
      )}
      {saved && (
        <p
          className={styles.notice}
          role='status'>
          학습 프로필을 저장했습니다.
        </p>
      )}
    </form>
  );
}
