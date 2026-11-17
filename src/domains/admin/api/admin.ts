import { request, type Transport } from '@/lib/api/request';
import { workspaceAccessSchema } from '../model/contracts';

/** 도우미와 운영 관리자의 별도 앱 진입 권한을 서버에서 확인한다. */
export const getWorkspaceAccess = (transport?: Transport) =>
  request(
    '/api/admin/workspace/access',
    workspaceAccessSchema,
    undefined,
    transport
  );
