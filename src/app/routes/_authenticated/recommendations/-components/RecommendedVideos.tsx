import { Card } from '@/components/ui/primitives/Card';
import { contentLabel } from '@/components/ui/primitives/contentLabel';
import { Banner } from '@/components/ui/composites/Banner';
import { Heading } from '@/components/ui/primitives/Heading';
import { Text } from '@/components/ui/primitives/Text';
import { ApiError } from '@/lib/api/request';
import { SessionRecovery } from '../../../-components/SessionRecovery';
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
import { Icon } from '@/components/ui/primitives/Icon';
import { RelativeTime } from '@/components/ui/primitives/RelativeTime';
import * as styles from './RecommendedVideos.css';

/** 추천 이유를 확인하고 관심 없음 선택을 저장하면서 직접 자료 선택도 유지한다. */
export function RecommendedVideos({ initial }: { initial: Recommendations }) {
  const [value, setValue] = useState(initial);
  const [language, setLanguage] = useState(initial.language);
  // 누른 버튼에만 진행 표시를 두고 나머지는 같은 동안 비활성으로만 막는다.
  const [pending, setPending] = useState<string | null>(null);
  const busy = pending !== null;
  const [error, setError] = useState('');

  const analysisRequest = useRef<{ language: 'en' | 'th'; id: string } | null>(
    null
  );

  const [sessionExpired, setSessionExpired] = useState(false);

  async function refresh(event: React.FormEvent) {
    event.preventDefault();
    setPending('refresh');
    setError('');

    try {
      setValue(await getRecommendations(language));
    } catch (error) {
      setSessionExpired(error instanceof ApiError && error.status === 401);
      setError((error as Error).message);
    } finally {
      setPending(null);
    }
  }

  async function personalize() {
    if (busy) return;
    setPending('personalize');
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
      setPending(null);
    }
  }

  async function dismiss(id: string) {
    setPending(`dismiss:${id}`);
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
      setPending(null);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <Heading level={1}>추천 영상</Heading>
          <Text
            as='p'
            display='block'
            color='secondary'
            className={styles.description}>
            관심과 학습 기록을 참고해 이용 가능한 준비 자료를 골랐어요.
          </Text>
        </div>
        <ButtonLink
          href='/materials?add=1'
          variant='ink'
          size='comfortable'
          startIcon='plus'>
          관심 영상 직접 등록
        </ButtonLink>
      </div>
      <form
        className={styles.filters}
        onSubmit={(event) => void refresh(event)}>
        <Select
          className={styles.language}
          label={contentLabel(<>학습 언어</>)}
          value={language}
          disabled={busy}
          onChange={(event) =>
            setLanguage(event.target.value as typeof language)
          }>
          <option value='en'>영어</option>
          <option value='th'>태국어</option>
        </Select>
        <Button
          variant='ink'
          loading={pending === 'refresh'}
          disabled={busy && pending !== 'refresh'}>
          추천 조회
        </Button>
        <Button
          type='button'
          variant='secondary'
          startIcon='sparkles'
          loading={pending === 'personalize'}
          disabled={busy && pending !== 'personalize'}
          onClick={() => void personalize()}>
          내 학습 기록으로 AI 추천
        </Button>
        <ButtonLink
          href='/settings'
          variant='ghost'
          startIcon='settings'
          className={styles.settings}>
          관심·수준 설정
        </ButtonLink>
        <Text
          as='p'
          display='block'
          color='secondary'
          className={styles.filterNote}>
          AI 추천은 최근 30일의 오답·저장 표현·메모·질문을 분석하며 AI 사용
          한도를 소모합니다.
        </Text>
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
      <div className={styles.overview}>
        <section
          aria-labelledby='recommendation-analysis-title'
          className={styles.analysis}>
          <div className={styles.analysisHeading}>
            <span
              aria-hidden='true'
              className={styles.analysisIcon}>
              <Icon
                name='sparkles'
                size={20}
              />
            </span>
            <Heading
              level={2}
              color='inherit'
              id='recommendation-analysis-title'
              className={styles.analysisTitle}>
              내 학습 기록 분석
            </Heading>
          </div>
          {value.personalization ? (
            <>
              <Text
                as='p'
                display='block'
                className={styles.summary}>
                {value.personalization.summary}
              </Text>
              <ul className={styles.focusList}>
                {value.personalization.focusAreas.map((focus) => (
                  <li
                    key={focus}
                    className={styles.focus}>
                    <Icon
                      name='check'
                      size={16}
                      className={styles.focusMark}
                    />
                    {focus}
                  </li>
                ))}
              </ul>
              <Text
                as='p'
                display='block'
                className={styles.analysisMeta}>
                학습 근거 {value.personalization.evidenceCount}건 ·{' '}
                <RelativeTime value={value.personalization.generatedAt} /> 분석
              </Text>
            </>
          ) : (
            // 분석 기록이 없어도 카드 자리와 위계를 유지하고 첫 분석을 여기서 시작하게 한다.
            <>
              <Text
                as='p'
                display='block'
                className={styles.summary}>
                아직 분석한 기록이 없어요. 최근 30일의 학습 기록으로 나에게 맞는
                영상을 골라 볼 수 있어요.
              </Text>
              <Button
                type='button'
                variant='primary'
                startIcon='sparkles'
                className={styles.analysisAction}
                loading={pending === 'personalize'}
                disabled={busy && pending !== 'personalize'}
                onClick={() => void personalize()}>
                내 학습 기록으로 AI 추천
              </Button>
            </>
          )}
        </section>
        <Card
          as='section'
          role='note'
          aria-label='추천 기준'
          className={styles.basis}>
          <Icon
            name='info'
            size={20}
            className={styles.basisIcon}
          />
          <Text
            as='p'
            display='block'
            className={styles.basisText}>
            <strong>안내</strong> {value.basis} · 저장 표현{' '}
            {value.savedExpressionCount}개
          </Text>
          <Text
            as='p'
            display='block'
            color='secondary'
            className={styles.basisNote}>
            난이도는 확보된 문장 길이 등의 단서를 참고한 추정이며 공인 수준
            판정이 아닙니다.
          </Text>
        </Card>
      </div>
      {value.insufficientCandidates && (
        <Banner
          status='note'
          icon='info'
          layout='inline'
          title='안내'
          role='note'>
          현재 선택 언어의 추천 후보가 부족합니다. 자료 보관함에서 고르거나 공개
          URL을 직접 등록할 수 있습니다.
        </Banner>
      )}
      <section
        aria-labelledby='recommendation-list-title'
        className={styles.list}>
        <div className={styles.listHeading}>
          <Heading
            level={2}
            id='recommendation-list-title'
            className={styles.listTitle}>
            지금 볼 만한 영상
          </Heading>
          <span
            role='status'
            className={styles.count}>
            {value.items.length}개
          </span>
        </div>
        {!value.items.length ? (
          <EmptyState
            title='현재 추천할 준비 영상이 없어요'
            description='다른 언어를 선택하거나 직접 자료를 등록해 보세요.'
            icon='play'
          />
        ) : (
          <ul className={styles.grid}>
            {value.items.map((item, index) => (
              <li key={item.id}>
                <RecommendedVideoCard
                  item={item}
                  tone={index}
                  busy={busy}
                  isDismissing={pending === `dismiss:${item.id}`}
                  onDismiss={() => void dismiss(item.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
