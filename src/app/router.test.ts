import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { queryClient } from './queryClient';
import { router } from './router';

function testRouter(path: string) {
  const instance = createRouter({
    ...router.options,
    history: createMemoryHistory({ initialEntries: [path] }),
    isServer: true,
  });

  instance.history.replace(
    instance.buildLocation({
      to: instance.latestLocation.pathname,
      search: true,
      _includeValidateSearch: true,
    }).href
  );

  return instance;
}

beforeEach(() => {
  queryClient.clear();
});

afterEach(() => {
  queryClient.clear();
  vi.unstubAllGlobals();
});

describe('서비스 앱 라우팅', () => {
  it.each([
    '/library',
    '/materials?add=1',
    '/learn/video-1?segment=segment-2',
    '/courses/course-1/assignments/task-1',
    '/shared/share-1',
  ])('미로그인 접근 %s는 개인 조회 전에 로그인으로 보낸다', async (path) => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Response.json(null))
    );

    const instance = testRouter(path);

    await instance.load();
    const result = instance._serverResult;

    expect(result?.type).toBe('redirect');

    if (result?.type === 'redirect') {
      expect(result.redirect.options.to).toBe('/login');

      expect(result.redirect.options.search).toMatchObject({
        returnTo: expect.stringContaining(path.split('?')[0]),
      });
    }

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('/api/auth/session', expect.anything());
  });

  it('인증 실패를 로그인한 상태로 취급하거나 개인 조회로 이어가지 않는다', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        Response.json({ error: '세션 확인 실패' }, { status: 503 })
      )
    );

    const instance = testRouter('/materials');

    await instance.load();

    expect(
      instance.state.matches.some((match) => match.status === 'error')
    ).toBe(true);

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('기존 루트 콜백의 오류와 복귀 위치를 새 로그인 주소로 전달한다', async () => {
    const instance = testRouter(
      '/?error=EMAIL_LOGIN_FAILED&returnTo=%2Fmaterials%3Fadd%3D1'
    );

    await instance.load();
    const result = instance._serverResult;

    expect(
      result?.type === 'redirect' && result.redirect.options.search
    ).toEqual({ error: 'EMAIL_LOGIN_FAILED', returnTo: '/materials?add=1' });
  });

  it('로그인 복귀 경로로 외부 주소를 허용하지 않는다', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (path) =>
        Response.json(
          path === '/api/auth/session' ? null : { configured: true }
        )
      )
    );

    const instance = testRouter('/login?returnTo=https%3A%2F%2Fexample.test');

    await instance.load();

    expect(instance.state.matches.at(-1)?.search).toMatchObject({
      returnTo: '/library',
    });

    expect(instance.state.matches.at(-1)?.status).toBe('success');
  });

  it('로그인한 사용자는 개인 자료와 URL의 추가 조건을 복원한다', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (path) => {
        if (path === '/api/auth/session')
          return Response.json({
            user: { id: 'student-1' },
            expires: '2099-01-01T00:00:00.000Z',
          });
        if (path === '/api/me/profile')
          return Response.json({
            targetLanguage: 'en',
            explanationLanguage: 'ko',
            level: 'beginner',
            interests: [],
            isHelper: false,
          });
        if (path === '/api/materials') return Response.json({ items: [] });
        throw new Error('예상하지 않은 API 요청: ' + path);
      })
    );

    const instance = testRouter('/materials?add=1');

    await instance.load();
    const match = instance.state.matches.at(-1);

    expect(match?.search).toMatchObject({ add: '1' });
    expect(match?.status).toBe('success');
    expect(match?.loaderData).toMatchObject({ initial: { items: [] } });
  });
});
