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
  type LearningAction,
} from '../model/contracts';
const endpoint = (id: string) => `/api/videos/${encodeURIComponent(id)}`;
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
export const registerVideo = (url: string) =>
  request(
    '/api/videos',
    registeredVideoSchema,
    jsonBody(registerVideoSchema.parse({ url }))
  );
/** 서버와 브라우저에서 동일한 학습 응답 계약을 사용한다. */
export const getLesson = (id: string, transport?: Transport) =>
  request(endpoint(id), lessonSchema, undefined, transport);
/** 재처리 요청의 주소와 응답 규칙을 화면에서 숨긴다. */
export const retryVideo = (id: string) =>
  request(`${endpoint(id)}/retry`, okSchema, jsonBody({}));
/** 자동 저장과 제출이 같은 요청 검증을 거치게 한다. */
export const applyLearningAction = (id: string, action: LearningAction) =>
  request(
    `${endpoint(id)}/actions`,
    actionResultSchema,
    jsonBody(actionSchema.parse(action))
  );
