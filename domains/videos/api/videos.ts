import { request, jsonBody, type Transport } from '@/lib/api/request';
import {
  lessonSchema,
  actionResultSchema,
  videoHistorySchema,
  registerVideoSchema,
  registeredVideoSchema,
  okSchema,
  actionSchema,
  videoLikeInputSchema,
  videoLikeSchema,
  videoFavoriteInputSchema,
  publicVideoQuerySchema,
  publicVideoListSchema,
  publicCategoryListSchema,
  type PublicVideoQuery,
  type LearningAction,
} from '../model/contracts';

const endpoint = (id: string) => `/api/videos/${encodeURIComponent(id)}`;

/** 관심 영상은 개인 목록에만 반영한다. */
export const setVideoFavorite = (id: string, favorite: boolean) =>
  request(
    `${endpoint(id)}/favorite`,
    okSchema,
    jsonBody(videoFavoriteInputSchema.parse({ favorite }))
  );

/** 재등록하면 이어서 학습할 수 있도록 목록에서만 제거한다. */
export const removeVideoFromLibrary = (id: string) =>
  request(`${endpoint(id)}/remove`, okSchema, jsonBody({}));

/** 홈에서 공용 영상의 인기순과 카테고리별 조회를 재사용한다. */
export const listPublicVideos = (
  input: Partial<PublicVideoQuery> = {},
  transport?: Transport
) => {
  const query = publicVideoQuerySchema.parse(input);

  const params = new URLSearchParams(
    Object.entries(query).map(([key, value]) => [key, String(value)])
  );

  return request(
    `/api/catalog/videos?${params}`,
    publicVideoListSchema,
    undefined,
    transport
  );
};

/** 준비된 영상이 있는 카테고리와 개수를 가져온다. */
export const listPublicCategories = (transport?: Transport) =>
  request(
    '/api/catalog/categories',
    publicCategoryListSchema,
    undefined,
    transport
  );

/** 좋아요와 취소를 원하는 상태로 전송해 재시도에도 중복 집계되지 않게 한다. */
export const setVideoLike = (id: string, liked: boolean) =>
  request(
    `${endpoint(id)}/like`,
    videoLikeSchema,
    jsonBody(videoLikeInputSchema.parse({ liked }))
  );

/** 학습 목록 응답을 검증한 뒤 화면에 전달한다. */
export const listVideos = () => request('/api/videos', videoHistorySchema);

/** 등록 요청과 반환 식별자를 같은 경계에서 검증한다. */
export const registerVideo = (url: string, language: 'en' | 'th' = 'en') =>
  request(
    '/api/videos',
    registeredVideoSchema,
    jsonBody(registerVideoSchema.parse({ url, language }))
  );

/** 서버와 브라우저에서 동일한 학습 응답 계약을 사용한다. */
export const getLesson = (id: string, transport?: Transport) =>
  request(endpoint(id), lessonSchema, undefined, transport);

/** 자동 저장과 제출이 같은 요청 검증을 거치게 한다. */
export const applyLearningAction = (id: string, action: LearningAction) =>
  request(
    `${endpoint(id)}/actions`,
    actionResultSchema,
    jsonBody(actionSchema.parse(action))
  );
