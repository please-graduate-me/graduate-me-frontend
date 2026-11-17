import type { QueryClient } from '@tanstack/react-query';
import { sessionQuery } from '@/domains/auth/api/queries';

/** 계정이 바뀌거나 세션이 끝나면 이전 사용자의 조회 캐시를 제거한다. */
export async function checkSession(client: QueryClient) {
  const previous = client.getQueryData(sessionQuery.queryKey);
  const session = await client.fetchQuery(sessionQuery);

  if (!session || previous?.user.id !== session.user.id) {
    await client.cancelQueries({
      predicate: (query) => query.queryKey[0] !== 'auth',
    });

    client.removeQueries({
      predicate: (query) => query.queryKey[0] !== 'auth',
    });
  }

  return session;
}
