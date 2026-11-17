import { describe, expect, it } from 'vitest';
import { ApiError } from '@/lib/api/request';
import { canStartNewGeneration } from './generationFailure';

describe('명시적 새 생성의 실패 경계', () => {
  it('서버가 확정한 실패만 새 요청을 허용하고 응답 유실·진행 중·한도는 제외한다', () => {
    expect(
      canStartNewGeneration(
        new ApiError(502, '실패', undefined, 'AI_RESULT_REJECTED')
      )
    ).toBe(true);

    expect(
      canStartNewGeneration(
        new ApiError(502, '실패', undefined, 'AI_OPERATION_FAILED')
      )
    ).toBe(true);

    for (const error of [
      new ApiError(0, '연결 끊김'),
      new ApiError(502, '프록시 실패'),
      new ApiError(409, '처리 중'),
      new ApiError(429, '한도 초과'),
      new ApiError(429, '한도 초과', undefined, 'AI_OPERATION_FAILED'),
      new Error('실패'),
    ]) {
      expect(canStartNewGeneration(error)).toBe(false);
    }
  });
});
