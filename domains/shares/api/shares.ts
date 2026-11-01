import { jsonBody, request, type Transport } from '@/lib/api/request';
import {
  createShareSchema,
  createdShareSchema,
  sharedLessonSchema,
  shareVisitSchema,
  shareStartResultSchema,
  okSchema,
} from '../model/contracts';
const endpoint = (id: string) => `/api/shares/${encodeURIComponent(id)}`;
/** 공유 생성 재시도에 같은 요청 ID를 사용한다. */
export const createShare = (input: {
  requestId: string;
  videoId: string;
  segmentId?: string;
}) =>
  request(
    '/api/shares',
    createdShareSchema,
    jsonBody(createShareSchema.parse(input))
  );
/** 로그인한 사용자가 공유된 영상과 구절 범위를 확인한다. */
export const getSharedLesson = (id: string, transport?: Transport) =>
  request(endpoint(id), sharedLessonSchema, undefined, transport);
/** 실제 공유 페이지 진입만 집계하고 서버 미리 가져오기는 제외한다. */
export const recordShareVisit = (id: string, visitId: string) =>
  request(
    `${endpoint(id)}/visits`,
    okSchema,
    jsonBody(shareVisitSchema.parse({ visitId }))
  );
/** 공유자가 아닌 현재 로그인 사용자의 진도로 학습을 시작한다. */
export const startSharedLesson = (id: string, visitId: string) =>
  request(
    `${endpoint(id)}/start`,
    shareStartResultSchema,
    jsonBody(shareVisitSchema.parse({ visitId }))
  );
