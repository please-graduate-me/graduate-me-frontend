import { z } from 'zod';
import { sourceSchema } from './source';

/** 하이라이트와 개인 메모는 공유 발췌와 독립적으로 저장한다. */
export const annotationSchema = z.object({
  id: z.string(),
  source: sourceSchema,
  color: z.enum(['yellow', 'blue', 'green']),
  memo: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

/** 공유 관리는 원본 파일과 개인 기록을 응답에 포함하지 않는다. */
export const excerptShareSchema = z.object({
  id: z.string(),
  path: z.string(),
  source: sourceSchema,
  visibility: z.enum(['link', 'accounts']),
  allowedUserIds: z.array(z.string()),
  revokedAt: z.string().nullable(),
  createdAt: z.string(),
});

/** 하이라이트 표시의 위치·색상·메모 계약이다. */
export type Annotation = z.infer<typeof annotationSchema>;

/** 명시적으로 공유한 발췌의 권한과 철회 상태이다. */
export type ExcerptShare = z.infer<typeof excerptShareSchema>;
