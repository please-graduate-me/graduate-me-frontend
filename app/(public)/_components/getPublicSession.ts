import 'server-only';
import { cache } from 'react';
import { getSession, isAuthConfigured } from '@/domains/auth/api/auth';
import { createServerTransport } from '@/lib/api/server';

/** 공개 헤더와 시작 화면이 같은 렌더링 요청 안에서 인증 상태를 공유한다. */
export const getPublicSession = cache(async () => {
  const transport = await createServerTransport();
  const configured = await isAuthConfigured(transport);
  const session = configured ? await getSession(transport) : null;

  return { configured, session };
});
