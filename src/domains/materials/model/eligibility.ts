import { z } from 'zod';

/** 새 AI 요청의 자료 적합성은 서버가 문자 단서와 확인 내용으로 판정한다. */
export const learningEligibilitySchema = z.object({
  status: z.enum([
    'eligible',
    'needs_ocr',
    'insufficient_text',
    'language_mismatch',
  ]),
  aiAllowed: z.boolean(),
  reason: z.string(),
});
