import { request, type Transport } from '@/lib/api/request';
import { learningSummarySchema } from '../model/summary';

/** 개인 자료와 표현, 질문의 최근 상태를 같은 응답으로 가져온다. */
export const getLearningSummary = (transport?: Transport) =>
  request('/api/learning/summary', learningSummarySchema, undefined, transport);
