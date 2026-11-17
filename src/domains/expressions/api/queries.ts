import { queryOptions } from '@tanstack/react-query';
import { browserTransport } from '@/lib/api/request';
import { listExpressions, getExpressionReview } from './expressions';

/** listExpressions 조회와 캐시 키를 같은 도메인에서 관리한다. */
export const listExpressionsQuery = () =>
  queryOptions({
    queryKey: ['expressions', 'listExpressions'],
    queryFn: ({ signal }) =>
      listExpressions((path, init) =>
        browserTransport(path, { ...init, signal })
      ),
  });

/** getExpressionReview 조회와 캐시 키를 같은 도메인에서 관리한다. */
export const getExpressionReviewQuery = (
  input?: Parameters<typeof getExpressionReview>[0]
) =>
  queryOptions({
    queryKey: ['expressions', 'getExpressionReview', input],
    queryFn: ({ signal }) =>
      getExpressionReview(input, (path, init) =>
        browserTransport(path, { ...init, signal })
      ),
  });
