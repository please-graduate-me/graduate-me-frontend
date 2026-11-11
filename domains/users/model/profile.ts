import { z } from 'zod';

/** 학습 대상과 설명 언어를 분리해 이전 언어의 기록을 유지한다. */
export const learningProfileSchema = z.object({
  isHelper: z.boolean().default(false),
  targetLanguage: z.enum(['en', 'th']),
  explanationLanguage: z.enum(['ko', 'en', 'th']),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  interests: z.array(z.string().trim().min(1).max(100)).max(20),
});

/** 사용자 프로필의 입력과 응답에 같은 계약을 사용한다. */
export type LearningProfile = z.infer<typeof learningProfileSchema>;
