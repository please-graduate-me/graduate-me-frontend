'use client';
import { Blockquote } from '@/components/ui/primitives/Blockquote';
import { Banner } from '@/components/ui/composites/Banner';
import { Heading } from '@/components/ui/primitives/Heading';
import { Text } from '@/components/ui/primitives/Text';
import { Card } from '@/components/ui/primitives/Card';
import { ApiError } from '@/lib/api/request';
import { SessionRecovery } from '../../../_components/SessionRecovery';
import { useId, useState } from 'react';
import { Link } from '@/components/ui/primitives/Link';
import { getLearningInsights } from '@/domains/learning/api/insights';
import type { LearningInsights } from '@/domains/learning/model/insights';
import { RelativeTime } from '@/components/ui/primitives/RelativeTime';
import { SegmentedControl } from '@/components/ui/primitives/SegmentedControl';
import { SegmentedControlItem } from '@/components/ui/primitives/SegmentedControlItem';
import { Button } from '@/components/ui/primitives/Button';
import { Badge } from '@/components/ui/primitives/Badge';
import { Icon } from '@/components/ui/primitives/Icon';
import { EmptyState } from '@/components/ui/composites/EmptyState';
import { InsightsSummary } from './InsightsSummary';
import { InsightsRoadmap } from './InsightsRoadmap';
import * as styles from './LearningInsightsPanel.css';

const languages = [
  ['en', '영어'],
  ['th', '태국어'],
] as const;

const periods = [7, 30, 90] as const;

/** 관찰 통계에서 실제 오답과 원문으로 돌아가며 근거 없는 진단을 만들지 않는다. */
export function LearningInsightsPanel({
  initial,
}: {
  initial: LearningInsights;
}) {
  const id = useId();
  const [value, setValue] = useState(initial);
  const [language, setLanguage] = useState(initial.language);
  const [days, setDays] = useState(initial.days);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);

  async function refresh(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');

    try {
      setValue(await getLearningInsights(language, days));
    } catch (error) {
      setSessionExpired(error instanceof ApiError && error.status === 401);
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <Heading level={1}>내 학습 분석</Heading>
          <Text
            as='p'
            display='block'
            color='secondary'
            className={styles.description}>
            실제 받아쓰기 답안에서 반복되는 어려움과 복습할 구절을 확인하세요.
          </Text>
        </div>
        <Badge tone='neutral'>개인 기록 · 규칙 기반 관찰</Badge>
      </div>
      <form
        className={styles.filters}
        onSubmit={(event) => void refresh(event)}>
        <div className={styles.group}>
          <span
            aria-hidden='true'
            className={styles.groupLabel}>
            학습 언어
          </span>
          <SegmentedControl
            label='학습 언어'
            variant='chip'
            value={language}
            isDisabled={busy}
            onChange={(code) => setLanguage(code as typeof language)}>
            {languages.map(([code, label]) => (
              <SegmentedControlItem
                key={code}
                value={code}
                label={label}
              />
            ))}
          </SegmentedControl>
        </div>
        <div className={styles.group}>
          <span
            aria-hidden='true'
            className={styles.groupLabel}>
            집계 기간
          </span>
          <SegmentedControl
            label='집계 기간'
            variant='chip'
            value={String(days)}
            isDisabled={busy}
            onChange={(day) => setDays(Number(day) as typeof days)}>
            {periods.map((day) => (
              <SegmentedControlItem
                key={day}
                value={String(day)}
                label={`최근 ${day}일`}
              />
            ))}
          </SegmentedControl>
        </div>
        <Button
          variant='ink'
          className={styles.apply}
          loading={busy}>
          조건 적용
        </Button>
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
      <InsightsSummary value={value} />
      <div className={styles.columns}>
        <section
          aria-labelledby={`${id}-review`}
          className={styles.review}>
          <div className={styles.reviewHeading}>
            <span
              aria-hidden='true'
              className={styles.reviewIcon}>
              <Icon
                name='headphones'
                size={22}
              />
            </span>
            <Heading
              level={2}
              id={`${id}-review`}
              className={styles.reviewTitle}>
              실제 오답에서 다시 듣기
            </Heading>
          </div>
          {!value.review.length ? (
            <EmptyState
              title='복습할 오답 근거가 없어요'
              description='받아쓰기를 제출하면 도움 없이 틀린 구절을 여기서 확인할 수 있습니다.'
              icon='headphones'
              variant='dashed'
              iconTone='neutral'
              headingLevel={3}
            />
          ) : (
            value.review.map((item) => (
              <Card
                as='article'
                key={item.evidence.id}
                className={`${styles.evidence} ${styles.appear}`}>
                <div className={styles.evidenceTop}>
                  <Heading
                    level={3}
                    className={styles.evidenceTitle}>
                    {item.evidence.title}
                  </Heading>
                  <Badge
                    tone='warning'
                    className={styles.category}>
                    {item.category}
                  </Badge>
                </div>
                <Text
                  as='p'
                  display='block'
                  color='secondary'
                  className={styles.evidenceMeta}>
                  시도 {item.attempts}회 중 오답 {item.mistakes}회 · 원문 v
                  {item.evidence.sourceVersion} ·{' '}
                  <RelativeTime value={item.evidence.createdAt} />
                </Text>
                <Text
                  as='p'
                  display='block'
                  className={styles.answer}>
                  <span className={styles.answerLabel}>당시 답안</span>{' '}
                  <span className={styles.answerText}>
                    {Array.isArray(item.evidence.answer)
                      ? item.evidence.answer.join(' / ')
                      : item.evidence.answer || '(미입력)'}
                  </span>
                </Text>
                <Blockquote>“{item.evidence.sourceText}”</Blockquote>
                <Link
                  className={styles.evidenceLink}
                  href={item.href}>
                  <Icon
                    name='headphones'
                    size={16}
                  />
                  해당 원문에서 다시 듣고 복습하기 ↗
                </Link>
              </Card>
            ))
          )}
        </section>
        <InsightsRoadmap
          roadmap={value.roadmap}
          basis={value.roadmapBasis}
        />
      </div>
    </div>
  );
}
