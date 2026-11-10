import { z } from 'zod';

/** 실제 저장된 학습 활동만 기록 화면에 표시한다. */
export const learningHistorySchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      kind: z.enum([
        'practice',
        'question',
        'material',
        'exercise',
        'video',
        'annotation',
        'explanation',
        'conversation',
        'watch',
      ]),
      language: z.enum(['en', 'th']).nullable().optional(),
      title: z.string(),
      detail: z.string(),
      createdAt: z.string(),
      href: z.string(),
    })
  ),
});

/** 기록 화면에서 사용하는 실제 활동 계약이다. */
export type LearningHistory = z.infer<typeof learningHistorySchema>['items'];

/** 자가점검 결과의 저장 식별자를 확인한다. */
export const practiceResultSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
});
