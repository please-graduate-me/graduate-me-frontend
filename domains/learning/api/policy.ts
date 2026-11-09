import { request, type Transport } from '@/lib/api/request';
import { learningPolicySchema } from '../model/policy';

/** 인증된 사용자의 현재 등록·분석 한도를 조회한다. */
export const getLearningPolicy = (transport?: Transport) =>
  request('/api/learning/policy', learningPolicySchema, undefined, transport);
