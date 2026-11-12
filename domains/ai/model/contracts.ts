import { rewardReceiptSchema } from '@/domains/growth/model/contracts';
import { z } from 'zod';
import { sourceSchema } from '@/domains/materials/model/source';

const artifact = {
  id: z.string(),
  version: z.number().int(),
  status: z.enum(['ready', 'suspended']),
  reviewStatus: z.enum(['unreviewed', 'verified', 'needs_review']),
  needsReview: z.boolean(),
  source: sourceSchema,
  model: z.string(),
  provider: z.enum(['naver', 'anthropic']),
  createdAt: z.string(),
  updatedAt: z.string(),
};

/** 원문 인용과 모델의 추가 예문·추정을 구분해 검증한다. */
export const explanationSchema = z.object({
  ...artifact,
  kind: z.literal('explanation'),
  payload: z.object({
    contextDescription: z.string().optional(),
    evidenceType: z.enum(['page_image_and_text', 'text_only']).optional(),
    translation: z.string(),
    meaning: z.string(),
    structure: z.string(),
    concept: z.string(),
    examples: z.array(z.string()),
    uncertainty: z.string(),
    citations: z.array(z.object({ quote: z.string() })),
  }),
});

/** 현재 원문에 연결된 비공개 AI 대화의 저장 결과를 검증한다. */
export const conversationSchema = z.object({
  id: z.string(),
  source: sourceSchema,
  messages: z.array(
    z.object({
      id: z.string(),
      role: z.enum(['user', 'assistant']),
      text: z.string(),
      status: z.enum(['ready', 'failed', 'out_of_scope']),
      createdAt: z.string(),
      model: z.string().optional(),
      provider: z.enum(['naver', 'anthropic']).nullable().optional(),
      citations: z.array(z.object({ quote: z.string() })).optional(),
      uncertainty: z.string().optional(),
      contextDescription: z.string().optional(),
      evidenceType: z.enum(['page_image_and_text', 'text_only']).optional(),
    })
  ),
  createdAt: z.string(),
  updatedAt: z.string(),
});

/** 제출 시점의 정답·해설·근거 버전은 현재 문제와 구분해 보존한다. */
export const exerciseResultSchema = z.object({
  reward: rewardReceiptSchema.nullable().optional(),
  id: z.string(),
  artifactId: z.string(),
  version: z.number(),
  answer: z.string(),
  correct: z.boolean().nullable(),
  expectedAnswer: z.string(),
  explanation: z.string(),
  feedback: z.string().nullable(),
  hintUsed: z.boolean(),
  revealed: z.boolean(),
  source: sourceSchema,
  createdAt: z.string(),
});

/** 저장 문제의 공개 응답에는 미공개 정답과 해설을 요구하지 않는다. */
export const exerciseSchema = z.object({
  ...artifact,
  kind: z.literal('practice'),
  payload: z.object({
    type: z.enum(['choice', 'short_answer', 'free_response']),
    question: z.string(),
    choices: z.array(z.string()),
    sourceQuote: z.string(),
    practiceStyle: z.enum(['application', 'flex']).optional(),
    skill: z.enum(['reading', 'listening']).optional(),
  }),
  state: z.object({
    draft: z.string(),
    hintUsed: z.boolean(),
    revealed: z.boolean(),
    excluded: z.boolean(),
  }),
  latestResult: exerciseResultSchema.nullable(),
  expressionIds: z.array(z.string()),
});

/** 지원 여부 대신 서버의 설정·사용량 한도를 표시한다. */
export const aiCapabilitiesSchema = z.object({
  provider: z.enum(['naver', 'anthropic']),
  configured: z.boolean(),
  models: z.object({ text: z.string(), image: z.string() }),
  limits: z.object({
    dailyRequests: z.number(),
    dailyTokens: z.number(),
    concurrentRequests: z.number(),
    maxPreparationPages: z.number(),
  }),
});

/** 선택 원문의 저장된 설명에 사용하는 외부 응답 계약이다. */
export type Explanation = z.infer<typeof explanationSchema>;

/** 개인 대화의 표시·후속 질문에 사용하는 외부 응답 계약이다. */
export type Conversation = z.infer<typeof conversationSchema>;

/** 생성 연습 문제의 공개 응답 계약이다. */
export type Exercise = z.infer<typeof exerciseSchema>;

/** 과거 제출 당시의 정답·근거를 표시한다. */
export type ExerciseResult = z.infer<typeof exerciseResultSchema>;
