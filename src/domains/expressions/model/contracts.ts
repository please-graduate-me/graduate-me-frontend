import { z } from 'zod';
import { sourceSchema } from '@/domains/materials/model/source';

/** 개인 표현의 뜻과 메모를 검증한 원문 출처와 함께 복원한다. */
export const expressionSchema = z.object({
  id: z.string(),
  text: z.string(),
  meaning: z.string(),
  note: z.string(),
  kind: z.enum(['word', 'phrase', 'sentence', 'concept']),
  reviewIncluded: z.boolean(),
  explanationId: z.string().nullable(),
  explanationVersion: z.number().nullable(),
  reviewStep: z.number().int().min(1).max(5),
  nextReviewOn: z.string().nullable(),
  reviewDue: z.boolean(),
  lastPracticedAt: z.string().nullable(),
  lastPracticeCorrect: z.boolean().nullable(),
  source: sourceSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

/** 개인 표현집의 목록 응답을 검증한다. */
export const expressionsSchema = z.object({ items: z.array(expressionSchema) });

/** 자가점검 덱은 다시 보기·오래 점검하지 않은 순서로 최대 10장이다. */
export const expressionReviewSchema = z.object({
  day: z.string(),
  scope: z.enum(['due', 'all']),
  dueCount: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
  items: z.array(expressionSchema).max(10),
});

/** 자가점검 덱의 검증된 응답이다. */
export type ExpressionReview = z.infer<typeof expressionReviewSchema>;

/** 표현집에서 사용하는 검증된 표현 계약이다. */
export type Expression = z.infer<typeof expressionSchema>;
