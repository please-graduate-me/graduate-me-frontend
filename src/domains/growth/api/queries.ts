import { queryOptions } from '@tanstack/react-query';
import { browserTransport } from '@/lib/api/request';
import { getGrowth, getLeaderboard } from './growth';

/** getGrowth 조회와 캐시 키를 같은 도메인에서 관리한다. */
export const getGrowthQuery = () =>
  queryOptions({
    queryKey: ['growth', 'getGrowth'],
    queryFn: ({ signal }) =>
      getGrowth((path, init) => browserTransport(path, { ...init, signal })),
  });

/** getLeaderboard 조회와 캐시 키를 같은 도메인에서 관리한다. */
export const getLeaderboardQuery = () =>
  queryOptions({
    queryKey: ['growth', 'getLeaderboard'],
    queryFn: ({ signal }) =>
      getLeaderboard((path, init) =>
        browserTransport(path, { ...init, signal })
      ),
  });
