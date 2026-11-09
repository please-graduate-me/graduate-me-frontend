import { z } from 'zod';
import { materialSummarySchema } from '@/domains/materials/model/contracts';
import { questionSummarySchema } from '@/domains/questions/model/contracts';
import { expressionSchema } from '@/domains/expressions/model/contracts';

/** 학습 홈에는 현재 계정의 실제 요약과 최근 활동만 표시한다. */
export const learningSummarySchema = z.object({
  materials: z.number().int().nonnegative(),
  expressions: z.number().int().nonnegative(),
  questions: z.number().int().nonnegative(),
  unanswered: z.number().int().nonnegative(),
  recentMaterials: z.array(materialSummarySchema),
  recentQuestions: z.array(questionSummarySchema),
  recentExpressions: z.array(expressionSchema),
});

/** 학습 홈에서 사용하는 검증된 집계 계약이다. */
export type LearningSummary = z.infer<typeof learningSummarySchema>;
