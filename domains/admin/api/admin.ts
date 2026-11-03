import { request, jsonBody, type Transport } from '@/lib/api/request';
import {
  adminAccessSchema,
  adminSharesSchema,
  adminShareQuerySchema,
  okSchema,
} from '../model/contracts';

/** 서버가 판정한 관리자 접근 여부를 조회한다. */
export const getAdminAccess = (transport?: Transport) =>
  request('/api/admin/access', adminAccessSchema, undefined, transport);

/** 공유 목록과 전체 누적 집계를 가져온다. */
export const getAdminShares = (page = 1, q = '', transport?: Transport) => {
  const query = adminShareQuerySchema.parse({ page, q });

  const params = new URLSearchParams({
    page: String(query.page),
    limit: String(query.limit),
    q,
  });

  return request(
    `/api/admin/shares?${params}`,
    adminSharesSchema,
    undefined,
    transport
  );
};

/** 문제가 있는 공유를 중지하되 기존 집계는 남긴다. */
export const revokeShare = (id: string) =>
  request(
    `/api/admin/shares/${encodeURIComponent(id)}/revoke`,
    okSchema,
    jsonBody({})
  );
