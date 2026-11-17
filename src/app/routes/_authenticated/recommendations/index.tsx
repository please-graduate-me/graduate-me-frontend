import { createFileRoute } from '@tanstack/react-router';
import { getLearningProfileQuery } from '@/domains/users/api/queries';
import { getRecommendationsQuery } from '@/domains/recommendations/api/queries';
import { MoreNav } from '../-components/MoreNav';
import { RecommendedVideos } from './-components/RecommendedVideos';

/** URL 조건과 인증된 조회 결과를 화면에 연결한다. */
export const Route = createFileRoute('/_authenticated/recommendations/')({
  loader: async ({ context }) => {
    const profile = await context.queryClient.fetchQuery(
      getLearningProfileQuery()
    );

    const initial = await context.queryClient.fetchQuery(
      getRecommendationsQuery(profile.targetLanguage)
    );

    return { initial };
  },
  component: RecommendationsPage,
});

function RecommendationsPage() {
  const { initial } = Route.useLoaderData();

  return (
    <>
      <MoreNav current='/recommendations' />
      <RecommendedVideos initial={initial} />
    </>
  );
}
