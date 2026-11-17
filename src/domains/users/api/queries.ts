import { queryOptions } from '@tanstack/react-query';
import { browserTransport } from '@/lib/api/request';
import { getLearningProfile } from './profile';

/** getLearningProfile 조회와 캐시 키를 같은 도메인에서 관리한다. */
export const getLearningProfileQuery = () =>
  queryOptions({
    queryKey: ['users', 'getLearningProfile'],
    queryFn: ({ signal }) =>
      getLearningProfile((path, init) =>
        browserTransport(path, { ...init, signal })
      ),
  });

import { getLearningSettings } from './settings';

/** getLearningSettings 조회와 캐시 키를 같은 도메인에서 관리한다. */
export const getLearningSettingsQuery = () =>
  queryOptions({
    queryKey: ['users', 'getLearningSettings'],
    queryFn: ({ signal }) =>
      getLearningSettings((path, init) =>
        browserTransport(path, { ...init, signal })
      ),
  });
