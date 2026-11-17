import { queryOptions } from '@tanstack/react-query';
import { browserTransport } from '@/lib/api/request';
import { getLearningHistory } from './history';

/** getLearningHistory 조회와 캐시 키를 같은 도메인에서 관리한다. */
export const getLearningHistoryQuery = () =>
  queryOptions({
    queryKey: ['learning', 'getLearningHistory'],
    queryFn: ({ signal }) =>
      getLearningHistory((path, init) =>
        browserTransport(path, { ...init, signal })
      ),
  });

import { getLearningInsights } from './insights';

/** getLearningInsights 조회와 캐시 키를 같은 도메인에서 관리한다. */
export const getLearningInsightsQuery = (
  language: Parameters<typeof getLearningInsights>[0],
  days?: Parameters<typeof getLearningInsights>[1]
) =>
  queryOptions({
    queryKey: ['learning', 'getLearningInsights', language, days],
    queryFn: ({ signal }) =>
      getLearningInsights(language, days, (path, init) =>
        browserTransport(path, { ...init, signal })
      ),
  });

import { getLearningPolicy } from './policy';

/** getLearningPolicy 조회와 캐시 키를 같은 도메인에서 관리한다. */
export const getLearningPolicyQuery = () =>
  queryOptions({
    queryKey: ['learning', 'getLearningPolicy'],
    queryFn: ({ signal }) =>
      getLearningPolicy((path, init) =>
        browserTransport(path, { ...init, signal })
      ),
  });
