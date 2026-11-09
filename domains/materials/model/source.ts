import { z } from 'zod';

/** 질문과 표현이 선택한 원문 위치를 잃지 않도록 입력을 검증한다. */
export const sourceInputSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('pdf'),
    materialId: z.string(),
    page: z.number().int().positive(),
    quote: z.string().trim().min(1).max(5000),
  }),
  z.object({
    kind: z.literal('video'),
    videoId: z.string(),
    segmentId: z.string(),
    quote: z.string().trim().min(1).max(5000),
  }),
]);

/** 서버가 확인한 자료 제목과 언어를 원문 위치에 결합한다. */
export const sourceSchema = z.intersection(
  sourceInputSchema,
  z.object({
    title: z.string(),
    language: z.enum(['en', 'th']),
    start: z.number().optional(),
    end: z.number().optional(),
  })
);

/** 등록 전에 필요한 원문 위치를 명시한다. */
export type SourceInput = z.infer<typeof sourceInputSchema>;

/** 서버에서 검증한 원문 출처를 표시한다. */
export type Source = z.infer<typeof sourceSchema>;
