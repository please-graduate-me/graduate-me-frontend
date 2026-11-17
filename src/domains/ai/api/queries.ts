import { queryOptions } from '@tanstack/react-query';
import { browserTransport } from '@/lib/api/request';
import { listExercises } from './learning';

/** listExercises 조회와 캐시 키를 같은 도메인에서 관리한다. */
export const listExercisesQuery = (
  language?: Parameters<typeof listExercises>[0]
) =>
  queryOptions({
    queryKey: ['ai', 'listExercises', language],
    queryFn: ({ signal }) =>
      listExercises(language, (path, init) =>
        browserTransport(path, { ...init, signal })
      ),
  });
