import { queryOptions } from '@tanstack/react-query';
import { browserTransport } from '@/lib/api/request';
import { getArchivedVideoSource } from './archive';

/** getArchivedVideoSource 조회와 캐시 키를 같은 도메인에서 관리한다. */
export const getArchivedVideoSourceQuery = (
  videoId: Parameters<typeof getArchivedVideoSource>[0],
  segmentId: Parameters<typeof getArchivedVideoSource>[1],
  version: Parameters<typeof getArchivedVideoSource>[2]
) =>
  queryOptions({
    queryKey: ['videos', 'getArchivedVideoSource', videoId, segmentId, version],
    queryFn: ({ signal }) =>
      getArchivedVideoSource(videoId, segmentId, version, (path, init) =>
        browserTransport(path, { ...init, signal })
      ),
  });

import { getLesson } from './videos';

/** getLesson 조회와 캐시 키를 같은 도메인에서 관리한다. */
export const getLessonQuery = (id: Parameters<typeof getLesson>[0]) =>
  queryOptions({
    queryKey: ['videos', 'getLesson', id],
    queryFn: ({ signal }) =>
      getLesson(id, (path, init) =>
        browserTransport(path, { ...init, signal })
      ),
  });
