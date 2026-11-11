import { z } from 'zod';
import { sourceSchema } from '@/domains/materials/model/source';

const person = z.object({
  id: z.string(),
  name: z.string().nullable(),
  isHelper: z.boolean().default(false),
});

const post = {
  id: z.string(),
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

/** 페이지 조회에 사용하는 검증된 일반 글 목록이다. */
export type CommunityPosts = z.infer<typeof communityPostsSchema>;

/** 일반 글과 현재 공개 댓글의 검증된 상세다. */
export type CommunityPost = z.infer<typeof communityPostSchema>;
