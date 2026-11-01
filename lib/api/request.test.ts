import { describe, expect, it } from 'vitest';
import { ApiError, jsonBody, request } from './request';
const parser = {
  parse(value: unknown) {
    if (typeof value !== 'string') throw new Error('문자열 응답이 필요합니다.');
    return value;
  },
};
describe('HTTP 경계', () => {
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
    ).rejects.toEqual(new ApiError(502, '서버에 연결하지 못했습니다.'));
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
