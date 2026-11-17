import { request, jsonBody, type Transport } from '@/lib/api/request';
import { okSchema } from '@/lib/api/contracts';
import type { SourceInput } from '@/domains/materials/model/source';
import {
  expressionReviewSchema,
  expressionSchema,
  expressionsSchema,
} from '../model/contracts';

const endpoint = (id: string) => `/api/expressions/${encodeURIComponent(id)}`;

/** 내 표현집만 가져와 검색과 복습에 사용한다. */
export const listExpressions = (transport?: Transport) =>
  request('/api/expressions', expressionsSchema, undefined, transport);

/** 오늘 복습할 표현 또는 복습 포함 전체에서 이번 세션 덱을 가져온다. */
export const getExpressionReview = (
  input: { scope?: 'due' | 'all'; limit?: number } = {},
  transport?: Transport
) =>
  request(
    `/api/expressions/review?${new URLSearchParams({ scope: input.scope ?? 'due', limit: String(input.limit ?? 10) })}`,
    expressionReviewSchema,
    undefined,
    transport
  );

/** 선택한 원문과 표현을 함께 저장해 최초 문맥을 보존한다. */
export const createExpression = (input: {
  source: SourceInput;
  text: string;
  meaning?: string;
  note?: string;
  kind?: 'word' | 'phrase' | 'sentence' | 'concept';
  reviewIncluded?: boolean;
  explanationId?: string | null;
  explanationVersion?: number | null;
}) => request('/api/expressions', expressionSchema, jsonBody(input));

/** 뜻과 개인 메모만 변경하고 원문 출처는 유지한다. */
export const updateExpression = (
  id: string,
  patch: {
    meaning?: string;
    note?: string;
    kind?: 'word' | 'phrase' | 'sentence' | 'concept';
    reviewIncluded?: boolean;
  }
) =>
  request(endpoint(id), expressionSchema, {
    ...jsonBody(patch),
    method: 'PATCH',
  });

/** 개인 표현집에서만 표현을 삭제한다. */
export const deleteExpression = (id: string) =>
  request(endpoint(id), okSchema, { method: 'DELETE' });
