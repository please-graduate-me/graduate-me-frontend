import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getRecommendations,
  personalizeRecommendations,
} from './recommendations';

afterEach(() => vi.unstubAllGlobals());

const response = {
  language: 'en',
  items: [],
  insufficientCandidates: true,
  basis: '규칙 추천',
  savedExpressionCount: 0,
  personalization: null,
};

describe('추천 조회와 AI 개인화 요청 계약', () => {
  it('일반 조회는 생성 요청을 보내지 않는다', async () => {
    const fetch = vi.fn(async () => Response.json(response));

    vi.stubGlobal('fetch', fetch);
    const value = await getRecommendations('en');

    expect(value.personalization).toBeNull();
    expect(fetch).toHaveBeenCalledTimes(1);

    expect(fetch).toHaveBeenCalledWith(
      '/api/recommendations?language=en',
      expect.objectContaining({ cache: 'no-store' })
    );
  });

  it('명시적 생성에만 요청 식별자를 보내고 분석 요약을 검증한다', async () => {
    const personalization = {
      summary: '조건문 관련 기록',
      focusAreas: ['조건문 복습'],
      generatedAt: '2026-11-10T00:00:00Z',
      evidenceCount: 6,
      provider: 'naver',
      model: 'mock',
    };

    const fetch = vi.fn(async () =>
      Response.json({ ...response, personalization })
    );

    vi.stubGlobal('fetch', fetch);
    const value = await personalizeRecommendations('en', 'request-id');

    expect(value.personalization).toEqual(personalization);

    expect(fetch).toHaveBeenCalledWith(
      '/api/recommendations/personalize',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ language: 'en', requestId: 'request-id' }),
      })
    );
  });
});
