import { z } from 'zod';

/** 실제 시도와 공개 도움을 구분한 관찰 통계만 표시한다. */
export const learningInsightsSchema = z.object({
  language: z.enum(['en', 'th']),
  days: z.number(),
  since: z.string(),
  classificationVersion: z.string(),
  sampleSize: z.number(),
  unassistedSamples: z.number(),
  excludedAssisted: z.number(),
  insufficientData: z.boolean(),
  correct: z.number(),
  accuracy: z.number().nullable(),
  daysStudied: z.number(),
  categories: z.array(z.object({ category: z.string(), count: z.number() })),
  review: z.array(
    z.object({
      evidence: z.object({
        id: z.string(),
        videoId: z.string(),
        segmentId: z.string(),
        title: z.string(),
        answer: z.union([z.string(), z.array(z.string())]),
        sourceText: z.string(),
        sourceVersion: z.number(),
        correct: z.boolean(),
        createdAt: z.string(),
        revealed: z.boolean(),
        hintCount: z.number(),
      }),
      mistakes: z.number(),
      attempts: z.number(),
      category: z.string(),
      href: z.string(),
    })
  ),
  basis: z.string(),
  roadmap: z.array(
    z.object({ year: z.number(), title: z.string(), goal: z.string() })
  ),
  roadmapBasis: z.string(),
});

/** 근거와 집계 기준이 포함된 개인 분석 결과다. */
export type LearningInsights = z.infer<typeof learningInsightsSchema>;
