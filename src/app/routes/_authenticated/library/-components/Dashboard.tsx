import { Text } from '@/components/ui/primitives/Text';
import { Heading } from '@/components/ui/primitives/Heading';
import { Section } from '@/components/ui/layouts/Section';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/primitives/Button';
import { Banner } from '@/components/ui/composites/Banner';
import { getLearningSummary } from '@/domains/learning/api/summary';
import { getLearningInsights } from '@/domains/learning/api/insights';
import type { LearningSummary } from '@/domains/learning/model/summary';
import type { LearningInsights } from '@/domains/learning/model/insights';
import { useGrowthSummary } from '../../-components/useGrowthSummary';
import { ResumeStack } from './ResumeStack';
import { ReviewCard } from './ReviewCard';
import * as styles from './Dashboard.css';

/** 학습 홈의 이어서 학습, 최근 자료, 오늘의 복습을 실제 계정 데이터로 연결한다. */
export function Dashboard({ language }: { language: 'en' | 'th' }) {
  const [summary, setSummary] = useState<LearningSummary | null>(null);
  const [insights, setInsights] = useState<LearningInsights | null>(null);
  const [insightsFailed, setInsightsFailed] = useState(false);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);
  const growth = useGrowthSummary();

  useEffect(() => {
    let disposed = false;

    getLearningSummary()
      .then((data) => {
        if (!disposed) {
          setSummary(data);
          setError('');
        }
      })
      .catch((error: Error) => {
        if (!disposed) setError(error.message);
      });

    return () => {
      disposed = true;
    };
  }, [reload]);

  useEffect(() => {
    let disposed = false;

    // 받아쓰기 복습 수는 보조 정보라 실패해도 홈을 막지 않고 분석 화면 안내로 대신한다.
    getLearningInsights(language)
      .then((data) => {
        if (!disposed) setInsights(data);
      })
      .catch(() => {
        if (!disposed) setInsightsFailed(true);
      });

    return () => {
      disposed = true;
    };
  }, [language]);

  const answered =
    summary?.recentQuestions.filter((item) => item.status === 'answered')
      .length ?? 0;

  const mistakes = insights?.review.filter((item) => item.mistakes > 0) ?? [];

  return (
    <div className={styles.workspace}>
      {error && (
        <Banner
          status='error'
          icon='circle-alert'
          title='학습 요약을 불러오지 못했어요'
          role='alert'>
          <Text
            as='p'
            display='block'>
            {error}
          </Text>
          <Button
            variant='secondary'
            size='small'
            onClick={() => setReload((value) => value + 1)}>
            학습 요약 다시 불러오기
          </Button>
        </Banner>
      )}
      <ResumeStack
        materials={summary?.recentMaterials ?? []}
        summaryLoading={!summary && !error}
        growth={growth}
      />
      <Section
        className={styles.review}
        aria-labelledby='review-title'>
        <Heading
          level={2}
          id='review-title'
          className={styles.reviewTitle}>
          오늘의 복습
        </Heading>
        <div className={styles.reviewCards}>
          <ReviewCard
            href={summary?.expressions ? '/practice' : '/expressions'}
            icon='bookmark'
            tone='review'
            title={
              summary ? `표현 카드 ${summary.dueExpressions}개` : '표현 카드'
            }
            description={
              summary
                ? summary.dueExpressions > 0
                  ? '반복 간격이 돌아온 표현'
                  : summary.expressions > 0
                    ? '오늘 돌아온 표현이 없어요'
                    : '학습하며 표현을 저장해 보세요'
                : error
                  ? '표현집에서 확인해 보세요'
                  : '저장한 표현을 불러오고 있어요'
            }
          />
          <ReviewCard
            href={mistakes[0]?.href ?? '/insights'}
            icon='audio-lines'
            tone='streak'
            title={
              insights ? `받아쓰기 ${mistakes.length}구절` : '받아쓰기 복습'
            }
            description={
              insights
                ? mistakes.length > 0
                  ? '지난번에 틀린 구절'
                  : '최근 틀린 구절이 없어요'
                : insightsFailed
                  ? '학습 분석에서 확인해 보세요'
                  : '틀린 구절을 찾고 있어요'
            }
          />
          <ReviewCard
            href='/questions'
            icon='message-circle'
            tone='accent'
            title={summary ? `답변 ${answered}개 도착` : '질문과 답변'}
            description={
              summary
                ? answered > 0
                  ? '최근 질문에 달린 답변'
                  : summary.unanswered > 0
                    ? `${summary.unanswered}개 질문이 답변을 기다려요`
                    : '궁금한 구절을 질문해 보세요'
                : error
                  ? '나의 질문에서 확인해 보세요'
                  : '질문 상태를 불러오고 있어요'
            }
          />
        </div>
      </Section>
    </div>
  );
}
