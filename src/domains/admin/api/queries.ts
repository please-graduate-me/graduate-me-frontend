import { queryOptions } from '@tanstack/react-query';
import { browserTransport } from '@/lib/api/request';
import { getWorkspaceAccess } from './admin';

/** getWorkspaceAccess 조회와 캐시 키를 같은 도메인에서 관리한다. */
export const getWorkspaceAccessQuery = () =>
  queryOptions({
    queryKey: ['admin', 'getWorkspaceAccess'],
    queryFn: ({ signal }) =>
      getWorkspaceAccess((path, init) =>
        browserTransport(path, { ...init, signal })
      ),
  });
