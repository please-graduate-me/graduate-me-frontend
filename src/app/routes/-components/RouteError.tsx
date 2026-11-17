import { useRouter, type ErrorComponentProps } from '@tanstack/react-router';
import { ApiError } from '@/lib/api/request';
import { ErrorView } from './ErrorView';
import { NotFoundView } from './NotFoundView';
import { SessionRecovery } from './SessionRecovery';

/** 접근할 수 없는 자원과 세션 만료를 일반 조회 실패와 구분한다. */
export function RouteError({ error, reset }: ErrorComponentProps) {
  const router = useRouter();

  if (error instanceof ApiError && error.status === 401)
    return <SessionRecovery />;
  if (error instanceof ApiError && [403, 404, 410].includes(error.status))
    return <NotFoundView />;

  return (
    <ErrorView
      reset={() => {
        reset();
        void router.invalidate();
      }}
    />
  );
}
