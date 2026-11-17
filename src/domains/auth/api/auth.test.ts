import { afterEach, describe, expect, it, vi } from 'vitest';
import { requestEmailCode, verifyEmailCode, signOut } from './auth';

afterEach(() => vi.unstubAllGlobals());

describe('학교 이메일 로그인 API 계약', () => {
  it('외부 이메일은 발송 요청 전에 거부한다', () => {
    vi.stubGlobal('fetch', vi.fn());
    expect(() => requestEmailCode('student@gmail.com')).toThrow();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('정규화한 학교 주소로 코드를 요청하고 응답에서 비밀 코드를 소비하지 않는다', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        Response.json({
          requestId: '00000000-0000-4000-8000-000000000001',
          expiresAt: '2099-01-01T00:00:00.000Z',
          resendAfterSeconds: 60,
        })
      )
    );

    const result = await requestEmailCode(' Student@HUFS.AC.KR ');

    expect(fetch).toHaveBeenCalledWith(
      '/api/auth/email/request',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'student@hufs.ac.kr' }),
      })
    );

    expect(result).not.toHaveProperty('code');
  });

  it('요청 식별자와 6자리 코드를 같은 검증 API로 전달한다', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Response.json({ ok: true }))
    );

    await verifyEmailCode(
      'student@hufs.ac.kr',
      '00000000-0000-4000-8000-000000000001',
      '012345'
    );

    expect(fetch).toHaveBeenCalledWith(
      '/api/auth/email/verify',
      expect.objectContaining({
        body: JSON.stringify({
          email: 'student@hufs.ac.kr',
          requestId: '00000000-0000-4000-8000-000000000001',
          code: '012345',
        }),
      })
    );
  });

  it('로그아웃에 OAuth나 CSRF 토큰 조회를 사용하지 않는다', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Response.json({ ok: true }))
    );

    await signOut();
    expect(fetch).toHaveBeenCalledOnce();

    expect(fetch).toHaveBeenCalledWith(
      '/api/auth/signout',
      expect.objectContaining({ method: 'POST' })
    );
  });
});
