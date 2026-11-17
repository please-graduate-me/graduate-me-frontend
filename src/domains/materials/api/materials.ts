import { request, jsonBody, type Transport } from '@/lib/api/request';
import { okSchema } from '@/lib/api/contracts';
import {
  materialInputSchema,
  materialVersionInputSchema,
  materialSchema,
  materialsSchema,
} from '../model/contracts';

const endpoint = (id: string) => `/api/materials/${encodeURIComponent(id)}`;

/** 개인 자료만 가져오며 서버 렌더링에서도 같은 계약을 사용한다. */
export const listMaterials = (transport?: Transport) =>
  request('/api/materials', materialsSchema, undefined, transport);

/** 원본과 추출한 텍스트를 한 요청에서 검증해 저장한다. */
export const registerMaterial = (input: unknown) =>
  request(
    '/api/materials',
    materialSchema,
    jsonBody(materialInputSchema.parse(input))
  );

/** 개인 자료의 페이지와 메모를 복원한다. */
export const getMaterial = (
  id: string,
  transport?: Transport,
  version?: number
) =>
  request(
    endpoint(id) + (version ? '?version=' + version : ''),
    materialSchema,
    undefined,
    transport
  );

/** 원본 교체를 새 버전으로 저장하고 이전 출처와 제출 이력을 보존한다. */
export const registerMaterialVersion = (id: string, input: unknown) =>
  request(
    endpoint(id) + '/versions',
    materialSchema,
    jsonBody(materialVersionInputSchema.parse(input))
  );

/** 학습 위치와 비공개 메모를 변경한다. */
export const updateMaterial = (
  id: string,
  patch: { currentPage?: number; memo?: string }
) =>
  request(endpoint(id), materialSchema, {
    ...jsonBody(patch),
    method: 'PATCH',
  });

/** 연결된 질문과 표현의 출처 스냅샷을 유지하며 원본을 삭제한다. */
export const deleteMaterial = (id: string) =>
  request(endpoint(id), okSchema, { method: 'DELETE' });
