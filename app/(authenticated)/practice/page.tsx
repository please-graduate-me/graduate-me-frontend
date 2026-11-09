import { requireSession } from '../requireSession';
import { listExpressions } from '@/domains/expressions/api/expressions';
import { ExpressionPractice } from './_components/ExpressionPractice';
import { GeneratedPractice } from './_components/GeneratedPractice';
import { listExercises } from '@/domains/ai/api/learning';
import { getLearningProfile } from '@/domains/users/api/profile';

/** 저장한 표현으로 실제 자가점검을 시작한다. */
export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<{ expressionId?: string; exerciseId?: string }>;
}) {
  const { transport } = await requireSession();

  const [initial, search, exercises, profile] = await Promise.all([
    listExpressions(transport),
    searchParams,
    listExercises(undefined, transport),
    getLearningProfile(transport),
  ]);

  const items = search.expressionId
    ? initial.items.filter((item) => item.id === search.expressionId)
    : initial.items;

  return (
    <>
      <GeneratedPractice
        initial={exercises.items}
        expressions={initial.items}
        selectedExerciseId={search.exerciseId}
        selectedExpressionId={search.expressionId}
        initialLanguage={
          exercises.items.find((item) => item.id === search.exerciseId)?.source
            .language ??
          initial.items.find((item) => item.id === search.expressionId)?.source
            .language ??
          profile.targetLanguage
        }
      />
      <details>
        <summary>내 표현 카드로 자가점검하기</summary>
        <ExpressionPractice
          key={search.expressionId ?? 'all'}
          expressions={items.filter((item) => item.reviewIncluded)}
        />
      </details>
    </>
  );
}
