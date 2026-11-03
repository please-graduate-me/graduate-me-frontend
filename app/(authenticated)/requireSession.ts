import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/domains/auth/api/auth';
import { videoPaths } from '@/domains/videos/config/paths';
import { createServerTransport } from '@/lib/api/server';

/** 레이아웃과 페이지가 병렬 실행되어도 개인 데이터 조회 전에 인증을 보장한다. */
export const requireSession = cache(async () => {
  const transport = await createServerTransport();
  const session = await getSession(transport);

  if (!session?.user) redirect(videoPaths.home);

  return { session, transport };
});
