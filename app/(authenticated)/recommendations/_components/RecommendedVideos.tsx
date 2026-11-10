'use client';
import { ApiError } from '@/lib/api/request';
import { SessionRecovery } from '../../../_components/SessionRecovery';
import { useRef, useState } from 'react';
import {
  getRecommendations,
  personalizeRecommendations,
  setRecommendationInterest,
} from '@/domains/recommendations/api/recommendations';
import type { Recommendations } from '@/domains/recommendations/model/contracts';
import { Button } from '@/components/ui/primitives/Button';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';
import { Select } from '@/components/ui/primitives/Select';
import { RecommendedVideoCard } from './RecommendedVideoCard';
import { EmptyState } from '@/components/ui/composites/EmptyState';
import * as styles from '@/lib/styles/workspace.css';

/** 추천 이유를 확인하고 관심 없음 선택을 저장하면서 직접 자료 선택도 유지한다. */
export function RecommendedVideos({ initial }: { initial: Recommendations }) {
  const [value, setValue] = useState(initial);
  const [language, setLanguage] = useState(initial.language);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const analysisRequest = useRef<{ language: 'en' | 'th'; id: string } | null>(
    null
  );

  const [sessionExpired, setSessionExpired] = useState(false);

  async function refresh(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');

    try {
      setValue(await getRecommendations(language));
    } catch (error) {
      setSessionExpired(error instanceof ApiError && error.status === 401);
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function personalize() {
    if (busy) return;
    setBusy(true);
    setError('');
    setSessionExpired(false);
    if (analysisRequest.current?.language !== language)
      analysisRequest.current = { language, id: crypto.randomUUID() };

    try {
      setValue(
        await personalizeRecommendations(language, analysisRequest.current.id)
      );

      analysisRequest.current = null;
    } catch (error) {
      setSessionExpired(error instanceof ApiError && error.status === 401);
      setError((error as Error).message);
      // 서버가 실패를 확정한 요청은 새 클릭에서만 새 식별자로 다시 실행한다.
      if (
        error instanceof ApiError &&
        error.status !== 409 &&
        error.status !== 0
      )
        analysisRequest.current = null;
    } finally {
      setBusy(false);
    }
  }

  async function dismiss(id: string) {
    setBusy(true);
    setError('');

    try {
      await setRecommendationInterest(id, false);

      setValue((previous) => ({
        ...previous,
        items: previous.items.filter((item) => item.id !== id),
      }));
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
          <h1>추천 영상</h1>
          <p className={styles.description}>
            관심과 학습 기록을 참고해 이용 가능한 준비 자료를 골랐어요.
          </p>
        </div>
        <ButtonLink href='/materials?add=1'>관심 영상 직접 등록</ButtonLink>
      </div>
      <form
        className={styles.filters}
        onSubmit={(event) => void refresh(event)}>
        <label className={styles.field}>
          학습 언어
          <Select
            value={language}
            disabled={busy}
            onChange={(event) =>
              setLanguage(event.target.value as typeof language)
            }>
            <option value='en'>영어</option>
            <option value='th'>태국어</option>
          </Select>
        </label>
        <Button loading={busy}>추천 조회</Button>
        <Button
          type='button'
          variant='secondary'
          disabled={busy}
          onClick={() => void personalize()}>
          내 학습 기록으로 AI 추천
        </Button>
        <ButtonLink
          href='/settings'
          variant='secondary'>
          관심·수준 설정
        </ButtonLink>
      </form>
      {sessionExpired && <SessionRecovery />}
      {error && (
        <p
          className={styles.error}
          role='alert'>
          {error}
        </p>
      )}
      <p className={styles.notice}>
        {value.basis} · 저장 표현 {value.savedExpressionCount}개
      </p>
      <p className={styles.meta}>
        AI 추천은 최근 30일의 오답·저장 표현·메모·질문을 분석하며 AI 사용 한도를
        소모합니다.
      </p>
      {value.personalization && (
        <section className={styles.panel}>
          <h2>내 학습 기록 분석</h2>
          <p>{value.personalization.summary}</p>
          <ul>
            {value.personalization.focusAreas.map((focus) => (
              <li key={focus}>{focus}</li>
            ))}
          </ul>
          <p className={styles.meta}>
            학습 근거 {value.personalization.evidenceCount}건 ·{' '}
            {new Date(value.personalization.generatedAt).toLocaleString(
              'ko-KR'
            )}{' '}
            분석
          </p>
        </section>
      )}
      {value.insufficientCandidates && (
        <p className={styles.notice}>
          현재 선택 언어의 추천 후보가 부족합니다. 자료 보관함에서 고르거나 공개
          URL을 직접 등록할 수 있습니다.
        </p>
      )}
      {!value.items.length ? (
        <EmptyState
          title='현재 추천할 준비 영상이 없어요'
          description='다른 언어를 선택하거나 직접 자료를 등록해 보세요.'
          icon='play'
        />
      ) : (
        value.items.map((item) => (
          <RecommendedVideoCard
            key={item.id}
            item={item}
            busy={busy}
            onDismiss={() => void dismiss(item.id)}
          />
        ))
      )}
    </div>
  );
}
