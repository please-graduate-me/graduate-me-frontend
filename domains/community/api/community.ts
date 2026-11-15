import { z } from 'zod';
import { request, jsonBody, type Transport } from '@/lib/api/request';
import type { SourceInput } from '@/domains/materials/model/source';
import {
  communityPostsSchema,
  communityHelpersSchema,
  communityPostSchema,
  relatedCommunityPostsSchema,
  savedCommunityPostSchema,
  taggedCountSchema,
  type CommunityPostKind,
} from '../model/contracts';

const endpoint = (id: string) =>
  `/api/community/posts/${encodeURIComponent(id)}`;

const ok = z.object({ ok: z.literal(true) });

/** 검색·언어·팔로우 조건을 서버의 권한 필터와 함께 조회한다. */
export const listCommunityPosts = (
  input: {
    language: 'en' | 'th';
    q?: string;
    following?: boolean;
    tagged?: boolean;
    helpers?: boolean;
    kind?: CommunityPostKind;
    page?: number;
  },
  transport?: Transport
) =>
  request(
    `/api/community/posts?${new URLSearchParams({ language: input.language, q: input.q ?? '', following: String(input.following ?? false), tagged: String(input.tagged ?? false), helpers: String(input.helpers ?? false), page: String(input.page ?? 1), limit: '20', ...(input.kind ? { kind: input.kind } : {}) })}`,
    communityPostsSchema,
    undefined,
    transport
  );

/** 글 공개 범위가 허용된 경우에만 본문과 댓글을 받는다. */
export const getCommunityPost = (id: string, transport?: Transport) =>
  request(endpoint(id), communityPostSchema, undefined, transport);

/** 같은 자료·페이지 또는 같은 영상 구간에 달린 읽기 가능한 다른 글을 가져온다. */
export const listRelatedCommunityPosts = (id: string, transport?: Transport) =>
  request(
    `${endpoint(id)}/related`,
    relatedCommunityPostsSchema,
    undefined,
    transport
  );

/** 조교 배지에 쓸 미응답 태그 글 수이며 조교가 아니면 0이다. */
export const getTaggedCount = (transport?: Transport) =>
  request(
    '/api/community/tagged/count',
    taggedCountSchema,
    undefined,
    transport
  );

type CommunityPostInput = {
  title: string;
  body: string;
  language: 'en' | 'th';
  visibility: 'public' | 'accounts';
  allowedUserIds?: string[];
  taggedHelperIds?: string[];
  source?: SourceInput;
};

const savePost = (
  input: CommunityPostInput & { kind?: CommunityPostKind },
  id?: string
) =>
  request(
    id ? endpoint(id) : '/api/community/posts',
    savedCommunityPostSchema,
    { ...jsonBody(input), method: id ? 'PATCH' : 'POST' }
  );

/** 명시적으로 확인한 내용과 발췌만 일반 글에 공유하며 새 글은 종류가 필수다. */
export function saveCommunityPost(
  input: CommunityPostInput & { kind: CommunityPostKind }
): ReturnType<typeof savePost>;

/** 수정은 종류를 생략하면 서버가 기존 종류를 유지한다. */
export function saveCommunityPost(
  input: CommunityPostInput & { kind?: CommunityPostKind },
  id: string
): ReturnType<typeof savePost>;

export function saveCommunityPost(
  input: CommunityPostInput & { kind?: CommunityPostKind },
  id?: string
) {
  return savePost(input, id);
}

/** 작성자의 요청으로 게시글을 삭제한다. */
export const deleteCommunityPost = (id: string) =>
  request(endpoint(id), ok, { method: 'DELETE' });

/** 선택한 글의 댓글을 작성하며 개인 질문 이력과 섞지 않는다. */
export const addCommunityComment = (id: string, body: string) =>
  request(
    `${endpoint(id)}/comments`,
    z.object({ id: z.string() }),
    jsonBody({ body })
  );

/** 작성자 또는 글 소유자가 허용된 댓글만 삭제한다. */
export const deleteCommunityComment = (id: string, commentId: string) =>
  request(`${endpoint(id)}/comments/${encodeURIComponent(commentId)}`, ok, {
    method: 'DELETE',
  });

/** 일반 게시글의 추천 선택을 계정별로 저장한다. */
export const reactToCommunityPost = (id: string, active: boolean) =>
  request(`${endpoint(id)}/reaction`, ok, jsonBody({ active }));

/** 명시적으로 선택한 작성자의 글을 팔로우한다. */
export const followCommunityAuthor = (id: string, active: boolean) =>
  request(
    `/api/community/follows/${encodeURIComponent(id)}`,
    ok,
    jsonBody({ active })
  );

/** 운영 검토에 필요한 일반 게시글 신고 사유만 전달한다. */
export const reportCommunityPost = (id: string, reason: string) =>
  request(
    `${endpoint(id)}/reports`,
    z.object({ id: z.string() }),
    jsonBody({ reason })
  );

/** 태그 선택지에는 활성 조교의 이름과 식별자만 사용한다. */
export const listCommunityHelpers = () =>
  request('/api/community/helpers', communityHelpersSchema);
