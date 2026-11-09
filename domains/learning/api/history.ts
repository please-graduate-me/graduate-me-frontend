import { request, jsonBody, type Transport } from '@/lib/api/request';
import { learningHistorySchema, practiceResultSchema } from '../model/history';

/** 자료·질문·AI 학습·받아쓰기의 실제 저장 활동을 가져온다. */
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
