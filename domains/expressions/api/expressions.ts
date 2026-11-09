import { request, jsonBody, type Transport } from '@/lib/api/request';
import { okSchema } from '@/lib/api/contracts';
import type { SourceInput } from '@/domains/materials/model/source';
import { expressionSchema, expressionsSchema } from '../model/contracts';

const endpoint = (id: string) => `/api/expressions/${encodeURIComponent(id)}`;

/** 내 표현집만 가져와 검색과 복습에 사용한다. */
export const listExpressions = (transport?: Transport) =>
  request('/api/expressions', expressionsSchema, undefined, transport);

/** 선택한 원문과 표현을 함께 저장해 최초 문맥을 보존한다. */
export const createExpression = (input: {
  source: SourceInput;
  text: string;
  meaning?: string;
  note?: string;
}) => request('/api/expressions', expressionSchema, jsonBody(input));

/** 뜻과 개인 메모만 변경하고 원문 출처는 유지한다. */
export const updateExpression = (
  id: string,
  patch: { meaning?: string; note?: string }
) =>
  request(endpoint(id), expressionSchema, {
    ...jsonBody(patch),
    method: 'PATCH',
  });

/** 개인 표현집에서만 표현을 삭제한다. */
export const deleteExpression = (id: string) =>
  request(endpoint(id), okSchema, { method: 'DELETE' });
