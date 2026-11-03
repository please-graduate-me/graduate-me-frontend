import { z } from 'zod';

/** 목록 요청의 크기를 제한하고 정렬 방식을 명시한다. */
export const publicVideoQuerySchema = z.object({
  category: z.string().trim().min(1).max(100).optional(),
  q: z.string().trim().max(100).optional(),
  sort: z.enum(['popular', 'latest']).default('popular'),
  page: z.coerce.number().int().min(1).max(10000).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

/** 서버 조회와 요청 검증이 같은 정렬 규칙을 사용하게 한다. */
export type PublicVideoQuery = z.infer<typeof publicVideoQuerySchema>;

/** 공개 목록에는 개인 학습 정보와 전사 정답을 포함하지 않는다. */
export const publicVideoListSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      youtubeId: z.string(),
      title: z.string(),
      duration: z.number().nullable(),
      category: z.string().nullable(),
      downloadedAt: z.string().nullable(),
      likeCount: z.number().int().nonnegative(),
    })
  ),
  page: z.number().int(),
  limit: z.number().int(),
  hasMore: z.boolean(),
});

/** 홈의 카테고리 메뉴가 실제 준비된 영상의 분류를 사용하게 한다. */
export const publicCategoryListSchema = z.array(
  z.object({ category: z.string(), count: z.number().int().nonnegative() })
);
