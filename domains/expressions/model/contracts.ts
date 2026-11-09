import { z } from 'zod';
import { sourceSchema } from '@/domains/materials/model/source';

/** 개인 표현의 뜻과 메모를 검증한 원문 출처와 함께 복원한다. */
export const expressionSchema = z.object({
  id: z.string(),
  text: z.string(),
  meaning: z.string(),
  note: z.string(),
  source: sourceSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

/** 개인 표현집의 목록 응답을 검증한다. */
export const expressionsSchema = z.object({ items: z.array(expressionSchema) });

/** 표현집에서 사용하는 검증된 표현 계약이다. */
export type Expression = z.infer<typeof expressionSchema>;
