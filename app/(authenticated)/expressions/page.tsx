import { requireSession } from '../requireSession';
import { listExpressions } from '@/domains/expressions/api/expressions';
import { ExpressionLibrary } from './_components/ExpressionLibrary';

/** 개인 표현집을 인증 경계 안에서 가져온다. */
export default async function ExpressionsPage() {
  const { transport } = await requireSession();
  const initial = await listExpressions(transport);

  return <ExpressionLibrary initial={initial.items} />;
}
