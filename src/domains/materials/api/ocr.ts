import { jsonBody, request } from '@/lib/api/request';
import { materialOcrSchema } from '../model/ocr';

const endpoint = (id: string) => `/api/materials/${encodeURIComponent(id)}/ocr`;

/** 페이지를 열 때 저장 결과만 조회하고 인식 작업을 생성하지 않는다. */
export const getMaterialOcr = (id: string, version: number, page: number) =>
  request(
    `${endpoint(id)}?${new URLSearchParams({ version: String(version), page: String(page) })}`,
    materialOcrSchema
  );

/** 소유자가 명시한 원본 한 페이지만 서버에서 인식한다. */
export const recognizeMaterialPage = (
  id: string,
  input: {
    requestId: string;
    version: number;
    page: number;
  }
) => request(endpoint(id), materialOcrSchema, jsonBody(input));
