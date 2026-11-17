import { QueryClient } from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { sessionQuery } from '@/domains/auth/api/queries';
import { checkSession } from './checkSession';

afterEach(() => vi.unstubAllGlobals());

describe('계정별 조회 캐시 경계', () => {
  it.each([null, 'student-2'])(
    '세션이 %s로 바뀌면 이전 개인 캐시를 제거한다',
    async (id) => {
      const client = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      });

      const initialSession = {
        user: { id: 'student-1' },
        expires: '2099-01-01',
      };

      client.setQueryData(sessionQuery.queryKey, initialSession);

      client.setQueryData(['materials', 'list'], { items: ['개인 자료'] });

      vi.stubGlobal(
        'fetch',
        vi.fn(async () =>
          Response.json(id ? { user: { id }, expires: '2099-01-01' } : null)
        )
      );

      await checkSession(client);
      expect(client.getQueryData(['materials', 'list'])).toBeUndefined();
      client.clear();
    }
  );

  it('같은 계정의 세션 확인은 편집 중인 화면의 캐시를 제거하지 않는다', async () => {
    const client = new QueryClient();
    const session = { user: { id: 'student-1' }, expires: '2099-01-01' };

    client.setQueryData(sessionQuery.queryKey, session);
    client.setQueryData(['materials', 'list'], { items: ['개인 자료'] });

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Response.json(session))
    );

    await checkSession(client);

    expect(client.getQueryData(['materials', 'list'])).toEqual({
      items: ['개인 자료'],
    });

    client.clear();
  });
});
