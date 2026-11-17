import { z } from 'zod';

/** 원본 버전별 전체 정리의 진행률과 부분 결과를 함께 검증한다. */
export const materialAnalysisSchema = z.object({
  analysis: z
    .object({
      id: z.string(),
      version: z.number().int().positive(),
      status: z.enum([
        'queued',
        'running',
        'ready',
        'partial',
        'failed',
        'skipped',
      ]),
      explanationLanguage: z.enum(['ko', 'en', 'th']),
      totalPages: z.number().int().nonnegative(),
      completedPages: z.number().int().nonnegative(),
      error: z.string().nullable(),
      canRetry: z.boolean(),
      createdAt: z.string(),
      updatedAt: z.string(),
      overview: z
        .object({
          documentType: z.string(),
          introduction: z.string(),
          summary: z.array(z.string()),
          keyPoints: z.array(
            z.object({
              text: z.string(),
              pages: z.array(z.number().int().positive()),
            })
          ),
          vocabulary: z
            .array(
              z.object({
                id: z.string(),
                page: z.number().int().positive(),
                term: z.string(),
                lemma: z.string(),
                partOfSpeech: z.string(),
                meaning: z.string(),
                example: z.string(),
              })
            )
            .max(50),
        })
        .nullable(),
      pages: z.array(
        z.object({
          page: z.number().int().positive(),
          status: z.enum(['queued', 'ready', 'failed']),
          error: z.string().nullable(),
          translation: z.string().nullable(),
          sourceText: z.string().nullable(),
          summary: z.string().nullable(),
          warnings: z.array(z.string()),
          provider: z.string().nullable(),
          model: z.string().nullable(),
        })
      ),
    })
    .nullable(),
});

/** 완료된 문서 정리와 진행 중 페이지를 같은 화면에서 표시한다. */
export type MaterialAnalysisResponse = z.infer<typeof materialAnalysisSchema>;
