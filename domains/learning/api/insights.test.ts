import { afterEach, describe, expect, it, vi } from 'vitest';
import { getLearningInsights } from './insights';

afterEach(() => vi.unstubAllGlobals());

describe('개인 학습 분석 계약', () => {
  it('언어와 기간을 조회에 반영하고 정답률 백분율과 부족 상태를 보존한다', async () => {
    const response = {
      language: 'th',
      days: 7,
      since: '2026-11-01T00:00:00Z',
      classificationVersion: 'observed-text-v1',
      sampleSize: 4,
      unassistedSamples: 2,
      excludedAssisted: 2,
      insufficientData: true,
      correct: 1,
      accuracy: 50,
      daysStudied: 1,
      categories: [],
      review: [],
      basis: '실제 시도만 집계',
      roadmap: [],
      roadmapBasis: '일반 권장',
    };

    const fetch = vi.fn(async () => Response.json(response));

    vi.stubGlobal('fetch', fetch);

    const value = await getLearningInsights('th', 7);

    expect(fetch).toHaveBeenCalledWith(
      '/api/learning/insights?language=th&days=7',
      { cache: 'no-store' }
    );

    expect(value.accuracy).toBe(50);
    expect(value.insufficientData).toBe(true);
    expect(value.excludedAssisted).toBe(2);
  });
});
