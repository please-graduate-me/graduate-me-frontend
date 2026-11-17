import { request, type Transport } from '@/lib/api/request';
import { learningInsightsSchema } from '../model/insights';

/** 기간과 언어를 고정해 실제 답안에서 계산한 관찰 결과를 조회한다. */
export const getLearningInsights = (
  language: 'en' | 'th',
  days = 30,
  transport?: Transport
) =>
  request(
    `/api/learning/insights?language=${language}&days=${days}`,
    learningInsightsSchema,
    undefined,
    transport
  );
