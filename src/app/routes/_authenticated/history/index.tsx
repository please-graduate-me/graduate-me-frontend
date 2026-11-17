import { createFileRoute } from '@tanstack/react-router';
import { getLearningHistoryQuery } from '@/domains/learning/api/queries';
import { MoreNav } from '../-components/MoreNav';
import { LearningHistoryList } from './-components/LearningHistoryList';

/** URL 조건과 인증된 조회 결과를 화면에 연결한다. */
export const Route = createFileRoute('/_authenticated/history/')({
  loader: async ({ context }) => {
    const initial = await context.queryClient.fetchQuery(
      getLearningHistoryQuery()
    );

    return { initial };
  },
  component: HistoryPage,
});

function HistoryPage() {
  const { initial } = Route.useLoaderData();

  return (
    <>
      <MoreNav current='/history' />
      <LearningHistoryList
        items={initial.items}
        limit={initial.limit}
        truncated={initial.truncated}
      />
    </>
  );
}
