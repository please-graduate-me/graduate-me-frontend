import { rewardReceiptSchema } from '@/domains/growth/model/contracts';
import { modeSchema } from './mode';
import { z } from 'zod';
import { learningSettingsSchema } from '../../users/model/settings';

/** 오답 표시가 알 수 없는 비교 결과를 받지 않게 한다. */
export const differenceSchema = z.object({
  kind: z.enum(['match', 'missing', 'extra', 'replace']),
  expected: z.string().optional(),
  actual: z.string().optional(),
});

/** 검증 스키마에서 타입을 추론해 별도 선언의 불일치를 막는다. */
export type Difference = z.infer<typeof differenceSchema>;

/** 채점 결과의 정답 여부와 단어별 차이를 정의한다. */
export const gradeSchema = z.object({
  correct: z.boolean(),
  differences: z.array(differenceSchema),
});

/** 검증 스키마에서 타입을 추론해 별도 선언의 불일치를 막는다. */
export type Grade = z.infer<typeof gradeSchema>;

/** 전사 결과를 학습 화면이 사용할 수 있는 형태로 검증한다. */
export const segmentSchema = z.object({
  id: z.string(),
  index: z.number(),
  start: z.number(),
  end: z.number(),
  text: z.string(),
  blanks: z.array(z.number()),
  units: z.array(z.string()).optional(),
  translation: z.string().nullable().optional(),
  blankCandidates: z.array(z.number()).nullable().optional(),
  blankActualRatio: z.number().min(0).max(100).optional(),
  version: z.number().int().optional(),
  words: z.array(
    z.object({ word: z.string(), start: z.number(), end: z.number() })
  ),
});

/** 검증 스키마에서 타입을 추론해 별도 선언의 불일치를 막는다. */
export type Segment = z.infer<typeof segmentSchema>;

/** 모드별 답안과 완료 상태를 복원할 때 계약을 확인한다. */
export const segmentStateSchema = z.object({
  segmentId: z.string(),
  mode: modeSchema,
  draft: z.union([z.string(), z.array(z.string())]),
  status: z.string(),
  revealed: z.boolean(),
  blankRatio: z.number().optional(),
  hintCount: z.number().optional(),
  sourceVersion: z.number().int().optional(),
});

/** 검증 스키마에서 타입을 추론해 별도 선언의 불일치를 막는다. */
export type SegmentState = z.infer<typeof segmentStateSchema>;

/** 좋아요 재전송으로 상태가 반전되지 않도록 원하는 값을 받는다. */
export const videoLikeInputSchema = z.object({ liked: z.boolean() });

/** 공용 좋아요와 개인 관심 영상 표시를 별도로 변경한다. */
export const videoFavoriteInputSchema = z.object({ favorite: z.boolean() });

/** 개인 선택과 공용 집계가 같은 응답으로 갱신되게 한다. */
export const videoLikeSchema = z.object({
  liked: z.boolean(),
  likeCount: z.number().int().nonnegative(),
});

/** 잘못된 학습 자료가 재생과 답안 상태에 들어오지 않게 한다. */
export const lessonSchema = z.object({
  settings: learningSettingsSchema,
  video: z.object({
    id: z.string(),
    youtubeId: z.string(),
    title: z.string(),
    duration: z.number().nullable(),
    category: z.string().nullable(),
    liked: z.boolean(),
    likeCount: z.number().int().nonnegative(),
    language: z.enum(['en', 'th']).optional(),
    analysisVersion: z.number().optional(),
  }),
  job: z
    .object({
      status: z.string(),
      attempts: z.number(),
      errorMessage: z.string().nullable(),
    })
    .nullable(),
  progress: z.object({
    currentIndex: z.number(),
    mode: modeSchema,
    favorite: z.boolean(),
    blankRatio: z
      .union([z.literal(20), z.literal(40), z.literal(60)])
      .optional(),
    scriptViewed: z.boolean().optional(),
    watchVersion: z.string().optional(),
    watchRevision: z.number().int().nonnegative().optional(),
    playbackPosition: z.number().nonnegative().optional(),
    scriptPosition: z.number().nonnegative().optional(),
    scriptMaxPosition: z.number().nonnegative().optional(),
    watchMode: z.enum(['dictation', 'script']).optional(),
  }),
  preparation: z
    .object({
      transcription: z.enum(['ready', 'pending', 'failed']),
      translation: z.enum(['ready', 'pending', 'failed']),
      blanks: z.enum(['ready', 'pending', 'failed']),
      error: z.string().nullable(),
    })
    .optional(),
  completedCount: z.number().optional(),
  progressPercent: z.number().optional(),
  isComplete: z.boolean().optional(),
  difficultSegmentIds: z.array(z.string()),
  segments: z.array(segmentSchema),
  states: z.array(segmentStateSchema),
});

/** 검증 스키마에서 타입을 추론해 별도 선언의 불일치를 막는다. */
export type Lesson = z.infer<typeof lessonSchema>;

/** 제출 결과를 반영하기 전에 응답 형식을 확인한다. */
export const actionResultSchema = z.object({
  reward: rewardReceiptSchema.nullable().optional(),
  grade: gradeSchema.optional(),
  nextIndex: z.number().optional(),
  text: z.string().optional(),
  ok: z.boolean().optional(),
  hint: z.string().optional(),
  hintCount: z.number().optional(),
});

/** 검증 스키마에서 타입을 추론해 별도 선언의 불일치를 막는다. */
export type ActionResult = z.infer<typeof actionResultSchema>;

/** 목록 응답의 필수 정보가 빠진 상태를 조기에 발견한다. */
export const videoHistorySchema = z.array(
  z.object({
    videoId: z.string(),
    youtubeId: z.string().optional(),
    title: z.string(),
    currentIndex: z.number(),
    favorite: z.boolean(),
    difficultCount: z.number().int().nonnegative(),
    updatedAt: z.string(),
    category: z.string().nullable(),
    likeCount: z.number().int().nonnegative(),
    count: z.number(),
    status: z.string(),
    language: z.enum(['en', 'th']).optional(),
    completedCount: z.number().optional(),
    progressPercent: z.number().optional(),
    isComplete: z.boolean().optional(),
  })
);

/** 검증 스키마에서 타입을 추론해 별도 선언의 불일치를 막는다. */
export type VideoHistory = z.infer<typeof videoHistorySchema>;

/** 영상 등록 입력의 제한을 요청 양쪽에서 맞춘다. */
export const registerVideoSchema = z.object({
  learningPurposeConfirmed: z.literal(true),
  url: z.string().max(2048),
  language: z.enum(['en', 'th']).optional(),
});

/** 등록 후 이동할 영상 식별자가 있는지 확인한다. */
export const registeredVideoSchema = z.object({ videoId: z.string() });

/** 영상 요청의 동작 계약을 명시적으로 제공한다. */
export { actionSchema, type LearningAction } from './actions';

/** 영상 목록의 요청과 응답을 검증한다. */
export {
  publicVideoQuerySchema,
  publicVideoListSchema,
  publicCategoryListSchema,
  type PublicVideoQuery,
} from './catalog-contracts';

/** 변경 요청의 성공 여부를 확인한다. */
export { okSchema } from '@/lib/api/contracts';

/** 학습 화면이 지원하는 모드를 제공한다. */
export { type Mode } from './mode';
