import { requireSession } from '../requireSession';
import { listExpressions } from '@/domains/expressions/api/expressions';
import { ExpressionPractice } from './_components/ExpressionPractice';

/** 저장한 표현으로 실제 자가점검을 시작한다. */
export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<{ expressionId?: string }>;
}) {
  const { transport } = await requireSession();

  const [initial, search] = await Promise.all([
    listExpressions(transport),
    searchParams,
  ]);

  const items = search.expressionId
    ? initial.items.filter((item) => item.id === search.expressionId)
    : initial.items;

  return (
    <ExpressionPractice
      key={search.expressionId ?? 'all'}
      expressions={items}
    />
  );
}
