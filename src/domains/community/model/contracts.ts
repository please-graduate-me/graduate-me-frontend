import { z } from 'zod';
import {
  sourceInputSchema,
  sourceSchema,
} from '@/domains/materials/model/source';

const person = z.object({
  id: z.string(),
  name: z.string().nullable(),
  isHelper: z.boolean().default(false),
});

/** 글 종류는 뜻 질문·문맥 질문·표현 의미·자유 글 네 가지다. */
export const communityPostKindSchema = z.enum([
  'meaning',
  'context',
  'expression',
  'free',
]);

const post = {
  id: z.string(),
  kind: communityPostKindSchema,
  ownerId: z.string(),
  title: z.string(),
  body: z.string(),
  language: z.enum(['en', 'th']),
  source: sourceSchema.nullable(),
  visibility: z.enum(['public', 'accounts']),
  allowedUserIds: z.array(z.string()).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  author: person,
  taggedHelperIds: z.array(z.string()),
  taggedHelpers: z.array(person),
  hiddenAt: z.string().nullable().optional(),
  owned: z.boolean(),
  likes: z.number(),
  liked: z.boolean(),
  following: z.boolean(),
  helperAnswered: z.boolean(),
  lastActivityAt: z.string(),
};

/** 커뮤니티에서 태그할 조교의 공개 프로필만 조회한다. */
export const communityHelpersSchema = z.object({ items: z.array(person) });

/** 공개 범위가 허용된 일반 게시글만 표시한다. */
export const communityPostsSchema = z.object({
  items: z.array(z.object({ ...post, comments: z.number() })),
  page: z.number(),
  limit: z.number(),
  hasMore: z.boolean(),
});

/** 댓글과 일반 게시글은 비공개 도우미 질문과 별도로 관리한다. */
export const communityPostSchema = z.object({
  ...post,
  expressionSource: sourceInputSchema.nullable(),
  comments: z.array(
    z.object({
      id: z.string(),
      body: z.string(),
      createdAt: z.string(),
      author: person,
      hiddenAt: z.string().nullable().optional(),
      owned: z.boolean(),
    })
  ),
});

/** 작성·수정 응답은 댓글의 개수만 반환한다. */
export const savedCommunityPostSchema = z.object({
  ...post,
  comments: z.number(),
});

/** 같은 원문 구절에 달린 다른 글 최대 5개다. */
export const relatedCommunityPostsSchema = z.object({
  items: z.array(z.object({ ...post, comments: z.number() })),
});

/** 조교에게 나를 태그했지만 아직 답하지 않은 글 수다. */
export const taggedCountSchema = z.object({
  count: z.number().int().nonnegative(),
});

/** 글 종류 식별자다. */
export type CommunityPostKind = z.infer<typeof communityPostKindSchema>;

/** 페이지 조회에 사용하는 검증된 일반 글 목록이다. */
export type CommunityPosts = z.infer<typeof communityPostsSchema>;

/** 일반 글과 현재 공개 댓글의 검증된 상세다. */
export type CommunityPost = z.infer<typeof communityPostSchema>;
