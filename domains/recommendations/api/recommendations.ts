import { z } from 'zod';
import { request, jsonBody, type Transport } from '@/lib/api/request';
import { recommendationsSchema } from '../model/contracts';

/** 언어와 접근 권한을 적용한 서버 추천 목록을 조회한다. */
export const getRecommendations = (
  language: 'en' | 'th',
  transport?: Transport
) =>
  request(
    `/api/recommendations?language=${language}`,
    recommendationsSchema,
    undefined,
    transport
  );

/** 관심 없음 선택은 계정에 저장해 다음 추천에도 반영한다. */
export const setRecommendationInterest = (id: string, interested: boolean) =>
  request(
    `/api/recommendations/${encodeURIComponent(id)}/feedback`,
    z.object({ ok: z.literal(true) }),
    jsonBody({ interested })
  );

/** 실제 카드 노출과 학습 선택은 중복 방지 식별자와 함께 기록한다. */
export const recordRecommendationEvent = (
  id: string,
  requestId: string,
  action: 'shown' | 'selected'
) =>
  request(
    `/api/recommendations/${encodeURIComponent(id)}/events`,
    z.object({ ok: z.literal(true) }),
    { ...jsonBody({ requestId, action }), keepalive: true }
  );

/** 최근 학습 기록을 분석하는 명시적 요청만 AI 생성을 시작한다. */
export const personalizeRecommendations = (
  language: 'en' | 'th',
  requestId: string
) =>
  request(
    '/api/recommendations/personalize',
    recommendationsSchema,
    jsonBody({ language, requestId })
  );
