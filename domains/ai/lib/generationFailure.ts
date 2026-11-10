import { ApiError } from '@/lib/api/request';

/** 응답 유실과 진행 중인 작업을 새 유료 생성으로 바꾸지 않고 서버의 확정 실패만 구분한다. */
export function canStartNewGeneration(error: unknown) {
  return (
    error instanceof ApiError &&
    error.status === 502 &&
    (error.code === 'AI_RESULT_REJECTED' ||
      error.code === 'AI_OPERATION_FAILED')
  );
}
