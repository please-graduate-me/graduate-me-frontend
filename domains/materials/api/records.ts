import { z } from 'zod';
import { okSchema } from '@/lib/api/contracts';
import { jsonBody, request, type Transport } from '@/lib/api/request';
import { sourceSchema, type SourceInput } from '../model/source';
import { annotationSchema, excerptShareSchema } from '../model/records';

/** 저장된 하이라이트를 조회하며 원문 표시만으로 새 기록을 만들지 않는다. */
export const listAnnotations = (
  source: { materialId: string } | { videoId: string }
) =>
  request(
    `/api/annotations?${new URLSearchParams(source)}`,
    z.object({ items: z.array(annotationSchema) })
  );

/** 선택 위치와 개인 메모를 함께 보존한다. */
export const createAnnotation = (input: {
  source: SourceInput;
  color?: 'yellow' | 'blue' | 'green';
  memo?: string;
}) => request('/api/annotations', annotationSchema, jsonBody(input));

/** 하이라이트의 색상과 개인 메모만 편집한다. */
export const updateAnnotation = (
  id: string,
  input: { color?: 'yellow' | 'blue' | 'green'; memo?: string }
) =>
  request(`/api/annotations/${encodeURIComponent(id)}`, annotationSchema, {
    ...jsonBody(input),
    method: 'PATCH',
  });

/** 하이라이트 삭제는 원문과 다른 학습 기록을 유지한다. */
export const deleteAnnotation = (id: string) =>
  request(`/api/annotations/${encodeURIComponent(id)}`, okSchema, {
    method: 'DELETE',
  });

/** 내가 만든 발췌 링크의 권한과 철회 여부를 조회한다. */
export const listExcerptShares = () =>
  request(
    '/api/excerpt-shares',
    z.object({ items: z.array(excerptShareSchema) })
  );

/** 확인한 발췌만 명시한 수신 범위로 공유한다. */
export const createExcerptShare = (input: {
  source: SourceInput;
  visibility: 'link' | 'accounts';
  allowedUserIds?: string[];
}) => request('/api/excerpt-shares', excerptShareSchema, jsonBody(input));

/** 공유 철회 후 링크를 아는 사람도 서버에서 차단한다. */
export const revokeExcerptShare = (id: string) =>
  request(
    `/api/excerpt-shares/${encodeURIComponent(id)}/revoke`,
    okSchema,
    jsonBody({})
  );

/** 수신자에게는 발췌와 원문 위치만 제공한다. */
export const getExcerptShare = (id: string, transport?: Transport) =>
  request(
    `/api/excerpt-shares/${encodeURIComponent(id)}`,
    z.object({ id: z.string(), source: sourceSchema, createdAt: z.string() }),
    undefined,
    transport
  );
