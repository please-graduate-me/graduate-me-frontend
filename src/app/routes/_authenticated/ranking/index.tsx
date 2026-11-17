import { createFileRoute } from '@tanstack/react-router';
import {
  getGrowthQuery,
  getLeaderboardQuery,
} from '@/domains/growth/api/queries';
import { RankingPanel } from './-components/RankingPanel';

/** URL 조건과 인증된 조회 결과를 화면에 연결한다. */
export const Route = createFileRoute('/_authenticated/ranking/')({
  loader: async ({ context }) => {
    const [summary, leaderboard] = await Promise.all([
      context.queryClient.fetchQuery(getGrowthQuery()),
      context.queryClient.fetchQuery(getLeaderboardQuery()),
    ]);

    return { summary, leaderboard };
  },
  component: RankingPage,
});

function RankingPage() {
  const { summary, leaderboard } = Route.useLoaderData();

  return (
    <RankingPanel
      initial={summary}
      initialLeaderboard={leaderboard}
    />
  );
}
