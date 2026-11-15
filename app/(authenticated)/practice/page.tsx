import { requireSession } from '../requireSession';
import {
  getExpressionReview,
  listExpressions,
} from '@/domains/expressions/api/expressions';
import { MoreNav } from '../_components/MoreNav';
import { ExpressionPractice } from './_components/ExpressionPractice';
import { GeneratedPractice } from './_components/GeneratedPractice';
import { PracticeTabs } from './_components/PracticeTabs';
import { listExercises } from '@/domains/ai/api/learning';
import { getLearningProfile } from '@/domains/users/api/profile';

/** 저장한 표현으로 실제 자가점검을 시작한다. */
export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<{
    expressionId?: string;
    exerciseId?: string;
    artifact?: string;
  }>;
}) {
  const { transport } = await requireSession();

  const [initial, search, exercises, profile] = await Promise.all([
    listExpressions(transport),
    searchParams,
    listExercises(undefined, transport),
    getLearningProfile(transport),
  ]);

  const selectedExerciseId = search.exerciseId ?? search.artifact;

  const includedCount = initial.items.filter(
    (item) => item.reviewIncluded
  ).length;

  // 표현집에서 고른 표현은 복습 제외 여부와 관계없이 그 한 장만 점검하고 복습 덱은 받지 않는다.
  const focused = search.expressionId
    ? initial.items.filter((item) => item.id === search.expressionId)
    : null;

  const due =
    focused || !includedCount
      ? null
      : await getExpressionReview({ scope: 'due' }, transport);

  // 오늘 복습할 표현이 없으면 빈 화면 대신 복습에 포함한 표현을 미리 점검하는 덱으로 시작한다.
  const review =
    due && !due.items.length
      ? await getExpressionReview({ scope: 'all' }, transport)
      : due;

  return (
    <>
      <MoreNav current='/practice' />
      <PracticeTabs
        key={selectedExerciseId ?? search.expressionId ?? 'all'}
        // 저장 문제 주소로 들어오면 그 문제를 바로 보여 주고, 그 외에는 자가점검부터 시작한다.
        initialMode={selectedExerciseId ? 'exercises' : 'cards'}
        cards={
          <ExpressionPractice
            key={search.expressionId ?? 'all'}
            expressions={focused ?? review?.items ?? []}
            review={review}
            savedCount={initial.items.length}
            includedCount={includedCount}
            isFocused={Boolean(focused)}
          />
        }
        exercises={
          <GeneratedPractice
            key={selectedExerciseId ?? search.expressionId ?? 'all'}
            initial={exercises.items}
            expressions={initial.items}
            selectedExerciseId={selectedExerciseId}
            selectedExpressionId={search.expressionId}
            initialLanguage={
              exercises.items.find((item) => item.id === selectedExerciseId)
                ?.source.language ??
              initial.items.find((item) => item.id === search.expressionId)
                ?.source.language ??
              profile.targetLanguage
            }
          />
        }
      />
    </>
  );
}
