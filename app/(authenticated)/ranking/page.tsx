import { requireSession } from '../requireSession';
import { getGrowth, getLeaderboard } from '@/domains/growth/api/growth';
import { RankingPanel } from './_components/RankingPanel';

/** 인증된 계정의 성장 현황과 선택 공개 랭킹을 함께 연다. */
export default async function RankingPage() {
  const { transport } = await requireSession();

  const [summary, leaderboard] = await Promise.all([
    getGrowth(transport),
    getLeaderboard(transport),
  ]);

  return (
    <RankingPanel
      initial={summary}
      initialLeaderboard={leaderboard}
    />
  );
}
