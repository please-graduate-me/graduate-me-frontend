'use client';
import { Card } from '@/components/ui/primitives/Card';

import { List } from '@/components/ui/composites/List';
import { ListItem } from '@/components/ui/composites/ListItem';

import { contentLabel } from '@/components/ui/primitives/contentLabel';
import { Banner } from '@/components/ui/composites/Banner';
import { Heading } from '@/components/ui/primitives/Heading';
import { Text } from '@/components/ui/primitives/Text';
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
          <Heading level={1}>추천 영상</Heading>
          <Text
            as='p'
            display='block'
            className={styles.description}>
            관심과 학습 기록을 참고해 이용 가능한 준비 자료를 골랐어요.
          </Text>
        </div>
        <ButtonLink href='/materials?add=1'>관심 영상 직접 등록</ButtonLink>
      </div>
      <form
        className={styles.filters}
        onSubmit={(event) => void refresh(event)}>
        <div className={styles.field}>
          <Select
            label={contentLabel(<>학습 언어</>)}
            value={language}
            disabled={busy}
            onChange={(event) =>
              setLanguage(event.target.value as typeof language)
            }>
            <option value='en'>영어</option>
            <option value='th'>태국어</option>
          </Select>
        </div>
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
        <Banner
          status='error'
          title='확인이 필요해요'

          role='alert'>
          {error}
        </Banner>
      )}
      <Banner
        status='info'
        title='안내'>
        {value.basis} · 저장 표현 {value.savedExpressionCount}개
      </Banner>
      <Text
        as='p'
        display='block'
        className={styles.meta}>
        AI 추천은 최근 30일의 오답·저장 표현·메모·질문을 분석하며 AI 사용 한도를
        소모합니다.
      </Text>
      {value.personalization && (
        <Card className={styles.panel}>
          <Heading level={2}>내 학습 기록 분석</Heading>
          <Text
            as='p'
            display='block'>
            {value.personalization.summary}
          </Text>
          <List>
            {value.personalization.focusAreas.map((focus) => (
              <ListItem
                key={focus}
                label={<>{focus}</>}
              />
            ))}
          </List>
          <Text
            as='p'
            display='block'
            className={styles.meta}>
            학습 근거 {value.personalization.evidenceCount}건 ·{' '}
            {new Date(value.personalization.generatedAt).toLocaleString(
              'ko-KR'
            )}{' '}
            분석
          </Text>
        </Card>
      )}
      {value.insufficientCandidates && (
        <Banner
          status='info'
          title='안내'>
          현재 선택 언어의 추천 후보가 부족합니다. 자료 보관함에서 고르거나 공개
          URL을 직접 등록할 수 있습니다.
        </Banner>
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
