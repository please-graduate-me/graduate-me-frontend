import { request, jsonBody, type Transport } from '@/lib/api/request';
import type { SourceInput } from '@/domains/materials/model/source';
import {
  questionSchema,
  questionsSchema,
  recipientsSchema,
} from '../model/contracts';

const endpoint = (id: string) => `/api/questions/${encodeURIComponent(id)}`;

/** 질문자의 개인 질문 목록을 가져온다. */
export const listQuestions = (transport?: Transport) =>
  request('/api/questions', questionsSchema, undefined, transport);

/** 선택한 발췌와 수신자를 확인한 질문만 전송한다. */
export const createQuestion = (input: {
  title: string;
  body: string;
  source: SourceInput;
  assigneeId?: string;
  kind?: 'question' | 'report';
  attachment?:
    | { artifactId: string; version: number }
    | { conversationId: string; messageId: string };
}) => request('/api/questions', questionSchema, jsonBody(input));

/** 공개된 답변과 추가 질문을 복원한다. */
export const getQuestion = (id: string, transport?: Transport) =>
  request(endpoint(id), questionSchema, undefined, transport);

/** 추가 질문을 보내고 응답 대기 상태를 갱신한다. */
export const addQuestionMessage = (id: string, body: string) =>
  request(`${endpoint(id)}/messages`, questionSchema, jsonBody({ body }));

/** 같은 언어와 자료의 배정 가능한 도우미를 조회한다. */
export const listRecipients = (language: 'en' | 'th', materialId: string) =>
  request(
    `/api/questions/recipients?${new URLSearchParams({ language, materialId })}`,
    recipientsSchema
  );

/** 답변 완료와 학생의 해결 여부, 질문 공유 철회를 각각 저장한다. */
export const updateQuestion = (
  id: string,
  input: { resolved?: boolean; shared?: boolean }
) =>
  request(endpoint(id), questionSchema, {
    ...jsonBody(input),
    method: 'PATCH',
  });
