import { queryOptions } from '@tanstack/react-query';
import { browserTransport } from '@/lib/api/request';
import { getMaterial, listMaterials } from './materials';

/** getMaterial 조회와 캐시 키를 같은 도메인에서 관리한다. */
export const getMaterialQuery = (
  id: Parameters<typeof getMaterial>[0],
  version?: Parameters<typeof getMaterial>[2]
) =>
  queryOptions({
    queryKey: ['materials', 'getMaterial', id, version],
    queryFn: ({ signal }) =>
      getMaterial(
        id,
        (path, init) => browserTransport(path, { ...init, signal }),
        version
      ),
  });

/** listMaterials 조회와 캐시 키를 같은 도메인에서 관리한다. */
export const listMaterialsQuery = () =>
  queryOptions({
    queryKey: ['materials', 'listMaterials'],
    queryFn: ({ signal }) =>
      listMaterials((path, init) =>
        browserTransport(path, { ...init, signal })
      ),
  });

import { getExcerptShare } from './records';

/** getExcerptShare 조회와 캐시 키를 같은 도메인에서 관리한다. */
export const getExcerptShareQuery = (
  id: Parameters<typeof getExcerptShare>[0]
) =>
  queryOptions({
    queryKey: ['materials', 'getExcerptShare', id],
    queryFn: ({ signal }) =>
      getExcerptShare(id, (path, init) =>
        browserTransport(path, { ...init, signal })
      ),
  });
