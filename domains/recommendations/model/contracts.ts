import { z } from 'zod';

/** 접근 가능한 영상과 실제 적용한 추천 이유만 검증한다. */
export const recommendationsSchema = z.object({
  language: z.enum(['en', 'th']),
  items: z.array(
    z.object({
      id: z.string(),
      youtubeId: z.string(),
      title: z.string(),
      duration: z.number().nullable(),
      category: z.string().nullable(),
      averageLength: z.number().nullable(),
      completed: z.boolean(),
      language: z.enum(['en', 'th']),
      reason: z.string(),
      levelMatch: z.boolean(),
      difficulty: z.string(),
      score: z.number(),
    })
  ),
  insufficientCandidates: z.boolean(),
  basis: z.string(),
  savedExpressionCount: z.number(),
});

/** 영상 추천 응답은 학습 결과나 정밀 능력 진단과 구분한다. */
export type Recommendations = z.infer<typeof recommendationsSchema>;
