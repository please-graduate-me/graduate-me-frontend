import { createFileRoute } from '@tanstack/react-router';
import {
  getExpressionReviewQuery,
  listExpressionsQuery,
} from '@/domains/expressions/api/queries';
import { MoreNav } from '../-components/MoreNav';
import { ExpressionPractice } from './-components/ExpressionPractice';
import { GeneratedPractice } from './-components/GeneratedPractice';
import { PracticeTabs } from './-components/PracticeTabs';
import { listExercisesQuery } from '@/domains/ai/api/queries';
import { getLearningProfileQuery } from '@/domains/users/api/queries';

/** URL 조건과 인증된 조회 결과를 화면에 연결한다. */
export const Route = createFileRoute('/_authenticated/practice/')({
  validateSearch: (search: Record<string, unknown>) => ({
    expressionId:
      typeof search.expressionId === 'string' ? search.expressionId : undefined,
    exerciseId:
      typeof search.exerciseId === 'string' ? search.exerciseId : undefined,
    artifact: typeof search.artifact === 'string' ? search.artifact : undefined,
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps: search }) => {
    const [initial, exercises, profile] = await Promise.all([
      context.queryClient.fetchQuery(listExpressionsQuery()),
      context.queryClient.fetchQuery(listExercisesQuery(undefined)),
      context.queryClient.fetchQuery(getLearningProfileQuery()),
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
        : await context.queryClient.fetchQuery(
            getExpressionReviewQuery({ scope: 'due' })
          );

    // 오늘 복습할 표현이 없으면 빈 화면 대신 복습에 포함한 표현을 미리 점검하는 덱으로 시작한다.
    const review =
      due && !due.items.length
        ? await context.queryClient.fetchQuery(
            getExpressionReviewQuery({ scope: 'all' })
          )
        : due;

    return {
      initial,
      search,
      exercises,
      profile,
      selectedExerciseId,
      includedCount,
      focused,
      review,
    };
  },
  component: PracticePage,
});

function PracticePage() {
  const {
    initial,
    search,
    exercises,
    profile,
    selectedExerciseId,
    includedCount,
    focused,
    review,
  } = Route.useLoaderData();

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
