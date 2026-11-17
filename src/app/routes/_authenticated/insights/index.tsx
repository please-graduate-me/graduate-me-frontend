import { createFileRoute } from '@tanstack/react-router';
import { getLearningProfileQuery } from '@/domains/users/api/queries';
import { getLearningInsightsQuery } from '@/domains/learning/api/queries';
import { MoreNav } from '../-components/MoreNav';
import { LearningInsightsPanel } from './-components/LearningInsightsPanel';

/** URL 조건과 인증된 조회 결과를 화면에 연결한다. */
export const Route = createFileRoute('/_authenticated/insights/')({
  loader: async ({ context }) => {
    const profile = await context.queryClient.fetchQuery(
      getLearningProfileQuery()
    );

    const initial = await context.queryClient.fetchQuery(
      getLearningInsightsQuery(profile.targetLanguage, 30)
    );

    return { initial };
  },
  component: InsightsPage,
});

function InsightsPage() {
  const { initial } = Route.useLoaderData();

  return (
    <>
      <MoreNav current='/insights' />
      <LearningInsightsPanel initial={initial} />
    </>
  );
}
