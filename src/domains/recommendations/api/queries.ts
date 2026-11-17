import { queryOptions } from '@tanstack/react-query';
import { browserTransport } from '@/lib/api/request';
import { getRecommendations } from './recommendations';

/** getRecommendations 조회와 캐시 키를 같은 도메인에서 관리한다. */
export const getRecommendationsQuery = (
  language: Parameters<typeof getRecommendations>[0]
) =>
  queryOptions({
    queryKey: ['recommendations', 'getRecommendations', language],
    queryFn: ({ signal }) =>
      getRecommendations(language, (path, init) =>
        browserTransport(path, { ...init, signal })
      ),
  });
