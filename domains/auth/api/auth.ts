import { request, type Transport } from '@/lib/api/request';
import {
  sessionSchema,
  authStatusSchema,
  csrfSchema,
  authRedirectSchema,
} from '../model/contracts';

/** Next.js에 의존하지 않고 전달받은 전송 방식으로 세션을 조회한다. */
export const getSession = (transport: Transport) =>
  request('/api/auth/session', sessionSchema, undefined, transport);

/** 로그인 UI가 인증 설정의 준비 여부를 기준으로 동작하게 한다. */
export async function isAuthConfigured(transport: Transport) {
  return (
    await request('/api/auth-status', authStatusSchema, undefined, transport)
  ).configured;
}

/** 인증 동작 전에 서버가 발급한 토큰을 확보한다. */
export const getCsrfToken = () => request('/api/auth/csrf', csrfSchema);

/** 로그인 전송 형식이 화면 로직에 섞이지 않게 한다. */
export const signIn = (csrfToken: string, callbackUrl: string) =>
  request(
    '/api/auth/signin/google',
    authRedirectSchema,
    authBody(csrfToken, callbackUrl)
  );

/** 로그아웃도 서버의 CSRF 검증 절차를 거치게 한다. */
export const signOut = (csrfToken: string, callbackUrl: string) =>
  request(
    '/api/auth/signout',
    authRedirectSchema,
    authBody(csrfToken, callbackUrl)
  );

function authBody(csrfToken: string, callbackUrl: string): RequestInit {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Auth-Return-Redirect': '1',
    },
    body: new URLSearchParams({ csrfToken, callbackUrl }),
  };
}
