import { request, jsonBody, type Transport } from '@/lib/api/request';
import { materialAnalysisSchema } from '../model/analysis';

/** 결과 조회는 AI 호출 없이 저장된 원본 버전의 진행 상태를 가져온다. */
export const getMaterialAnalysis = (
  id: string,
  version: number,
  transport?: Transport
) =>
  request(
    `/api/materials/${encodeURIComponent(id)}/analysis?version=${version}`,
    materialAnalysisSchema,
    undefined,
    transport
  );

/** 실패한 페이지와 기존 자료의 최초 정리만 명시적으로 요청한다. */
export const retryMaterialAnalysis = (
  id: string,
  version: number,
  requestId: string
) =>
  request(
    `/api/materials/${encodeURIComponent(id)}/analysis/retry`,
    materialAnalysisSchema,
    jsonBody({ version, requestId })
  );
