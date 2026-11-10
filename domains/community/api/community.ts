import { z } from 'zod';
import { request, jsonBody, type Transport } from '@/lib/api/request';
import type { SourceInput } from '@/domains/materials/model/source';
import {
  communityPostsSchema,
  communityPostSchema,
  savedCommunityPostSchema,
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
    page?: number;
  },
  transport?: Transport
) =>
  request(
    `/api/community/posts?${new URLSearchParams({ language: input.language, q: input.q ?? '', following: String(input.following ?? false), page: String(input.page ?? 1), limit: '20' })}`,
    communityPostsSchema,
    undefined,
    transport
  );

/** 글 공개 범위가 허용된 경우에만 본문과 댓글을 받는다. */
export const getCommunityPost = (id: string, transport?: Transport) =>
  request(endpoint(id), communityPostSchema, undefined, transport);

/** 명시적으로 확인한 내용과 발췌만 일반 글에 공유한다. */
export const saveCommunityPost = (
  input: {
    title: string;
    body: string;
    language: 'en' | 'th';
    visibility: 'public' | 'accounts';
    allowedUserIds?: string[];
    source?: SourceInput;
  },
  id?: string
) =>
  request(
    id ? endpoint(id) : '/api/community/posts',
    savedCommunityPostSchema,
    { ...jsonBody(input), method: id ? 'PATCH' : 'POST' }
  );

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
