import { request, jsonBody, type Transport } from '@/lib/api/request';
import { learningHistorySchema, practiceResultSchema } from '../model/history';

/** 자료 등록과 질문 및 자가점검의 저장 이력을 가져온다. */
export const getLearningHistory = (transport?: Transport) =>
  request('/api/learning/history', learningHistorySchema, undefined, transport);

/** AI 채점과 구분되는 사용자의 자가점검만 저장한다. */
export const savePracticeAttempt = (input: {
  expressionId: string;
  answer: string;
  correct: boolean;
}) =>
  request(
    '/api/practice/attempts',
    practiceResultSchema,
    jsonBody({ ...input, mode: 'self' })
  );
