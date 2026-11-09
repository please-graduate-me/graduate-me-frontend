import { jsonBody, request, type Transport } from '@/lib/api/request';
import { learningProfileSchema, type LearningProfile } from '../model/profile';

/** 저장된 학습 언어·수준·관심 주제를 조회한다. */
export const getLearningProfile = (transport?: Transport) =>
  request('/api/me/profile', learningProfileSchema, undefined, transport);

/** 학습 설정 변경은 기록을 삭제하지 않고 프로필만 갱신한다. */
export const saveLearningProfile = (input: LearningProfile) =>
  request('/api/me/profile', learningProfileSchema, {
    ...jsonBody(learningProfileSchema.parse(input)),
    method: 'PATCH',
  });
