import { z } from 'zod';

/** 관리자 목록의 조회 범위를 제한한다. */
export const adminShareQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(10000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().trim().max(100).optional(),
});

/** 관리자 목록 요청은 검증 규칙에서 추론한다. */
export type AdminShareQuery = z.infer<typeof adminShareQuerySchema>;

/** 관리자 화면은 접근 허용 여부만 확인하고 허용 이메일 목록은 받지 않는다. */
export const adminAccessSchema = z.object({ allowed: z.boolean() });

/** 공유별 집계와 공유자 정보는 관리자 응답에만 포함한다. */
export const adminSharesSchema = z.object({
  summary: z.object({
    links: z.number(),
    visits: z.number(),
    starts: z.number(),
  }),
  items: z.array(
    z.object({
      id: z.string(),
      createdAt: z.string(),
      revokedAt: z.string().nullable(),
      video: z.object({ title: z.string(), id: z.string() }),
      segment: z.object({ start: z.number(), end: z.number() }).nullable(),
      creator: z
        .object({ name: z.string().nullable(), email: z.string().nullable() })
        .nullable(),
      visitCount: z.number(),
      startCount: z.number(),
    })
  ),
  page: z.number(),
  hasMore: z.boolean(),
});

/** 관리자 화면과 서버가 같은 통계 응답을 사용한다. */
export type AdminShares = z.infer<typeof adminSharesSchema>;

/** 변경 요청의 성공 응답을 확인한다. */
export { okSchema } from '@/lib/api/contracts';
