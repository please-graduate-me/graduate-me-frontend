import { createFileRoute } from '@tanstack/react-router';
import { listExpressionsQuery } from '@/domains/expressions/api/queries';
import { MoreNav } from '../-components/MoreNav';
import { ExpressionLibrary } from './-components/ExpressionLibrary';

/** URL 조건과 인증된 조회 결과를 화면에 연결한다. */
export const Route = createFileRoute('/_authenticated/expressions/')({
  loader: async ({ context }) => {
    const initial = await context.queryClient.fetchQuery(
      listExpressionsQuery()
    );

    return { initial };
  },
  component: ExpressionsPage,
});

function ExpressionsPage() {
  const { initial } = Route.useLoaderData();

  return (
    <>
      <MoreNav current='/expressions' />
      <ExpressionLibrary initial={initial.items} />
    </>
  );
}
