import { z } from 'zod';

/** 등록과 AI 준비의 현재 서버 한도를 과거 자료 계약과 분리한다. */
export const learningPolicySchema = z.object({
  profile: z.enum(['mvp', 'standard']),
  pdf: z.object({
    maxBytes: z.number().int().positive(),
    maxPages: z.number().int().positive(),
    dailyNewLimit: z.number().int().positive(),
    preparationPages: z.number().int().positive(),
  }),
  video: z.object({
    maxSeconds: z.number().int().positive(),
    dailyNewLimit: z.number().int().positive(),
    transcriptionEnabled: z.boolean(),
  }),
  ai: z.object({
    dailyRequests: z.number().int().positive(),
    dailyTokens: z.number().int().positive(),
    concurrentRequests: z.number().int().positive(),
  }),
  suitability: z.object({
    requiresLearningConfirmation: z.boolean(),
    minTargetLetters: z.number().int().nonnegative(),
    subjectsRestricted: z.boolean(),
  }),
});

/** 등록 화면이 서버에서 받은 현재 정책만 사용한다. */
export type LearningPolicy = z.infer<typeof learningPolicySchema>;
