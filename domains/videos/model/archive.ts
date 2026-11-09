import { z } from 'zod';
import { sourceSchema } from '@/domains/materials/model/source';

/** 수정 전 구절은 당시 원문과 번역을 묶어 보관본으로 검증한다. */
export const archivedVideoSourceSchema = z.object({
  source: sourceSchema,
  text: z.string(),
  translation: z.string().nullable(),
  blankCandidates: z.array(z.number()).nullable(),
  version: z.number().int().positive(),
  currentVersion: z.number().int().positive(),
});

/** 과거 답안과 설명이 참조한 영상 구절의 보관본이다. */
export type ArchivedVideoSource = z.infer<typeof archivedVideoSourceSchema>;
