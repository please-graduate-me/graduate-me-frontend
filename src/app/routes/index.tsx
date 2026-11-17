import { createFileRoute, redirect } from '@tanstack/react-router';
import { safeReturnPath } from '@/domains/auth/lib/returnPath';

/** 기존 로그인 콜백 주소의 복귀 경로와 오류를 새 로그인 화면으로 전달한다. */
export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>) => ({
    returnTo: typeof search.returnTo === 'string' ? search.returnTo : undefined,
    error: typeof search.error === 'string' ? search.error : undefined,
  }),
  beforeLoad: ({ search }) => {
    throw redirect({
      to: '/login',
      search: {
        returnTo: safeReturnPath(search.returnTo),
        error: search.error,
      },
    });
  },
});
