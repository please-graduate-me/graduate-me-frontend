import { request, jsonBody, type Transport } from '@/lib/api/request';
import {
  sessionSchema,
  authStatusSchema,
  schoolEmailSchema,
  emailChallengeSchema,
  authSuccessSchema,
} from '../model/contracts';

/** 세션 쿠키로 학교 이메일 인증을 마친 계정을 확인한다. */
export const getSession = (transport: Transport) =>
  request('/api/auth/session', sessionSchema, undefined, transport);

/** 메일 발송 설정이 준비됐을 때만 인증 화면을 활성화한다. */
export async function isAuthConfigured(transport: Transport) {
  return (
    await request('/api/auth-status', authStatusSchema, undefined, transport)
  ).configured;
}

/** 로그인 버튼을 누른 경우에만 학교 이메일로 인증 코드를 요청한다. */
export const requestEmailCode = (email: string) =>
  request(
    '/api/auth/email/request',
    emailChallengeSchema,
    jsonBody({ email: schoolEmailSchema.parse(email) })
  );

/** 코드 검증과 세션 발급은 백엔드가 함께 처리한다. */
export const verifyEmailCode = (
  email: string,
  requestId: string,
  code: string
) =>
  request(
    '/api/auth/email/verify',
    authSuccessSchema,
    jsonBody({ email: schoolEmailSchema.parse(email), requestId, code })
  );

/** 같은 출처의 POST 요청으로 서버 세션을 폐기한다. */
export const signOut = () =>
  request('/api/auth/signout', authSuccessSchema, { method: 'POST' });
