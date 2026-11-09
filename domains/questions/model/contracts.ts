import { z } from 'zod';
import { sourceSchema } from '@/domains/materials/model/source';

/** 학생이 명시적으로 공유한 설명·문제·AI 답변 스냅샷만 표시한다. */
export const attachmentSchema = z.object({
  artifactId: z.string().optional(),
  version: z.number().optional(),
  kind: z.enum(['explanation', 'practice', 'ai_answer']),
  text: z.string(),
  payload: z.record(z.string(), z.unknown()).optional(),
});

const personSchema = z.object({ id: z.string(), name: z.string().nullable() });

/** 질문자는 본인 질문과 공개된 답변만 받는다. */
export const questionSummarySchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  kind: z.enum(['question', 'report']).optional(),
  resolvedAt: z.string().nullable().optional(),
  revokedAt: z.string().nullable().optional(),
  attachment: attachmentSchema.nullable().optional(),
  status: z.enum(['waiting', 'answered']),
  source: sourceSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  assignee: personSchema.nullable(),
  author: personSchema,
});

/** 내부 메모나 초안 없이 게시된 대화만 검증한다. */
export const questionSchema = questionSummarySchema.extend({
  messages: z.array(
    z.object({
      id: z.string(),
      body: z.string(),
      author: personSchema.extend({ id: z.string().nullable() }),
      kind: z.enum(['question', 'answer']),
      createdAt: z.string(),
    })
  ),
});

/** 내 질문 목록 응답을 검증한다. */
export const questionsSchema = z.object({
  items: z.array(questionSummarySchema),
});

/** 담당 언어와 자료 배정을 확인한 수신자만 선택하게 한다. */
export const recipientsSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      name: z.string().nullable(),
      languages: z.array(z.string()),
    })
  ),
});

/** 질문 목록과 필터의 항목 계약이다. */
export type QuestionSummary = z.infer<typeof questionSummarySchema>;

/** 공개 질문 대화의 상세 계약이다. */
export type Question = z.infer<typeof questionSchema>;
