import { queryOptions } from '@tanstack/react-query';
import { browserTransport } from '@/lib/api/request';
import { getSharedLesson } from './shares';

/** getSharedLesson 조회와 캐시 키를 같은 도메인에서 관리한다. */
export const getSharedLessonQuery = (
  id: Parameters<typeof getSharedLesson>[0]
) =>
  queryOptions({
    queryKey: ['shares', 'getSharedLesson', id],
    queryFn: ({ signal }) =>
      getSharedLesson(id, (path, init) =>
        browserTransport(path, { ...init, signal })
      ),
  });
