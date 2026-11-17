import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, browserTransport, jsonBody, request } from './request';

afterEach(() => vi.unstubAllGlobals());

const parser = {
  parse(value: unknown) {
    if (typeof value !== 'string') throw new Error('문자열 응답이 필요합니다.');

    return value;
  },
};

describe('HTTP 경계', () => {
  it('기존 헤더와 본문을 유지하면서 프록시에도 JSON 오류 응답을 요청한다', async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => Response.json('ok'));

    vi.stubGlobal('fetch', fetchMock);
    await browserTransport('/example', jsonBody({ value: 1 }));
    const options = fetchMock.mock.calls[0]?.[1] as RequestInit;

    expect(new Headers(options.headers).get('Accept')).toBe('application/json');

    expect(new Headers(options.headers).get('Content-Type')).toBe(
      'application/json'
    );

    expect(options.body).toBe(JSON.stringify({ value: 1 }));
  });

  it('성공 응답도 계약에 맞는지 검사한다', async () => {
    await expect(
      request('/example', parser, undefined, async () =>
        Response.json({ value: 'wrong' })
      )
    ).rejects.toThrow('문자열 응답');
  });

  it('오류 상태와 서버 오류 문구를 보존한다', async () => {
    await expect(
      request('/example', parser, undefined, async () =>
        Response.json({ error: '찾을 수 없습니다.' }, { status: 404 })
      )
    ).rejects.toEqual(new ApiError(404, '찾을 수 없습니다.'));
  });

  it('JSON이 아닌 오류 응답에도 사용자용 오류를 반환한다', async () => {
    await expect(
      request(
        '/example',
        parser,
        undefined,
        async () => new Response('bad gateway', { status: 502 })
      )
    ).rejects.toEqual(
      new ApiError(502, '요청을 처리하지 못했습니다. (HTTP 502)')
    );
  });

  it('서버 실패 사유·확정 실패 코드·요청 식별자를 함께 보존한다', async () => {
    const id = 'ea609bf4-2144-4e44-99c4-0535f4db3a12';

    await expect(
      request('/example', parser, undefined, async () =>
        Response.json(
          {
            error: '원문 인용 검증에 실패했습니다.',
            code: 'AI_RESULT_REJECTED',
            requestId: id,
          },
          { status: 502 }
        )
      )
    ).rejects.toEqual(
      new ApiError(
        502,
        '원문 인용 검증에 실패했습니다.',
        id,
        'AI_RESULT_REJECTED'
      )
    );
  });

  it('본문이 없는 프록시 오류도 상태와 유효한 헤더 식별자를 남긴다', async () => {
    const id = 'ea609bf4-2144-4e44-99c4-0535f4db3a12';

    await expect(
      request(
        '/example',
        parser,
        undefined,
        async () =>
          new Response('', { status: 503, headers: { 'X-Request-Id': id } })
      )
    ).rejects.toEqual(
      new ApiError(503, '요청을 처리하지 못했습니다. (HTTP 503)', id)
    );
  });

  it('전송 실패와 응답에 섞인 잘못된 추적 값을 구분한다', async () => {
    await expect(
      request('/example', parser, undefined, async () => {
        throw new TypeError('fetch failed');
      })
    ).rejects.toEqual(
      new ApiError(0, '응답을 받지 못했습니다. 네트워크 연결을 확인해 주세요.')
    );

    await expect(
      request('/example', parser, undefined, async () =>
        Response.json(
          {
            error: '실패했습니다.',
            requestId: '잘못된 추적 값',
            code: 'bad code',
          },
          { status: 500 }
        )
      )
    ).rejects.toEqual(new ApiError(500, '실패했습니다.'));
  });

  it('호출자가 넘긴 전송 함수에 요청 본문을 그대로 전달한다', async () => {
    const init = jsonBody({ value: 1 });

    expect(
      await request('/example', parser, init, async (path, options) => {
        expect(path).toBe('/example');
        expect(options).toEqual(init);

        return Response.json('ok');
      })
    ).toBe('ok');
  });
});
