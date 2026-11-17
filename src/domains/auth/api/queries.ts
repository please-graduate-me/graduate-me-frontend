import { queryOptions } from '@tanstack/react-query';
import { browserTransport } from '@/lib/api/request';
import { getSession, isAuthConfigured } from './auth';

/** 개인 데이터 조회 전에 서버 세션을 새로 확인한다. */
export const sessionQuery = queryOptions({
  queryKey: ['auth', 'session'],
  queryFn: () => getSession(browserTransport),
  retry: false,
});

/** 로그인 버튼은 백엔드의 인증 준비 여부를 따른다. */
export const authStatusQuery = queryOptions({
  queryKey: ['auth', 'configured'],
  queryFn: () => isAuthConfigured(browserTransport),
  retry: false,
});
