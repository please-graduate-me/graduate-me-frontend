import { z } from 'zod';
import { jsonBody, request, type Transport } from '@/lib/api/request';
import type { SourceInput } from '@/domains/materials/model/source';
import {
  aiCapabilitiesSchema,
  conversationSchema,
  exerciseResultSchema,
  exerciseSchema,
  explanationSchema,
} from '../model/contracts';

const sourceQuery = (source: SourceInput) =>
  new URLSearchParams(
    source.kind === 'pdf'
      ? {
          kind: source.kind,
          materialId: source.materialId,
          page: String(source.page),
          version: String(source.version ?? 1),
          ocrId: source.ocrId ?? 'none',
        }
      : {
          kind: source.kind,
          videoId: source.videoId,
          segmentId: source.segmentId,
          version: String(source.version ?? 1),
        }
  ).toString();

const endpoint = (id: string) => `/api/ai/practice/${encodeURIComponent(id)}`;

/** 설명 패널을 열 때에는 모델을 실행하지 않고 저장 결과만 조회한다. */
export const listExplanations = (source: SourceInput) =>
  request(
    `/api/ai/explanations?${sourceQuery(source)}`,
    z.object({ items: z.array(explanationSchema) })
  );

/** 선택 원문의 명시적 설명 요청만 생성 API에 전달한다. */
export const generateExplanation = (input: {
  requestId: string;
  source: SourceInput;
  mode: 'meaning' | 'translation' | 'structure' | 'concept';
  explanationLanguage?: 'ko' | 'en' | 'th';
  image?: { base64: string; mimeType: 'image/png' | 'image/jpeg' };
}) => request('/api/ai/explanations', explanationSchema, jsonBody(input));

/** 기본 준비도 명시한 페이지 범위로 한정하고 실패 범위를 구분한다. */
export const prepareMaterial = (
  id: string,
  input: {
    requestId: string;
    fromPage: number;
    toPage: number;
    explanationLanguage?: 'ko' | 'en' | 'th';
  }
) =>
  request(
    `/api/materials/${encodeURIComponent(id)}/prepare`,
    z.object({
      items: z.array(explanationSchema),
      failed: z.array(z.object({ page: z.number(), error: z.string() })),
      range: z.object({
        fromPage: z.number(),
        toPage: z.number(),
        totalPages: z.number(),
      }),
    }),
    jsonBody(input)
  );

/** 키 설정과 서버 한도를 조회하고 임의의 준비 완료 상태를 만들지 않는다. */
export const getAiCapabilities = () =>
  request('/api/ai/capabilities', aiCapabilitiesSchema);

/** 저장된 개인 대화를 다시 열 때 새 답변을 생성하지 않는다. */
export const listConversations = (source: SourceInput) =>
  request(
    `/api/ai/conversations?${sourceQuery(source)}`,
    z.object({ items: z.array(conversationSchema) })
  );

/** 대화 생성은 원문 연결만 만들며 실제 질문 제출과 분리한다. */
export const openConversation = (source: SourceInput) =>
  request('/api/ai/conversations', conversationSchema, jsonBody({ source }));

/** 다른 화면에서 저장한 후속 질문도 대화 재진입 시 복원한다. */
export const getConversation = (id: string) =>
  request(
    `/api/ai/conversations/${encodeURIComponent(id)}`,
    conversationSchema
  );

/** 후속 질문은 원래 대화와 원문 위치를 유지한다. */
export const sendAiMessage = (
  id: string,
  input: { requestId: string; text: string }
) =>
  request(
    `/api/ai/conversations/${encodeURIComponent(id)}/messages`,
    conversationSchema,
    jsonBody(input)
  );

/** 저장된 연습의 재풀이는 AI 생성 요청 없이 조회한다. */
export const listExercises = (language?: 'en' | 'th', transport?: Transport) =>
  request(
    `/api/ai/practice${language ? '?language=' + language : ''}`,
    z.object({ items: z.array(exerciseSchema) }),
    undefined,
    transport
  );

/** 선택 원문과 실제 저장 항목에 기반해 적용 문제를 생성한다. */
export const generateExercises = (input: {
  requestId: string;
  source?: SourceInput;
  expressionIds?: string[];
  language: 'en' | 'th';
  type?: 'choice' | 'short_answer' | 'free_response';
  count?: number;
  explanationId?: string;
}) =>
  request(
    '/api/ai/practice/generate',
    z.object({ items: z.array(exerciseSchema) }),
    jsonBody(input)
  );

/** 초안과 연습 제외 상태를 문제 버전과 묶어 저장한다. */
export const updateExerciseState = (
  id: string,
  input: { version: number; draft?: string; excluded?: boolean }
) =>
  request(`${endpoint(id)}/state`, exerciseSchema, {
    ...jsonBody(input),
    method: 'PATCH',
  });

/** 저장된 힌트 공개와 사용 이력을 별도 기록한다. */
export const revealExerciseHint = (id: string, version: number) =>
  request(
    `${endpoint(id)}/hint`,
    z.object({ hint: z.string(), state: exerciseSchema.shape.state }),
    jsonBody({ version })
  );

/** 정답 열람은 제출에 의한 성공과 구분한다. */
export const revealExerciseAnswer = (id: string, version: number) =>
  request(
    `${endpoint(id)}/reveal`,
    z.object({
      answer: z.string(),
      explanation: z.string(),
      state: exerciseSchema.shape.state,
    }),
    jsonBody({ version })
  );

/** 제출 답안과 요청 식별자를 함께 보내 중복 기록을 막는다. */
export const answerExercise = (
  id: string,
  input: { requestId: string; version: number; answer: string }
) => request(`${endpoint(id)}/answer`, exerciseResultSchema, jsonBody(input));

/** 수정 전후와 무관하게 당시 제출 근거의 이력을 조회한다. */
export const listExerciseAttempts = (id: string) =>
  request(
    `${endpoint(id)}/attempts`,
    z.object({ items: z.array(exerciseResultSchema) })
  );
